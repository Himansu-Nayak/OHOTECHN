package com.ohotech.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentGatewaySummaryDto {
    private BigDecimal totalPaymentVolume;
    private long successfulPayments;
    private long pendingPayments;
    private long failedPayments;
    private long refundedPayments;
    private int activeGatewayCount;
    private String environment; // "PRODUCTION (LIVE)" or "DEVELOPMENT (TEST)"
    private LocalDateTime lastSuccessfulTransactionAt;
    private LocalDateTime lastGatewayHealthCheckAt;
}
