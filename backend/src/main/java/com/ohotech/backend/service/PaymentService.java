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
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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
    private final CartService cartService;

    @Value("${app.razorpay.key-id:${razorpay.key-id:}}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:${razorpay.key-secret:}}")
    private String razorpayKeySecret;

    @Value("${app.razorpay.webhook-secret:${razorpay.webhook-secret:}}")
    private String razorpayWebhookSecret;

    @Value("${app.razorpay.test-mode:false}")
    private boolean testMode;

    public boolean razorpayConfigured() {
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

        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order #" + orderId + " is already paid.");
        }

        if (order.getTotalAmount() == null || order.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Order amount must be greater than zero!");
        }

        long amountInPaise = order.getTotalAmount()
                .multiply(new BigDecimal(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        String razorpayOrderId;
        if (testMode && !razorpayConfigured()) {
            razorpayOrderId = "order_test_" + order.getId() + "_" + (System.currentTimeMillis() % 1000000);
            logger.info("Test mode active: Generated simulated Razorpay order {} for test suite", razorpayOrderId);
        } else {
            if (!razorpayConfigured()) {
                logger.error("Razorpay LIVE credentials not configured on server (keyId is blank or placeholder)");
                throw new BadRequestException("Payment gateway is temporarily unavailable. Please contact support.");
            }

            try {
                com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
                org.json.JSONObject orderRequest = new org.json.JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "rcpt_" + order.getId() + "_" + (System.currentTimeMillis() % 1000000));

                com.razorpay.Order rzpOrder = razorpay.orders.create(orderRequest);
                if (rzpOrder == null || !rzpOrder.has("id")) {
                    throw new BadRequestException("Razorpay gateway did not return an order identifier.");
                }
                razorpayOrderId = rzpOrder.get("id").toString();
                logger.info("Created real Razorpay order {} for internal order #{}", razorpayOrderId, order.getId());
            } catch (com.razorpay.RazorpayException re) {
                logger.error("Razorpay SDK order creation failed: {}", re.getMessage());
                throw new BadRequestException("Failed to initiate Razorpay order: " + re.getMessage());
            } catch (Exception e) {
                logger.error("Unexpected error creating Razorpay order: {}", e.getMessage(), e);
                throw new BadRequestException("Could not initiate payment with gateway.");
            }
        }

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

        // Idempotency: If already verified and marked paid, return existing verified payment
        if (payment.getStatus() == PaymentStatus.SUCCESSFUL &&
            (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.CONFIRMED)) {
            logger.info("Order #{} is already verified and paid. Returning existing payment.", order.getId());
            return mapPaymentToDto(payment);
        }

        // Validate Razorpay Order ID matches (strict in production, flexible in test mode)
        if (!testMode && (payment.getRazorpayOrderId() == null || !payment.getRazorpayOrderId().equals(request.getRazorpayOrderId()))) {
            logger.error("Mismatched Razorpay order ID. Expected: {}, Received: {}",
                    payment.getRazorpayOrderId(), request.getRazorpayOrderId());
            throw new BadRequestException("Mismatched Razorpay order ID!");
        }

        boolean isValidSignature = false;
        if (testMode && !razorpayConfigured()) {
            isValidSignature = request.getRazorpaySignature() != null && request.getRazorpaySignature().length() >= 10;
            logger.info("Test mode active: Accepted test payment signature for order #{}", order.getId());
        } else {
            if (!razorpayConfigured()) {
                logger.error("Razorpay secret not configured for verification");
                throw new BadRequestException("Payment verification secret is not configured on server.");
            }

            if (request.getRazorpayPaymentId() == null || request.getRazorpayPaymentId().isBlank() ||
                request.getRazorpaySignature() == null || request.getRazorpaySignature().isBlank()) {
                throw new BadRequestException("Payment ID and Signature are required for verification.");
            }

            // Cryptographic HMAC-SHA256 signature verification
            String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            isValidSignature = verifyHmacSha256(payload, request.getRazorpaySignature(), razorpayKeySecret);
        }

        if (!isValidSignature) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            logger.error("HMAC-SHA256 signature verification failed for order #{}!", order.getId());
            throw new BadRequestException("Invalid payment signature verification!");
        }

        // Server-side payment fetch and validation using Razorpay SDK
        if (!testMode && razorpayConfigured()) {
            try {
                com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
                com.razorpay.Payment rzpPayment = razorpay.payments.fetch(request.getRazorpayPaymentId());
                if (rzpPayment != null) {
                    long expectedPaise = order.getTotalAmount()
                            .multiply(new BigDecimal(100))
                            .setScale(0, RoundingMode.HALF_UP)
                            .longValueExact();
                    long rzpAmount = ((Number) rzpPayment.get("amount")).longValue();

                    if (rzpAmount != expectedPaise) {
                        payment.setStatus(PaymentStatus.FAILED);
                        paymentRepository.save(payment);
                        logger.error("Payment amount mismatch! Expected: {}, Gateway reported: {}", expectedPaise, rzpAmount);
                        throw new BadRequestException("Payment amount mismatch with gateway!");
                    }

                    String rzpStatus = rzpPayment.get("status").toString();
                    if (!"captured".equalsIgnoreCase(rzpStatus) && !"authorized".equalsIgnoreCase(rzpStatus)) {
                        payment.setStatus(PaymentStatus.FAILED);
                        paymentRepository.save(payment);
                        logger.error("Payment status is not captured/authorized: {}", rzpStatus);
                        throw new BadRequestException("Payment status is invalid on gateway: " + rzpStatus);
                    }
                }
            } catch (BadRequestException bre) {
                throw bre;
            } catch (Exception e) {
                logger.warn("Could not fetch payment from Razorpay client (signature was verified): {}", e.getMessage());
            }
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        if (request.getRazorpayOrderId() != null && !request.getRazorpayOrderId().isBlank()) {
            payment.setRazorpayOrderId(request.getRazorpayOrderId());
        }
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Process Idempotent Entitlements (Subscriptions & Licenses)
        createEntitlementsForOrder(order);

        // Clear cart now that payment is verified and order is marked PAID
        try {
            cartService.clearCart(order.getUser().getId());
            logger.info("Cleared cart for user #{} after verified payment", order.getUser().getId());
        } catch (Exception e) {
            logger.warn("Could not clear cart for user #{}: {}", order.getUser().getId(), e.getMessage());
        }

        // Notifications & confirmation email
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

            // Check if subscription already created for this order
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

            // Check if license already created for this subscription
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

    public boolean verifyHmacSha256(String data, String signature, String secret) {
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
            return MessageDigest.isEqual(
                    hexString.toString().getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            logger.error("Error calculating HMAC SHA256 signature", e);
            return false;
        }
    }

    public boolean verifyWebhookSignature(String payload, String signature) {
        String secret = (razorpayWebhookSecret != null && !razorpayWebhookSecret.isBlank())
                ? razorpayWebhookSecret : razorpayKeySecret;
        if (secret == null || secret.isBlank()) return false;
        return verifyHmacSha256(payload, signature, secret);
    }
}
