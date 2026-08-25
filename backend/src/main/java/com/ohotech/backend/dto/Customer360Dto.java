package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer360Dto {
    private UserDto profile;
    private String companyName;

    // CRM Aggregation
    private List<LeadDto> leads;
    private List<LeadActivityDto> activities;
    private List<LeadFollowUpDto> followUps;
    private long totalLeadsCount;
    private String primaryCrmStatus;

    // Commerce Aggregation
    private List<OrderDto> orders;
    private long totalOrdersCount;
    private BigDecimal totalSpent;

    // Payment Aggregation
    private List<PaymentDto> payments;

    // Software & Subscription Aggregation
    private List<SubscriptionDto> subscriptions;
    private List<LicenseDto> licenses;
    private List<DeviceActivationDto> deviceActivations;
    private List<SoftwareReleaseDto> availableDownloads;

    // Business Timeline
    private List<TimelineEventDto> timeline;
}
