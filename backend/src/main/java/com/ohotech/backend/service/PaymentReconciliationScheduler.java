package com.ohotech.backend.service;

import com.ohotech.backend.dto.PaymentReconciliationReportDto;
import com.ohotech.backend.entity.PaymentReconciliationLog;
import com.ohotech.backend.repository.PaymentReconciliationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentReconciliationScheduler {

    private final PaymentService paymentService;
    private final PaymentReconciliationLogRepository reconciliationLogRepository;
    private final AuditService auditService;

    @Value("${app.payment.reconciliation.enabled:true}")
    private boolean reconciliationEnabled;

    /**
     * Nightly automated payment reconciliation cron.
     * Scheduled for 02:00 AM IST (Asia/Kolkata).
     */
    @Scheduled(cron = "${app.payment.reconciliation.cron:0 0 2 * * ?}", zone = "Asia/Kolkata")
    public void runNightlyPaymentReconciliation() {
        if (!reconciliationEnabled) {
            log.info("Nightly payment reconciliation is disabled by configuration");
            return;
        }

        log.info("==================================================================");
        log.info("  STARTING AUTOMATED NIGHTLY PAYMENT RECONCILIATION AUDIT (IST)   ");
        log.info("==================================================================");

        try {
            PaymentReconciliationReportDto report = paymentService.generateReconciliationReport();

            String status = report.getAnomalyCount() > 0 ? "DISCREPANCIES_DETECTED" : "CLEAN";

            StringBuilder summary = new StringBuilder();
            if (report.getAnomalies() != null) {
                for (var a : report.getAnomalies()) {
                    summary.append(String.format("[%s] Order #%s, Payment #%s, Amount: %s - %s\n",
                            a.getAnomalyType(), a.getOrderId(), a.getPaymentId(), a.getRecordedAmount(), a.getRecommendation()));
                }
            }

            PaymentReconciliationLog logEntry = PaymentReconciliationLog.builder()
                    .executedAt(LocalDateTime.now())
                    .totalEvaluated(report.getTotalRecordsEvaluated())
                    .matchedCount(report.getMatchedCount())
                    .anomalyCount(report.getAnomalyCount())
                    .status(status)
                    .triggeredBy("SCHEDULED_CRON")
                    .anomaliesSummary(summary.toString())
                    .build();

            reconciliationLogRepository.save(logEntry);

            auditService.logEvent("PAYMENT_RECONCILIATION_RUN", "PaymentReconciliationLog",
                    String.valueOf(logEntry.getId()),
                    String.format("Nightly reconciliation completed. Evaluated: %d, Matched: %d, Anomalies: %d [%s]",
                            report.getTotalRecordsEvaluated(), report.getMatchedCount(), report.getAnomalyCount(), status));

            if (report.getAnomalyCount() > 0) {
                log.warn("Reconciliation detected {} anomalies! Review discrepancies in Admin Transaction Operations Center.", report.getAnomalyCount());
            } else {
                log.info("Reconciliation passed with zero anomalies across {} records.", report.getTotalRecordsEvaluated());
            }

        } catch (Exception e) {
            log.error("Fatal error during nightly payment reconciliation: {}", e.getMessage(), e);
        }
    }
}
