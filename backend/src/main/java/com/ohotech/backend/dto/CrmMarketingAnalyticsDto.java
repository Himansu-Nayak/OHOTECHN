package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LeadSource;
import com.ohotech.backend.entity.LeadStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrmMarketingAnalyticsDto {

    private long totalLeads;
    private Map<String, Long> leadsBySource;
    private Map<String, Long> leadsByStatus;
    private Map<String, Long> leadsByCampaign;
    private Map<String, Double> conversionRateBySource;
    private Map<String, BigDecimal> revenueBySource;
}
