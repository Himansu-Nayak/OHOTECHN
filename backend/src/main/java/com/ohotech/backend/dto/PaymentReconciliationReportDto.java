package com.ohotech.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReconciliationReportDto {
    private LocalDateTime generatedAt;
    private int totalRecordsEvaluated;
    private int matchedCount;
    private int anomalyCount;
    private List<ReconciliationAnomalyDto> anomalies;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReconciliationAnomalyDto {
        private Long paymentId;
        private Long orderId;
        private String provider;
        private String gatewayOrderId;
        private String gatewayPaymentId;
        private BigDecimal recordedAmount;
        private String currentPaymentStatus;
        private String currentOrderStatus;
        private String anomalyType; // e.g. "PENDING_OVER_24H", "ORDER_PAYMENT_STATUS_MISMATCH", "UNLINKED_PAYMENT"
        private String recommendation;
        private LocalDateTime detectedAt;
    }
}
