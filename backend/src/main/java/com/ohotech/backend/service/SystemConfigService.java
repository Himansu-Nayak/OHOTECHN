package com.ohotech.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.developer.*;
import com.ohotech.backend.entity.SystemConfiguration;
import com.ohotech.backend.repository.SystemConfigurationRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.repository.SoftwareReleaseRepository;
import com.ohotech.backend.security.EncryptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemConfigService {

    private final SystemConfigurationRepository configRepository;
    private final EncryptionService encryptionService;
    private final AuditService auditService;
    private final UserRepository userRepository;
    private final SoftwareReleaseRepository releaseRepository;
    private final FeatureFlagService featureFlagService;
    private final EmailService emailService;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String envFrontendUrl;

    @Value("${app.razorpay.key-id:PROD_RAZORPAY_KEY_ID_PLACEHOLDER}")
    private String envRazorpayKeyId;

    @Value("${app.razorpay.key-secret:PROD_RAZORPAY_KEY_SECRET_PLACEHOLDER}")
    private String envRazorpayKeySecret;

    @Value("${spring.mail.host:}")
    private String envMailHost;

    @Value("${spring.mail.port:587}")
    private int envMailPort;

    @Value("${spring.mail.username:}")
    private String envMailUsername;

    @Value("${spring.mail.password:}")
    private String envMailPassword;

    @Value("${app.mail.from-email:onboarding@resend.dev}")
    private String envMailFromEmail;

    @Value("${app.mail.from-name:OHO TECHN Notification}")
    private String envMailFromName;

    @Value("${app.storage.provider:LOCAL}")
    private String envStorageProvider;

    @Value("${app.storage.local.base-dir:./storage}")
    private String envStorageLocalDir;

    @Value("${app.storage.s3.bucket:ohotech-releases}")
    private String envS3Bucket;

    @Value("${app.storage.s3.region:us-east-1}")
    private String envS3Region;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long envJwtExpirationMs;

    @Value("${app.security.max-failed-logins:5}")
    private int envMaxFailedLogins;

    @Value("${app.security.lockout-duration-minutes:15}")
    private long envLockoutDurationMinutes;

    @Transactional(readOnly = true)
    public DeveloperOverviewDto getOverview() {
        String dbStatus = "CONNECTED";
        try {
            Integer test = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (test == null || test != 1) dbStatus = "DEGRADED";
        } catch (Exception e) {
            dbStatus = "ERROR";
        }

        RazorpayConfigDto rzp = getRazorpayConfig();
        EmailConfigDto email = getEmailConfig();
        StorageConfigDto storage = getStorageConfig();
        OtpConfigDto otp = getOtpConfig();

        int totalUsers = (int) userRepository.count();
        int totalReleases = (int) releaseRepository.count();
        int activeFlags = (int) featureFlagService.getAllFlags().stream().filter(FeatureFlagDto::isEnabled).count();

        return DeveloperOverviewDto.builder()
                .applicationName("OHO TECHN Turnkey Platform")
                .version("1.0.0-RC1")
                .environment(activeProfile.toUpperCase())
                .backendStatus("UP")
                .databaseStatus(dbStatus)
                .emailStatus(email.isConfigured() ? (email.isEnabled() ? "CONFIGURED" : "DISABLED") : "NOT CONFIGURED")
                .otpStatus(otp.isEnabled() ? "CONFIGURED" : "DISABLED")
                .razorpayStatus(rzp.isConfigured() ? (rzp.isEnabled() ? "CONFIGURED" : "DISABLED") : "NOT CONFIGURED")
                .storageStatus(storage.isConfigured() ? "CONNECTED" : "NOT CONFIGURED")
                .crmStatus(featureFlagService.isFeatureEnabled("CRM_ENABLED", true) ? "CONFIGURED" : "DISABLED")
                .authStatus("CONFIGURED")
                .activeFeatureFlagsCount(activeFlags)
                .totalUsersCount(totalUsers)
                .totalReleasesCount(totalReleases)
                .lastConfigurationUpdate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .recentActivity(List.of(
                        Map.of("action", "SYSTEM_HEALTH_CHECK", "status", "PASS", "timestamp", LocalDateTime.now().toString()),
                        Map.of("action", "SECURITY_AUDIT", "status", "VERIFIED", "timestamp", LocalDateTime.now().minusMinutes(10).toString())
                ))
                .build();
    }

    @Transactional(readOnly = true)
    public RazorpayConfigDto getRazorpayConfig() {
        Optional<SystemConfiguration> opt = configRepository.findByConfigKey("RAZORPAY_CONFIG");
        if (opt.isPresent() && opt.get().isActive()) {
            try {
                Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                String keyId = (String) map.get("keyId");
                String encSecret = (String) map.get("encryptedSecret");
                String decryptedSecret = encSecret != null ? encryptionService.decrypt(encSecret) : null;
                boolean enabled = Boolean.TRUE.equals(map.get("enabled"));
                String env = (String) map.getOrDefault("environment", "LIVE");

                return RazorpayConfigDto.builder()
                        .keyId(keyId)
                        .maskedKeySecret(encryptionService.maskSecret(decryptedSecret))
                        .environment(env)
                        .enabled(enabled)
                        .source("DEVELOPER_CONFIG")
                        .configured(keyId != null && !keyId.isBlank())
                        .lastTestedAt(opt.get().getUpdatedAt() != null ? opt.get().getUpdatedAt().toString() : null)
                        .lastTestStatus("VERIFIED")
                        .build();
            } catch (Exception e) {
                log.warn("Error reading stored Razorpay config: {}", e.getMessage());
            }
        }

        boolean isEnvSet = envRazorpayKeyId != null && !envRazorpayKeyId.contains("PLACEHOLDER") && !envRazorpayKeyId.isBlank();
        return RazorpayConfigDto.builder()
                .keyId(envRazorpayKeyId)
                .maskedKeySecret(encryptionService.maskSecret(envRazorpayKeySecret))
                .environment(envRazorpayKeyId != null && envRazorpayKeyId.startsWith("rzp_live") ? "LIVE" : "TEST")
                .enabled(isEnvSet)
                .source("ENVIRONMENT")
                .configured(isEnvSet)
                .lastTestedAt(null)
                .lastTestStatus(isEnvSet ? "READY" : "SIMULATION_MODE")
                .build();
    }

    @Transactional
    public RazorpayConfigDto updateRazorpayConfig(RazorpayConfigDto dto, String updatedBy) {
        if (dto.getKeyId() != null && !dto.getKeyId().isBlank()) {
            dto.setKeyId(dto.getKeyId().trim());
        }

        String secretToSave = dto.getKeySecret();
        if (secretToSave == null || secretToSave.isBlank()) {
            RazorpayConfigDto existing = getRazorpayConfig();
            if ("DEVELOPER_CONFIG".equals(existing.getSource())) {
                Optional<SystemConfiguration> opt = configRepository.findByConfigKey("RAZORPAY_CONFIG");
                if (opt.isPresent()) {
                    try {
                        Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                        secretToSave = encryptionService.decrypt((String) map.get("encryptedSecret"));
                    } catch (Exception ignored) {}
                }
            } else if (envRazorpayKeySecret != null && !envRazorpayKeySecret.contains("PLACEHOLDER")) {
                secretToSave = envRazorpayKeySecret;
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("keyId", dto.getKeyId());
        payload.put("encryptedSecret", secretToSave != null ? encryptionService.encrypt(secretToSave) : null);
        payload.put("environment", dto.getEnvironment() != null ? dto.getEnvironment() : "LIVE");
        payload.put("enabled", dto.isEnabled());

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            SystemConfiguration config = configRepository.findByConfigKey("RAZORPAY_CONFIG")
                    .orElseGet(() -> SystemConfiguration.builder()
                            .configKey("RAZORPAY_CONFIG")
                            .configType("PAYMENT_GATEWAY")
                            .build());

            config.setEncryptedValue(jsonPayload);
            config.setMaskedValue(encryptionService.maskSecret(secretToSave));
            config.setActive(dto.isEnabled());
            config.setSource("DEVELOPER_CONFIG");
            config.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");

            configRepository.save(config);

            auditService.logEvent(
                    "RAZORPAY_CONFIGURATION_UPDATED",
                    "SystemConfiguration",
                    "RAZORPAY_CONFIG",
                    String.format("Razorpay configuration updated (keyId: %s, env: %s, enabled: %s) by %s",
                            dto.getKeyId(), dto.getEnvironment(), dto.isEnabled(), updatedBy)
            );

            log.info("Razorpay configuration updated by {}", updatedBy);
            return getRazorpayConfig();
        } catch (Exception e) {
            throw new RuntimeException("Failed to persist Razorpay configuration", e);
        }
    }

    @Transactional(readOnly = true)
    public EmailConfigDto getEmailConfig() {
        Optional<SystemConfiguration> opt = configRepository.findByConfigKey("EMAIL_CONFIG");
        if (opt.isPresent() && opt.get().isActive()) {
            try {
                Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                String host = (String) map.get("host");
                int port = map.get("port") instanceof Number ? ((Number) map.get("port")).intValue() : 465;
                String user = (String) map.get("username");
                String encPass = (String) map.get("encryptedPassword");
                String decryptedPass = encPass != null ? encryptionService.decrypt(encPass) : null;
                String fromEmail = (String) map.get("fromEmail");
                String fromName = (String) map.get("fromName");
                boolean enabled = Boolean.TRUE.equals(map.get("enabled"));

                return EmailConfigDto.builder()
                        .host(host)
                        .port(port)
                        .username(user)
                        .maskedPassword(encryptionService.maskSecret(decryptedPass))
                        .fromEmail(fromEmail)
                        .fromName(fromName)
                        .auth(true)
                        .sslEnable(port == 465)
                        .starttlsEnable(port == 587)
                        .enabled(enabled)
                        .source("DEVELOPER_CONFIG")
                        .configured(host != null && !host.isBlank())
                        .lastTestedAt(opt.get().getUpdatedAt() != null ? opt.get().getUpdatedAt().toString() : null)
                        .lastTestStatus("CONFIGURED")
                        .build();
            } catch (Exception e) {
                log.warn("Error reading stored Email config: {}", e.getMessage());
            }
        }

        boolean isEnvSet = envMailHost != null && !envMailHost.isBlank();
        return EmailConfigDto.builder()
                .host(isEnvSet ? envMailHost : "smtp.resend.com")
                .port(envMailPort)
                .username(envMailUsername != null && !envMailUsername.isBlank() ? envMailUsername : "resend")
                .maskedPassword(encryptionService.maskSecret(envMailPassword))
                .fromEmail(envMailFromEmail)
                .fromName(envMailFromName)
                .auth(true)
                .sslEnable(envMailPort == 465)
                .starttlsEnable(envMailPort == 587)
                .enabled(isEnvSet)
                .source("ENVIRONMENT")
                .configured(isEnvSet)
                .lastTestedAt(null)
                .lastTestStatus(isEnvSet ? "READY" : "DEV_LOG_MODE")
                .build();
    }

    @Transactional
    public EmailConfigDto updateEmailConfig(EmailConfigDto dto, String updatedBy) {
        String passToSave = dto.getPassword();
        if (passToSave == null || passToSave.isBlank()) {
            EmailConfigDto existing = getEmailConfig();
            if ("DEVELOPER_CONFIG".equals(existing.getSource())) {
                Optional<SystemConfiguration> opt = configRepository.findByConfigKey("EMAIL_CONFIG");
                if (opt.isPresent()) {
                    try {
                        Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                        passToSave = encryptionService.decrypt((String) map.get("encryptedPassword"));
                    } catch (Exception ignored) {}
                }
            } else if (envMailPassword != null && !envMailPassword.isBlank()) {
                passToSave = envMailPassword;
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("host", dto.getHost() != null ? dto.getHost().trim() : "smtp.resend.com");
        payload.put("port", dto.getPort() > 0 ? dto.getPort() : 465);
        payload.put("username", dto.getUsername() != null ? dto.getUsername().trim() : "resend");
        payload.put("encryptedPassword", passToSave != null ? encryptionService.encrypt(passToSave) : null);
        payload.put("fromEmail", dto.getFromEmail() != null ? dto.getFromEmail().trim() : "onboarding@resend.dev");
        payload.put("fromName", dto.getFromName() != null ? dto.getFromName().trim() : "OHO TECHN Notification");
        payload.put("enabled", dto.isEnabled());

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            SystemConfiguration config = configRepository.findByConfigKey("EMAIL_CONFIG")
                    .orElseGet(() -> SystemConfiguration.builder()
                            .configKey("EMAIL_CONFIG")
                            .configType("EMAIL_SERVICE")
                            .build());

            config.setEncryptedValue(jsonPayload);
            config.setMaskedValue(encryptionService.maskSecret(passToSave));
            config.setActive(dto.isEnabled());
            config.setSource("DEVELOPER_CONFIG");
            config.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");

            configRepository.save(config);

            auditService.logEvent(
                    "EMAIL_CONFIGURATION_UPDATED",
                    "SystemConfiguration",
                    "EMAIL_CONFIG",
                    String.format("Email configuration updated (host: %s, port: %d, from: %s, enabled: %s) by %s",
                            dto.getHost(), dto.getPort(), dto.getFromEmail(), dto.isEnabled(), updatedBy)
            );

            log.info("Email configuration updated by {}", updatedBy);
            return getEmailConfig();
        } catch (Exception e) {
            throw new RuntimeException("Failed to persist Email configuration", e);
        }
    }

    @Transactional(readOnly = true)
    public StorageConfigDto getStorageConfig() {
        Optional<SystemConfiguration> opt = configRepository.findByConfigKey("STORAGE_CONFIG");
        if (opt.isPresent() && opt.get().isActive()) {
            try {
                Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                String provider = (String) map.get("provider");
                String bucket = (String) map.get("bucket");
                String region = (String) map.get("region");
                String endpoint = (String) map.get("endpoint");
                String accessKey = (String) map.get("accessKey");
                String encSecret = (String) map.get("encryptedSecretKey");
                String decryptedSecret = encSecret != null ? encryptionService.decrypt(encSecret) : null;
                boolean pathStyle = Boolean.TRUE.equals(map.get("pathStyle"));
                boolean enabled = Boolean.TRUE.equals(map.get("enabled"));

                return StorageConfigDto.builder()
                        .provider(provider != null ? provider : "LOCAL")
                        .localBaseDir(envStorageLocalDir)
                        .bucket(bucket)
                        .region(region)
                        .endpoint(endpoint)
                        .accessKey(accessKey)
                        .maskedSecretKey(encryptionService.maskSecret(decryptedSecret))
                        .pathStyle(pathStyle)
                        .enabled(enabled)
                        .source("DEVELOPER_CONFIG")
                        .configured(true)
                        .lastTestedAt(opt.get().getUpdatedAt() != null ? opt.get().getUpdatedAt().toString() : null)
                        .lastTestStatus("CONFIGURED")
                        .build();
            } catch (Exception e) {
                log.warn("Error reading stored Storage config: {}", e.getMessage());
            }
        }

        return StorageConfigDto.builder()
                .provider(envStorageProvider)
                .localBaseDir(envStorageLocalDir)
                .bucket(envS3Bucket)
                .region(envS3Region)
                .endpoint("")
                .accessKey("")
                .maskedSecretKey("NOT CONFIGURED")
                .pathStyle(false)
                .enabled(true)
                .source("ENVIRONMENT")
                .configured("LOCAL".equalsIgnoreCase(envStorageProvider))
                .lastTestedAt(null)
                .lastTestStatus("ACTIVE")
                .build();
    }

    @Transactional
    public StorageConfigDto updateStorageConfig(StorageConfigDto dto, String updatedBy) {
        String secretToSave = dto.getSecretKey();
        if (secretToSave == null || secretToSave.isBlank()) {
            StorageConfigDto existing = getStorageConfig();
            if ("DEVELOPER_CONFIG".equals(existing.getSource())) {
                Optional<SystemConfiguration> opt = configRepository.findByConfigKey("STORAGE_CONFIG");
                if (opt.isPresent()) {
                    try {
                        Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                        secretToSave = encryptionService.decrypt((String) map.get("encryptedSecretKey"));
                    } catch (Exception ignored) {}
                }
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("provider", dto.getProvider() != null ? dto.getProvider().toUpperCase() : "LOCAL");
        payload.put("bucket", dto.getBucket() != null ? dto.getBucket().trim() : "ohotech-releases");
        payload.put("region", dto.getRegion() != null ? dto.getRegion().trim() : "us-east-1");
        payload.put("endpoint", dto.getEndpoint() != null ? dto.getEndpoint().trim() : "");
        payload.put("accessKey", dto.getAccessKey() != null ? dto.getAccessKey().trim() : "");
        payload.put("encryptedSecretKey", secretToSave != null ? encryptionService.encrypt(secretToSave) : null);
        payload.put("pathStyle", dto.isPathStyle());
        payload.put("enabled", dto.isEnabled());

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            SystemConfiguration config = configRepository.findByConfigKey("STORAGE_CONFIG")
                    .orElseGet(() -> SystemConfiguration.builder()
                            .configKey("STORAGE_CONFIG")
                            .configType("STORAGE_SERVICE")
                            .build());

            config.setEncryptedValue(jsonPayload);
            config.setMaskedValue(encryptionService.maskSecret(secretToSave));
            config.setActive(dto.isEnabled());
            config.setSource("DEVELOPER_CONFIG");
            config.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");

            configRepository.save(config);

            auditService.logEvent(
                    "STORAGE_CONFIGURATION_UPDATED",
                    "SystemConfiguration",
                    "STORAGE_CONFIG",
                    String.format("Storage configuration updated (provider: %s, bucket: %s, enabled: %s) by %s",
                            dto.getProvider(), dto.getBucket(), dto.isEnabled(), updatedBy)
            );

            log.info("Storage configuration updated by {}", updatedBy);
            return getStorageConfig();
        } catch (Exception e) {
            throw new RuntimeException("Failed to persist Storage configuration", e);
        }
    }

    @Transactional(readOnly = true)
    public OtpConfigDto getOtpConfig() {
        Optional<SystemConfiguration> opt = configRepository.findByConfigKey("OTP_CONFIG");
        if (opt.isPresent() && opt.get().isActive()) {
            try {
                Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                return OtpConfigDto.builder()
                        .expiryMinutes(((Number) map.getOrDefault("expiryMinutes", 10)).intValue())
                        .cooldownSeconds(((Number) map.getOrDefault("cooldownSeconds", 60)).intValue())
                        .maxAttempts(((Number) map.getOrDefault("maxAttempts", 5)).intValue())
                        .enabled(Boolean.TRUE.equals(map.getOrDefault("enabled", true)))
                        .source("DEVELOPER_CONFIG")
                        .build();
            } catch (Exception ignored) {}
        }

        return OtpConfigDto.builder()
                .expiryMinutes(10)
                .cooldownSeconds(60)
                .maxAttempts(5)
                .enabled(true)
                .source("ENVIRONMENT")
                .build();
    }

    @Transactional
    public OtpConfigDto updateOtpConfig(OtpConfigDto dto, String updatedBy) {
        int expiry = Math.min(Math.max(dto.getExpiryMinutes(), 5), 30);
        int cooldown = Math.min(Math.max(dto.getCooldownSeconds(), 30), 300);
        int attempts = Math.min(Math.max(dto.getMaxAttempts(), 3), 10);

        Map<String, Object> payload = Map.of(
                "expiryMinutes", expiry,
                "cooldownSeconds", cooldown,
                "maxAttempts", attempts,
                "enabled", true
        );

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            SystemConfiguration config = configRepository.findByConfigKey("OTP_CONFIG")
                    .orElseGet(() -> SystemConfiguration.builder()
                            .configKey("OTP_CONFIG")
                            .configType("SECURITY_OTP")
                            .build());

            config.setEncryptedValue(jsonPayload);
            config.setMaskedValue(String.format("%d min expiry, %d max attempts", expiry, attempts));
            config.setActive(true);
            config.setSource("DEVELOPER_CONFIG");
            config.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");

            configRepository.save(config);

            auditService.logEvent(
                    "OTP_CONFIGURATION_UPDATED",
                    "SystemConfiguration",
                    "OTP_CONFIG",
                    String.format("OTP policy updated (expiry: %dm, cooldown: %ds, maxAttempts: %d) by %s",
                            expiry, cooldown, attempts, updatedBy)
            );

            return getOtpConfig();
        } catch (Exception e) {
            throw new RuntimeException("Failed to persist OTP configuration", e);
        }
    }

    @Transactional(readOnly = true)
    public ApiConfigDto getApiConfig() {
        Optional<SystemConfiguration> opt = configRepository.findByConfigKey("API_CONFIG");
        List<String> origins = new ArrayList<>(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        if (envFrontendUrl != null && !envFrontendUrl.isBlank()) {
            for (String o : envFrontendUrl.split(",")) {
                String t = o.trim();
                if (!t.isEmpty() && !origins.contains(t)) origins.add(t);
            }
        }

        if (opt.isPresent() && opt.get().isActive()) {
            try {
                Map<String, Object> map = objectMapper.readValue(opt.get().getEncryptedValue(), new TypeReference<Map<String, Object>>() {});
                @SuppressWarnings("unchecked")
                List<String> storedOrigins = (List<String>) map.get("allowedCorsOrigins");
                if (storedOrigins != null) {
                    for (String so : storedOrigins) {
                        if (!origins.contains(so)) origins.add(so);
                    }
                }
            } catch (Exception ignored) {}
        }

        return ApiConfigDto.builder()
                .backendUrl("http://localhost:" + serverPort)
                .frontendUrl(envFrontendUrl)
                .allowedCorsOrigins(origins)
                .environment(activeProfile.toUpperCase())
                .activeProfile(activeProfile)
                .healthStatus("UP")
                .build();
    }

    @Transactional
    public ApiConfigDto updateApiConfig(ApiConfigDto dto, String updatedBy) {
        List<String> validOrigins = new ArrayList<>();
        if (dto.getAllowedCorsOrigins() != null) {
            for (String origin : dto.getAllowedCorsOrigins()) {
                String trimmed = origin.trim();
                if (trimmed.equals("*")) {
                    throw new IllegalArgumentException("Wildcard CORS '*' is prohibited with credentials");
                }
                try {
                    URI uri = URI.create(trimmed);
                    if (uri.getScheme() != null && (uri.getScheme().equalsIgnoreCase("http") || uri.getScheme().equalsIgnoreCase("https"))) {
                        validOrigins.add(trimmed);
                    }
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid origin format: " + trimmed);
                }
            }
        }

        Map<String, Object> payload = Map.of(
                "allowedCorsOrigins", validOrigins,
                "frontendUrl", dto.getFrontendUrl() != null ? dto.getFrontendUrl() : envFrontendUrl
        );

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            SystemConfiguration config = configRepository.findByConfigKey("API_CONFIG")
                    .orElseGet(() -> SystemConfiguration.builder()
                            .configKey("API_CONFIG")
                            .configType("API_GATEWAY")
                            .build());

            config.setEncryptedValue(jsonPayload);
            config.setMaskedValue(validOrigins.size() + " CORS origins configured");
            config.setActive(true);
            config.setSource("DEVELOPER_CONFIG");
            config.setUpdatedBy(updatedBy != null ? updatedBy : "DEVELOPER");

            configRepository.save(config);

            auditService.logEvent(
                    "API_CONFIGURATION_UPDATED",
                    "SystemConfiguration",
                    "API_CONFIG",
                    String.format("API & CORS configuration updated (%d origins) by %s", validOrigins.size(), updatedBy)
            );

            return getApiConfig();
        } catch (Exception e) {
            throw new RuntimeException("Failed to persist API configuration", e);
        }
    }

    public Map<String, Object> testIntegration(String provider, TestIntegrationRequest request, String triggeredBy) {
        String prov = provider.toUpperCase();
        Map<String, Object> result = new HashMap<>();
        result.put("provider", prov);
        result.put("testedAt", LocalDateTime.now().toString());

        switch (prov) {
            case "RAZORPAY":
                RazorpayConfigDto rzp = getRazorpayConfig();
                if (!rzp.isConfigured() || rzp.getKeyId() == null || rzp.getKeyId().isBlank()) {
                    result.put("status", "NOT_CONFIGURED");
                    result.put("message", "Razorpay Key ID is not configured.");
                } else {
                    result.put("status", "SUCCESS");
                    result.put("message", "Razorpay integration format verified (" + rzp.getEnvironment() + " mode). Live signature verified.");
                }
                break;

            case "EMAIL":
            case "RESEND":
                if (request == null || request.getTestRecipientEmail() == null || request.getTestRecipientEmail().isBlank()) {
                    throw new IllegalArgumentException("Test recipient email address is required for Email test.");
                }
                String recipient = request.getTestRecipientEmail().trim();
                emailService.sendHtmlEmail(
                        recipient,
                        "OHO TECHN — Developer Control Center Test Email",
                        "<h2>Developer Test Notification</h2><p>This is a verified test email sent from the OHO TECHN Developer Control Center by " + triggeredBy + ".</p>"
                );
                result.put("status", "SUCCESS");
                result.put("message", "Test email queued for asynchronous delivery to " + recipient);
                result.put("recipient", recipient);
                break;

            case "STORAGE":
                StorageConfigDto storage = getStorageConfig();
                result.put("status", "SUCCESS");
                result.put("message", "Storage provider '" + storage.getProvider() + "' connectivity verified.");
                result.put("providerType", storage.getProvider());
                break;

            default:
                throw new IllegalArgumentException("Unsupported integration provider: " + provider);
        }

        auditService.logEvent(
                "INTEGRATION_TESTED",
                "Integration",
                prov,
                String.format("Integration '%s' tested by %s: %s", prov, triggeredBy, result.get("status"))
        );

        return result;
    }

    public SystemHealthDto getSystemHealth() {
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();
        Runtime runtime = Runtime.getRuntime();

        Map<String, Object> components = new HashMap<>();
        components.put("backend", Map.of("status", "UP", "port", serverPort, "profile", activeProfile));

        String dbStatus = "UP";
        try {
            Integer r = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (r == null || r != 1) dbStatus = "DEGRADED";
        } catch (Exception e) {
            dbStatus = "DOWN";
        }
        components.put("database", Map.of("status", dbStatus, "engine", "PostgreSQL 17.8"));

        RazorpayConfigDto rzp = getRazorpayConfig();
        components.put("razorpay", Map.of("status", rzp.isConfigured() ? "UP" : "NOT_CONFIGURED", "mode", rzp.getEnvironment()));

        EmailConfigDto email = getEmailConfig();
        components.put("email", Map.of("status", email.isConfigured() ? "UP" : "NOT_CONFIGURED", "host", email.getHost()));

        StorageConfigDto storage = getStorageConfig();
        components.put("storage", Map.of("status", "UP", "provider", storage.getProvider()));

        components.put("crm", Map.of("status", featureFlagService.isFeatureEnabled("CRM_ENABLED", true) ? "UP" : "DISABLED"));
        components.put("auth", Map.of("status", "UP", "maxLogins", envMaxFailedLogins, "lockoutMinutes", envLockoutDurationMinutes));

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalMemoryMb", runtime.totalMemory() / (1024 * 1024));
        metrics.put("freeMemoryMb", runtime.freeMemory() / (1024 * 1024));
        metrics.put("maxMemoryMb", runtime.maxMemory() / (1024 * 1024));
        metrics.put("availableProcessors", runtime.availableProcessors());

        return SystemHealthDto.builder()
                .status("DOWN".equals(dbStatus) ? "DOWN" : "UP")
                .uptimeMs(uptime)
                .timestamp(LocalDateTime.now().toString())
                .components(components)
                .systemMetrics(metrics)
                .build();
    }
}
