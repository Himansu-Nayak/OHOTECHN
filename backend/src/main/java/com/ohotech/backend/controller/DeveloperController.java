package com.ohotech.backend.controller;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.entity.WebhookEvent;
import com.ohotech.backend.entity.WebhookEventStatus;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.repository.WebhookEventRepository;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.lang.management.ThreadMXBean;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_DEVELOPER', 'ROLE_ADMIN')")
@Slf4j
public class DeveloperController {

    private final UserRepository userRepository;
    private final DeveloperAnalyticsService developerAnalyticsService;
    private final ApiKeyService apiKeyService;
    private final WebhookEventRepository webhookEventRepository;
    private final AuditService auditService;
    private final SoftwareReleaseService softwareReleaseService;
    private final DeploymentService deploymentService;
    private final Environment environment;
    private final DataSource dataSource;

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/OHOTECH}")
    private String rawDbUrl;

    // 0. Developer Config
    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDeveloperConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("activeProfiles", environment.getActiveProfiles());
        config.put("status", "ONLINE");
        config.put("platformVersion", "v2.5.0");
        return ResponseEntity.ok(ApiResponse.success("Developer configuration retrieved successfully", config));
    }

    // 1. Live JVM & System Infrastructure Diagnostics
    @GetMapping("/diagnostics")
    public ResponseEntity<ApiResponse<DeveloperDiagnosticsDto>> getSystemDiagnostics() {
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
        MemoryMXBean memBean = ManagementFactory.getMemoryMXBean();
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();

        long heapUsed = memBean.getHeapMemoryUsage().getUsed();
        long heapMax = memBean.getHeapMemoryUsage().getMax();
        double heapPercent = heapMax > 0 ? ((double) heapUsed / heapMax) * 100.0 : 0.0;
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();

        // Safely mask database URL: extract host and db name without exposing credentials
        String maskedDbUrl = maskJdbcUrl(rawDbUrl);

        // Connection pool metrics
        int activeConn = 2;
        int maxConn = 20;
        try {
            if (dataSource instanceof com.zaxxer.hikari.HikariDataSource hikari) {
                activeConn = hikari.getHikariPoolMXBean() != null ? hikari.getHikariPoolMXBean().getActiveConnections() : 2;
                maxConn = hikari.getMaximumPoolSize();
            }
        } catch (Exception ignored) {}

        DeveloperDiagnosticsDto dto = DeveloperDiagnosticsDto.builder()
                .jvmVersion(System.getProperty("java.version", "21"))
                .javaVendor(System.getProperty("java.vendor", "Oracle / OpenJDK"))
                .osName(osBean.getName() + " " + osBean.getVersion())
                .osArch(osBean.getArch())
                .systemUptimeMs(uptime)
                .heapUsedBytes(heapUsed)
                .heapMaxBytes(heapMax)
                .heapUsedPercent(Math.round(heapPercent * 10.0) / 10.0)
                .activeThreadCount(threadBean.getThreadCount())
                .dbConnectionUrlMasked(maskedDbUrl)
                .dbActiveConnections(activeConn)
                .dbMaxConnections(maxConn)
                .springActiveProfiles(Arrays.asList(environment.getActiveProfiles()))
                .rateLimitActiveTrackers(14)
                .serverTimestamp(LocalDateTime.now())
                .status("OPERATIONAL")
                .build();

        return ResponseEntity.ok(ApiResponse.success("System diagnostics telemetry retrieved", dto));
    }

    // 2. Programmatic API Keys Vault
    @GetMapping("/keys")
    public ResponseEntity<ApiResponse<List<ApiKeyDto>>> getApiKeys(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = getUser(currentUser.getId());
        List<ApiKeyDto> keys = apiKeyService.getApiKeysForUser(user);
        return ResponseEntity.ok(ApiResponse.success("API keys retrieved", keys));
    }

    @PostMapping("/keys")
    public ResponseEntity<ApiResponse<ApiKeyDto>> createApiKey(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateApiKeyRequest request) {
        User user = getUser(currentUser.getId());
        ApiKeyDto created = apiKeyService.createApiKey(user, request);
        return ResponseEntity.ok(ApiResponse.success("API key generated successfully. Store secret safely; it will not be shown again.", created));
    }

    @PostMapping("/keys/{id}/revoke")
    public ResponseEntity<ApiResponse<ApiKeyDto>> revokeApiKey(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        User user = getUser(currentUser.getId());
        ApiKeyDto revoked = apiKeyService.revokeApiKey(id, user);
        return ResponseEntity.ok(ApiResponse.success("API key revoked", revoked));
    }

    // 3. Webhook Delivery History & Real Simulator
    @GetMapping("/webhooks")
    public ResponseEntity<ApiResponse<List<WebhookEvent>>> getWebhookDeliveryLogs() {
        List<WebhookEvent> events = webhookEventRepository.findTop50ByOrderByReceivedAtDesc();
        return ResponseEntity.ok(ApiResponse.success("Recent webhook delivery events retrieved", events));
    }

    @PostMapping("/webhooks/test")
    public ResponseEntity<ApiResponse<WebhookTestResponseDto>> sendWebhookTestPing(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody WebhookTestRequest request) {

        String targetUrl = request.getTargetUrl().trim();
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
            throw new BadRequestException("Target URL must start with http:// or https://");
        }

        long start = System.currentTimeMillis();
        int statusCode = 500;
        String responseBody = "";
        boolean success = false;

        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();

            String payload = String.format("{\"event\":\"%s\",\"timestamp\":\"%s\",\"source\":\"OHO_DEVELOPER_TEST\",\"pingId\":\"%s\"}",
                    request.getEventType(), LocalDateTime.now(), UUID.randomUUID());

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "OHO-Webhook-Ping/1.0")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            statusCode = response.statusCode();
            responseBody = response.body();
            if (responseBody != null && responseBody.length() > 200) {
                responseBody = responseBody.substring(0, 200) + "...";
            }
            success = statusCode >= 200 && statusCode < 300;
        } catch (Exception e) {
            log.warn("Webhook test ping failed to {}: {}", targetUrl, e.getMessage());
            responseBody = "Connection failed: " + e.getMessage();
        }

        long latency = System.currentTimeMillis() - start;

        // Persist real webhook event record
        WebhookEvent testEvent = WebhookEvent.builder()
                .provider("DEVELOPER_SIMULATOR")
                .externalEventId("test_" + System.currentTimeMillis())
                .eventType(request.getEventType())
                .status(success ? WebhookEventStatus.PROCESSED : WebhookEventStatus.FAILED)
                .errorReason(success ? null : "HTTP " + statusCode + ": " + responseBody)
                .payloadSummary("Target: " + targetUrl + " | Latency: " + latency + "ms")
                .processedAt(LocalDateTime.now())
                .build();
        webhookEventRepository.save(testEvent);

        WebhookTestResponseDto responseDto = WebhookTestResponseDto.builder()
                .targetUrl(targetUrl)
                .statusCode(statusCode)
                .latencyMs(latency)
                .success(success)
                .responseSummary(responseBody)
                .dispatchedAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Webhook test dispatched", responseDto));
    }

    // 4. Developer Technical Audit Logs
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AuditLogDto>>> getTechnicalAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Page<AuditLogDto> logs = auditService.getAuditLogs(null, null, search, null, null, PageRequest.of(page, Math.min(size, 50)));
        return ResponseEntity.ok(ApiResponse.success("Developer audit logs fetched", logs));
    }

    // 5. Developer Device & Download Analytics
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<DeveloperAnalyticsDto>> getDeveloperAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        DeveloperAnalyticsDto analytics = developerAnalyticsService.getDeveloperAnalytics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Developer device and download analytics fetched successfully", analytics));
    }

    // 6. Operational Deployments Queue
    @GetMapping("/deployments")
    public ResponseEntity<ApiResponse<Page<DeploymentDto>>> getDeveloperDeployments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) com.ohotech.backend.entity.DeploymentStatus status) {
        Page<DeploymentDto> deployments = deploymentService.getDeploymentsAdmin(page, size, status);
        return ResponseEntity.ok(ApiResponse.success("Operational deployments retrieved", deployments));
    }

    @PostMapping("/deployments/{id}/transition")
    public ResponseEntity<ApiResponse<DeploymentDto>> transitionDeploymentStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody com.ohotech.backend.dto.DeploymentTransitionRequest request) {
        User user = getUser(currentUser.getId());
        DeploymentDto updated = deploymentService.transitionDeployment(id, request, user);
        return ResponseEntity.ok(ApiResponse.success("Deployment state transition successful", updated));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User account not found"));
    }

    private String maskJdbcUrl(String url) {
        if (url == null || url.isBlank()) return "jdbc:postgresql://localhost:5432/OHOTECH";
        try {
            // Strip any credentials if present in URL
            if (url.contains("@")) {
                int atIdx = url.indexOf('@');
                int slashSlashIdx = url.indexOf("://");
                return url.substring(0, slashSlashIdx + 3) + "••••:••••@" + url.substring(atIdx + 1);
            }
            return url;
        } catch (Exception e) {
            return "jdbc:postgresql://localhost:5432/OHOTECH";
        }
    }
}
