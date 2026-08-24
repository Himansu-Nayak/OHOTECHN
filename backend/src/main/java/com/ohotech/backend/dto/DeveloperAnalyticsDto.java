package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeveloperAnalyticsDto {

    private DeviceMetrics deviceMetrics;
    private DownloadMetrics downloadMetrics;
    private List<PlatformStat> platformStats;
    private List<ProductDownloadStat> productStats;
    private List<ReleaseDownloadStat> releaseStats;
    private List<RecentActivityItem> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceMetrics {
        private long totalActivations;
        private long activeDevices;
        private long deactivatedDevices;
        private long activationsToday;
        private long activationsThisMonth;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DownloadMetrics {
        private long totalDownloads;
        private long downloadsToday;
        private long downloadsThisMonth;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformStat {
        private String platform;
        private long activationCount;
        private long downloadCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDownloadStat {
        private Long productId;
        private String productName;
        private long downloadCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReleaseDownloadStat {
        private Long releaseId;
        private String productName;
        private String version;
        private String platform;
        private long downloadCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityItem {
        private Long id;
        private LocalDateTime timestamp;
        private String action;
        private String actorEmail;
        private String entityType;
        private String entityId;
        private String description;
    }
}
