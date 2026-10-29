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
    private String phoneNumberId;
    private String apiUrl;
    private String defaultTemplate;
    private long totalSent;
    private long totalDelivered;
    private long totalRead;
    private long totalFailed;
}
