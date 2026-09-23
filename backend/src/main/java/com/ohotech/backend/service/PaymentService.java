package com.ohotech.backend.service;

import com.ohotech.backend.dto.PaymentResponseDto;
import com.ohotech.backend.dto.PaymentVerificationRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LicenseRepository licenseRepository;
    private final LicenseService licenseService;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final EmailTemplateService emailTemplateService;

    @Value("${app.razorpay.key-id:${razorpay.key-id:}}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:${razorpay.key-secret:}}")
    private String razorpayKeySecret;

    private boolean razorpayConfigured() {
        return razorpayKeyId != null && razorpayKeyId.startsWith("rzp_")
                && razorpayKeySecret != null && !razorpayKeySecret.isBlank()
                && !razorpayKeyId.contains("PLACEHOLDER")
                && !razorpayKeySecret.contains("PLACEHOLDER");
    }

    @Transactional
    public Map<String, Object> createPaymentOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        if (!razorpayConfigured()) {
            throw new BadRequestException("Razorpay payment gateway is not configured for live payments. Please contact support.");
        }

        long amountInPaise = order.getTotalAmount().movePointRight(2).longValueExact();
        if (amountInPaise <= 0) {
            throw new BadRequestException("Payment amount must be greater than ₹0.");
        }

        try {
            com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_order_" + order.getId());

            com.razorpay.Order rzpOrder = razorpay.orders.create(orderRequest);
            if (rzpOrder == null || !rzpOrder.has("id")) {
                throw new BadRequestException("Razorpay did not return a valid payment order.");
            }

            String razorpayOrderId = rzpOrder.get("id").toString();

            Payment payment = paymentRepository.findByOrderId(orderId)
                    .orElse(Payment.builder()
                            .order(order)
                            .amount(order.getTotalAmount())
                            .status(PaymentStatus.PENDING)
                            .build());

            payment.setAmount(order.getTotalAmount());
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("razorpayOrderId", razorpayOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            return response;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Razorpay order creation failed for order {}", orderId, e);
            throw new BadRequestException("Unable to create Razorpay payment order. Please try again.");
        }
    }

    @Transactional
    public PaymentResponseDto verifyPayment(Long userId, PaymentVerificationRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", request.getOrderId());
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment for order", "id", request.getOrderId()));

        if (!razorpayConfigured()) {
            throw new BadRequestException("Razorpay payment gateway is not configured for live payments.");
        }

        if (payment.getRazorpayOrderId() == null || !payment.getRazorpayOrderId().equals(request.getRazorpayOrderId())) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Razorpay order ID does not match the server payment order.");
        }

        boolean isValidSignature = verifyHmacSha256(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                razorpayKeySecret
        );

        if (!isValidSignature) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BadRequestException("Invalid payment signature verification!");
        }

        boolean isNewlyVerified = payment.getStatus() != PaymentStatus.SUCCESSFUL;

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        createEntitlementsForOrder(order);

        if (isNewlyVerified) {
            try {
                notificationService.createNotification(
                        order.getUser().getId(),
                        "Payment Verified Successfully",
                        "Your payment of ₹" + order.getTotalAmount() + " for Order #" + order.getId() + " was verified. Software access is now active.",
                        NotificationType.SUCCESS,
                        NotificationCategory.PAYMENT,
                        "/my-products"
                );

                if (order.getUser().getEmail() != null) {
                    String htmlBody = emailTemplateService.buildPaymentSuccessEmail(
                            order.getUser().getName(), request.getRazorpayPaymentId(), order.getId(), order.getTotalAmount());
                    emailService.sendHtmlEmail(order.getUser().getEmail(), "OHO TECHN - Payment Verified for Order #" + order.getId(), htmlBody);
                }
            } catch (Exception e) {
                logger.warn("Notification/Email trigger warning on payment verify: {}", e.getMessage());
            }
        }

        return mapPaymentToDto(payment);
    }

    public PaymentResponseDto mapPaymentToDto(Payment payment) {
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrder() != null ? payment.getOrder().getId() : null)
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    @Transactional
    public void createEntitlementsForOrder(Order order) {
        if (order.getItems() == null) return;

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            ProductPlan plan = item.getProductPlan();

            Optional<Subscription> existingSub = subscriptionRepository.findByOrderId(order.getId());

            Subscription subscription;
            if (existingSub.isEmpty()) {
                LocalDateTime now = LocalDateTime.now();
                int durationDays = (plan != null && plan.getDurationDays() != null) ? plan.getDurationDays() : 365;
                LocalDateTime expiryDate = (plan != null && plan.getBillingType() == BillingType.LIFETIME) ? null : now.plusDays(durationDays);

                subscription = Subscription.builder()
                        .user(order.getUser())
                        .product(product)
                        .productPlan(plan)
                        .order(order)
                        .status(SubscriptionStatus.ACTIVE)
                        .startDate(now)
                        .expiryDate(expiryDate)
                        .autoRenew(plan != null && plan.getBillingType() == BillingType.MONTHLY)
                        .build();

                subscription = subscriptionRepository.save(subscription);
            } else {
                subscription = existingSub.get();
            }

            Optional<License> existingLicense = licenseRepository.findBySubscriptionId(subscription.getId());
            if (existingLicense.isEmpty()) {
                LocalDateTime now = LocalDateTime.now();
                int durationDays = (plan != null && plan.getDurationDays() != null) ? plan.getDurationDays() : 365;
                LocalDateTime expiresAt = (plan != null && plan.getBillingType() == BillingType.LIFETIME) ? null : now.plusDays(durationDays);
                int limit = (plan != null && plan.getActivationLimit() != null) ? plan.getActivationLimit() : 1;

                License license = License.builder()
                        .user(order.getUser())
                        .product(product)
                        .productPlan(plan)
                        .subscription(subscription)
                        .licenseKey(licenseService.generateUniqueLicenseKey())
                        .status(LicenseStatus.ACTIVE)
                        .activationLimit(limit)
                        .activationCount(0)
                        .issuedAt(now)
                        .expiresAt(expiresAt)
                        .build();

                licenseRepository.save(license);
            }
        }
    }

    private boolean verifyHmacSha256(String data, String signature, String secret) {
        if (signature == null || signature.isBlank() || secret == null || secret.isBlank()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(signature);
        } catch (Exception e) {
            logger.error("Error calculating HMAC SHA256 signature", e);
            return false;
        }
    }
}
