package com.ohotech.backend.service.payment;

import com.ohotech.backend.dto.GatewayHealthDto;
import com.ohotech.backend.dto.PaymentGatewayDto;
import com.ohotech.backend.entity.Order;
import com.ohotech.backend.entity.OrderStatus;
import com.ohotech.backend.entity.Payment;
import com.ohotech.backend.entity.PaymentStatus;
import com.ohotech.backend.entity.WebhookEvent;
import com.ohotech.backend.entity.WebhookEventStatus;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.PaymentRepository;
import com.ohotech.backend.repository.WebhookEventRepository;
import com.ohotech.backend.service.AuditService;
import com.ohotech.backend.service.CartService;
import com.ohotech.backend.service.EmailService;
import com.ohotech.backend.service.EmailTemplateService;
import com.ohotech.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashfreeGateway implements PaymentGateway {

    public static final String PROVIDER_ID = "CASHFREE";

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final com.ohotech.backend.repository.SubscriptionRepository subscriptionRepository;
    private final com.ohotech.backend.repository.LicenseRepository licenseRepository;
    private final CartService cartService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    private final AuditService auditService;

    @Value("${cashfree.client-id:}")
    private String clientId;

    @Value("${cashfree.client-secret:}")
    private String clientSecret;

    @Value("${cashfree.webhook-secret:}")
    private String webhookSecret;

    @Value("${cashfree.environment:SANDBOX}")
    private String environment;

    @Value("${cashfree.api-version:2025-01-01}")
    private String apiVersion;

    @Value("${app.payment.cashfree-enabled:true}")
    private boolean enabled;

    private LocalDateTime lastHealthCheckAt;
    private Long lastHealthLatencyMs;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getProviderId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayName() {
        return "Cashfree Payment Gateway (UPI, Cards, NetBanking, Wallets)";
    }

    @Override
    public boolean isImplemented() {
        return true;
    }

    @Override
    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank() && !clientId.contains("PLACEHOLDER")
                && clientSecret != null && !clientSecret.isBlank() && !clientSecret.contains("PLACEHOLDER");
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public String getEnvironment() {
        if (!isConfigured()) return "NOT CONFIGURED";
        return isProduction() ? "LIVE MODE" : "TEST MODE (SANDBOX)";
    }

    public boolean isProduction() {
        return "PRODUCTION".equalsIgnoreCase(environment) || "PROD".equalsIgnoreCase(environment);
    }

    public String getBaseUrl() {
        return isProduction() ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    }

    @Override
    public String getMaskedIdentifier() {
        if (clientId == null || clientId.isBlank()) return "Not configured";
        if (clientId.length() <= 8) return "cf_••••";
        return clientId.substring(0, 4) + "••••" + clientId.substring(clientId.length() - 4);
    }

    @Override
    public List<String> getSupportedMethods() {
        return Arrays.asList("UPI (GPay, PhonePe, Paytm, BHIM, QR)", "Credit / Debit Cards (Visa, MasterCard, RuPay)", "Net Banking (58+ Banks)", "Cashfree PayLater & Wallets");
    }

    @Override
    public List<String> getSupportedCurrencies() {
        return List.of("INR", "USD");
    }

    @Override
    public String getWebhookStatus() {
        if (webhookSecret != null && !webhookSecret.isBlank() && !webhookSecret.contains("PLACEHOLDER")) {
            return "ACTIVE_SIGNATURE_VERIFIED";
        }
        return isConfigured() ? "CLIENT_SECRET_FALLBACK" : "UNCONFIGURED";
    }

    /**
     * Official Cashfree signature algorithm:
     * Base64( HMAC-SHA256( timestamp + rawBody, secret ) )
     */
    public boolean verifyWebhookSignature(String rawBody, String timestamp, String signature) {
        if (signature == null || signature.isBlank() || timestamp == null || timestamp.isBlank() || rawBody == null) {
            log.warn("Cashfree signature verification rejected: missing signature, timestamp, or raw body");
            return false;
        }

        String secretToUse = (webhookSecret != null && !webhookSecret.isBlank() && !webhookSecret.contains("PLACEHOLDER"))
                ? webhookSecret.trim()
                : (clientSecret != null ? clientSecret.trim() : "");

        if (secretToUse.isBlank()) {
            log.error("Cashfree webhook secret is not configured on server.");
            return false;
        }

        try {
            String dataToSign = timestamp + rawBody;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secretToUse.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(dataToSign.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = Base64.getEncoder().encodeToString(hash);

            boolean match = MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.trim().getBytes(StandardCharsets.UTF_8)
            );

            if (!match) {
                log.warn("Cashfree webhook signature mismatch. Computed Base64 signature does not match header.");
            }
            return match;
        } catch (Exception e) {
            log.error("Error executing HMAC-SHA256 for Cashfree webhook signature: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Process incoming verified Cashfree webhook payload.
     * Handled events:
     * - PAYMENT_SUCCESS_WEBHOOK
     * - PAYMENT_FAILED_WEBHOOK
     * - PAYMENT_USER_DROPPED_WEBHOOK
     * - REFUND_STATUS_WEBHOOK
     */
    @Transactional
    public Map<String, Object> processWebhookEvent(String rawPayload, String timestamp, String signature) {
        if (!verifyWebhookSignature(rawPayload, timestamp, signature)) {
            log.error("Rejected Cashfree webhook delivery: Invalid signature");
            throw new BadRequestException("Invalid Cashfree webhook signature");
        }

        JSONObject eventJson;
        try {
            eventJson = new JSONObject(rawPayload);
        } catch (Exception e) {
            log.error("Malformed Cashfree JSON payload: {}", e.getMessage());
            throw new BadRequestException("Malformed JSON payload");
        }

        String eventType = eventJson.optString("type", "");
        String eventTime = eventJson.optString("event_time", "");
        JSONObject dataObj = eventJson.optJSONObject("data");

        if (dataObj == null) {
            log.warn("Cashfree webhook received with no 'data' object. Event type: {}", eventType);
            return Map.of("status", "IGNORED", "reason", "Missing data node");
        }

        // Determine unique event ID for deduplication
        String eventId = generateEventId(eventType, dataObj, eventTime, rawPayload);

        // 1. Check Deduplication / Idempotency
        if (webhookEventRepository.existsByProviderAndExternalEventId(PROVIDER_ID, eventId)) {
            log.info("Duplicate Cashfree webhook event acknowledged and skipped: {}", eventId);
            return Map.of("status", "ALREADY_PROCESSED", "eventId", eventId);
        }

        // Record incoming event
        WebhookEvent webhookEvent = WebhookEvent.builder()
                .provider(PROVIDER_ID)
                .externalEventId(eventId)
                .eventType(eventType)
                .status(WebhookEventStatus.RECEIVED)
                .payloadSummary(rawPayload.length() > 500 ? rawPayload.substring(0, 500) + "..." : rawPayload)
                .build();
        webhookEvent = webhookEventRepository.save(webhookEvent);

        try {
            if ("PAYMENT_SUCCESS_WEBHOOK".equalsIgnoreCase(eventType)) {
                handlePaymentSuccess(dataObj);
            } else if ("PAYMENT_FAILED_WEBHOOK".equalsIgnoreCase(eventType) ||
                       "PAYMENT_USER_DROPPED_WEBHOOK".equalsIgnoreCase(eventType)) {
                handlePaymentFailure(dataObj, eventType);
            } else if ("REFUND_STATUS_WEBHOOK".equalsIgnoreCase(eventType)) {
                handleRefundStatus(dataObj);
            } else {
                log.info("Unhandled Cashfree webhook event type acknowledged: {}", eventType);
            }

            webhookEvent.setStatus(WebhookEventStatus.PROCESSED);
            webhookEvent.setProcessedAt(LocalDateTime.now());
            webhookEventRepository.save(webhookEvent);

            auditService.logEvent("CASHFREE_WEBHOOK_PROCESSED", "WebhookEvent", String.valueOf(webhookEvent.getId()),
                    "Processed Cashfree webhook event: " + eventType + " [" + eventId + "]");

            return Map.of("status", "SUCCESS", "eventId", eventId, "eventType", eventType);

        } catch (Exception ex) {
            log.error("Error processing Cashfree webhook event {}: {}", eventId, ex.getMessage(), ex);
            webhookEvent.setStatus(WebhookEventStatus.FAILED);
            webhookEvent.setErrorReason(ex.getMessage() != null && ex.getMessage().length() > 1000
                    ? ex.getMessage().substring(0, 1000) : ex.getMessage());
            webhookEventRepository.save(webhookEvent);
            throw ex;
        }
    }

    private String generateEventId(String eventType, JSONObject dataObj, String eventTime, String rawPayload) {
        if ("REFUND_STATUS_WEBHOOK".equalsIgnoreCase(eventType)) {
            JSONObject refundObj = dataObj.optJSONObject("refund");
            if (refundObj != null) {
                String refundId = refundObj.optString("refund_id", "");
                if (!refundId.isBlank()) return "cf_ref_" + refundId;
                long cfRefundId = refundObj.optLong("cf_refund_id", 0);
                if (cfRefundId > 0) return "cf_ref_" + cfRefundId;
            }
        }

        JSONObject paymentObj = dataObj.optJSONObject("payment");
        if (paymentObj != null) {
            String cfPaymentId = paymentObj.optString("cf_payment_id", "");
            if (!cfPaymentId.isBlank()) {
                return "cf_pay_" + cfPaymentId + "_" + eventType;
            }
        }

        JSONObject orderObj = dataObj.optJSONObject("order");
        String orderId = orderObj != null ? orderObj.optString("order_id", "") : "";
        if (!orderId.isBlank() && !eventTime.isBlank()) {
            return "cf_evt_" + orderId + "_" + eventTime.trim();
        }

        // Deterministic fallback: SHA-256 hash of the exact raw payload
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawPayload != null ? rawPayload.getBytes(StandardCharsets.UTF_8) : new byte[0]);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return "cf_raw_" + hexString.substring(0, Math.min(32, hexString.length()));
        } catch (Exception e) {
            return "cf_raw_" + (rawPayload != null ? Math.abs(rawPayload.hashCode()) : 0);
        }
    }

    private void handlePaymentSuccess(JSONObject dataObj) {
        JSONObject orderObj = dataObj.optJSONObject("order");
        JSONObject paymentObj = dataObj.optJSONObject("payment");

        if (orderObj == null || paymentObj == null) {
            throw new BadRequestException("PAYMENT_SUCCESS_WEBHOOK missing order or payment object");
        }

        String cfOrderId = orderObj.optString("order_id", "").trim();
        BigDecimal reportedOrderAmount = parseBigDecimal(orderObj.opt("order_amount"));
        String reportedCurrency = orderObj.optString("order_currency", "INR");

        String cfPaymentId = paymentObj.optString("cf_payment_id", "").trim();
        String paymentStatus = paymentObj.optString("payment_status", "").trim();
        BigDecimal paymentAmount = parseBigDecimal(paymentObj.opt("payment_amount"));
        String paymentGroup = paymentObj.optString("payment_group", "ONLINE");
        String bankReference = paymentObj.optString("bank_reference", "");

        if (!"SUCCESS".equalsIgnoreCase(paymentStatus)) {
            log.warn("Payment status in PAYMENT_SUCCESS_WEBHOOK is not SUCCESS: {}", paymentStatus);
            return;
        }

        // Locate internal order
        Order order = findMatchingOrder(cfOrderId);
        if (order == null) {
            log.error("Unable to match Cashfree order_id '{}' to any internal OHO TECH order.", cfOrderId);
            throw new BadRequestException("Order not found for Cashfree order ID: " + cfOrderId);
        }

        // Amount & Currency Verification
        if (order.getTotalAmount() != null) {
            if (reportedOrderAmount.compareTo(BigDecimal.ZERO) > 0 &&
                order.getTotalAmount().compareTo(reportedOrderAmount) != 0) {
                log.error("Cashfree order amount mismatch! Internal Order #{}: ₹{}, Cashfree reported: ₹{}",
                        order.getId(), order.getTotalAmount(), reportedOrderAmount);
                throw new BadRequestException("Order amount mismatch during webhook processing");
            }

            if (paymentAmount.compareTo(BigDecimal.ZERO) > 0 &&
                order.getTotalAmount().compareTo(paymentAmount) != 0) {
                log.error("Cashfree payment amount mismatch! Internal Order #{}: ₹{}, Payment reported: ₹{}",
                        order.getId(), order.getTotalAmount(), paymentAmount);
                throw new BadRequestException("Payment amount mismatch during webhook processing");
            }
        }

        // Find or create Payment record
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(paymentRepository.findByCashfreeOrderId(cfOrderId)
                        .orElse(Payment.builder()
                                .order(order)
                                .amount(order.getTotalAmount())
                                .build()));

        // Idempotency: Do not downgrade or re-process if already marked SUCCESSFUL
        if (payment.getStatus() == PaymentStatus.SUCCESSFUL &&
            (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED)) {
            log.info("Order #{} is already marked verified/paid. Duplicate payment success event ignored safely.", order.getId());
            return;
        }

        payment.setOrder(order);
        payment.setProvider(PROVIDER_ID);
        payment.setMethod(paymentGroup.toUpperCase());
        payment.setCurrency(reportedCurrency);
        payment.setCashfreeOrderId(cfOrderId);
        payment.setCashfreePaymentId(cfPaymentId);
        payment.setTransactionReference(bankReference.isBlank() ? "CF_" + cfPaymentId : bankReference);
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        payment.setVerifiedAt(LocalDateTime.now());
        payment.setAdminNotes("Payment verified via Cashfree Webhook (" + cfPaymentId + ")");
        payment = paymentRepository.save(payment);

        // Advance Order to CONFIRMED (Awaiting explicit Admin Approval per Phase 10 system rules)
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Clear user cart safely
        if (order.getUser() != null) {
            try {
                cartService.clearCart(order.getUser().getId());
                log.info("Cleared cart for user #{} after verified Cashfree payment", order.getUser().getId());
            } catch (Exception e) {
                log.warn("Could not clear cart for user #{}: {}", order.getUser().getId(), e.getMessage());
            }
        }

        // Notify user
        try {
            if (order.getUser() != null) {
                notificationService.createNotification(
                        order.getUser().getId(),
                        "Payment Received - Pending Verification",
                        "Your payment of ₹" + order.getTotalAmount() + " for Order #" + order.getId() + " was received via Cashfree. Software license and download access will be activated upon admin approval.",
                        com.ohotech.backend.entity.NotificationType.INFO,
                        com.ohotech.backend.entity.NotificationCategory.PAYMENT,
                        "/my-products"
                );

                if (order.getUser().getEmail() != null) {
                    String htmlBody = emailTemplateService.buildPaymentSuccessEmail(
                            order.getUser().getName(), "CF_" + cfPaymentId, order.getId(), order.getTotalAmount());
                    emailService.sendHtmlEmail(order.getUser().getEmail(), "OHO TECHN - Payment Received for Order #" + order.getId(), htmlBody);
                }
            }
        } catch (Exception ne) {
            log.warn("Customer notification warning after Cashfree payment: {}", ne.getMessage());
        }

        log.info("Cashfree payment success processed for Order #{}, Payment ID: {}", order.getId(), cfPaymentId);
    }

    private void handlePaymentFailure(JSONObject dataObj, String eventType) {
        JSONObject orderObj = dataObj.optJSONObject("order");
        JSONObject paymentObj = dataObj.optJSONObject("payment");

        String cfOrderId = orderObj != null ? orderObj.optString("order_id", "").trim() : "";
        String failureMsg = paymentObj != null ? paymentObj.optString("payment_message", "Transaction failed") : eventType;
        String cfPaymentId = paymentObj != null ? paymentObj.optString("cf_payment_id", "") : "";

        if (cfOrderId.isBlank()) return;

        Order order = findMatchingOrder(cfOrderId);
        if (order == null) {
            log.warn("Order not found for failed Cashfree event with order_id: {}", cfOrderId);
            return;
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(paymentRepository.findByCashfreeOrderId(cfOrderId).orElse(null));

        if (payment != null) {
            // NEVER downgrade an already paid order if a delayed failure event arrives
            if (payment.getStatus() == PaymentStatus.SUCCESSFUL ||
                order.getStatus() == OrderStatus.PAID ||
                order.getStatus() == OrderStatus.CONFIRMED) {
                log.warn("Ignoring delayed Cashfree failure event for already SUCCESSFUL order #{}", order.getId());
                return;
            }

            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Cashfree: " + failureMsg);
            if (!cfPaymentId.isBlank()) {
                payment.setCashfreePaymentId(cfPaymentId);
            }
            paymentRepository.save(payment);
            log.info("Marked Payment #{} as FAILED due to Cashfree event {}", payment.getId(), eventType);
        }
    }

    private void handleRefundStatus(JSONObject dataObj) {
        JSONObject refundObj = dataObj.optJSONObject("refund");
        if (refundObj == null) return;

        String cfOrderId = refundObj.optString("order_id", "").trim();
        String refundStatus = refundObj.optString("refund_status", "").trim();
        BigDecimal refundAmount = parseBigDecimal(refundObj.opt("refund_amount"));
        String refundArn = refundObj.optString("refund_arn", "");

        if (!"SUCCESS".equalsIgnoreCase(refundStatus)) {
            log.info("Cashfree refund status is not SUCCESS: {}", refundStatus);
            return;
        }

        Order order = findMatchingOrder(cfOrderId);
        if (order == null) return;

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(paymentRepository.findByCashfreeOrderId(cfOrderId).orElse(null));

        if (payment != null) {
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setFailureReason("Cashfree Refund Processed. ARN: " + refundArn);
            paymentRepository.save(payment);

            order.setStatus(OrderStatus.REFUNDED);
            orderRepository.save(order);

            // Revoke active entitlements if previously provisioned
            List<com.ohotech.backend.entity.Subscription> subs = subscriptionRepository.findAllByOrderId(order.getId());
            for (com.ohotech.backend.entity.Subscription sub : subs) {
                sub.setStatus(com.ohotech.backend.entity.SubscriptionStatus.CANCELLED);
                subscriptionRepository.save(sub);
                Optional<com.ohotech.backend.entity.License> lic = licenseRepository.findBySubscriptionId(sub.getId());
                lic.ifPresent(l -> {
                    l.setStatus(com.ohotech.backend.entity.LicenseStatus.REVOKED);
                    licenseRepository.save(l);
                });
            }

            // Customer notification for refund
            try {
                if (order.getUser() != null) {
                    notificationService.createNotification(
                            order.getUser().getId(),
                            "Payment Refund Processed",
                            "A refund of ₹" + refundAmount + " has been processed via Cashfree for Order #" + order.getId() + ". Status: REFUNDED.",
                            com.ohotech.backend.entity.NotificationType.INFO,
                            com.ohotech.backend.entity.NotificationCategory.PAYMENT,
                            "/orders"
                    );
                }
            } catch (Exception ne) {
                log.warn("Customer refund notification warning: {}", ne.getMessage());
            }

            log.info("Order #{} and Payment #{} marked REFUNDED and entitlements revoked via Cashfree REFUND_STATUS_WEBHOOK", order.getId(), payment.getId());
        }
    }

    private Order findMatchingOrder(String cfOrderId) {
        if (cfOrderId == null || cfOrderId.isBlank()) return null;

        // 1. Direct match by Cashfree order ID in Payment
        Optional<Payment> paymentOpt = paymentRepository.findByCashfreeOrderId(cfOrderId);
        if (paymentOpt.isPresent() && paymentOpt.get().getOrder() != null) {
            return paymentOpt.get().getOrder();
        }

        // 2. Pattern match: e.g. "order_123_..." or "ORD_123_..." or numeric "123"
        String raw = cfOrderId.trim();
        if (raw.startsWith("order_") || raw.startsWith("ord_") || raw.startsWith("ORDER_") || raw.startsWith("ORD_")) {
            String[] parts = raw.split("_");
            if (parts.length >= 2) {
                try {
                    Long internalId = Long.parseLong(parts[1]);
                    return orderRepository.findById(internalId).orElse(null);
                } catch (NumberFormatException ignored) {}
            }
        }

        try {
            Long directId = Long.parseLong(raw);
            return orderRepository.findById(directId).orElse(null);
        } catch (NumberFormatException ignored) {}

        return null;
    }

    private BigDecimal parseBigDecimal(Object val) {
        if (val == null) return BigDecimal.ZERO;
        if (val instanceof Number) return BigDecimal.valueOf(((Number) val).doubleValue()).setScale(2, RoundingMode.HALF_UP);
        try {
            return new BigDecimal(val.toString().trim()).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    @Override
    public GatewayHealthDto healthCheck() {
        long start = System.currentTimeMillis();
        this.lastHealthCheckAt = LocalDateTime.now();

        if (!enabled) {
            long latency = System.currentTimeMillis() - start;
            this.lastHealthLatencyMs = latency;
            return GatewayHealthDto.builder()
                    .providerId(PROVIDER_ID)
                    .status("DISABLED")
                    .healthy(false)
                    .latencyMs(latency)
                    .message("Cashfree gateway is disabled in settings.")
                    .checkedAt(this.lastHealthCheckAt)
                    .build();
        }

        if (!isConfigured()) {
            long latency = System.currentTimeMillis() - start;
            this.lastHealthLatencyMs = latency;
            return GatewayHealthDto.builder()
                    .providerId(PROVIDER_ID)
                    .status("NOT_CONFIGURED")
                    .healthy(false)
                    .latencyMs(latency)
                    .message("Cashfree credentials (CASHFREE_CLIENT_ID / SECRET) are missing.")
                    .checkedAt(this.lastHealthCheckAt)
                    .build();
        }

        // Test credentials by hitting Cashfree health / test endpoint
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", clientId);
            headers.set("x-client-secret", clientSecret);
            headers.set("x-api-version", apiVersion);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // Fetch a dummy / non-existent order to verify API auth
            String url = getBaseUrl() + "/orders/ping_health_check";
            try {
                restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            } catch (org.springframework.web.client.HttpClientErrorException.NotFound nfe) {
                // 404 means credentials are authenticated, only the test resource is not found!
            }

            long latency = System.currentTimeMillis() - start;
            this.lastHealthLatencyMs = latency;

            return GatewayHealthDto.builder()
                    .providerId(PROVIDER_ID)
                    .status(isProduction() ? "LIVE_MODE" : "TEST_MODE")
                    .healthy(true)
                    .latencyMs(latency)
                    .message("Cashfree connection authenticated (" + getEnvironment() + ").")
                    .checkedAt(this.lastHealthCheckAt)
                    .build();

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            this.lastHealthLatencyMs = latency;
            log.error("Cashfree health check failed: {}", e.getMessage());

            return GatewayHealthDto.builder()
                    .providerId(PROVIDER_ID)
                    .status("ERROR")
                    .healthy(false)
                    .latencyMs(latency)
                    .message("Cashfree Gateway Error: " + e.getMessage())
                    .checkedAt(this.lastHealthCheckAt)
                    .build();
        }
    }

    @Override
    public PaymentGatewayDto toDto() {
        String statusStr;
        if (!enabled) {
            statusStr = "DISABLED";
        } else if (!isConfigured()) {
            statusStr = "NOT_CONFIGURED";
        } else if (isProduction()) {
            statusStr = "LIVE_MODE";
        } else {
            statusStr = "TEST_MODE";
        }

        return PaymentGatewayDto.builder()
                .providerId(getProviderId())
                .name(getDisplayName())
                .status(statusStr)
                .environment(getEnvironment())
                .implemented(isImplemented())
                .configured(isConfigured())
                .enabled(isEnabled())
                .supportedCurrencies(getSupportedCurrencies())
                .supportedMethods(getSupportedMethods())
                .maskedKeyId(getMaskedIdentifier())
                .lastHealthCheckAt(lastHealthCheckAt)
                .healthLatencyMs(lastHealthLatencyMs)
                .webhookStatus(getWebhookStatus())
                .build();
    }
}
