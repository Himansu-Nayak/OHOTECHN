package com.ohotech.backend.dto.developer;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeveloperOverviewDto {
    private String applicationName;
    private String version;
    private String environment;
    private String backendStatus;
    private String databaseStatus;
    private String emailStatus;
    private String otpStatus;
    private String razorpayStatus;
    private String storageStatus;
    private String crmStatus;
    private String authStatus;
    private int activeFeatureFlagsCount;
    private int totalUsersCount;
    private int totalReleasesCount;
    private String lastConfigurationUpdate;
    private List<Map<String, Object>> recentActivity;
}
