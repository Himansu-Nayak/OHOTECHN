package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.PaymentOrderRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class P0SecurityHotfixRegressionTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPlanRepository productPlanRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PaymentService paymentService;

    private User syntheticCustomer;
    private Product syntheticProduct;
    private ProductPlan syntheticPlan;
    private License syntheticLicense;
    private String syntheticLicenseKey;
    private String syntheticCustomerToken;

    @BeforeEach
    void setUp() {
        licenseRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        productPlanRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        String rawSecretPassword = "SuperSecretSyntheticPassword987!";
        syntheticCustomer = userRepository.save(User.builder()
                .name("Synthetic Customer")
                .email("synthetic.customer@ohotech-test.internal")
                .phone("+91 99999 88888")
                .passwordHash(passwordEncoder.encode(rawSecretPassword))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());
        syntheticCustomerToken = jwtTokenProvider.generateTokenFromUserId(syntheticCustomer.getId());

        syntheticProduct = productRepository.save(Product.builder()
                .name("Enterprise ERP Hub")
                .description("Production grade ERP suite")
                .price(new BigDecimal("99999.00"))
                .active(true)
                .slug("enterprise-erp-hub-" + UUID.randomUUID())
                .build());

        syntheticPlan = productPlanRepository.save(ProductPlan.builder()
                .product(syntheticProduct)
                .name("Commercial Enterprise License")
                .billingType(BillingType.ONE_TIME)
                .price(new BigDecimal("99999.00"))
                .activationLimit(50)
                .build());

        syntheticLicenseKey = "OHO-TEST-" + UUID.randomUUID().toString().toUpperCase();
        syntheticLicense = licenseRepository.save(License.builder()
                .licenseKey(syntheticLicenseKey)
                .user(syntheticCustomer)
                .product(syntheticProduct)
                .productPlan(syntheticPlan)
                .status(LicenseStatus.ACTIVE)
                .activationLimit(50)
                .activationCount(3)
                .issuedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusYears(1))
                .build());
    }

    // =========================================================================
    // 1. SEC-001: PUBLIC LICENSE LOOKUP DATA PROTECTION REGRESSION TESTS
    // =========================================================================

    @Test
    @DisplayName("SEC-001: Public license lookup returns approved public metadata and zero PII or password hashes")
    void testPublicLicenseLookupDoesNotExposeSensitiveData() throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/licenses/key/" + syntheticLicenseKey)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.licenseKey").value(syntheticLicenseKey))
                .andExpect(jsonPath("$.data.productName").value("Enterprise ERP Hub"))
                .andExpect(jsonPath("$.data.productPlanName").value("Commercial Enterprise License"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.activationLimit").value(50))
                .andExpect(jsonPath("$.data.activationCount").value(3))
                // Verify sensitive properties DO NOT exist in JSON tree
                .andExpect(jsonPath("$.data.user").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.email").doesNotExist())
                .andExpect(jsonPath("$.data.phone").doesNotExist())
                .andExpect(jsonPath("$.data.order").doesNotExist())
                .andReturn();

        String rawJson = mvcResult.getResponse().getContentAsString();

        // Exact string assertions verifying zero secret or customer leak in serialized output
        assertThat(rawJson).doesNotContain("passwordHash");
        assertThat(rawJson).doesNotContain(syntheticCustomer.getPasswordHash());
        assertThat(rawJson).doesNotContain("synthetic.customer@ohotech-test.internal");
        assertThat(rawJson).doesNotContain("+91 99999 88888");
        assertThat(rawJson).doesNotContain("Synthetic Customer");
    }

    @Test
    @DisplayName("SEC-001: Public license lookup returns 404 for non-existent license key")
    void testPublicLicenseLookupNotFound() throws Exception {
        mockMvc.perform(get("/api/licenses/key/NON-EXISTENT-LICENSE-KEY-999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // =========================================================================
    // 2. PAY-001: DEMO PAYMENT FEATURE FLAG ENFORCEMENT REGRESSION TESTS
    // =========================================================================

    @Test
    @DisplayName("PAY-001: PaymentService rejects demo payment when demo-payment-enabled is false")
    void testPaymentServiceRejectsDemoPaymentWhenDisabled() {
        Order order = orderRepository.save(Order.builder()
                .user(syntheticCustomer)
                .totalAmount(new BigDecimal("99999.00"))
                .status(OrderStatus.PENDING)
                .shippingAddress("Bangalore Office")
                .contactPhone("+91 99999 88888")
                .build());

        // Temporarily set demoPaymentEnabled to false via reflection to test service logic
        ReflectionTestUtils.setField(paymentService, "demoPaymentEnabled", false);

        try {
            assertThrows(BadRequestException.class, () ->
                    paymentService.processDemoPayment(syntheticCustomer.getId(), order.getId())
            );

            // Verify order was NOT confirmed
            Order reloadedOrder = orderRepository.findById(order.getId()).orElseThrow();
            assertThat(reloadedOrder.getStatus()).isEqualTo(OrderStatus.PENDING);
        } finally {
            // Restore enabled state for remaining tests
            ReflectionTestUtils.setField(paymentService, "demoPaymentEnabled", true);
        }
    }

    @Test
    @DisplayName("PAY-001: Demo payment requires ownership of the order")
    void testDemoPaymentRejectsCrossUserOrderAccess() throws Exception {
        User otherCustomer = userRepository.save(User.builder()
                .name("Other Customer")
                .email("other.customer@ohotech-test.internal")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());
        String otherCustomerToken = jwtTokenProvider.generateTokenFromUserId(otherCustomer.getId());

        Order customerOrder = orderRepository.save(Order.builder()
                .user(syntheticCustomer)
                .totalAmount(new BigDecimal("1000.00"))
                .status(OrderStatus.PENDING)
                .shippingAddress("Test Address")
                .contactPhone("+91 99999 88888")
                .build());

        // Other customer attempts to demo-pay customerOrder
        PaymentOrderRequest req = new PaymentOrderRequest();
        req.setOrderId(customerOrder.getId());

        mockMvc.perform(post("/api/payments/demo-pay")
                        .header("Authorization", "Bearer " + otherCustomerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    // =========================================================================
    // 3. PRODUCTION-LIKE CONFIGURATION: DEMO PAYMENT DISABLED HTTP TEST
    // =========================================================================

    @Nested
    @TestPropertySource(properties = {"app.payment.demo-payment-enabled=false"})
    class ProductionDemoPaymentDisabledHttpTests {

        @Test
        @DisplayName("PAY-001: HTTP POST /api/payments/demo-pay returns 400 when demoPaymentEnabled=false")
        void testDemoPayEndpointFailsWhenFlagIsFalse() throws Exception {
            Order order = orderRepository.save(Order.builder()
                    .user(syntheticCustomer)
                    .totalAmount(new BigDecimal("4999.00"))
                    .status(OrderStatus.PENDING)
                    .shippingAddress("Test Shipping Addr")
                    .contactPhone("+91 99999 88888")
                    .build());

            PaymentOrderRequest req = new PaymentOrderRequest();
            req.setOrderId(order.getId());

            mockMvc.perform(post("/api/payments/demo-pay")
                            .header("Authorization", "Bearer " + syntheticCustomerToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Demo payment gateway is disabled in this environment. Please choose a real payment method."));

            // Verify order state remains unchanged in database
            Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
            assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PENDING);
        }
    }
}
