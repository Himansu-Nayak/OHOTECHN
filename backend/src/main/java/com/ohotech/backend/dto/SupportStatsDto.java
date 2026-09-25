package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportStatsDto {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long urgentTickets;
    private long resolvedToday;
    private long totalEnquiries;
    private long pendingEnquiries;
}
