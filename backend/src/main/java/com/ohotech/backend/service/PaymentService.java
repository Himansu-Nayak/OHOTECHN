package com.ohotech.backend.service;

import com.ohotech.backend.dto.*;
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
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LicenseRepository licenseRepository;
    private final LicenseService licenseService;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final EmailTemplateService emailTemplateService;
    private final CartService cartService;
    private final AuditService auditService;

    @Value("${app.razorpay.key-id:${razorpay.key-id:}}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:${razorpay.key-secret:}}")
    private String razorpayKeySecret;

    @Value("${app.razorpay.webhook-secret:${razorpay.webhook-secret:}}")
    private String razorpayWebhookSecret;

    @Value("${app.razorpay.test-mode:false}")
    private boolean testMode;

    @Value("${app.upi.merchant-name:KAMPA INFRA AND RENEWABLE ENERGY DEVELOPERS PVT L}")
    private String upiMerchantName;

    @Value("${app.upi.id:9937591330@indianbk}")
    private String upiId;

    @Value("${app.upi.bank-name:Indian Bank}")
    private String upiBankName;

    @Value("${app.payment.bank-transfer-enabled:true}")
    private boolean bankTransferEnabled;

    @Value("${app.payment.cod-enabled:true}")
    private boolean codEnabled;

    @Value("${app.payment.razorpay-enabled:true}")
    private boolean razorpayEnabled;

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

    @Transactional(readOnly = true)
    public PaymentConfigDto getPaymentConfig() {
        return PaymentConfigDto.builder()
                .upiId(upiId)
                .merchantName(upiMerchantName)
                .bankName(upiBankName)
                .bankTransferEnabled(bankTransferEnabled)
                .codEnabled(codEnabled)
                .razorpayEnabled(razorpayEnabled && razorpayConfigured())
                .razorpayKeyId(razorpayKeyId)
                .build();
    }

    @Transactional
    public UpiInitiateResponse initiateUpiPayment(Long userId, Long orderId) {
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

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElse(Payment.builder()
                        .order(order)
                        .amount(order.getTotalAmount())
                        .status(PaymentStatus.PENDING)
                        .build());

        payment.setAmount(order.getTotalAmount());
        payment.setProvider("BANK_TRANSFER");
        payment.setMethod("UPI");
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);

        String encodedMerchant;
        try {
            encodedMerchant = java.net.URLEncoder.encode(upiMerchantName, StandardCharsets.UTF_8.toString()).replace("+", "%20");
        } catch (Exception e) {
            encodedMerchant = "KAMPA%20INFRA%20AND%20RENEWABLE%20ENERGY%20DEVELOPERS%20PVT%20L";
        }

        String transactionRef = "ORD" + order.getId() + "_" + (System.currentTimeMillis() % 100000);
        String upiIntentUri = String.format(
                "upi://pay?pa=%s&pn=%s&am=%s&cu=INR&tr=%s",
                upiId.trim(),
                encodedMerchant,
                order.getTotalAmount().setScale(2, RoundingMode.HALF_UP).toPlainString(),
                transactionRef
        );

        return UpiInitiateResponse.builder()
                .orderId(order.getId())
                .paymentId(payment.getId())
                .amount(order.getTotalAmount())
                .currency("INR")
                .upiId(upiId)
                .merchantName(upiMerchantName)
                .bankName(upiBankName)
                .upiIntentUri(upiIntentUri)
                .transactionRef(transactionRef)
                .build();
    }

    @Transactional
    public PaymentResponseDto submitUtr(Long userId, UtrSubmissionRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", request.getOrderId());
        }

        String rawUtr = request.getUtr() != null ? request.getUtr().trim() : "";
        if (rawUtr.length() < 6) {
            throw new BadRequestException("Please enter a valid UTR / Transaction Reference number (minimum 6 characters).");
        }

        // Prevent reusing an already verified UTR from another order
        Optional<Payment> duplicatePayment = paymentRepository.findDuplicateVerifiedUtr(rawUtr, order.getId());
        if (duplicatePayment.isPresent()) {
            throw new BadRequestException("This UTR / Transaction Reference has already been verified and used for another order.");
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(Payment.builder()
                        .order(order)
                        .amount(order.getTotalAmount())
                        .build());

        if (payment.getStatus() == PaymentStatus.SUCCESSFUL) {
            return mapPaymentToDto(payment);
        }

        payment.setAmount(order.getTotalAmount());
        payment.setProvider("BANK_TRANSFER");
        payment.setMethod("UPI");
        payment.setCurrency("INR");
        payment.setTransactionReference(rawUtr);
        payment.setPayerUpiId(request.getPayerUpiId() != null ? request.getPayerUpiId().trim() : null);
        payment.setPayerName(request.getPayerName() != null ? request.getPayerName().trim() : null);
        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            payment.setAdminNotes(request.getNotes().trim());
        }
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);

        order.setStatus(OrderStatus.PENDING);
        orderRepository.save(order);

        // Clear user's cart now that UTR proof has been submitted
        try {
            cartService.clearCart(userId);
        } catch (Exception e) {
            logger.warn("Cart clear warning after UTR submission: {}", e.getMessage());
        }

        // Notification & email
        try {
            notificationService.createNotification(
                    userId,
                    "Payment Under Verification",
                    "We have received your payment reference (UTR: " + rawUtr + ") for Order #" + order.getId() + ". Our finance team will verify and activate your software.",
                    NotificationType.INFO,
                    NotificationCategory.PAYMENT,
                    "/orders"
            );

            auditService.logUserEvent(order.getUser(), "PAYMENT_UTR_SUBMITTED", "Payment", String.valueOf(payment.getId()),
                    "Customer submitted UTR: " + rawUtr + " for order #" + order.getId());

            if (order.getUser().getEmail() != null) {
                emailService.sendEmail(order.getUser().getEmail(),
                        "OHO TECHN - Payment Received for Order #" + order.getId() + " (Verification Pending)",
                        "Dear " + order.getUser().getName() + ",\n\nWe have received your payment reference (UTR: " + rawUtr + ") for Order #" + order.getId() + " (Amount: ₹" + order.getTotalAmount() + ").\n\nOur team is currently verifying the transfer with " + upiBankName + ". Once approved, your software licenses and access will be activated immediately.\n\nThank you for choosing OHO TECHN.");
            }
        } catch (Exception e) {
            logger.warn("Email/Notification warning: {}", e.getMessage());
        }

        return mapPaymentToDto(payment);
    }

    @Transactional
    public PaymentResponseDto initiateCod(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        if (order.getStatus() == OrderStatus.PAID) {
            throw new BadRequestException("Order #" + orderId + " is already paid.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElse(Payment.builder()
                        .order(order)
                        .amount(order.getTotalAmount())
                        .build());

        payment.setAmount(order.getTotalAmount());
        payment.setProvider("COD");
        payment.setMethod("CASH_ON_DELIVERY");
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);

        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        try {
            cartService.clearCart(userId);
            auditService.logUserEvent(order.getUser(), "ORDER_COD_INITIATED", "Order", String.valueOf(order.getId()),
                    "Customer placed Cash on Delivery order #" + order.getId());
        } catch (Exception e) {
            logger.warn("COD post-processing warning: {}", e.getMessage());
        }

        return mapPaymentToDto(payment);
    }

    @Transactional
    public PaymentResponseDto adminVerifyPayment(Long adminId, Long paymentId, AdminPaymentActionRequest actionRequest) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        User adminUser = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin User", "id", adminId));

        Order order = payment.getOrder();
        if (order == null) {
            throw new BadRequestException("Payment is not attached to an order.");
        }

        if (payment.getStatus() == PaymentStatus.SUCCESSFUL && order.getStatus() == OrderStatus.PAID) {
            return mapPaymentToDto(payment);
        }

        // Prevent verifying if another payment already successfully used this UTR
        if (payment.getTransactionReference() != null && !payment.getTransactionReference().isBlank()) {
            Optional<Payment> existingVerified = paymentRepository.findDuplicateVerifiedUtr(
                    payment.getTransactionReference().trim(), order.getId());
            if (existingVerified.isPresent()) {
                throw new BadRequestException("Cannot approve: UTR " + payment.getTransactionReference() + " is already approved on payment #" + existingVerified.get().getId());
            }
        }

        payment.setStatus(PaymentStatus.SUCCESSFUL);
        payment.setVerifiedBy(adminUser.getEmail() != null ? adminUser.getEmail() : adminUser.getName());
        payment.setVerifiedAt(LocalDateTime.now());
        if (actionRequest != null && actionRequest.getNotes() != null && !actionRequest.getNotes().isBlank()) {
            payment.setAdminNotes(actionRequest.getNotes().trim());
        }
        payment = paymentRepository.save(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Provision licenses and subscriptions
        createEntitlementsForOrder(order);

        // Audit Trail
        auditService.logUserEvent(adminUser, "PAYMENT_MANUAL_VERIFIED", "Payment", String.valueOf(payment.getId()),
                "Admin manually verified payment #" + payment.getId() + " for order #" + order.getId() +
                (payment.getTransactionReference() != null ? " with UTR: " + payment.getTransactionReference() : ""));

        // Notifications & confirmation email
        try {
            notificationService.createNotification(
                    order.getUser().getId(),
                    "Payment Approved & Verified",
                    "Your payment for Order #" + order.getId() + " (₹" + order.getTotalAmount() + ") has been approved by accounts. Your software access is ready!",
                    NotificationType.SUCCESS,
                    NotificationCategory.PAYMENT,
                    "/my-products"
            );

            if (order.getUser().getEmail() != null) {
                String htmlBody = emailTemplateService.buildPaymentSuccessEmail(
                        order.getUser().getName(),
                        payment.getTransactionReference() != null ? payment.getTransactionReference() : "OFFLINE_" + payment.getId(),
                        order.getId(),
                        order.getTotalAmount()
                );
                emailService.sendHtmlEmail(order.getUser().getEmail(), "OHO TECHN - Payment Approved for Order #" + order.getId(), htmlBody);
            }
        } catch (Exception e) {
            logger.warn("Notification/Email trigger warning on admin verify: {}", e.getMessage());
        }

        return mapPaymentToDto(payment);
    }

    @Transactional
    public PaymentResponseDto adminRejectPayment(Long adminId, Long paymentId, AdminPaymentActionRequest actionRequest) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        User adminUser = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin User", "id", adminId));

        Order order = payment.getOrder();
        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(actionRequest != null && actionRequest.getReason() != null ? actionRequest.getReason().trim() : "Payment rejected by admin / invalid UTR");
        payment.setVerifiedBy(adminUser.getEmail() != null ? adminUser.getEmail() : adminUser.getName());
        payment.setVerifiedAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        if (order != null) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }

        auditService.logUserEvent(adminUser, "PAYMENT_MANUAL_REJECTED", "Payment", String.valueOf(payment.getId()),
                "Admin rejected payment #" + payment.getId() + " Reason: " + payment.getFailureReason());

        try {
            if (order != null && order.getUser() != null) {
                notificationService.createNotification(
                        order.getUser().getId(),
                        "Payment Verification Rejected",
                        "The payment reference for Order #" + order.getId() + " could not be verified. Please contact support or retry payment.",
                        NotificationType.WARNING,
                        NotificationCategory.PAYMENT,
                        "/orders"
                );
            }
        } catch (Exception e) {
            logger.warn("Reject notification warning: {}", e.getMessage());
        }

        return mapPaymentToDto(payment);
    }

    public PaymentResponseDto mapPaymentToDto(Payment payment) {
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrder() != null ? payment.getOrder().getId() : null)
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .provider(payment.getProvider())
                .method(payment.getMethod())
                .currency(payment.getCurrency())
                .transactionReference(payment.getTransactionReference())
                .payerUpiId(payment.getPayerUpiId())
                .payerName(payment.getPayerName())
                .failureReason(payment.getFailureReason())
                .adminNotes(payment.getAdminNotes())
                .verifiedBy(payment.getVerifiedBy())
                .verifiedAt(payment.getVerifiedAt())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    @Transactional
    public void createEntitlementsForOrder(Order order) {
        if (order.getItems() == null) return;

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            ProductPlan plan = item.getProductPlan();

            // Check if subscription already created for this order & product
            Optional<Subscription> existingSub = subscriptionRepository.findByOrderIdAndProductId(order.getId(), product.getId());

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
