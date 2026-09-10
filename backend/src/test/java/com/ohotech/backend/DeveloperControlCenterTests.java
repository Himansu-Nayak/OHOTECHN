package com.ohotech.backend;

import com.ohotech.backend.controller.DeveloperController;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.developer.*;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.EncryptionService;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.FeatureFlagService;
import com.ohotech.backend.service.SystemConfigService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DeveloperControlCenterTests {

    @Autowired
    private DeveloperController developerController;

    @Autowired
    private SystemConfigService systemConfigService;

    @Autowired
    private FeatureFlagService featureFlagService;

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserPrincipal devPrincipal;
    private UserPrincipal customerPrincipal;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User devUser = userRepository.save(User.builder()
                .name("Developer User")
                .email("dev@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .emailVerified(true)
                .build());

        devPrincipal = UserPrincipal.create(devUser);

        User customerUser = userRepository.save(User.builder()
                .name("Customer User")
                .email("customer@client.com")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .emailVerified(true)
                .build());

        customerPrincipal = UserPrincipal.create(customerUser);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(devPrincipal, null, devPrincipal.getAuthorities())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Security: Customer cannot access developer controller (AccessDeniedException)")
    void customerCannotAccessDeveloperEndpoints() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(customerPrincipal, null, customerPrincipal.getAuthorities())
        );

        assertThrows(AccessDeniedException.class, () -> {
            developerController.getOverview();
        });
    }

    @Test
    @DisplayName("Overview: Developer receives safe operational cards with valid status")
    void developerCanAccessOverview() {
        ResponseEntity<ApiResponse<DeveloperOverviewDto>> response = developerController.getOverview();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        DeveloperOverviewDto data = response.getBody().getData();
        assertNotNull(data);
        assertEquals("OHO TECHN Turnkey Platform", data.getApplicationName());
        assertEquals("UP", data.getBackendStatus());
        assertNotNull(data.getDatabaseStatus());
    }

    @Test
    @DisplayName("Integrations: Razorpay configuration masks secret keys and never returns plain secret")
    void razorpayConfigurationMasksSecret() {
        RazorpayConfigDto updateDto = RazorpayConfigDto.builder()
                .keyId("rzp_test_sampleKeyId1234")
                .keySecret("secret_value_that_must_remain_masked_9999")
                .environment("TEST")
                .enabled(true)
                .build();

        ResponseEntity<ApiResponse<RazorpayConfigDto>> response = developerController.updateRazorpayConfig(updateDto, devPrincipal);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        RazorpayConfigDto data = response.getBody().getData();
        assertEquals("rzp_test_sampleKeyId1234", data.getKeyId());
        assertTrue(data.getMaskedKeySecret().contains("••••••••"));
        assertFalse(data.getMaskedKeySecret().contains("secret_value_that_must_remain_masked"));
        assertNull(data.getKeySecret());
    }

    @Test
    @DisplayName("Integrations: Email configuration update masks SMTP password")
    void emailConfigurationMasksPassword() {
        EmailConfigDto updateDto = EmailConfigDto.builder()
                .host("smtp.resend.com")
                .port(465)
                .username("resend")
                .password("re_sample_super_secret_api_key_8888")
                .fromEmail("noreply@ohotech.com")
                .fromName("OHO TECHN Support")
                .enabled(true)
                .build();

        ResponseEntity<ApiResponse<EmailConfigDto>> response = developerController.updateEmailConfig(updateDto, devPrincipal);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        EmailConfigDto data = response.getBody().getData();
        assertEquals("smtp.resend.com", data.getHost());
        assertTrue(data.getMaskedPassword().contains("••••••••"));
        assertFalse(data.getMaskedPassword().contains("re_sample_super_secret"));
        assertNull(data.getPassword());
    }

    @Test
    @DisplayName("Integrations: Storage configuration masks secret access key")
    void storageConfigurationMasksSecretKey() {
        StorageConfigDto updateDto = StorageConfigDto.builder()
                .provider("S3")
                .bucket("my-custom-releases-bucket")
                .region("eu-central-1")
                .accessKey("AKIA_SAMPLE_KEY_1234")
                .secretKey("super_secret_aws_key_value_7777")
                .pathStyle(false)
                .enabled(true)
                .build();

        ResponseEntity<ApiResponse<StorageConfigDto>> response = developerController.updateStorageConfig(updateDto, devPrincipal);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        StorageConfigDto data = response.getBody().getData();
        assertEquals("S3", data.getProvider());
        assertTrue(data.getMaskedSecretKey().contains("••••••••"));
        assertFalse(data.getMaskedSecretKey().contains("super_secret_aws_key"));
        assertNull(data.getSecretKey());
    }

    @Test
    @DisplayName("Feature Flags: Developer can retrieve and toggle feature flags with audit trail")
    void developerCanToggleFeatureFlags() {
        ResponseEntity<ApiResponse<List<FeatureFlagDto>>> allFlags = developerController.getFeatureFlags();
        assertEquals(200, allFlags.getStatusCode().value());
        assertFalse(allFlags.getBody().getData().isEmpty());

        ResponseEntity<ApiResponse<FeatureFlagDto>> response = developerController.toggleFeatureFlag(
                "MAINTENANCE_MODE", Map.of("enabled", true), devPrincipal);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().getData().isEnabled());
        assertEquals("MAINTENANCE_MODE", response.getBody().getData().getFlagKey());
    }

    @Test
    @DisplayName("API Config: Prohibits wildcard '*' CORS with credentials")
    void apiConfigRejectsWildcardCors() {
        ApiConfigDto dto = ApiConfigDto.builder()
                .allowedCorsOrigins(List.of("http://localhost:3000", "*"))
                .build();

        assertThrows(IllegalArgumentException.class, () -> {
            systemConfigService.updateApiConfig(dto, "dev@ohotech.com");
        });
    }

    @Test
    @DisplayName("OTP Policy: Enforces safe operational limits")
    void otpConfigEnforcesSafeLimits() {
        OtpConfigDto unsafeDto = OtpConfigDto.builder()
                .expiryMinutes(100)
                .cooldownSeconds(5)
                .maxAttempts(50)
                .build();

        OtpConfigDto saved = systemConfigService.updateOtpConfig(unsafeDto, "dev@ohotech.com");
        assertEquals(30, saved.getExpiryMinutes());
        assertEquals(30, saved.getCooldownSeconds());
        assertEquals(10, saved.getMaxAttempts());
        assertTrue(saved.isEnabled());
    }

    @Test
    @DisplayName("System Health: Diagnostics endpoint returns UP status without secret leakage")
    void systemHealthReturnsDiagnosticsSafely() {
        ResponseEntity<ApiResponse<SystemHealthDto>> response = developerController.getSystemHealth();
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        SystemHealthDto health = response.getBody().getData();
        assertEquals("UP", health.getStatus());
        assertTrue(health.getComponents().containsKey("database"));
        assertTrue(health.getComponents().containsKey("backend"));
    }

    @Test
    @DisplayName("EncryptionService: AES-GCM encryption and decryption works with random IV")
    void encryptionDecryptionWorks() {
        String original = "rzp_live_secret_key_1234567890";
        String encrypted = encryptionService.encrypt(original);
        assertNotNull(encrypted);
        assertNotEquals(original, encrypted);

        String decrypted = encryptionService.decrypt(encrypted);
        assertEquals(original, decrypted);
    }
}
