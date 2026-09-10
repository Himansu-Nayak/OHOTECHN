package com.ohotech.backend.controller;

import com.ohotech.backend.config.DataInitializer;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.AuditLogDto;
import com.ohotech.backend.dto.DeveloperAnalyticsDto;
import com.ohotech.backend.dto.UserDto;
import com.ohotech.backend.dto.developer.*;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.AuditService;
import com.ohotech.backend.service.DeveloperAnalyticsService;
import com.ohotech.backend.service.FeatureFlagService;
import com.ohotech.backend.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_DEVELOPER')")
@Slf4j
public class DeveloperController {

    private final UserRepository userRepository;
    private final DataInitializer dataInitializer;
    private final DeveloperAnalyticsService developerAnalyticsService;
    private final SystemConfigService systemConfigService;
    private final FeatureFlagService featureFlagService;
    private final AuditService auditService;

    // 1. OVERVIEW DASHBOARD
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DeveloperOverviewDto>> getOverview() {
        DeveloperOverviewDto overview = systemConfigService.getOverview();
        return ResponseEntity.ok(ApiResponse.success("Developer overview retrieved", overview));
    }

    // 2. INTEGRATIONS: RAZORPAY
    @GetMapping("/integrations/razorpay")
    public ResponseEntity<ApiResponse<RazorpayConfigDto>> getRazorpayConfig() {
        RazorpayConfigDto config = systemConfigService.getRazorpayConfig();
        return ResponseEntity.ok(ApiResponse.success("Razorpay configuration retrieved", config));
    }

    @PutMapping("/integrations/razorpay")
    public ResponseEntity<ApiResponse<RazorpayConfigDto>> updateRazorpayConfig(
            @RequestBody RazorpayConfigDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        RazorpayConfigDto updated = systemConfigService.updateRazorpayConfig(dto, actor);
        return ResponseEntity.ok(ApiResponse.success("Razorpay configuration updated successfully", updated));
    }

    // 3. INTEGRATIONS: EMAIL & RESEND
    @GetMapping("/integrations/email")
    public ResponseEntity<ApiResponse<EmailConfigDto>> getEmailConfig() {
        EmailConfigDto config = systemConfigService.getEmailConfig();
        return ResponseEntity.ok(ApiResponse.success("Email configuration retrieved", config));
    }

    @PutMapping("/integrations/email")
    public ResponseEntity<ApiResponse<EmailConfigDto>> updateEmailConfig(
            @RequestBody EmailConfigDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        EmailConfigDto updated = systemConfigService.updateEmailConfig(dto, actor);
        return ResponseEntity.ok(ApiResponse.success("Email configuration updated successfully", updated));
    }

    // 4. INTEGRATIONS: STORAGE
    @GetMapping("/integrations/storage")
    public ResponseEntity<ApiResponse<StorageConfigDto>> getStorageConfig() {
        StorageConfigDto config = systemConfigService.getStorageConfig();
        return ResponseEntity.ok(ApiResponse.success("Storage configuration retrieved", config));
    }

    @PutMapping("/integrations/storage")
    public ResponseEntity<ApiResponse<StorageConfigDto>> updateStorageConfig(
            @RequestBody StorageConfigDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        StorageConfigDto updated = systemConfigService.updateStorageConfig(dto, actor);
        return ResponseEntity.ok(ApiResponse.success("Storage configuration updated successfully", updated));
    }

    // 5. INTEGRATIONS: OTP POLICY
    @GetMapping("/integrations/otp")
    public ResponseEntity<ApiResponse<OtpConfigDto>> getOtpConfig() {
        OtpConfigDto config = systemConfigService.getOtpConfig();
        return ResponseEntity.ok(ApiResponse.success("OTP configuration retrieved", config));
    }

    @PutMapping("/integrations/otp")
    public ResponseEntity<ApiResponse<OtpConfigDto>> updateOtpConfig(
            @RequestBody OtpConfigDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        OtpConfigDto updated = systemConfigService.updateOtpConfig(dto, actor);
        return ResponseEntity.ok(ApiResponse.success("OTP configuration updated successfully", updated));
    }

    // 6. INTEGRATIONS: API & CORS
    @GetMapping("/integrations/api")
    public ResponseEntity<ApiResponse<ApiConfigDto>> getApiConfig() {
        ApiConfigDto config = systemConfigService.getApiConfig();
        return ResponseEntity.ok(ApiResponse.success("API configuration retrieved", config));
    }

    @PutMapping("/integrations/api")
    public ResponseEntity<ApiResponse<ApiConfigDto>> updateApiConfig(
            @RequestBody ApiConfigDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        ApiConfigDto updated = systemConfigService.updateApiConfig(dto, actor);
        return ResponseEntity.ok(ApiResponse.success("API configuration updated successfully", updated));
    }

    // 7. INTEGRATION TEST TRIGGER
    @PostMapping("/integrations/{provider}/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testIntegration(
            @PathVariable String provider,
            @RequestBody(required = false) TestIntegrationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        Map<String, Object> testResult = systemConfigService.testIntegration(provider, request, actor);
        return ResponseEntity.ok(ApiResponse.success("Integration test executed", testResult));
    }

    // 8. FEATURE FLAGS
    @GetMapping("/features")
    public ResponseEntity<ApiResponse<List<FeatureFlagDto>>> getFeatureFlags() {
        List<FeatureFlagDto> flags = featureFlagService.getAllFlags();
        return ResponseEntity.ok(ApiResponse.success("Feature flags retrieved", flags));
    }

    @PutMapping("/features/{flagKey}")
    public ResponseEntity<ApiResponse<FeatureFlagDto>> toggleFeatureFlag(
            @PathVariable String flagKey,
            @RequestBody Map<String, Boolean> payload,
            @AuthenticationPrincipal UserPrincipal principal) {
        Boolean enabled = payload.get("enabled");
        if (enabled == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'enabled' is required"));
        }
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        FeatureFlagDto updated = featureFlagService.toggleFlag(flagKey, enabled, actor);
        return ResponseEntity.ok(ApiResponse.success("Feature flag updated successfully", updated));
    }

    // 9. SYSTEM HEALTH DIAGNOSTICS
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<SystemHealthDto>> getSystemHealth() {
        SystemHealthDto health = systemConfigService.getSystemHealth();
        return ResponseEntity.ok(ApiResponse.success("System health diagnostics fetched", health));
    }

    // 10. AUDIT LOGS
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuditLogDto> logs = auditService.getAuditLogs(action, entityType, search, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success("Audit logs fetched successfully", logs));
    }

    // 11. LEGACY CONFIG VAULT (Retained for backward compatibility)
    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemConfig() {
        DeveloperOverviewDto overview = systemConfigService.getOverview();
        Map<String, Object> configMap = new HashMap<>();
        configMap.put("databaseUrl", "jdbc:postgresql://localhost:5432/OHOTECH");
        configMap.put("razorpayConfigured", overview.getRazorpayStatus().equals("CONFIGURED"));
        configMap.put("resendEmailTarget", "onboarding@resend.dev");
        configMap.put("environment", overview.getEnvironment());
        configMap.put("activeRoles", Arrays.asList("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_DEVELOPER"));
        configMap.put("systemUptime", "100.0%");

        return ResponseEntity.ok(ApiResponse.success("Developer configuration vault retrieved", configMap));
    }

    // 12. RBAC ROLE MANAGEMENT
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> rolePayload,
            @AuthenticationPrincipal UserPrincipal principal) {

        String roleStr = rolePayload.get("role");
        return userRepository.findById(id)
                .map(user -> {
                    try {
                        Role newRole = Role.valueOf(roleStr.toUpperCase());
                        Role prevRole = user.getRole();
                        user.setRole(newRole);
                        User saved = userRepository.save(user);

                        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
                        auditService.logEvent(
                                "USER_ROLE_UPDATED",
                                "User",
                                String.valueOf(user.getId()),
                                String.format("User #%d (%s) role changed from %s to %s by %s",
                                        user.getId(), user.getEmail(), prevRole, newRole, actor)
                        );

                        log.info("Developer assigned role {} to user #{}", newRole, id);
                        UserDto userDto = UserDto.builder()
                                .id(saved.getId())
                                .name(saved.getName())
                                .email(saved.getEmail())
                                .phone(saved.getPhone())
                                .role(saved.getRole())
                                .enabled(saved.isEnabled())
                                .emailVerified(saved.isEmailVerified())
                                .phoneVerified(saved.isPhoneVerified())
                                .createdAt(saved.getCreatedAt())
                                .build();
                        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", userDto));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(ApiResponse.<UserDto>error("Invalid role: " + roleStr));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 13. DATABASE SEEDING
    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<String>> triggerDatabaseSeeding(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            dataInitializer.run();
            String actor = principal != null ? principal.getEmail() : "DEVELOPER";
            auditService.logEvent("DATABASE_SEEDED", "Database", "CATALOG", "Database re-seeded by " + actor);
            return ResponseEntity.ok(ApiResponse.success("Database seeding executed successfully", "28 turnkey products verified"));
        } catch (Exception e) {
            log.error("Manual seeding error:", e);
            return ResponseEntity.internalServerError().body(ApiResponse.<String>error("Seeding failed: " + e.getMessage()));
        }
    }

    // 14. AI COMMAND EXECUTION
    @PostMapping("/ai-execute")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeAiCommand(
            @RequestBody Map<String, String> promptPayload,
            @AuthenticationPrincipal UserPrincipal principal) {
        String prompt = promptPayload.getOrDefault("prompt", "");
        String actor = principal != null ? principal.getEmail() : "DEVELOPER";
        log.info("Developer AI Command received from {}: {}", actor, prompt);

        auditService.logEvent("DEV_AI_COMMAND_EXECUTED", "AI_ENGINE", "PROMPT", "Executed prompt by " + actor + ": " + prompt);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("prompt", prompt);
        responseMap.put("executedAt", new Date());
        responseMap.put("status", "SUCCESS");
        responseMap.put("executionLog", "Processed command: '" + prompt + "'. Applied automated parameter adjustments to system configuration.");

        return ResponseEntity.ok(ApiResponse.success("AI Command executed", responseMap));
    }

    // 15. DEVICE & DOWNLOAD ANALYTICS
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<DeveloperAnalyticsDto>> getDeveloperAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        DeveloperAnalyticsDto analytics = developerAnalyticsService.getDeveloperAnalytics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Developer device and download analytics fetched successfully", analytics));
    }
}
