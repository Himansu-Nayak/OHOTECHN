package com.ohotech.backend.service.payment;

import com.ohotech.backend.entity.Order;
import com.ohotech.backend.entity.OrderStatus;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class YouPiPrototypeService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${app.payment.youpi-enabled:false}")
    private boolean enabled;
    @Value("${app.youpi.base-url:}")
    private String baseUrl;
    @Value("${app.youpi.merchant-id:}")
    private String merchantId;
    @Value("${app.youpi.merchant-api-key:}")
    private String merchantApiKey;
    @Value("${app.youpi.webhook-secret:}")
    private String webhookSecret;
    @Value("${app.frontend.url:https://ohotechn.com}")
    private String frontendUrl;
    @Value("${app.youpi.checkout-base-url:}")
    private String checkoutBaseUrl;

    public boolean isEnabled() {
        return enabled && hasRequiredConfiguration();
    }

    private boolean hasRequiredConfiguration() {
        return baseUrl != null && !baseUrl.isBlank()
                && checkoutBaseUrl != null && !checkoutBaseUrl.isBlank()
                && merchantId != null && !merchantId.isBlank()
                && merchantApiKey != null && !merchantApiKey.isBlank()
                && webhookSecret != null && !webhookSecret.isBlank();
    }

    @Transactional
    public Map<String, Object> createPayment(Long userId, Long orderId) {
        if (!isEnabled()) {
            throw new BadRequestException("YouPI UPI prototype is disabled or not configured.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }
        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order #" + orderId + " is already paid.");
        }
        if (order.getTotalAmount() == null || order.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Order amount must be greater than zero.");
        }

        String externalOrderId = "OHO-" + order.getId();
        long amountPaise = order.getTotalAmount().multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.UNNECESSARY).longValueExact();

        Payment existing = paymentRepository.findByOrderId(orderId).orElse(null);
        if (existing != null && existing.getStatus() == PaymentStatus.PENDING
                && !"YOUPI_PG".equalsIgnoreCase(existing.getProvider())
                && (existing.getRazorpayOrderId() != null || existing.getCashfreeOrderId() != null
                || existing.getTransactionReference() != null)) {
            throw new BadRequestException("This order already has another pending payment attempt. Resolve it before starting YouPI.");
        }
        if (existing != null && "YOUPI_PG".equalsIgnoreCase(existing.getProvider())
                && existing.getYoupiPaymentId() != null && !existing.getYoupiPaymentId().isBlank()) {
            Map<String, Object> existingResponse = new LinkedHashMap<>();
            existingResponse.put("orderId", order.getId());
            existingResponse.put("paymentId", existing.getYoupiPaymentId());
            existingResponse.put("checkoutUrl", checkoutBaseUrl.replaceAll("/+$", "") + "/checkout/" + existing.getYoupiPaymentId());
            existingResponse.put("status", existing.getStatus().name());
            existingResponse.put("amountPaise", amountPaise);
            existingResponse.put("message", "A YouPI session is already associated with this order. Check its state before retrying.");
            return existingResponse;
        }

        try {
            URI configuredBase = URI.create(baseUrl);
            boolean localHttp = "http".equalsIgnoreCase(configuredBase.getScheme())
                    && ("localhost".equalsIgnoreCase(configuredBase.getHost()) || "127.0.0.1".equals(configuredBase.getHost()));
            if (!"https".equalsIgnoreCase(configuredBase.getScheme()) && !localHttp) {
                throw new BadRequestException("YouPI base URL must use HTTPS outside localhost.");
            }
            URI apiUri = URI.create(baseUrl.replaceAll("/+$", "") + "/api/v1/payments");
            JSONObject payload = new JSONObject()
                    .put("orderId", externalOrderId)
                    .put("amount", order.getTotalAmount().setScale(2, RoundingMode.UNNECESSARY).toPlainString())
                    .put("currency", "INR")
                    .put("description", "OHO TECH order #" + order.getId())
                    .put("returnUrl", frontendUrl.replaceAll("/+$", "") + "/orders")
                    .put("metadata", new JSONObject().put("ohoOrderId", order.getId()).put("integration", "OHO_TECH"));

            HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
            HttpRequest request = HttpRequest.newBuilder(apiUri)
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("X-Merchant-Id", merchantId)
                    .header("X-Merchant-Key", merchantApiKey)
                    .header("Idempotency-Key", "oho-order-" + order.getId())
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BadRequestException("YouPI could not create a payment session (HTTP " + response.statusCode() + ").");
            }

            JSONObject result = new JSONObject(response.body());
            String youpiPaymentId = result.optString("paymentId", "");
            String checkoutUrl = result.optString("checkoutUrl", "");
            if (youpiPaymentId.isBlank() || checkoutUrl.isBlank()) {
                throw new BadRequestException("YouPI response did not include a payment ID and checkout URL.");
            }
            URI checkoutUri = URI.create(checkoutUrl);
            URI configuredCheckoutBase = URI.create(checkoutBaseUrl);
            boolean checkoutLocalHttp = "http".equalsIgnoreCase(configuredCheckoutBase.getScheme())
                    && ("localhost".equalsIgnoreCase(configuredCheckoutBase.getHost()) || "127.0.0.1".equals(configuredCheckoutBase.getHost()));
            if (!"https".equalsIgnoreCase(checkoutUri.getScheme())
                    && !("http".equalsIgnoreCase(checkoutUri.getScheme())
                    && ("localhost".equalsIgnoreCase(checkoutUri.getHost()) || "127.0.0.1".equals(checkoutUri.getHost())))) {
                throw new BadRequestException("YouPI returned a non-HTTPS checkout URL.");
            }
            if (checkoutUri.getHost() == null || configuredCheckoutBase.getHost() == null
                    || !checkoutUri.getHost().equalsIgnoreCase(configuredCheckoutBase.getHost())
                    || !java.util.Objects.equals(checkoutUri.getPort(), configuredCheckoutBase.getPort())
                    || (!checkoutLocalHttp && !"https".equalsIgnoreCase(checkoutUri.getScheme()))) {
                throw new BadRequestException("YouPI returned a checkout URL outside the configured checkout host.");
            }

            Payment payment = existing != null ? existing : Payment.builder()
                    .order(order).amount(order.getTotalAmount()).status(PaymentStatus.PENDING).build();
            payment.setProvider("YOUPI_PG");
            payment.setMethod("UPI_QR");
            payment.setCurrency("INR");
            payment.setAmount(order.getTotalAmount());
            payment.setYoupiPaymentId(youpiPaymentId);
            payment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);

            Map<String, Object> out = new LinkedHashMap<>();
            out.put("orderId", order.getId());
            out.put("paymentId", youpiPaymentId);
            out.put("checkoutUrl", checkoutUrl);
            out.put("status", result.optString("status", "INITIATED"));
            out.put("amountPaise", amountPaise);
            out.put("currency", "INR");
            return out;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Could not create a YouPI payment session. Check gateway connectivity and configuration.");
        }
    }

    public boolean isWebhookSecretConfigured() {
        return webhookSecret != null && !webhookSecret.isBlank();
    }

    public String getWebhookSecretForVerification() {
        if (!isEnabled() || !isWebhookSecretConfigured()) {
            throw new BadRequestException("YouPI webhook handling is disabled or not configured.");
        }
        return webhookSecret;
    }
}
