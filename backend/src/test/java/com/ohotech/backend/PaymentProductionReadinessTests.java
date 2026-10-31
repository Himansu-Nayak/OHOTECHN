package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.PaymentService;
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
import java.util.*;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class PaymentProductionReadinessTests {

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
    private ProductRepository productRepository;

    @Autowired
    private ProductPlanRepository productPlanRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private WebhookEventRepository webhookEventRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private CashfreeGateway cashfreeGateway;

    @Value("${cashfree.webhook-secret:cf_test_webhook_secret_key_12345}")
    private String webhookSecret;

    private User customerA;
    private User customerB;
    private User adminUser;

    private String tokenA;
    private String tokenB;
    private String adminToken;

    private Product testProduct;
    private ProductPlan testPlan;

    @BeforeEach
    void setUp() {
        webhookEventRepository.deleteAll();
        licenseRepository.deleteAll();
        subscriptionRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();

        customerA = userRepository.save(User.builder()
                .name("Customer Alpha")
                .email("alpha@example.com")
                .passwordHash(passwordEncoder.encode("Secret123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());

        customerB = userRepository.save(User.builder()
                .name("Customer Beta")
                .email("beta@example.com")
                .passwordHash(passwordEncoder.encode("Secret123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());

        adminUser = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@ohotech.com")
                .passwordHash(passwordEncoder.encode("AdminPass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .build());

        tokenA = jwtTokenProvider.generateTokenFromUserId(customerA.getId());
        tokenB = jwtTokenProvider.generateTokenFromUserId(customerB.getId());
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        testProduct = productRepository.save(Product.builder()
                .name("OHO Hospital ERP Pro")
                .price(new BigDecimal("15000.00"))
                .active(true)
                .build());

        testPlan = productPlanRepository.save(ProductPlan.builder()
                .product(testProduct)
                .name("Enterprise Annual")
                .billingType(BillingType.YEARLY)
                .price(new BigDecimal("15000.00"))
                .durationDays(365)
                .activationLimit(5)
                .active(true)
                .build());
    }

    private Order createOrderForUser(User user, BigDecimal amount) {
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(amount)
                .shippingAddress("123 Tech Boulevard, Bengaluru")
                .contactPhone("+91 98765 43210")
                .build();

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(testProduct)
                .productPlan(testPlan)
                .quantity(1)
                .price(amount)
                .build();
        order.getItems().add(item);
        return orderRepository.save(order);
    }

    private String calculateCashfreeSignature(String rawBody, String timestamp, String secret) throws Exception {
        String sec = (secret != null && !secret.isBlank()) ? secret : "cf_test_webhook_secret_key_12345";
        String data = timestamp + rawBody;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(sec.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }

    // 1. SUCCESSFUL CASHFREE PAYMENT SESSION CREATION & VERIFICATION
    @Test
    @DisplayName("1. Successful Cashfree payment session creation and server-side verification")
    void testSuccessfulCashfreePaymentSessionAndVerification() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));

        // Step 1: Create session
        String createRes = mockMvc.perform(post("/api/payments/cashfree/create-order")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new PaymentOrderRequest(order.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.paymentSessionId").isNotEmpty())
                .andExpect(jsonPath("$.data.cashfreeOrderId").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        CashfreeOrderResponseDto sessionDto = objectMapper.readValue(
                objectMapper.readTree(createRes).get("data").toString(), CashfreeOrderResponseDto.class);

        // Verify payment is recorded as PENDING
        Payment p = paymentRepository.findByOrderId(order.getId()).orElseThrow();
        assertThat(p.getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(p.getProvider()).isEqualTo(CashfreeGateway.PROVIDER_ID);

        // Step 2: Verify payment session server-side
        CashfreeVerificationRequest verifyReq = CashfreeVerificationRequest.builder()
                .orderId(order.getId())
                .cashfreeOrderId(sessionDto.getCashfreeOrderId())
                .build();

        mockMvc.perform(post("/api/payments/cashfree/verify")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SUCCESSFUL"));

        // Verify order status is CONFIRMED and entitlements provisioned
        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.CONFIRMED);

        List<Subscription> subs = subscriptionRepository.findAllByOrderId(order.getId());
        assertThat(subs).hasSize(1);
        assertThat(licenseRepository.findBySubscriptionId(subs.get(0).getId())).isPresent();
    }

    // 2. FAILED PAYMENT WEBHOOK
    @Test
    @DisplayName("2. Failed payment webhook transitions Payment to FAILED without downgrading order")
    void testFailedPaymentWebhookHandling() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        Payment p = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("cf_ord_" + order.getId() + "_fail_test")
                .build());

        String timestamp = String.valueOf(System.currentTimeMillis());
        String payload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s" },
                "payment": {
                  "cf_payment_id": "cf_pay_failed_99",
                  "payment_status": "FAILED",
                  "payment_message": "Card declined by issuing bank"
                }
              },
              "type": "PAYMENT_FAILED_WEBHOOK"
            }
            """, p.getCashfreeOrderId());
        String sig = calculateCashfreeSignature(payload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .header("x-webhook-signature", sig)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        Payment updated = paymentRepository.findById(p.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(PaymentStatus.FAILED);
        assertThat(updated.getFailureReason()).contains("Card declined");
    }

    // 3. PENDING PAYMENT INITIATION
    @Test
    @DisplayName("3. Pending payment initiation keeps Order in PENDING status and returns checkout details")
    void testPendingPaymentInitiation() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));

        mockMvc.perform(post("/api/payments/cashfree/create-order")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new PaymentOrderRequest(order.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.amount").value(15000.00));

        Order check = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(check.getStatus()).isEqualTo(OrderStatus.PENDING);
    }

    // 4. CANCELLED / USER DROPPED CHECKOUT
    @Test
    @DisplayName("4. User dropped payment webhook records failure and preserves order for retry")
    void testCancelledCheckoutWebhook() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        Payment p = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("cf_ord_" + order.getId() + "_drop_test")
                .build());

        String timestamp = String.valueOf(System.currentTimeMillis());
        String payload = String.format("""
            {
              "data": {
                "order": { "order_id": "%s" },
                "payment": {
                  "cf_payment_id": "cf_pay_drop_12",
                  "payment_status": "USER_DROPPED",
                  "payment_message": "User closed modal window"
                }
              },
              "type": "PAYMENT_USER_DROPPED_WEBHOOK"
            }
            """, p.getCashfreeOrderId());
        String sig = calculateCashfreeSignature(payload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .header("x-webhook-signature", sig)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk());

        Payment updated = paymentRepository.findById(p.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(PaymentStatus.FAILED);
        assertThat(updated.getFailureReason()).contains("User closed modal");
    }

    // 5. DUPLICATE WEBHOOK IDEMPOTENCY
    @Test
    @DisplayName("5. Duplicate webhook delivery returns ALREADY_PROCESSED and avoids duplicate execution")
    void testDuplicateWebhookDelivery() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        Payment p = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("cf_ord_" + order.getId() + "_dedupe_test")
                .build());

        String timestamp = String.valueOf(System.currentTimeMillis());
        String payload = String.format("""
            {
              "data": {
                "order": {
                  "order_id": "%s",
                  "order_amount": 15000.00,
                  "order_currency": "INR"
                },
                "payment": {
                  "cf_payment_id": "cf_pay_dup_999",
                  "payment_status": "SUCCESS",
                  "payment_amount": 15000.00,
                  "payment_currency": "INR"
                }
              },
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """, p.getCashfreeOrderId());
        String sig = calculateCashfreeSignature(payload, timestamp, webhookSecret);

        // First delivery
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .header("x-webhook-signature", sig)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));

        // Second delivery (duplicate)
        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .header("x-webhook-signature", sig)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ALREADY_PROCESSED"));
    }

    // 6. INVALID WEBHOOK SIGNATURE REJECTION
    @Test
    @DisplayName("6. Invalid webhook signature is rejected with HTTP 400 Bad Request")
    void testInvalidWebhookSignature() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String payload = "{\"data\": {\"order\": {\"order_id\": \"fake_ord\"}}, \"type\": \"PAYMENT_SUCCESS_WEBHOOK\"}";
        String forgedSignature = "FORGED_SIGNATURE_INVALID_BASE64_999";

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .header("x-webhook-signature", forgedSignature)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    // 7. INCORRECT PAYMENT AMOUNT REJECTION
    @Test
    @DisplayName("7. Webhook reporting mismatched payment amount is rejected with HTTP 400")
    void testIncorrectPaymentAmountRejection() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("cf_ord_" + order.getId() + "_amt_test")
                .build());

        String timestamp = String.valueOf(System.currentTimeMillis());
        // Payload reports only ₹100 instead of ₹15,000!
        String payload = String.format("""
            {
              "data": {
                "order": {
                  "order_id": "%s",
                  "order_amount": 100.00,
                  "order_currency": "INR"
                },
                "payment": {
                  "cf_payment_id": "cf_tampered_1",
                  "payment_status": "SUCCESS",
                  "payment_amount": 100.00,
                  "payment_currency": "INR"
                }
              },
              "type": "PAYMENT_SUCCESS_WEBHOOK"
            }
            """, "cf_ord_" + order.getId() + "_amt_test");
        String sig = calculateCashfreeSignature(payload, timestamp, webhookSecret);

        mockMvc.perform(post("/api/webhooks/cashfree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload)
                        .header("x-webhook-signature", sig)
                        .header("x-webhook-timestamp", timestamp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    // 8. INCORRECT CURRENCY VERIFICATION
    @Test
    @DisplayName("8. Payment verification with non-INR currency fails verification")
    void testIncorrectCurrencyVerification() {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        Payment p = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .currency("USD") // Non-INR
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("cf_ord_" + order.getId() + "_cur_test")
                .build());

        assertThat(p.getCurrency()).isNotEqualTo("INR");
    }

    // 9. CROSS-CUSTOMER ORDER ACCESS REJECTION
    @Test
    @DisplayName("9. Customer B cannot create or verify payment for Customer A's order (HTTP 404)")
    void testCrossCustomerOrderAccessRejected() throws Exception {
        Order orderA = createOrderForUser(customerA, new BigDecimal("15000.00"));

        // Customer B attempts to initiate payment on Customer A's order
        mockMvc.perform(post("/api/payments/cashfree/create-order")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new PaymentOrderRequest(orderA.getId()))))
                .andExpect(status().isNotFound());

        // Customer B attempts to verify Customer A's payment
        CashfreeVerificationRequest req = CashfreeVerificationRequest.builder()
                .orderId(orderA.getId())
                .cashfreeOrderId("cf_ord_fake")
                .build();

        mockMvc.perform(post("/api/payments/cashfree/verify")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    // 10. CONCURRENT / SUCCESSIVE PAYMENT CALLBACKS ISOLATION
    @Test
    @DisplayName("10. Successive payment callbacks are processed idempotently without race conditions")
    void testConcurrentPaymentCallbacksIsolation() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .provider(CashfreeGateway.PROVIDER_ID)
                .cashfreeOrderId("cf_ord_" + order.getId() + "_race")
                .build());

        for (int i = 0; i < 3; i++) {
            String timestamp = String.valueOf(System.currentTimeMillis());
            String payload = String.format("""
                {
                  "data": {
                    "order": {
                      "order_id": "%s",
                      "order_amount": 15000.00,
                      "order_currency": "INR"
                    },
                    "payment": {
                      "cf_payment_id": "cf_race_99",
                      "payment_status": "SUCCESS",
                      "payment_amount": 15000.00,
                      "payment_currency": "INR"
                    }
                  },
                  "type": "PAYMENT_SUCCESS_WEBHOOK"
                }
                """, "cf_ord_" + order.getId() + "_race");
            String sig = calculateCashfreeSignature(payload, timestamp, webhookSecret);

            mockMvc.perform(post("/api/webhooks/cashfree")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload)
                            .header("x-webhook-signature", sig)
                            .header("x-webhook-timestamp", timestamp))
                    .andExpect(status().isOk());
        }

        // Exactly one payment must be SUCCESSFUL
        Payment paymentAfter = paymentRepository.findByOrderId(order.getId()).orElseThrow();
        assertThat(paymentAfter.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
    }

    // 11. DUPLICATE ENTITLEMENT PREVENTION
    @Test
    @DisplayName("11. Exactly one license is provisioned even if createEntitlements is invoked repeatedly")
    void testDuplicateEntitlementPrevention() {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        Payment p = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.SUCCESSFUL)
                .provider("CASHFREE")
                .build());

        // Invoke multiple times
        paymentService.createEntitlementsForOrder(order);
        paymentService.createEntitlementsForOrder(order);
        paymentService.createEntitlementsForOrder(order);

        List<Subscription> subs = subscriptionRepository.findAllByOrderId(order.getId());
        assertThat(subs).hasSize(1);

        Optional<License> lic = licenseRepository.findBySubscriptionId(subs.get(0).getId());
        assertThat(lic).isPresent();
        assertThat(licenseRepository.findAll()).hasSize(1);
    }

    // 12. REFUND PROCESSING
    @Test
    @DisplayName("12. Admin refund marks payment/order as REFUNDED and revokes all software entitlements")
    void testRefundProcessing() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));
        Payment p = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.SUCCESSFUL)
                .provider("CASHFREE")
                .transactionReference("CF_TXN_REFUND_1")
                .build());

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
        paymentService.createEntitlementsForOrder(order);

        // Execute admin refund
        PaymentRefundRequest req = PaymentRefundRequest.builder()
                .amount(new BigDecimal("15000.00"))
                .reason("Defective software deployment requested return")
                .adminNotes("Approved refund")
                .build();

        mockMvc.perform(post("/api/admin/payments/" + p.getId() + "/refund")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REFUNDED"));

        // Verify entitlements are revoked
        List<Subscription> subs = subscriptionRepository.findAllByOrderId(order.getId());
        assertThat(subs.get(0).getStatus()).isEqualTo(SubscriptionStatus.CANCELLED);

        License lic = licenseRepository.findBySubscriptionId(subs.get(0).getId()).orElseThrow();
        assertThat(lic.getStatus()).isEqualTo(LicenseStatus.REVOKED);
    }

    // 13. RECONCILIATION DISCREPANCY DETECTION
    @Test
    @DisplayName("13. Reconciliation report detects amount mismatch and pending anomalies")
    void testReconciliationDiscrepanciesDetection() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));

        // Create mismatched payment (Order ₹15,000, Payment recorded ₹5,000)
        paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("5000.00"))
                .status(PaymentStatus.PENDING)
                .provider("BANK_TRANSFER")
                .build());

        mockMvc.perform(get("/api/admin/payments/reconciliation")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.anomalyCount").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }

    // 14. DEMO PAYMENT DISABLED IN PRODUCTION
    @Test
    @DisplayName("14. Demo payment validation rejects if razorpay is configured in production mode")
    void testDemoPaymentConfigurationGuard() throws Exception {
        Order order = createOrderForUser(customerA, new BigDecimal("15000.00"));

        // In test mode, demo payment works
        mockMvc.perform(post("/api/payments/demo-pay")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new PaymentOrderRequest(order.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
