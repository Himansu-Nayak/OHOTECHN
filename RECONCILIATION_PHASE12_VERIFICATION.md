# OHO TECH — Phase 12: Automated Reconciliation Engine Verification

**Auditor:** Principal Payment Systems Architect & Independent Application Security Auditor  
**Date:** 2026-10-31  
**Scope:** Automated Nightly Reconciliation Scheduler, Anomaly Detection & Ledger Persistence  
**Overall Status:** **VERIFIED (Detective Controls Complete & Invariants Enforced)**  

---

## 1. Scheduler Configuration & Execution Architecture

### 1.1 Spring Boot Scheduling Configuration
- **Application Annotation:** `@EnableScheduling` is explicitly present on [`BackendApplication.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/BackendApplication.java#L10).
- **Scheduler Component:** [`PaymentReconciliationScheduler.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/PaymentReconciliationScheduler.java) is annotated with `@Component`.
- **Cron Expression:** `@Scheduled(cron = "${app.payment.reconciliation.cron:0 0 2 * * ?}", zone = "Asia/Kolkata")`
- **Execution Time:** Fires daily at **02:00:00 AM IST** (Indian Standard Time, UTC+05:30).
- **Environment Toggle:** Gated by `@Value("${app.payment.reconciliation.enabled:true}")`. Defaults to `true` in production.

---

## 2. Anomaly Detection & Classification Matrix

The engine (`PaymentService.generateReconciliationReport`) evaluates all recorded transactions against the following anomaly classifications:

| Anomaly Type | Condition Detected | Severity | Actionable Recommendation |
|:---|:---|:---:|:---|
| `AMOUNT_MISMATCH` | `payment.amount != order.totalAmount` | **Critical** | Flag for immediate finance review; customer charged incorrect amount. |
| `ORDER_PAYMENT_STATUS_MISMATCH` | `payment.status == SUCCESSFUL` but `order.status` is not `PAID`, `CONFIRMED`, or `REFUNDED` | **High** | Re-sync order state to match verified payment. |
| `PENDING_EXCEEDED_24H` | `payment.status == PENDING` and created > 24 hours ago | **Medium** | Mark as `FAILED` or cross-check bank statements for offline transfers. |
| `MISSING_ENTITLEMENT` | Order is paid/confirmed but 0 subscriptions or licenses exist | **High** | Software provisioning was interrupted; administrator can trigger manual re-provisioning. |
| `DUPLICATE_PAYMENT_FOR_ORDER` | More than 1 `SUCCESSFUL` payment recorded for a single order ID | **Critical** | Customer was double-charged; trigger gateway refund for duplicate transaction. |

---

## 3. Persistent Audit Logging & Administrative Visibility

### 3.1 Table Persistence
Reconciliation results are permanently recorded in PostgreSQL table `payment_reconciliation_logs` via [`PaymentReconciliationLog.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/PaymentReconciliationLog.java):
- `id`: Auto-incrementing primary key.
- `executed_at`: Timestamp of run completion.
- `total_evaluated`: Number of payment records audited.
- `matched_count`: Clean records with zero discrepancies.
- `anomaly_count`: Total anomalies identified.
- `status`: `CLEAN` (0 anomalies) or `DISCREPANCIES_DETECTED`.
- `triggered_by`: `SCHEDULED_CRON` or `MANUAL_ADMIN`.
- `anomalies_summary`: Human-readable text summary of all detected discrepancies.

### 3.2 Administrative Control
- Anomalies are surfaced to administrators via the Transaction Operations Center (`GET /api/admin/payments/reconciliation`).
- Administrators can review the anomaly ledger and execute targeted single-order reconciliation recovery via `TransactionOperationsService.recoverReconciliation(orderId, adminUserId)`.

---

## 4. Critical Security & Integrity Invariants

### 4.1 Zero-Grant Security Guard
**CRITICAL VERIFICATION:** The scheduled reconciliation engine operates strictly as an auditing/detective control. It **never automatically issues licenses or grants access** based on scheduler execution alone. Fulfillments require cryptographic signature verification from webhooks, direct authenticated gateway API confirmation, or explicit manual administrative recovery with an immutable audit log trail.

### 4.2 Multi-Instance / Clustered Scheduler Considerations
- In the current single-instance Hostinger VPS deployment, Spring's `@Scheduled` executes exactly once per night.
- For horizontal multi-instance scaling in future cloud setups, ShedLock or database leader locks should be added to prevent concurrent runs on duplicate worker nodes.

**Reconciliation Engine Verdict: VERIFIED (PASS)**
