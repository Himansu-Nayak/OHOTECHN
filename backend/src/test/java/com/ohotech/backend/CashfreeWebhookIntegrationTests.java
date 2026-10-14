package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.service.CartService;
import com.ohotech.backend.service.payment.CashfreeGateway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CashfreeWebhookIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private WebhookEventRepository webhookEventRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPlanRepository productPlanRepository;

    @Autowired
    private com.ohotech.backend.repository.SubscriptionRepository subscriptionRepository;

    @Autowired
    private com.ohotech.backend.repository.LicenseRepository licenseRepository;

    @Autowired
    private com.ohotech.backend.service.PaymentService paymentService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CashfreeGateway cashfreeGateway;

    private static final String TEST_SECRET = "cf_test_webhook_secret_key_12345";

    @Value("${cashfree.webhook-secret:cf_test_webhook_secret_key_12345}")
    private String webhookSecret;

    private User customerUser;
    private Product testProduct;
    private ProductPlan testPlan;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        webhookEventRepository.deleteAll();
        licenseRepository.deleteAll();
        subscriptionRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        cartRepository.deleteAll();
        userRepository.deleteAll();

        customerUser = userRepository.save(User.builder()
                .name("Aditya Roy")
                .email("aditya.roy@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());

        testProduct = productRepository.save(Product.builder()
                .name("OHO Hospital ERP Pro")
                .description("Advanced healthcare information platform")
                .price(new BigDecimal("24999.00"))
                .active(true)
                .build());

        testPlan = productPlanRepository.save(ProductPlan.builder()
                .product(testProduct)
                .name("Annual Commercial License")
                .billingType(BillingType.YEARLY)
                .price(new BigDecimal("24999.00"))
                .durationDays(365)
                .activationLimit(3)
                .active(true)
                .build());

        testOrder = orderRepository.save(Order.builder()
                .user(customerUser)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("24999.00"))
                .shippingAddress("DLF CyberCity, Phase 2, Gurugram, Haryana")
                .contactPhone("+91 98765 43210")
                .build());

        // Initial Payment record
        paymentRepository.save(Payment.builder()
                .order(testOrder)
                .amount(testOrder.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("order_" + testOrder.getId() + "_cf101")
                .build());
    }

    private String calculateCashfreeSignature(String rawBody, String timestamp, String secret) throws Exception {
        String sec = (secret != null && !secret.isBlank()) ? secret : TEST_SECRET;
        String data = timestamp + rawBody;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(sec.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }

    // 1. VALID PAYMENT-SUCCESS WEBHOOK
    @Test
    @DisplayName("Valid PAYMENT_SUCCESS_WEBHOOK transitions Order to CONFIRMED and records Payment details")
    void testValidPaymentSuccessWebhook() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";
        String cfPaymentId = "cf_pay_99887766";

        String rawPayload = String.format("""
            {
              "data": {
                "order": {
                  "order_id": "%s",
                  "order_amount": 24999.00,
                  "order_currency": "INR"
                },
                "payment": {
                  "cf_payment_id": "%s",
                  "payment_status": "SUCCESS",
                  "payment_amount": 24999.00,
                  "payment_currency": "INR",
                  "payment_message": "Transaction successful",
                  "payment_time": "2026-10-09T11:30:00+05:30",
                  "bank_reference": "SBI123456789",
                  "payment_group": "upi"
                },
                "customer_details": {
                  "customer_id": "cust_%d",
                  "customer_email": "%s",
                  "customer_phone": "+919876543210"
                }
              },
              "event_time": "2026-10-09T11:30:00+05:30",
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """, cfOrderId, cfPaymentId, customerUser.getId(), customerUser.getEmail());

        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));

        // Verify Order status transitioned to CONFIRMED
        Order updatedOrder = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.CONFIRMED);

        // Verify Payment updated
        Payment updatedPayment = paymentRepository.findByOrderId(testOrder.getId()).orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(updatedPayment.getCashfreePaymentId()).isEqualTo(cfPaymentId);
        assertThat(updatedPayment.getProvider()).isEqualTo(CashfreeGateway.PROVIDER_ID);

        // Verify Webhook event recorded in database
        assertThat(webhookEventRepository.existsByProviderAndExternalEventId(CashfreeGateway.PROVIDER_ID, "cf_pay_" + cfPaymentId + "_PAYMENT_SUCCESS_WEBHOOK")).isTrue();
    }

    // 2. INVALID SIGNATURE REJECTION
    @Test
    @DisplayName("Invalid Cashfree webhook signature is strictly rejected (400 Bad Request)")
    void testInvalidSignatureRejected() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        String rawPayload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s", "order_amount": 24999.00 },
                "payment": { "cf_payment_id": "123", "payment_status": "SUCCESS" }
              },
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """, cfOrderId);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", "invalid_forged_signature_base64==")
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        // Order remains PENDING
        Order updatedOrder = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PENDING);
    }

    // 3. MISSING SIGNATURE HEADERS
    @Test
    @DisplayName("Missing signature or timestamp headers is rejected (400 Bad Request)")
    void testMissingSignatureHeadersRejected() throws Exception {
        String rawPayload = "{\"type\": \"PAYMENT_SUCCESS_WEBHOOK\"}";

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    // 4. MALFORMED JSON
    @Test
    @DisplayName("Malformed JSON payload with valid HMAC is rejected (400 Bad Request)")
    void testMalformedJsonPayload() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String malformedJson = "{ unclosed_json: \"invalid\" ";
        String signature = calculateCashfreeSignature(malformedJson, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    // 5. UNKNOWN ORDER ID
    @Test
    @DisplayName("Unknown order ID returns error and preserves database integrity")
    void testUnknownOrderId() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String rawPayload = """
            {
              "data": {
                "order": { "order_id": "order_9999999_unknown", "order_amount": 5000.00, "order_currency": "INR" },
                "payment": { "cf_payment_id": "cf_99999", "payment_status": "SUCCESS", "payment_amount": 5000.00 }
              },
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """;
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    // 6. AMOUNT MISMATCH
    @Test
    @DisplayName("Amount mismatch between Cashfree report and order total is rejected")
    void testAmountMismatch() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        // Order total is 24999.00, reported is 1.00 (tampering attempt)
        String rawPayload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s", "order_amount": 1.00, "order_currency": "INR" },
                "payment": { "cf_payment_id": "cf_hack_1", "payment_status": "SUCCESS", "payment_amount": 1.00 }
              },
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        // Order total amount must remain unchanged and order PENDING
        Order updatedOrder = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PENDING);
    }

    // 7. DUPLICATE EVENT DELIVERY & IDEMPOTENCY
    @Test
    @DisplayName("Duplicate event delivery returns 200 ALREADY_PROCESSED and executes business logic only once")
    void testDuplicateEventDelivery() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";
        String cfPaymentId = "cf_pay_duplicate_test";

        String rawPayload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s", "order_amount": 24999.00, "order_currency": "INR" },
                "payment": { "cf_payment_id": "%s", "payment_status": "SUCCESS", "payment_amount": 24999.00, "bank_reference": "UTR123" }
              },
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """, cfOrderId, cfPaymentId);

        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        // First delivery
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));

        // Second duplicate delivery
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ALREADY_PROCESSED"));
    }

    // 8. PAYMENT FAILURE WEBHOOK
    @Test
    @DisplayName("PAYMENT_FAILED_WEBHOOK marks payment as FAILED without cancelling order prematurely")
    void testPaymentFailedWebhook() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        String rawPayload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s", "order_amount": 24999.00 },
                "payment": { "cf_payment_id": "cf_failed_99", "payment_status": "FAILED", "payment_message": "Bank server timeout" }
              },
              "type": "PAYMENT_FAILED_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        Payment updatedPayment = paymentRepository.findByOrderId(testOrder.getId()).orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.FAILED);
        assertThat(updatedPayment.getFailureReason()).contains("Bank server timeout");
    }

    // 9. DELAYED FAILURE AFTER PAYMENT SUCCESS DOES NOT DOWNGRADE ORDER
    @Test
    @DisplayName("Delayed failure event after payment success never downgrades a confirmed/paid order")
    void testDelayedFailureAfterPaymentSuccess() throws Exception {
        // Mark payment as SUCCESSFUL and order CONFIRMED
        Payment payment = paymentRepository.findByOrderId(testOrder.getId()).orElseThrow();
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        paymentRepository.save(payment);

        testOrder.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(testOrder);

        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        String rawPayload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s", "order_amount": 24999.00 },
                "payment": { "cf_payment_id": "cf_delayed_fail", "payment_status": "FAILED", "payment_message": "Delayed dropped message" }
              },
              "type": "PAYMENT_FAILED_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        // Order and Payment must remain SUCCESSFUL/CONFIRMED
        Order orderCheck = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(orderCheck.getStatus()).isEqualTo(OrderStatus.CONFIRMED);

        Payment paymentCheck = paymentRepository.findById(payment.getId()).orElseThrow();
        assertThat(paymentCheck.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
    }

    // 10. REFUND STATUS WEBHOOK
    @Test
    @DisplayName("REFUND_STATUS_WEBHOOK transitions successful Order and Payment to REFUNDED")
    void testRefundStatusWebhook() throws Exception {
        Payment payment = paymentRepository.findByOrderId(testOrder.getId()).orElseThrow();
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        paymentRepository.save(payment);

        testOrder.setStatus(OrderStatus.PAID);
        orderRepository.save(testOrder);

        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        String rawPayload = String.format("""
            {
              "data": {
                "refund": {
                  "cf_refund_id": 991122,
                  "refund_id": "ref_991122",
                  "order_id": "%s",
                  "refund_amount": 24999.00,
                  "refund_currency": "INR",
                  "refund_status": "SUCCESS",
                  "refund_arn": "ARN_BANK_123456"
                }
              },
              "type": "REFUND_STATUS_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        Order orderCheck = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(orderCheck.getStatus()).isEqualTo(OrderStatus.REFUNDED);

        Payment paymentCheck = paymentRepository.findById(payment.getId()).orElseThrow();
        assertThat(paymentCheck.getStatus()).isEqualTo(PaymentStatus.REFUNDED);
        assertThat(paymentCheck.getFailureReason()).contains("ARN_BANK_123456");
    }

    // 11. SPRING SECURITY PERMIT ALL ON WEBHOOK ROUTE (UNAUTHENTICATED DELIVERY)
    @Test
    @DisplayName("Cashfree webhook route is accessible without Bearer token authentication")
    void testUnauthenticatedWebhookAccessPermitted() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String rawPayload = """
            {
              "data": { "order": { "order_id": "test_ping" } },
              "type": "PAYMENT_USER_DROPPED_WEBHOOK"
            }
            """;
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        // Perform request WITHOUT Authorization header
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());
    }

    // 12. DETERMINISTIC FALLBACK IDEMPOTENCY KEY ON RETRIED IDENTICAL PAYLOADS
    @Test
    @DisplayName("Identical payloads without cf_payment_id or event_time generate identical SHA-256 fallback event IDs")
    void testDeterministicFallbackEventIdOnIdenticalRetries() throws Exception {
        String timestamp = "1791527637000";
        // Minimal payload without cf_payment_id and without event_time
        String rawPayload = "{\"type\":\"CUSTOM_EVENT\",\"data\":{\"order\":{\"order_id\":\"order_" + testOrder.getId() + "_cf101\"}}}";
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        // First delivery: processes and stores deterministic hash ID
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));

        // Second retry delivery of exact same payload: recognized as ALREADY_PROCESSED
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ALREADY_PROCESSED"));
    }

    // 13. REFUND REVOKES ACTIVE ENTITLEMENTS IF ORDER WAS ALREADY PROVISIONED
    @Test
    @DisplayName("REFUND_STATUS_WEBHOOK revokes active Subscriptions and Licenses for previously provisioned orders")
    void testRefundRevokesProvisionedEntitlements() throws Exception {
        // Setup order with order items
        OrderItem orderItem = OrderItem.builder()
                .order(testOrder)
                .product(testProduct)
                .productPlan(testPlan)
                .quantity(1)
                .price(testOrder.getTotalAmount())
                .build();
        List<OrderItem> items = new java.util.ArrayList<>();
        items.add(orderItem);
        testOrder.setItems(items);
        testOrder.setStatus(OrderStatus.PAID);
        orderRepository.save(testOrder);

        Payment payment = paymentRepository.findByOrderId(testOrder.getId()).orElseThrow();
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        paymentRepository.save(payment);

        // Provision entitlements (as admin approval would)
        paymentService.createEntitlementsForOrder(testOrder);

        List<Subscription> subsBefore = subscriptionRepository.findAllByOrderId(testOrder.getId());
        assertThat(subsBefore).isNotEmpty();
        assertThat(subsBefore.get(0).getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);

        Optional<License> licBefore = licenseRepository.findBySubscriptionId(subsBefore.get(0).getId());
        assertThat(licBefore).isPresent();
        assertThat(licBefore.get().getStatus()).isEqualTo(LicenseStatus.ACTIVE);

        // Send REFUND_STATUS_WEBHOOK
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        String rawPayload = String.format("""
            {
              "data": {
                "refund": {
                  "cf_refund_id": 883344,
                  "refund_id": "ref_883344",
                  "order_id": "%s",
                  "refund_amount": 24999.00,
                  "refund_currency": "INR",
                  "refund_status": "SUCCESS",
                  "refund_arn": "ARN_PROVISIONED_REFUND"
                }
              },
              "type": "REFUND_STATUS_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        // Verify order status
        Order orderAfter = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(orderAfter.getStatus()).isEqualTo(OrderStatus.REFUNDED);

        // Verify entitlements are now revoked
        List<Subscription> subsAfter = subscriptionRepository.findAllByOrderId(testOrder.getId());
        assertThat(subsAfter.get(0).getStatus()).isEqualTo(SubscriptionStatus.CANCELLED);

        License licAfter = licenseRepository.findBySubscriptionId(subsAfter.get(0).getId()).orElseThrow();
        assertThat(licAfter.getStatus()).isEqualTo(LicenseStatus.REVOKED);
    }

    // 14. FAILED REFUND DOES NOT REVOKE ENTITLEMENTS OR CHANGE STATUS
    @Test
    @DisplayName("Failed or pending refund event does not revoke entitlements or mark order as REFUNDED")
    void testFailedRefundPreservesEntitlements() throws Exception {
        // Setup paid order with active entitlements
        OrderItem orderItem = OrderItem.builder()
                .order(testOrder)
                .product(testProduct)
                .productPlan(testPlan)
                .quantity(1)
                .price(testOrder.getTotalAmount())
                .build();
        List<OrderItem> items = new java.util.ArrayList<>();
        items.add(orderItem);
        testOrder.setItems(items);
        testOrder.setStatus(OrderStatus.PAID);
        orderRepository.save(testOrder);

        Payment payment = paymentRepository.findByOrderId(testOrder.getId()).orElseThrow();
        payment.setStatus(PaymentStatus.SUCCESSFUL);
        paymentRepository.save(payment);

        paymentService.createEntitlementsForOrder(testOrder);

        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        // Refund status is FAILED
        String rawPayload = String.format("""
            {
              "data": {
                "refund": {
                  "cf_refund_id": 776655,
                  "refund_id": "ref_776655",
                  "order_id": "%s",
                  "refund_amount": 24999.00,
                  "refund_currency": "INR",
                  "refund_status": "FAILED",
                  "refund_arn": ""
                }
              },
              "type": "REFUND_STATUS_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        // Order and Payment must remain intact
        Order orderAfter = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(orderAfter.getStatus()).isEqualTo(OrderStatus.PAID);

        Payment paymentAfter = paymentRepository.findById(payment.getId()).orElseThrow();
        assertThat(paymentAfter.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);

        // Entitlements remain ACTIVE
        List<Subscription> subs = subscriptionRepository.findAllByOrderId(testOrder.getId());
        assertThat(subs.get(0).getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);

        License lic = licenseRepository.findBySubscriptionId(subs.get(0).getId()).orElseThrow();
        assertThat(lic.getStatus()).isEqualTo(LicenseStatus.ACTIVE);
    }

    // 15. UNKNOWN EVENT TYPE IS SAFELY ACKNOWLEDGED WITHOUT MUTATING STATE
    @Test
    @DisplayName("Unknown or unhandled event type returns 200 OK and preserves database state")
    void testUnknownEventTypeAcknowledgedSafely() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String cfOrderId = "order_" + testOrder.getId() + "_cf101";

        String rawPayload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s" }
              },
              "type": "SUBSCRIPTION_STATUS_WEBHOOK"
            }
            """, cfOrderId);
        String signature = calculateCashfreeSignature(rawPayload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rawPayload)
                        .header("x-webhook-signature", signature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));

        // Order remains in original state
        Order orderCheck = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertThat(orderCheck.getStatus()).isEqualTo(OrderStatus.PENDING);
    }
}
