package com.ohotech.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_reconciliation_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentReconciliationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime executedAt;

    private int totalEvaluated;
    private int matchedCount;
    private int anomalyCount;

    @Column(length = 50)
    private String status; // "CLEAN" or "DISCREPANCIES_DETECTED"

    @Column(length = 50)
    private String triggeredBy; // "SCHEDULED_CRON" or "ADMIN_MANUAL"

    @Column(columnDefinition = "TEXT")
    private String anomaliesSummary;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (executedAt == null) {
            executedAt = LocalDateTime.now();
        }
    }
}
