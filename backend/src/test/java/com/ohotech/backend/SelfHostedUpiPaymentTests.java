package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.PhoneVerificationService;
import com.ohotech.backend.service.otp.DevTestOtpDeliveryService;
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
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class SelfHostedUpiPaymentTests {

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
    private OtpRepository otpRepository;

    @Autowired
    private PaymentSlotLeaseRepository slotLeaseRepository;

    @Autowired
    private ObserverDeviceRepository observerDeviceRepository;

    @Autowired
    private BankCreditAlertRepository bankCreditAlertRepository;

    @Autowired
    private DevTestOtpDeliveryService devTestOtpDeliveryService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User adminUser;
    private User customerUser;
    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        devTestOtpDeliveryService.clearTestSink();
        bankCreditAlertRepository.deleteAll();
        slotLeaseRepository.deleteAll();
        observerDeviceRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        otpRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = userRepository.save(User.builder()
                .name("Admin POS Cashier")
                .email("admin.pos@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .build());
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        customerUser = userRepository.save(User.builder()
                .name("Customer Checkout")
                .email("customer.upi@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // ==========================================
    // 1. Phone OTP Verification Tests
    // ==========================================

    @Test
    @DisplayName("Phone OTP request dispatches code to test sink and stores salted SHA-256 hash in database")
    void testPhoneOtpRequestAndSha256StorageVerification() throws Exception {
        String phone = "+91 98765 43210";
        Map<String, String> body = Map.of("phoneNumber", phone);

        mockMvc.perform(post("/api/auth/phone-otp/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        String rawDeliveredOtp = devTestOtpDeliveryService.getLastDeliveredOtpForTesting("919876543210");
        assertThat(rawDeliveredOtp).isNotNull();
        assertThat(rawDeliveredOtp).matches("\\d{6}");

        // Verify database state: clean phone target, hashed OTP (never plain text), 0 attempts, unverified
        Optional<OtpVerification> recordOpt = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(
                "+919876543210", OtpPurpose.PHONE_CHECKOUT_VERIFICATION);
        assertThat(recordOpt).isPresent();
        OtpVerification record = recordOpt.get();
        assertThat(record.isVerified()).isFalse();
        assertThat(record.getAttempts()).isEqualTo(0);
        assertThat(record.getOtpHash()).isNotEqualTo(rawDeliveredOtp);
        assertThat(record.getOtpHash()).isEqualTo(sha256(rawDeliveredOtp));
    }

    @Test
    @DisplayName("Phone OTP enforces 60-second cooldown and 3-attempt maximum lockout")
    void testPhoneOtpAttemptsLockoutAndResendCooldown() throws Exception {
        String phone = "919998887771";
        Map<String, String> reqBody = Map.of("phoneNumber", phone);

        // 1. First request
        mockMvc.perform(post("/api/auth/phone-otp/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody)))
                .andExpect(status().isOk());

        // 2. Immediate second request within 60s cooldown fails
        mockMvc.perform(post("/api/auth/phone-otp/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Please wait 60 seconds")));

        // 3. Failed attempts lockout
        Map<String, String> wrongCodeBody = Map.of("phoneNumber", phone, "otpCode", "000000");

        // Attempt 1
        mockMvc.perform(post("/api/auth/phone-otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongCodeBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("2 attempt(s) remaining")));

        // Attempt 2
        mockMvc.perform(post("/api/auth/phone-otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongCodeBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("1 attempt(s) remaining")));

        // Attempt 3: Locks out
        mockMvc.perform(post("/api/auth/phone-otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongCodeBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Maximum verification attempts exceeded")));

        // Attempt 4 even with correct code is locked out
        String actualCode = devTestOtpDeliveryService.getLastDeliveredOtpForTesting(phone);
        Map<String, String> correctCodeBody = Map.of("phoneNumber", phone, "otpCode", actualCode);
        mockMvc.perform(post("/api/auth/phone-otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(correctCodeBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Maximum verification attempts exceeded")));
    }

    @Test
    @DisplayName("Phone OTP allows single-use consumption only; replay is rejected")
    void testPhoneOtpSingleUseConsumption() throws Exception {
        String phone = "919998887772";
        mockMvc.perform(post("/api/auth/phone-otp/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("phoneNumber", phone))))
                .andExpect(status().isOk());

        String validCode = devTestOtpDeliveryService.getLastDeliveredOtpForTesting(phone);
        Map<String, String> verifyBody = Map.of("phoneNumber", phone, "otpCode", validCode);

        // First verification: success and yields proof token
        mockMvc.perform(post("/api/auth/phone-otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.proofToken").isNotEmpty());

        // Replay attempt fails
        mockMvc.perform(post("/api/auth/phone-otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already been consumed")));
    }

    // ==========================================
    // 2. Self-Hosted UPI Payment Engine Tests
    // ==========================================

    @Test
    @DisplayName("Initiate self-hosted UPI session generates dynamic NPCI upi://pay URI and slot lease")
    void testSelfHostedUpiInitiateSessionAndDynamicNpciUri() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("499.00"))
                .status(OrderStatus.PENDING)
                .build());

        Map<String, Object> req = Map.of("orderId", order.getId());

        mockMvc.perform(post("/api/payments/upi/initiate")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderId").value(order.getId()))
                .andExpect(jsonPath("$.data.amount").value(499.00))
                .andExpect(jsonPath("$.data.upiUri").value(org.hamcrest.Matchers.startsWith("upi://pay?pa=")))
                .andExpect(jsonPath("$.data.slotNumber").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.expiresInSeconds").value(org.hamcrest.Matchers.greaterThan(0)));

        // Verify DB payment entity was created with DIRECT_UPI
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElseThrow();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(payment.getProvider()).isEqualTo("DIRECT_UPI");
        assertThat(payment.getMethod()).isEqualTo("UPI_QR");
    }

    @Test
    @DisplayName("FIFO slot leases assign distinct slots and maintain active lease invariant")
    void testFifoSlotLeaseAcquisitionAndQueueing() throws Exception {
        Order order1 = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("299.00"))
                .status(OrderStatus.PENDING)
                .build());

        Order order2 = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("399.00"))
                .status(OrderStatus.PENDING)
                .build());

        // Initiate order 1
        mockMvc.perform(post("/api/payments/upi/initiate")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("orderId", order1.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slotNumber").value(1));

        // Initiate order 2 - should be queued when slot is occupied
        mockMvc.perform(post("/api/payments/upi/initiate")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("orderId", order2.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("QUEUED"))
                .andExpect(jsonPath("$.data.slotAcquired").value(false))
                .andExpect(jsonPath("$.data.queuePosition").value(1));

        // Check active leases in database
        long activeCount = slotLeaseRepository.findAll().stream()
                .filter(l -> "ACTIVE".equals(l.getStatus()))
                .count();
        assertThat(activeCount).isEqualTo(1);
    }

    @Test
    @DisplayName("Slot lease expiration flags session as expired and releases slot")
    void testSlotExpirationAndAutomaticRelease() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("999.00"))
                .status(OrderStatus.PENDING)
                .build());

        Payment payment = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(new BigDecimal("999.00"))
                .status(PaymentStatus.PENDING)
                .provider("DIRECT_UPI")
                .method("UPI_QR")
                .currency("INR")
                .build());

        // Simulate an expired lease in the DB
        slotLeaseRepository.save(PaymentSlotLease.builder()
                .paymentId(payment.getId())
                .orderId(order.getId())
                .merchantVpa("pay@ohotech")
                .status("ACTIVE")
                .acquiredAt(LocalDateTime.now().minusMinutes(10))
                .expiresAt(LocalDateTime.now().minusMinutes(2))
                .build());

        // Check status endpoint
        mockMvc.perform(get("/api/payments/upi/status/" + payment.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isExpired").value(true))
                .andExpect(jsonPath("$.data.isPaid").value(false));

        // Verify DB lease status updated to EXPIRED
        PaymentSlotLease lease = slotLeaseRepository.findByOrderId(order.getId()).orElseThrow();
        assertThat(lease.getStatus()).isEqualTo("EXPIRED");
    }

    @Test
    @DisplayName("Customer UTR submission immediately settles payment when matching bank credit alert pre-exists")
    void testCustomerUtrSubmissionAndMatching() throws Exception {
        String testRrn = "RRN998877665544";
        BigDecimal amount = new BigDecimal("750.00");

        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(amount)
                .status(OrderStatus.PENDING)
                .build());

        Payment payment = paymentRepository.save(Payment.builder()
                .order(order)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .provider("DIRECT_UPI")
                .method("UPI_QR")
                .currency("INR")
                .build());

        // Pre-create matching bank credit alert
        bankCreditAlertRepository.save(BankCreditAlert.builder()
                .rrn(testRrn)
                .amount(amount)
                .currency("INR")
                .status("PENDING")
                .receivedAt(LocalDateTime.now())
                .build());

        // Customer submits UTR
        Map<String, Object> submitReq = Map.of(
                "paymentId", payment.getId(),
                "utr", testRrn,
                "payerUpi", "customer@okaxis",
                "payerName", "Customer Name"
        );

        mockMvc.perform(post("/api/payments/upi/submit-utr")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isPaid").value(true))
                .andExpect(jsonPath("$.data.paymentStatus").value("SUCCESSFUL"))
                .andExpect(jsonPath("$.data.orderStatus").value("PAID"));

        // Verify DB Payment and Order status
        Payment updatedPayment = paymentRepository.findById(payment.getId()).orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(updatedPayment.getTransactionReference()).isEqualTo(testRrn);

        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PAID);
    }

    // ==========================================
    // 3. Observer Device & Bank Alert Ingestion Tests
    // ==========================================

    @Test
    @DisplayName("Observer device bearer token authentication verifies valid token and rejects invalid/revoked tokens")
    void testObserverDeviceAuthenticationAndRejection() throws Exception {
        String rawSecret = "secret-observer-token-alpha";
        String tokenHash = sha256(rawSecret);

        ObserverDevice device = observerDeviceRepository.save(ObserverDevice.builder()
                .deviceName("SBI Banking SMS Sync Android")
                .tokenHash(tokenHash)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build());

        // 1. Valid token heartbeat
        mockMvc.perform(get("/api/payments/observers/heartbeat")
                        .header("X-Observer-Token", rawSecret))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.deviceName").value("SBI Banking SMS Sync Android"));

        // 2. Invalid token rejected
        mockMvc.perform(get("/api/payments/observers/heartbeat")
                        .header("X-Observer-Token", "wrong-secret-token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Invalid or unregistered")));

        // 3. Revoked device rejected
        device.setStatus("REVOKED");
        observerDeviceRepository.save(device);

        mockMvc.perform(get("/api/payments/observers/heartbeat")
                        .header("X-Observer-Token", rawSecret))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("revoked")));
    }

    @Test
    @DisplayName("Bank credit alert ingestion deduplicates identical RRN replay attacks")
    void testBankCreditAlertIngestionAndRrnDeduplication() throws Exception {
        String rawToken = "observer-token-beta";
        observerDeviceRepository.save(ObserverDevice.builder()
                .deviceName("HDFC Observer Daemon")
                .tokenHash(sha256(rawToken))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build());

        Map<String, Object> alertPayload = Map.of(
                "amount", 1500.00,
                "rrn", "RRN-DEDUP-12345",
                "payerUpi", "payer@okhdfcbank",
                "rawMessage", "Rs.1500.00 credited to A/c ... via UPI Ref RRN-DEDUP-12345"
        );

        // First ingestion
        mockMvc.perform(post("/api/payments/observers/alerts")
                        .header("X-Observer-Token", rawToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alertPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Replay of same RRN
        mockMvc.perform(post("/api/payments/observers/alerts")
                        .header("X-Observer-Token", rawToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alertPayload)))
                .andExpect(status().isOk());

        // Verify only 1 bank credit alert exists in the DB with this RRN
        assertThat(bankCreditAlertRepository.findAll().stream()
                .filter(a -> "RRN-DEDUP-12345".equals(a.getRrn()))
                .count()).isEqualTo(1);
    }

    @Test
    @DisplayName("Ambiguous bank credit alert with no unique order match is routed to UNCLAIMED without order fulfillment")
    void testAmbiguousBankAlertEscalationToManualReconciliation() throws Exception {
        String rawToken = "observer-token-gamma";
        observerDeviceRepository.save(ObserverDevice.builder()
                .deviceName("Axis Ingestion Daemon")
                .tokenHash(sha256(rawToken))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build());

        Map<String, Object> alertPayload = Map.of(
                "amount", 3333.33,
                "rrn", "RRN-UNKNOWN-9999",
                "rawMessage", "Rs.3333.33 credited to A/c ... via UPI Ref RRN-UNKNOWN-9999"
        );

        mockMvc.perform(post("/api/payments/observers/alerts")
                        .header("X-Observer-Token", rawToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alertPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("UNCLAIMED"))
                .andExpect(jsonPath("$.data.matchedPaymentId").doesNotExist());

        BankCreditAlert alert = bankCreditAlertRepository.findByRrn("RRN-UNKNOWN-9999").orElseThrow();
        assertThat(alert.getStatus()).isEqualTo("UNCLAIMED");
        assertThat(alert.getMatchedPaymentId()).isNull();
    }

    // ==========================================
    // 4. Counter Billing POS (Cash & Card) Tests
    // ==========================================

    @Test
    @DisplayName("Cash counter sale validates tendered amount, calculates change due, and auto-provisions order")
    void testCounterBillingCashSale() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("1200.00"))
                .status(OrderStatus.PENDING)
                .build());

        Map<String, Object> saleReq = Map.of(
                "orderId", order.getId(),
                "cashTendered", 1500.00
        );

        mockMvc.perform(post("/api/admin/counter-billing/cash")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saleReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderId").value(order.getId()))
                .andExpect(jsonPath("$.data.orderTotal").value(1200.00))
                .andExpect(jsonPath("$.data.cashTendered").value(1500.00))
                .andExpect(jsonPath("$.data.changeReturned").value(300.00))
                .andExpect(jsonPath("$.data.paymentMethod").value("CASH"))
                .andExpect(jsonPath("$.data.status").value("SUCCESSFUL"))
                .andExpect(jsonPath("$.data.receiptNumber").isNotEmpty());

        // Verify DB state
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElseThrow();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(payment.getCashierUserId()).isEqualTo(adminUser.getId());
        assertThat(payment.getCashTendered()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(payment.getChangeReturned()).isEqualByComparingTo(new BigDecimal("300.00"));

        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PAID);
    }

    @Test
    @DisplayName("Card terminal counter sale records approval code and cashier audit reference")
    void testCounterBillingCardTerminalSale() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("2500.00"))
                .status(OrderStatus.PENDING)
                .build());

        Map<String, Object> saleReq = Map.of(
                "orderId", order.getId(),
                "terminalRef", "POS-TXN-987654",
                "terminalId", "TERM-MUMBAI-01"
        );

        mockMvc.perform(post("/api/admin/counter-billing/card")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saleReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderId").value(order.getId()))
                .andExpect(jsonPath("$.data.orderTotal").value(2500.00))
                .andExpect(jsonPath("$.data.paymentMethod").value("CARD"))
                .andExpect(jsonPath("$.data.status").value("SUCCESSFUL"))
                .andExpect(jsonPath("$.data.cardTerminalRef").value("POS-TXN-987654"));

        Payment payment = paymentRepository.findByOrderId(order.getId()).orElseThrow();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(payment.getCardTerminalRef()).isEqualTo("POS-TXN-987654");
        assertThat(payment.getCardTerminalId()).isEqualTo("TERM-MUMBAI-01");
        assertThat(payment.getCashierUserId()).isEqualTo(adminUser.getId());

        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PAID);
    }

    @Test
    @DisplayName("Non-admin customer cannot access counter billing POS endpoints")
    void testNonAdminAccessDeniedForObserverAndCounterBilling() throws Exception {
        Order order = orderRepository.save(Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("500.00"))
                .status(OrderStatus.PENDING)
                .build());

        Map<String, Object> saleReq = Map.of(
                "orderId", order.getId(),
                "cashTendered", 500.00
        );

        // Customer token forbidden from cash counter billing
        mockMvc.perform(post("/api/admin/counter-billing/cash")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saleReq)))
                .andExpect(status().isForbidden());

        // Customer token forbidden from terminal summary
        mockMvc.perform(get("/api/admin/counter-billing/terminal-summary")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }
}
