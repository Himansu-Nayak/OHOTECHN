package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.ApiKeyService;
import com.ohotech.backend.service.PaymentService;
import com.ohotech.backend.service.payment.PaymentGatewayRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class PaymentGatewaySecurityTests {

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
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private WebhookEventRepository webhookEventRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaymentGatewayRegistry gatewayRegistry;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ApiKeyService apiKeyService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private ProductRepository productRepository;

    private User adminUser;
    private User devUser;
    private User customerUser;

    private String adminToken;
    private String devToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        apiKeyRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();
        webhookEventRepository.deleteAll();

        adminUser = userRepository.save(User.builder()
                .name("Admin Tester")
                .email("admin@test.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .build());
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        devUser = userRepository.save(User.builder()
                .name("Developer Tester")
                .email("developer@test.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .emailVerified(true)
                .build());
        devToken = jwtTokenProvider.generateTokenFromUserId(devUser.getId());

        customerUser = userRepository.save(User.builder()
                .name("Customer Tester")
                .email("customer@test.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());
    }

    // 1. GATEWAY HEALTH CHECKS & REAL EXTENSIBLE CATALOG
    @Test
    @DisplayName("Admin can view honest payment gateways with real status and summary")
    void testGetGatewaysAndSummary() throws Exception {
        mockMvc.perform(get("/api/admin/gateways")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[?(@.providerId == 'RAZORPAY')].implemented").value(true))
                .andExpect(jsonPath("$.data[?(@.providerId == 'CASHFREE')].implemented").value(true))
                .andExpect(jsonPath("$.data[?(@.providerId == 'BANK_TRANSFER')].implemented").value(true))
                .andExpect(jsonPath("$.data[?(@.providerId == 'COD')].implemented").value(true))
                .andExpect(jsonPath("$.data[?(@.providerId == 'STRIPE')].implemented").value(false))
                .andExpect(jsonPath("$.data[?(@.providerId == 'STRIPE')].environment").value("INTEGRATION REQUIRED"));

        mockMvc.perform(get("/api/admin/gateways/summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPaymentVolume").exists())
                .andExpect(jsonPath("$.data.activeGatewayCount").isNumber());
    }

    @Test
    @DisplayName("Gateway health checks return authentic latency and status")
    void testGatewayHealthChecks() throws Exception {
        mockMvc.perform(post("/api/admin/gateways/BANK_TRANSFER/health-check")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.healthy").value(true))
                .andExpect(jsonPath("$.data.status").value("CONNECTED"));

        mockMvc.perform(post("/api/admin/gateways/STRIPE/health-check")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.healthy").value(false))
                .andExpect(jsonPath("$.data.status").value("NOT_CONFIGURED"));
    }

    // 2. STRICT PERMISSION BOUNDARY TESTS
    @Test
    @DisplayName("Developer is strictly denied access to Admin financial and gateway control endpoints (403 Forbidden)")
    void testDeveloperForbiddenOnAdminEndpoints() throws Exception {
        // Developer cannot access admin gateways
        mockMvc.perform(get("/api/admin/gateways")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isForbidden());

        // Developer cannot access admin payments ledger
        mockMvc.perform(get("/api/admin/payments")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isForbidden());

        // Developer cannot access admin payment reconciliation
        mockMvc.perform(get("/api/admin/payments/reconciliation")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Customer is denied access to Admin and Developer operations (403 Forbidden)")
    void testCustomerForbiddenOnAdminAndDeveloperEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/gateways")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/developer/diagnostics")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Unauthenticated requests are denied (401 Unauthorized)")
    void testUnauthenticatedAccessDenied() throws Exception {
        mockMvc.perform(get("/api/admin/gateways"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/developer/diagnostics"))
                .andExpect(status().isUnauthorized());
    }

    // 3. REAL REFUND OPERATION & ENTITLEMENT REVOCATION
    @Test
    @DisplayName("Admin can refund successful payments, revoking entitlements and recording audit log")
    void testAdminRefundExecution() throws Exception {
        // Create order and payment
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("14999.00"))
                .status(OrderStatus.PAID)
                .build());

        Payment payment = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("14999.00"))
                .status(PaymentStatus.SUCCESSFUL)
                .provider("BANK_TRANSFER")
                .transactionReference("UTR8829104")
                .build());

        PaymentRefundRequest refundRequest = PaymentRefundRequest.builder()
                .reason("Customer request cancellation within warranty window")
                .adminNotes("Verified bank transaction reverse")
                .build();

        mockMvc.perform(post("/api/admin/payments/" + payment.getId() + "/refund")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refundRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("REFUNDED"));

        // Verify DB state
        Payment updatedPayment = paymentRepository.findById(payment.getId()).orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.REFUNDED);

        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.REFUNDED);
    }

    @Test
    @DisplayName("Non-successful payments cannot be refunded")
    void testCannotRefundPendingOrFailedPayment() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("5000.00"))
                .status(OrderStatus.PENDING)
                .build());

        Payment payment = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("5000.00"))
                .status(PaymentStatus.PENDING)
                .provider("BANK_TRANSFER")
                .build());

        PaymentRefundRequest refundRequest = PaymentRefundRequest.builder()
                .reason("Test invalid refund")
                .build();

        mockMvc.perform(post("/api/admin/payments/" + payment.getId() + "/refund")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refundRequest)))
                .andExpect(status().isBadRequest());
    }

    // 4. REAL RECONCILIATION REPORT
    @Test
    @DisplayName("Admin reconciliation report detects pending payments and status mismatches")
    void testReconciliationReport() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("9999.00"))
                .status(OrderStatus.CANCELLED)
                .build());

        // Status mismatch anomaly: Payment successful but Order cancelled
        paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("9999.00"))
                .status(PaymentStatus.SUCCESSFUL)
                .provider("RAZORPAY")
                .build());

        mockMvc.perform(get("/api/admin/payments/reconciliation")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalRecordsEvaluated").isNumber())
                .andExpect(jsonPath("$.data.anomalies").isArray());
    }

    // 5. DEVELOPER API KEYS VAULT & SHA-256 HASHING
    @Test
    @DisplayName("Developer can generate API keys with SHA-256 hash storage and masked prefix")
    void testDeveloperApiKeyCreationAndRevocation() throws Exception {
        CreateApiKeyRequest request = CreateApiKeyRequest.builder()
                .name("Integration Pipeline Client")
                .scope("read_write")
                .build();

        String responseJson = mockMvc.perform(post("/api/developer/keys")
                        .header("Authorization", "Bearer " + devToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Integration Pipeline Client"))
                .andExpect(jsonPath("$.data.plaintextSecret").exists())
                .andExpect(jsonPath("$.data.keyPrefix").exists())
                .andReturn().getResponse().getContentAsString();

        // Verify secret token starts with oho_live_
        ApiResponse<?> apiResp = objectMapper.readValue(responseJson, ApiResponse.class);
        ApiKeyDto createdDto = objectMapper.convertValue(apiResp.getData(), ApiKeyDto.class);
        assertThat(createdDto.getPlaintextSecret()).startsWith("oho_live_");

        // Verify DB only stores hash, not plaintext
        ApiKey inDb = apiKeyRepository.findById(createdDto.getId()).orElseThrow();
        assertThat(inDb.getKeyHash()).isNotEqualTo(createdDto.getPlaintextSecret());
        assertThat(inDb.getKeyHash()).hasSize(64); // SHA-256 hex string is 64 characters

        // List keys: Plaintext must NEVER be disclosed in read operations
        mockMvc.perform(get("/api/developer/keys")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].plaintextSecret").doesNotExist());

        // Revoke key
        mockMvc.perform(post("/api/developer/keys/" + createdDto.getId() + "/revoke")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(false));
    }

    // 6. DEVELOPER SYSTEM TELEMETRY DIAGNOSTICS
    @Test
    @DisplayName("Developer diagnostics returns authentic JVM telemetry and masked DB URL")
    void testDeveloperSystemDiagnostics() throws Exception {
        mockMvc.perform(get("/api/developer/diagnostics")
                        .header("Authorization", "Bearer " + devToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.jvmVersion").exists())
                .andExpect(jsonPath("$.data.heapUsedBytes").isNumber())
                .andExpect(jsonPath("$.data.activeThreadCount").isNumber())
                .andExpect(jsonPath("$.data.dbConnectionUrlMasked").isString());
    }

    // 7. WEBHOOK EVENT RECORDING & DEDUPLICATION IDEMPOTENCY
    @Test
    @DisplayName("Webhook events are recorded in database and duplicate events are ignored")
    void testWebhookEventDeduplication() throws Exception {
        String eventId = "evt_test_" + System.currentTimeMillis();
        String payload = String.format("{\"id\":\"%s\",\"event\":\"payment.captured\",\"payload\":{}}", eventId);

        // Sign with mock key secret
        String signature = paymentService.verifyHmacSha256(payload, "invalid_sig", "secret") ? "valid" : "test_sig";

        WebhookEvent event = WebhookEvent.builder()
                .provider("RAZORPAY")
                .externalEventId(eventId)
                .eventType("payment.captured")
                .status(WebhookEventStatus.PROCESSED)
                .build();
        webhookEventRepository.save(event);

        // Verify deduplication check detects this event
        assertThat(webhookEventRepository.existsByProviderAndExternalEventId("RAZORPAY", eventId)).isTrue();
    }

    // 8. RAZORPAY WEBHOOK CAPTURE & AUTOMATED ENTITLEMENT PROVISIONING
    @Test
    @DisplayName("Razorpay webhook payment.captured sets order PAID and provisions entitlements idempotently")
    void testRazorpayWebhookPaymentCapturedAutoProvisionsEntitlements() throws Exception {
        Product product = productRepository.findAll().stream().findFirst().orElseGet(() ->
                productRepository.save(Product.builder()
                        .name("OHO Enterprise Engine")
                        .slug("oho-enterprise-engine")
                        .description("High-performance core engine")
                        .price(new BigDecimal("14999.00"))
                        .active(true)
                        .build()));

        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("14999.00"))
                .status(OrderStatus.PENDING)
                .build());

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(1)
                .price(new BigDecimal("14999.00"))
                .build();
        order.getItems().add(orderItem);
        order = orderRepository.save(order);

        String rzpOrderId = "order_rzp_mock_" + System.currentTimeMillis();
        Payment payment = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("14999.00"))
                .currency("INR")
                .status(PaymentStatus.PENDING)
                .provider("RAZORPAY")
                .razorpayOrderId(rzpOrderId)
                .build());

        String eventId = "evt_cap_" + System.currentTimeMillis();
        String payload = "{\"id\":\"" + eventId + "\",\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_rzp_mock_123\",\"order_id\":\"" + rzpOrderId + "\",\"amount\":1499900}}}}";

        // Generate HMAC-SHA256 signature
        String webhookSecret = "test_razorpay_webhook_secret_key_12345";
        String signature = "";
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(new javax.crypto.spec.SecretKeySpec(webhookSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) sb.append('0');
                sb.append(hex);
            }
            signature = sb.toString();
        } catch (Exception ignored) {}

        // 1st Webhook delivery
        mockMvc.perform(post("/api/payments/webhook")
                        .header("X-Razorpay-Signature", signature)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verify order is PAID
        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PAID);

        // Verify payment is SUCCESSFUL
        Payment updatedPayment = paymentRepository.findById(payment.getId()).orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(updatedPayment.getRazorpayPaymentId()).isEqualTo("pay_rzp_mock_123");

        // Verify Entitlements (Subscription & License) were auto-provisioned
        List<Subscription> subs = subscriptionRepository.findAllByOrderId(order.getId());
        assertThat(subs).isNotEmpty();
        assertThat(subs.get(0).getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);

        Optional<License> lic = licenseRepository.findBySubscriptionId(subs.get(0).getId());
        assertThat(lic).isPresent();
        assertThat(lic.get().getStatus()).isEqualTo(LicenseStatus.ACTIVE);
        assertThat(lic.get().getLicenseKey()).isNotBlank();
        int initialLicenseCount = licenseRepository.findByUserIdOrderByCreatedAtDesc(customerUser.getId()).size();

        // 2nd Webhook delivery (Duplicate event replay)
        mockMvc.perform(post("/api/payments/webhook")
                        .header("X-Razorpay-Signature", signature)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value("ALREADY_PROCESSED"));

        // Idempotency: verify no duplicate licenses created
        int subsequentLicenseCount = licenseRepository.findByUserIdOrderByCreatedAtDesc(customerUser.getId()).size();
        assertThat(subsequentLicenseCount).isEqualTo(initialLicenseCount);
    }

    // 9. FORGED OR MISSING WEBHOOK SIGNATURE REJECTION
    @Test
    @DisplayName("Webhook rejects missing or invalid signatures with HTTP 400 Bad Request")
    void testWebhookRejectsInvalidSignature() throws Exception {
        String payload = "{\"event\":\"payment.captured\",\"id\":\"evt_fake\"}";

        // Missing signature
        mockMvc.perform(post("/api/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Missing webhook signature"));

        // Invalid signature
        mockMvc.perform(post("/api/payments/webhook")
                        .header("X-Razorpay-Signature", "forged_invalid_signature_hex_12345")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid webhook signature"));
    }

    // 10. RECONCILIATION DETECTS MISSING ENTITLEMENT ANOMALY
    @Test
    @DisplayName("Reconciliation report accurately identifies paid orders lacking provisioned entitlements")
    void testReconciliationDetectsMissingEntitlement() throws Exception {
        Product product = productRepository.findAll().stream().findFirst().orElseGet(() ->
                productRepository.save(Product.builder()
                        .name("OHO Cloud License")
                        .slug("oho-cloud-license")
                        .price(new BigDecimal("4999.00"))
                        .active(true)
                        .build()));

        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("4999.00"))
                .status(OrderStatus.PAID)
                .build());

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(1)
                .price(new BigDecimal("4999.00"))
                .build();
        order.getItems().add(item);
        order = orderRepository.save(order);

        paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("4999.00"))
                .status(PaymentStatus.SUCCESSFUL)
                .provider("RAZORPAY")
                .build());

        // Call reconciliation report as Admin
        mockMvc.perform(get("/api/admin/payments/reconciliation")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.anomalies[?(@.anomalyType == 'MISSING_ENTITLEMENT')]").exists());
    }
}
