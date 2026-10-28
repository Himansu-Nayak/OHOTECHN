package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionOverviewDto {
    private LocalDateTime generatedAt;
    private String period; // "ALL", "30D", "7D", "24H", "CUSTOM"
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;

    private long totalTransactions;
    private BigDecimal totalVolume; // Gross successful volume

    private long successfulCount;
    private BigDecimal successfulAmount;

    private long pendingCount;
    private BigDecimal pendingAmount;

    private long failedCount;
    private BigDecimal failedAmount;

    private long refundedCount;
    private BigDecimal refundedAmount;

    private long reconciliationDiscrepancies;
    private long webhookFailures;
    private long entitlementFailures;
}
