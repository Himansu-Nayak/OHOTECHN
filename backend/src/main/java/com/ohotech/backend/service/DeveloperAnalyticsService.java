package com.ohotech.backend.service;

import com.ohotech.backend.dto.DeveloperAnalyticsDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeveloperAnalyticsService {

    private final DeviceActivationRepository deviceActivationRepository;
    private final SoftwareReleaseRepository softwareReleaseRepository;
    private final AuditLogRepository auditLogRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DeveloperAnalyticsDto getDeveloperAnalytics(LocalDate startDate, LocalDate endDate) {
        // Server-side date range validation
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        // Enforce maximum 365 days range limit to prevent expensive database operations
        if (ChronoUnit.DAYS.between(start, end) > 365) {
            start = end.minusDays(365);
        }

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        // 1. Device Metrics
        List<DeviceActivation> allDevices = deviceActivationRepository.findAll();
        long totalActivations = allDevices.size();
        long activeDevices = allDevices.stream().filter(DeviceActivation::isActive).count();
        long deactivatedDevices = totalActivations - activeDevices;

        long activationsToday = allDevices.stream()
                .filter(d -> d.getActivatedAt() != null && d.getActivatedAt().isAfter(todayStart))
                .count();
        long activationsThisMonth = allDevices.stream()
                .filter(d -> d.getActivatedAt() != null && d.getActivatedAt().isAfter(monthStart))
                .count();

        DeveloperAnalyticsDto.DeviceMetrics deviceMetrics = DeveloperAnalyticsDto.DeviceMetrics.builder()
                .totalActivations(totalActivations)
                .activeDevices(activeDevices)
                .deactivatedDevices(deactivatedDevices)
                .activationsToday(activationsToday)
                .activationsThisMonth(activationsThisMonth)
                .build();

        // 2. Download Metrics from Audit Logs (Action: SOFTWARE_DOWNLOADED)
        List<AuditLog> allAuditLogs = auditLogRepository.findAll();
        List<AuditLog> downloadLogs = allAuditLogs.stream()
                .filter(a -> "SOFTWARE_DOWNLOADED".equalsIgnoreCase(a.getAction()))
                .toList();

        long totalDownloads = downloadLogs.size();
        long downloadsToday = downloadLogs.stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().isAfter(todayStart))
                .count();
        long downloadsThisMonth = downloadLogs.stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().isAfter(monthStart))
                .count();

        DeveloperAnalyticsDto.DownloadMetrics downloadMetrics = DeveloperAnalyticsDto.DownloadMetrics.builder()
                .totalDownloads(totalDownloads)
                .downloadsToday(downloadsToday)
                .downloadsThisMonth(downloadsThisMonth)
                .build();

        // 3. Platform Breakdown (Grouping devices by Operating System & releases by Platform)
        Map<String, Long> devicePlatformCounts = allDevices.stream()
                .filter(d -> d.getOperatingSystem() != null && !d.getOperatingSystem().isBlank())
                .collect(Collectors.groupingBy(d -> normalizePlatform(d.getOperatingSystem()), Collectors.counting()));

        List<SoftwareRelease> allReleases = softwareReleaseRepository.findAll();
        Map<String, Long> releasePlatformCounts = allReleases.stream()
                .filter(r -> r.getPlatform() != null)
                .collect(Collectors.groupingBy(r -> r.getPlatform().name(), Collectors.counting()));

        Set<String> allPlatforms = new HashSet<>();
        allPlatforms.addAll(devicePlatformCounts.keySet());
        allPlatforms.addAll(releasePlatformCounts.keySet());
        if (allPlatforms.isEmpty()) {
            allPlatforms.addAll(List.of("WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"));
        }

        List<DeveloperAnalyticsDto.PlatformStat> platformStats = allPlatforms.stream()
                .map(pf -> DeveloperAnalyticsDto.PlatformStat.builder()
                        .platform(pf)
                        .activationCount(devicePlatformCounts.getOrDefault(pf, 0L))
                        .downloadCount(releasePlatformCounts.getOrDefault(pf, 0L))
                        .build())
                .sorted(Comparator.comparingLong(DeveloperAnalyticsDto.PlatformStat::getActivationCount).reversed())
                .toList();

        // 4. Product Download Breakdown
        List<Product> products = productRepository.findAll();
        List<DeveloperAnalyticsDto.ProductDownloadStat> productStats = new ArrayList<>();

        for (Product prod : products) {
            long count = downloadLogs.stream()
                    .filter(a -> a.getDescription() != null && a.getDescription().contains(prod.getName()))
                    .count();
            productStats.add(DeveloperAnalyticsDto.ProductDownloadStat.builder()
                    .productId(prod.getId())
                    .productName(prod.getName())
                    .downloadCount(count)
                    .build());
        }
        productStats.sort(Comparator.comparingLong(DeveloperAnalyticsDto.ProductDownloadStat::getDownloadCount).reversed());

        // 5. Release Download Breakdown
        List<DeveloperAnalyticsDto.ReleaseDownloadStat> releaseStats = allReleases.stream()
                .map(rel -> {
                    long count = downloadLogs.stream()
                            .filter(a -> String.valueOf(rel.getId()).equals(a.getEntityId()))
                            .count();
                    return DeveloperAnalyticsDto.ReleaseDownloadStat.builder()
                            .releaseId(rel.getId())
                            .productName(rel.getProduct() != null ? rel.getProduct().getName() : "Unknown")
                            .version(rel.getVersion())
                            .platform(rel.getPlatform() != null ? rel.getPlatform().name() : "N/A")
                            .downloadCount(count)
                            .build();
                })
                .sorted(Comparator.comparingLong(DeveloperAnalyticsDto.ReleaseDownloadStat::getDownloadCount).reversed())
                .limit(10)
                .toList();

        // 6. Recent Technical Activity Logs
        List<String> techActions = List.of(
                "SOFTWARE_DOWNLOADED", "DEVICE_ACTIVATED", "DEVICE_DEACTIVATED",
                "LICENSE_ACTIVATED", "LICENSE_REVOKED", "LICENSE_SUSPENDED", "USER_REGISTERED"
        );

        List<DeveloperAnalyticsDto.RecentActivityItem> recentActivity = allAuditLogs.stream()
                .filter(a -> techActions.stream().anyMatch(act -> act.equalsIgnoreCase(a.getAction())))
                .sorted(Comparator.comparing(AuditLog::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(20)
                .map(a -> DeveloperAnalyticsDto.RecentActivityItem.builder()
                        .id(a.getId())
                        .timestamp(a.getCreatedAt())
                        .action(a.getAction())
                        .actorEmail(a.getActorEmail() != null ? a.getActorEmail() : "system")
                        .entityType(a.getEntityType())
                        .entityId(a.getEntityId())
                        .description(a.getDescription())
                        .build())
                .toList();

        return DeveloperAnalyticsDto.builder()
                .deviceMetrics(deviceMetrics)
                .downloadMetrics(downloadMetrics)
                .platformStats(platformStats)
                .productStats(productStats)
                .releaseStats(releaseStats)
                .recentActivity(recentActivity)
                .build();
    }

    private String normalizePlatform(String osName) {
        if (osName == null) return "OTHER";
        String lower = osName.toLowerCase();
        if (lower.contains("win")) return "WINDOWS";
        if (lower.contains("mac") || lower.contains("darwin") || lower.contains("ios")) return "MACOS";
        if (lower.contains("linux") || lower.contains("ubuntu")) return "LINUX";
        if (lower.contains("android")) return "ANDROID";
        return osName.toUpperCase();
    }
}
