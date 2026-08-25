package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUpDashboardDto {
    private List<LeadFollowUpDto> todayFollowUps;
    private List<LeadFollowUpDto> overdueFollowUps;
    private List<LeadFollowUpDto> upcomingFollowUps;
    private long todayCount;
    private long overdueCount;
    private long upcomingCount;
}
