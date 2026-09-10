package com.ohotech.backend;

import com.ohotech.backend.dto.ChangePasswordRequest;
import com.ohotech.backend.dto.ResetPasswordRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.service.*;
import com.ohotech.backend.storage.LocalStorageService;
import com.ohotech.backend.storage.StorageFileUploadResult;
import com.ohotech.backend.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class Phase2SecurityAndInfrastructureTests {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private LicenseService licenseService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SoftwareReleaseService softwareReleaseService;

    @Autowired
    private StorageService storageService;

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
    private OrderRepository orderRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private SoftwareReleaseRepository softwareReleaseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User customerA;
    private User customerB;
    private Product testProduct;
    private ProductPlan testPlan;

    @BeforeEach
    void setUp() {
        String rand = UUID.randomUUID().toString().substring(0, 8);
        customerA = userRepository.save(User.builder()
                .name("Customer A")
                .email("cust_a_" + rand + "@test.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(false)
                .build());

        customerB = userRepository.save(User.builder()
                .name("Customer B")
                .email("cust_b_" + rand + "@test.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .phoneVerified(false)
                .build());

        testProduct = productRepository.save(Product.builder()
                .name("Security Audit Suite " + rand)
                .price(new BigDecimal("9999.00"))
                .active(true)
                .build());

        testPlan = productPlanRepository.save(ProductPlan.builder()
                .product(testProduct)
                .name("Pro Yearly")
                .billingType(BillingType.YEARLY)
                .price(new BigDecimal("9999.00"))
                .durationDays(365)
                .activationLimit(3)
                .active(true)
                .build());
    }

    @Test
    @DisplayName("Security: Refresh tokens must be invalidated upon user password change")
    @Transactional
    void testRefreshTokenInvalidationOnPasswordChange() {
        // Create an active refresh token for Customer A
        RefreshToken token = refreshTokenRepository.save(RefreshToken.builder()
                .user(customerA)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(3600))
                .build());

        assertTrue(refreshTokenRepository.findByToken(token.getToken()).isPresent());

        // Change password
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("Password123!");
        request.setNewPassword("NewSecurePassword456!");

        userService.changePassword(customerA.getId(), request);

        // Verify that Customer A's refresh token has been purged
        assertTrue(refreshTokenRepository.findByToken(token.getToken()).isEmpty(),
                "Active refresh token must be invalidated when password is changed");
    }

    @Test
    @DisplayName("Security: Refresh tokens must be invalidated upon OTP password reset")
    @Transactional
    void testRefreshTokenInvalidationOnPasswordReset() {
        RefreshToken token = refreshTokenRepository.save(RefreshToken.builder()
                .user(customerB)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(3600))
                .build());

        assertTrue(refreshTokenRepository.findByToken(token.getToken()).isPresent());

        // Generate verified reset token
        String resetToken = UUID.randomUUID().toString();
        otpRepository.save(OtpVerification.builder()
                .target(customerB.getEmail())
                .otpHash("dummy_hash")
                .purpose(OtpPurpose.PASSWORD_RESET)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .resetToken(resetToken)
                .resetTokenExpiry(LocalDateTime.now().plusMinutes(15))
                .verified(true)
                .build());

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail(customerB.getEmail());
        request.setResetToken(resetToken);
        request.setNewPassword("ResetPassword789!");

        authService.resetPassword(request);

        // Verify that Customer B's refresh token was invalidated
        assertTrue(refreshTokenRepository.findByToken(token.getToken()).isEmpty(),
                "Active refresh token must be invalidated when password is reset");
    }

    @Test
    @DisplayName("IDOR / Ownership: Customer B cannot access Customer A's order")
    @Transactional
    void testCustomerCannotAccessOtherCustomerOrder() {
        Order orderA = orderRepository.save(Order.builder()
                .user(customerA)
                .totalAmount(new BigDecimal("9999.00"))
                .status(OrderStatus.PAID)
                .build());

        // Customer A can access their own order
        assertNotNull(orderService.getOrderById(customerA.getId(), orderA.getId()));

        // Customer B cannot access Customer A's order -> Throws ResourceNotFoundException
        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.getOrderById(customerB.getId(), orderA.getId());
        });
    }

    @Test
    @DisplayName("IDOR / Ownership: Customer B cannot access Customer A's license")
    @Transactional
    void testCustomerCannotAccessOtherCustomerLicense() {
        License licenseA = licenseRepository.save(License.builder()
                .user(customerA)
                .product(testProduct)
                .productPlan(testPlan)
                .licenseKey(licenseService.generateUniqueLicenseKey())
                .status(LicenseStatus.ACTIVE)
                .activationLimit(3)
                .activationCount(0)
                .issuedAt(LocalDateTime.now())
                .build());

        // Customer A can access
        assertNotNull(licenseService.getLicenseById(customerA.getId(), licenseA.getId()));

        // Customer B cannot access Customer A's license
        assertThrows(ResourceNotFoundException.class, () -> {
            licenseService.getLicenseById(customerB.getId(), licenseA.getId());
        });
    }

    @Test
    @DisplayName("IDOR / Ownership: Customer B cannot cancel Customer A's subscription")
    @Transactional
    void testCustomerCannotCancelOtherCustomerSubscription() {
        Subscription subA = subscriptionRepository.save(Subscription.builder()
                .user(customerA)
                .product(testProduct)
                .productPlan(testPlan)
                .status(SubscriptionStatus.ACTIVE)
                .startDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusDays(365))
                .build());

        // Customer B cannot access or cancel
        assertThrows(ResourceNotFoundException.class, () -> {
            subscriptionService.cancelSubscription(customerB.getId(), subA.getId());
        });
    }

    @Test
    @DisplayName("Entitlement: Unentitled user cannot download software releases")
    @Transactional
    void testUnentitledUserCannotDownloadSoftwareRelease() {
        SoftwareRelease release = softwareReleaseRepository.save(SoftwareRelease.builder()
                .product(testProduct)
                .version("2.0.0")
                .platform(Platform.WINDOWS)
                .fileName("sec-audit-v2.0.0.zip")
                .filePath("/releases/sec-audit-v2.0.0.zip")
                .active(true)
                .build());

        // Customer B does NOT have a subscription, license, or paid order
        assertFalse(softwareReleaseService.isUserEntitledToProduct(customerB.getId(), testProduct.getId()));

        assertThrows(BadRequestException.class, () -> {
            softwareReleaseService.getSoftwareReleaseForDownload(customerB.getId(), testProduct.getId(), release.getId());
        });

        // Grant entitlement to Customer A
        licenseRepository.save(License.builder()
                .user(customerA)
                .product(testProduct)
                .productPlan(testPlan)
                .licenseKey(licenseService.generateUniqueLicenseKey())
                .status(LicenseStatus.ACTIVE)
                .activationLimit(3)
                .issuedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(365))
                .build());

        assertTrue(softwareReleaseService.isUserEntitledToProduct(customerA.getId(), testProduct.getId()));
        assertNotNull(softwareReleaseService.getSoftwareReleaseForDownload(customerA.getId(), testProduct.getId(), release.getId()));
    }

    @Test
    @DisplayName("Infrastructure: Cloud / Local StorageService uploads and presigned URLs")
    void testStorageServiceUploadAndDownload() {
        String testContent = "OHO TECHN Enterprise Binary Payload";
        ByteArrayInputStream is = new ByteArrayInputStream(testContent.getBytes());

        StorageFileUploadResult result = storageService.uploadFile(
                "test-releases",
                "test-package.bin",
                is,
                testContent.length(),
                "application/octet-stream"
        );

        assertNotNull(result);
        assertEquals("test-package.bin", result.getFileName());
        assertEquals(testContent.length(), result.getFileSize());
        assertNotNull(result.getStorageProvider());

        // Test presigned URL generation
        String presignedUrl = storageService.generatePresignedDownloadUrl(result.getFilePath(), 30);
        assertNotNull(presignedUrl);
        assertTrue(presignedUrl.contains("test-package.bin") || presignedUrl.contains("stream") || presignedUrl.contains("releases"));

        // Test binary byte retrieval
        byte[] bytes = storageService.downloadFileBytes(result.getFilePath());
        assertNotNull(bytes);
        assertTrue(bytes.length > 0);
    }
}
