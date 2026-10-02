package com.ohotech.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentGatewayDto {
    private String providerId;
    private String name;
    private String status; // IMPLEMENTED, CONFIGURED, CONNECTED, TEST_MODE, LIVE_MODE, DISABLED, ERROR, NOT_CONFIGURED
    private String environment; // "LIVE MODE", "TEST MODE", "NOT CONFIGURED", "INTEGRATION REQUIRED"
    private boolean implemented;
    private boolean configured;
    private boolean enabled;
    private List<String> supportedCurrencies;
    private List<String> supportedMethods;
    private String maskedKeyId;
    private LocalDateTime lastHealthCheckAt;
    private Long healthLatencyMs;
    private long successfulTransactions;
    private long failedTransactions;
    private BigDecimal totalVolume;
    private String webhookStatus; // "ACTIVE_SIGNATURE_VERIFIED", "UNCONFIGURED", "NOT_SUPPORTED"
}
