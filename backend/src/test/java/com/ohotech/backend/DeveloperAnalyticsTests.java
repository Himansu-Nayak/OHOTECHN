package com.ohotech.backend;

import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class DeveloperAnalyticsTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DeviceActivationRepository deviceActivationRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("Developer Analytics RBAC 1: ROLE_DEVELOPER 200 OK, ROLE_CUSTOMER 403 Forbidden, Unauthenticated 401 Unauthorized")
    void testDeveloperAnalyticsRbac() throws Exception {
        // 1. Unauthenticated -> 401 Unauthorized
        mockMvc.perform(get("/api/developer/analytics"))
                .andExpect(status().isUnauthorized());

        // 2. Customer User -> 403 Forbidden
        User customer = User.builder()
                .name("Customer User")
                .email("cust_dev_analytics_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();
        User savedCustomer = userRepository.save(customer);
        String customerToken = jwtTokenProvider.generateTokenFromUserId(savedCustomer.getId());

        mockMvc.perform(get("/api/developer/analytics")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 3. Developer User -> 200 OK
        User developer = User.builder()
                .name("Developer User")
                .email("dev_analytics_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .build();
        User savedDeveloper = userRepository.save(developer);
        String developerToken = jwtTokenProvider.generateTokenFromUserId(savedDeveloper.getId());

        mockMvc.perform(get("/api/developer/analytics")
                        .header("Authorization", "Bearer " + developerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.deviceMetrics").exists())
                .andExpect(jsonPath("$.data.downloadMetrics").exists());
    }

    @Test
    @DisplayName("Developer Analytics Data Accuracy: Verify Seeded Device Activations and Downloads")
    void testDeveloperAnalyticsDataAccuracy() throws Exception {
        User developer = User.builder()
                .name("Developer Lead")
                .email("dev_lead_" + UUID.randomUUID().toString().substring(0, 6) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_DEVELOPER)
                .enabled(true)
                .build();
        User savedDeveloper = userRepository.save(developer);
        String developerToken = jwtTokenProvider.generateTokenFromUserId(savedDeveloper.getId());

        // Seed a Product
        Product product = Product.builder()
                .name("Test Enterprise Software " + UUID.randomUUID().toString().substring(0, 4))
                .description("Telemetry test product")
                .price(new java.math.BigDecimal("49900.00"))
                .serviceType("Enterprise")
                .active(true)
                .build();
        Product savedProduct = productRepository.save(product);

        // Seed a License & DeviceActivation
        License license = License.builder()
                .licenseKey("OHO-DEV-TEST-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase())
                .user(savedDeveloper)
                .product(savedProduct)
                .status(LicenseStatus.ACTIVE)
                .activationLimit(5)
                .activationCount(1)
                .build();
        License savedLicense = licenseRepository.save(license);

        DeviceActivation device = DeviceActivation.builder()
                .license(savedLicense)
                .deviceIdentifier("DEV-MAC-BOOK-PRO-" + UUID.randomUUID())
                .deviceName("Workstation Mac")
                .operatingSystem("macOS")
                .applicationVersion("1.0.0")
                .active(true)
                .activatedAt(LocalDateTime.now())
                .lastSeenAt(LocalDateTime.now())
                .build();
        deviceActivationRepository.save(device);

        // Seed a Download AuditLog
        AuditLog auditLog = AuditLog.builder()
                .actorUserId(savedDeveloper.getId())
                .actorEmail(savedDeveloper.getEmail())
                .actorRole("ROLE_DEVELOPER")
                .action("SOFTWARE_DOWNLOADED")
                .entityType("SoftwareRelease")
                .entityId("999")
                .description("Downloaded release v1.0.0 (MACOS) for test product")
                .createdAt(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);

        mockMvc.perform(get("/api/developer/analytics")
                        .header("Authorization", "Bearer " + developerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.deviceMetrics.totalActivations").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.deviceMetrics.activeDevices").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.downloadMetrics.totalDownloads").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.recentActivity").isArray());
    }
}
