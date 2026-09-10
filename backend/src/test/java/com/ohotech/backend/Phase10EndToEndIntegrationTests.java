package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class Phase10EndToEndIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPlanRepository productPlanRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private DeviceActivationRepository deviceActivationRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private SoftwareReleaseRepository softwareReleaseRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User testCustomer;
    private User testAdmin;
    private User testDeveloper;
    private User otherCustomer;
    private Product enterpriseProduct;
    private ProductPlan enterprisePlan;

    private String customerToken;
    private String adminToken;
    private String developerToken;
    private String otherCustomerToken;

    @BeforeEach
    void setup() {
        String rand = UUID.randomUUID().toString().substring(0, 8);

        testCustomer = userRepository.save(User.builder()
                .name("Integration Customer")
                .email("cust_" + rand + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(false)
                .build());

        otherCustomer = userRepository.save(User.builder()
                .name("Other Customer")
                .email("other_" + rand + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(false)
                .build());

        testAdmin = userRepository.save(User.builder()
                .name("Integration Admin")
                .email("admin_" + rand + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("AdminPass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(true)
                .build());

        testDeveloper = userRepository.save(User.builder()
                .name("Integration Dev")
                .email("dev_" + rand + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("DevPass123!"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(true)
                .build());

        enterpriseProduct = productRepository.save(Product.builder()
                .name("OHO Enterprise Suite " + rand)
                .description("Enterprise Core Software Suite")
                .price(new BigDecimal("4999.00"))
                .active(true)
                .build());

        enterprisePlan = productPlanRepository.save(ProductPlan.builder()
                .product(enterpriseProduct)
                .name("Enterprise Annual")
                .billingType(BillingType.YEARLY)
                .price(new BigDecimal("4999.00"))
                .durationDays(365)
                .activationLimit(5)
                .active(true)
                .build());

        customerToken = jwtTokenProvider.generateTokenFromUserId(testCustomer.getId());
        adminToken = jwtTokenProvider.generateTokenFromUserId(testAdmin.getId());
        developerToken = jwtTokenProvider.generateTokenFromUserId(testDeveloper.getId());
        otherCustomerToken = jwtTokenProvider.generateTokenFromUserId(otherCustomer.getId());
    }

    // =========================================================================
    // STEP 3: AUTHENTICATION END-TO-END FLOWS
    // =========================================================================

    @Test
    @DisplayName("Auth E2E: User Registration -> Password Login -> Forgot Password -> Reset Flow")
    void testAuthenticationCompleteLifecycle() throws Exception {
        String regEmail = "newuser_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";

        // 1. Register new user
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("New Onboarding User");
        registerReq.setEmail(regEmail);
        registerReq.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.email").value(regEmail));

        // 2. Duplicate registration attempt should be rejected
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isBadRequest());

        // Verify user email to enable password login (production security rule)
        User registeredUser = userRepository.findByEmail(regEmail).orElseThrow();
        registeredUser.setEmailVerified(true);
        userRepository.save(registeredUser);

        // 3. Login with correct credentials
        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername(regEmail);
        loginReq.setPassword("SecurePassword123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty());

        // 4. Login with invalid password
        loginReq.setPassword("WrongPassword!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());

        // 5. Trigger Forgot Password OTP
        SendOtpRequest forgotReq = new SendOtpRequest();
        forgotReq.setTarget(regEmail);
        forgotReq.setChannel("EMAIL");
        forgotReq.setPurpose(OtpPurpose.PASSWORD_RESET);

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Generate verified reset token for password reset test
        String resetToken = UUID.randomUUID().toString();
        otpRepository.save(OtpVerification.builder()
                .target(regEmail)
                .otpHash("dummy_hash")
                .purpose(OtpPurpose.PASSWORD_RESET)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .resetToken(resetToken)
                .resetTokenExpiry(LocalDateTime.now().plusMinutes(15))
                .verified(true)
                .build());

        // 6. Reset Password with Reset Token
        ResetPasswordRequest resetReq = new ResetPasswordRequest();
        resetReq.setEmail(regEmail);
        resetReq.setResetToken(resetToken);
        resetReq.setNewPassword("BrandNewPassword456!");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 7. Old password now fails
        loginReq.setPassword("SecurePassword123!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());

        // 8. New password works
        loginReq.setPassword("BrandNewPassword456!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // =========================================================================
    // STEP 4 & 5: ROLE-BASED ACCESS CONTROL & AUTHORIZATION
    // =========================================================================

    @Test
    @DisplayName("RBAC: Customer rejected on Admin/Developer endpoints; Admin & Developer granted")
    void testRoleBasedAccessControlIsolation() throws Exception {
        // Customer attempting Admin API -> 403 Forbidden
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // Customer attempting Developer API -> 403 Forbidden
        mockMvc.perform(get("/api/developer/config")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // Admin accessing Admin API -> 200 OK
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.systemStatus").value("OPERATIONAL_100"));

        // Developer accessing Developer API -> 200 OK
        mockMvc.perform(get("/api/developer/config")
                        .header("Authorization", "Bearer " + developerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.environment").isNotEmpty());
    }

    // =========================================================================
    // STEP 6 & 8: COMMERCE (PRODUCT -> CART -> ORDER -> INVOICE -> IDOR)
    // =========================================================================

    @Test
    @DisplayName("Commerce & IDOR: Cart items -> Order Creation -> Invoice Download -> IDOR Guard")
    @Transactional
    void testCommerceAndOrderLifecycleWithIdorGuard() throws Exception {
        // 1. Add item to cart
        CartItemRequest cartItemReq = new CartItemRequest();
        cartItemReq.setProductId(enterpriseProduct.getId());
        cartItemReq.setProductPlanId(enterprisePlan.getId());
        cartItemReq.setQuantity(2);

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cartItemReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items", hasSize(1)));

        // 2. Fetch cart
        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(1)));

        // 3. Checkout -> Create Order
        OrderRequest orderReq = new OrderRequest();
        orderReq.setShippingAddress("Tower B, Cyber City, Gurugram, India");
        orderReq.setContactPhone("+91-9876543210");

        String orderResponse = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalAmount").value(9998.0))
                .andReturn().getResponse().getContentAsString();

        ApiResponse<Map<String, Object>> createdOrder = objectMapper.readValue(orderResponse, ApiResponse.class);
        Long orderId = Long.valueOf(createdOrder.getData().get("id").toString());

        // 4. Cart should now be empty after order creation
        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items", hasSize(0)));

        // 5. Customer fetches own order
        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(orderId));

        // 6. IDOR Check: Other customer attempts to view Customer's order -> 404/Forbidden
        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + otherCustomerToken))
                .andExpect(status().isNotFound());

        // 7. Customer downloads PDF invoice
        mockMvc.perform(get("/api/orders/" + orderId + "/invoice")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"));

        // 8. IDOR Check: Other customer attempts to download invoice -> 404
        mockMvc.perform(get("/api/orders/" + orderId + "/invoice")
                        .header("Authorization", "Bearer " + otherCustomerToken))
                .andExpect(status().isNotFound());

        // 9. Admin can view and download customer invoice
        mockMvc.perform(get("/api/orders/" + orderId + "/invoice")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"));
    }

    // =========================================================================
    // STEP 9 & 11: LICENSE, DEVICE ACTIVATION & SECURE DOWNLOADS
    // =========================================================================

    @Test
    @DisplayName("License & Download: Device activation limits + Entitlement gating for downloads")
    @Transactional
    void testLicenseDeviceActivationAndDownloadGating() throws Exception {
        // 1. Issue license to Customer
        License license = licenseRepository.save(License.builder()
                .user(testCustomer)
                .product(enterpriseProduct)
                .productPlan(enterprisePlan)
                .licenseKey("OHO-ENT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .status(LicenseStatus.ACTIVE)
                .activationLimit(2)
                .activationCount(0)
                .issuedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(365))
                .build());

        // 2. Customer views own licenses
        mockMvc.perform(get("/api/licenses/my")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].licenseKey").value(license.getLicenseKey()));

        // 3. Device 1 Activation -> Success
        DeviceActivationRequest dev1 = new DeviceActivationRequest();
        dev1.setDeviceIdentifier("DEV-MACBOOK-001");
        dev1.setDeviceName("CEO MacBook Pro");
        dev1.setOperatingSystem("macOS Sonoma");
        dev1.setApplicationVersion("2.4.0");

        mockMvc.perform(post("/api/licenses/" + license.getLicenseKey() + "/activate")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dev1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.deviceIdentifier").value("DEV-MACBOOK-001"));

        // 4. Device 2 Activation -> Success (Limit reached = 2)
        DeviceActivationRequest dev2 = new DeviceActivationRequest();
        dev2.setDeviceIdentifier("DEV-WINDOWS-002");
        dev2.setDeviceName("Workstation Windows 11");

        mockMvc.perform(post("/api/licenses/" + license.getLicenseKey() + "/activate")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dev2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.deviceIdentifier").value("DEV-WINDOWS-002"));

        // 5. Device 3 Activation -> Fails because limit (2) is exceeded
        DeviceActivationRequest dev3 = new DeviceActivationRequest();
        dev3.setDeviceIdentifier("DEV-LINUX-003");

        mockMvc.perform(post("/api/licenses/" + license.getLicenseKey() + "/activate")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dev3)))
                .andExpect(status().isBadRequest());

        // 6. Create proprietary software release
        SoftwareRelease release = softwareReleaseRepository.save(SoftwareRelease.builder()
                .product(enterpriseProduct)
                .version("2.4.0")
                .platform(Platform.WINDOWS)
                .fileName("oho-enterprise-v2.4.0.zip")
                .filePath("/releases/oho-enterprise-v2.4.0.zip")
                .active(true)
                .build());

        // 7. Entitled customer requests presigned download URL -> Success
        mockMvc.perform(get("/api/products/my/" + enterpriseProduct.getId() + "/download-url/" + release.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.downloadUrl").isNotEmpty());

        // 8. Entitled customer downloads binary -> Success
        mockMvc.perform(get("/api/products/my/" + enterpriseProduct.getId() + "/download/" + release.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/octet-stream"));

        // 9. Other unentitled customer attempts download -> 400 Bad Request
        mockMvc.perform(get("/api/products/my/" + enterpriseProduct.getId() + "/download-url/" + release.getId())
                        .header("Authorization", "Bearer " + otherCustomerToken))
                .andExpect(status().isBadRequest());

        // 10. Unauthenticated attempt -> 401 Unauthorized
        mockMvc.perform(get("/api/products/my/" + enterpriseProduct.getId() + "/download-url/" + release.getId()))
                .andExpect(status().isUnauthorized());
    }

    // =========================================================================
    // STEP 10: SUBSCRIPTION & FREE TRIAL FLOW
    // =========================================================================

    @Test
    @DisplayName("Subscription: Start free trial -> Duplicate trial prevention -> Cancel Subscription")
    @Transactional
    void testSubscriptionAndFreeTrialFlow() throws Exception {
        // 1. Start free trial
        mockMvc.perform(post("/api/products/" + enterpriseProduct.getId() + "/trial")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.subscriptionStatus").value("TRIAL"));

        // 2. Attempt duplicate trial -> Rejected
        mockMvc.perform(post("/api/products/" + enterpriseProduct.getId() + "/trial")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isBadRequest());

        // 3. Customer views subscriptions
        mockMvc.perform(get("/api/subscriptions/my")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));

        Subscription sub = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(testCustomer.getId()).get(0);

        // 4. Cancel subscription
        mockMvc.perform(post("/api/subscriptions/" + sub.getId() + "/cancel")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }

    // =========================================================================
    // STEP 12: NOTIFICATIONS LIFECYCLE
    // =========================================================================

    @Test
    @DisplayName("Notifications: User notification creation -> Unread Count -> Mark Read -> Delete")
    @Transactional
    void testNotificationsLifecycle() throws Exception {
        Notification notif = notificationRepository.save(Notification.builder()
                .user(testCustomer)
                .title("Order Paid Successfully")
                .message("Your enterprise license is ready to activate.")
                .type(NotificationType.SUCCESS)
                .category(NotificationCategory.SYSTEM)
                .read(false)
                .build());

        // 1. Get unread count
        mockMvc.perform(get("/api/notifications/unread-count")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(greaterThanOrEqualTo(1)));

        // 2. Mark notification as read
        mockMvc.perform(patch("/api/notifications/" + notif.getId() + "/read")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.read").value(true));

        // 3. Delete notification
        mockMvc.perform(delete("/api/notifications/" + notif.getId())
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk());
    }

    // =========================================================================
    // STEP 13: CRM & PUBLIC LEAD MANAGEMENT
    // =========================================================================

    @Test
    @DisplayName("CRM: Public Contact form submission -> Admin CRM Lead Pipeline -> Lead Update")
    @Transactional
    void testCrmPublicLeadIngestionAndAdminPipeline() throws Exception {
        ContactRequest contactReq = new ContactRequest();
        contactReq.setName("Enterprise Lead Contact");
        contactReq.setEmail("lead_" + UUID.randomUUID().toString().substring(0, 6) + "@enterprise.com");
        contactReq.setPhone("+91-9988776655");
        contactReq.setCompany("Global Infratech Ltd");
        contactReq.setSubject("Turnkey Cloud ERP Solution");
        contactReq.setMessage("We require enterprise deployment for 500 seats.");
        contactReq.setInterestedProduct("Cloud ERP");

        // 1. Public user submits enquiry
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contactReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Enterprise Lead Contact"));

        // 2. Customer rejected from CRM pipeline
        mockMvc.perform(get("/api/admin/crm/leads")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 3. Admin views CRM leads
        mockMvc.perform(get("/api/admin/crm/leads")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isNotEmpty());
    }
}
