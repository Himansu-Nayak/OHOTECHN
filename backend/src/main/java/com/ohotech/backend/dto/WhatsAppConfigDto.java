package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppConfigDto {
    private boolean configured;
    private String providerName;
    private String businessContactNumber;
    private String phoneNumberId;
    private String apiUrl;
    private String defaultTemplate;
    private String webhookEndpoint;
    private boolean webhookConfigured;
    private long totalSent;
    private long totalDelivered;
    private long totalRead;
    private long totalFailed;
    private long totalOptedOut;
    private long totalConsented;
}
