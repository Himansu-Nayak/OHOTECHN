package com.ohotech.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeveloperDiagnosticsDto {
    private String jvmVersion;
    private String javaVendor;
    private String osName;
    private String osArch;
    private long systemUptimeMs;
    private long heapUsedBytes;
    private long heapMaxBytes;
    private double heapUsedPercent;
    private int activeThreadCount;
    private String dbConnectionUrlMasked;
    private int dbActiveConnections;
    private int dbMaxConnections;
    private List<String> springActiveProfiles;
    private int rateLimitActiveTrackers;
    private LocalDateTime serverTimestamp;
    private String status; // "OPERATIONAL"
}
