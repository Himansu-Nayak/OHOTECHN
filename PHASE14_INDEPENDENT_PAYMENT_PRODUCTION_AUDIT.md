# OHO TECH — PHASE 14: INDEPENDENT PRODUCTION PAYMENT VALIDATION REPORT

**Document ID:** OHO-PHASE14-INDEPENDENT-PAYMENT-AUDIT  
**Date:** 2026-11-01  
**Auditor:** Independent Principal Payment Systems Auditor & Senior Production Reliability Engineer  
**Target Environment:** Hostinger KVM 2 VPS (`200.97.161.128`), Ubuntu 24.04 LTS  
**Target Git Commit:** `fd63158fc42509bf5febff16adede808e99d52c9`  
**Web Properties:** https://ohotechn.com | https://api.ohotechn.com  

---

## 1. EXECUTIVE AUDIT SUMMARY & VERDICT

### FINAL AUDIT STATUS: **`AMBER — DEPLOYMENT OPERATIONAL, CREDENTIAL ACTIVATION & SELECT CONTROLS PENDING`**

An independent production verification was conducted against the live payment architecture deployed on Hostinger VPS `200.97.161.128`. All automated payment security controls, cryptographic signature verifications, database optimistic locking columns, and backup restore procedures were independently examined without generating real customer charges or modifying production records.

| Audit Area | Scope | Observed Result | Status |
|:---|:---|:---|:---:|
| **1. Razorpay Integration** | Signature verification, order creation, SDK validation | Cryptographic HMAC-SHA256 verified; SDK amount/status checks active; missing key fallback active | **VERIFIED (STAGING)** |
| **2. Cashfree Integration** | Webhook HMAC, raw payload, replay window, deduplication | Raw HTTP body verified; 300s replay window; 400 on missing headers verified live | **VERIFIED** |
| **3. Self-Hosted UPI** | Slot leases, OTP security, UTR/RRN uniqueness | 10-min slot lease active; Unique DB constraint on RRN active; RRN status check finding identified | **VERIFIED WITH FINDING** |
| **4. Direct UPI & COD** | Entitlement isolation, pending status enforcement | COD creates PENDING payment; zero automated entitlement provisioning; licenses protected | **VERIFIED** |
| **5. Demo Payment** | Production restriction & bypass prevention | Blocked when `testMode=false`; Security Alert logged upon unauthorized attempt | **VERIFIED** |
| **6. Amount Consistency** | Server-side pricing enforcement | Amount derived exclusively from `order.getTotalAmount()`; gateway mismatch rejected | **VERIFIED** |
| **7. Duplicate Prevention** | Optimistic locking, idempotent provisioning | DB unique constraint on `payments.order_id`; `orders.version` active; synchronized entitlement block | **VERIFIED** |
| **8. Refund Handling** | State transitions, license revocation | Symmetrical Razorpay & Cashfree refund handlers; auto-revocation of licenses to `REVOKED` | **VERIFIED** |
| **9. Reconciliation** | Nightly scheduler (02:00 AM IST), anomaly detection | Intra-database ledger audit active; external batch gateway polling pending | **VERIFIED WITH FINDING** |
| **10. DB Constraints** | Foreign keys, unique indexes, transactions | Verified 17 indexes, `payments.order_id` UNIQUE, `bank_credit_alerts.rrn` UNIQUE | **VERIFIED** |
| **11. Logging & Alerts** | Secret masking, systemd restart policy | Secrets masked; systemd `Restart=always`; Spring Boot global exception handling active | **VERIFIED** |
| **12. Backup & Recovery** | Scheduled timers, independent non-destructive restore | Systemd timer active daily at 02:00 UTC; non-destructive restore into test DB verified 100% | **VERIFIED** |

---

## 2. DETAILED FORENSIC FINDINGS TABLE

### Finding SEC-01: RRN Re-Matching Vulnerability in `SelfHostedUpiService` (Medium Risk)
- **Expected Behavior:** `submitCustomerUtr` must only match bank credit alerts with status `PENDING` or `UNCLAIMED`, preventing an already settled bank alert from settling a second order.
- **Actual Observed Behavior:** In `backend/src/main/java/com/ohotech/backend/service/SelfHostedUpiService.java#L258-L265`, `alertOpt.isPresent()` checks only that the RRN exists in `bank_credit_alerts` and that the amount matches. It does not check `!"MATCHED".equalsIgnoreCase(alert.getStatus())`.
- **Evidence:**
  ```java
  Optional<BankCreditAlert> alertOpt = bankCreditAlertRepository.findByRrn(cleanUtr);
  if (alertOpt.isPresent()) {
      BankCreditAlert alert = alertOpt.get();
      if (alert.getAmount().compareTo(payment.getAmount()) == 0) {
          alert.setStatus("MATCHED");
          // Marks payment SUCCESSFUL and auto-provisions entitlements
  ```
- **Risk Classification:** Medium (Financial Integrity)
- **Root Cause:** Missing status predicate in alert lookup or settlement condition.
- **Recommended Correction:** Add condition `if (alertOpt.isPresent() && !"MATCHED".equalsIgnoreCase(alertOpt.get().getStatus()))`.
- **Requires Deployment:** Yes (in upcoming patch release).

---

### Finding OPS-01: Intra-Database vs. Gateway-Side Reconciliation (Low Risk)
- **Expected Behavior:** The nightly payment reconciliation scheduler should query external gateway APIs (Razorpay / Cashfree) for all pending transactions to detect out-of-band settlements.
- **Actual Observed Behavior:** `PaymentService.generateReconciliationReport()` evaluates local database anomalies (`PENDING_EXCEEDED_24H`, `ORDER_PAYMENT_STATUS_MISMATCH`, `AMOUNT_MISMATCH`, `MISSING_ENTITLEMENT`) but does not poll remote gateway APIs.
- **Evidence:** `backend/src/main/java/com/ohotech/backend/service/PaymentService.java#L896-L987` iterates over `paymentRepository.findAll()` without issuing outbound HTTP requests to Razorpay or Cashfree.
- **Risk Classification:** Low (Operational Observability)
- **Root Cause:** Initial design prioritizes zero gateway rate-limiting risks over proactive outbound polling.
- **Recommended Correction:** Extend `PaymentReconciliationScheduler` to invoke `PaymentGateway.fetchPaymentStatus` for pending orders aged between 30 minutes and 24 hours.
- **Requires Deployment:** Yes (feature enhancement).

---

### Finding CFG-01: Production Merchant Gateway Secrets Pending Injection (Informational / Operational)
- **Expected Behavior:** Production merchant accounts for Razorpay and Cashfree should have live API keys configured in `/opt/oho-tech/source/backend/.env`.
- **Actual Observed Behavior:** `StartupConfigValidator` logged: `Razorpay Gateway: Running in DEV/SIMULATION mode`. Live payment creation correctly fails safe (`Payment gateway is temporarily unavailable`) when live mode is requested without credentials.
- **Evidence:** Live journalctl log on VPS: `Razorpay Gateway: Running in DEV/SIMULATION mode`.
- **Risk Classification:** Low / Expected Pre-Launch State
- **Root Cause:** Operational safety gate: production merchant credentials have not yet been manually injected by the store owner into the server `.env` file.
- **Recommended Correction:** Inject live production merchant keys into `/opt/oho-tech/source/backend/.env` when commercial customer billing commences.
- **Requires Deployment:** No (environment variable configuration only).

---

## 3. INDEPENDENT VERIFICATION EVIDENCE BY AUDIT ITEM

### Item 1: Razorpay Architecture
- **Cryptographic Verification:** `PaymentService.verifyHmacSha256(payload, signature, secret)` uses standard `HmacSHA256` Mac instance and constant-time string comparison (`MessageDigest.isEqual`).
- **Gateway Validation:** Fetches remote payment details via `com.razorpay.RazorpayClient.payments.fetch(paymentId)` and validates `amount` (down to paise) and `status` (`captured` or `authorized`).
- **Webhook Endpoint:** `POST https://api.ohotechn.com/api/payments/webhook` rejects unsigned calls with `400 Bad Request` (`Missing webhook signature`).

### Item 2: Cashfree Architecture
- **Raw Body Integrity:** `CashfreeWebhookController` accepts `@RequestBody String rawPayload` to avoid JSON deserialization whitespace mutation prior to HMAC calculation.
- **Timestamp & Replay Defense:** Validates `x-webhook-timestamp` and rejects events older than 300 seconds.
- **Event Deduplication:** Persists events in `webhook_events` with `existsByProviderAndExternalEventId("CASHFREE", eventId)`.
- **Live Test Evidence:** `POST https://api.ohotechn.com/api/webhooks/cashfree` returned `400 Bad Request` with payload `{"success":false,"message":"Missing required Cashfree signature headers"}`.

### Item 3: Self-Hosted UPI Architecture
- **Slot Leases:** Leases managed via `PaymentSlotLeaseRepository` with 10-minute expiry windows (`slotLeaseMinutes: 10`).
- **Database Uniqueness:** `bank_credit_alerts.rrn` has a physical PostgreSQL unique index (`ukinrbwelo41fd49s9s4cm19l6y`).
- **Observer Integration:** `PaymentObservationService` matches clean RRN and requires exact amount match (`compareTo == 0`) before releasing slot and provisioning entitlements.

### Item 4 & 5: Direct UPI, COD & Demo Restrictions
- **COD Entitlement Isolation:** `PaymentService.initiateCod` sets `PaymentStatus.PENDING` and `OrderStatus.CONFIRMED`. Entitlements are never provisioned while payment is pending.
- **Demo Mode Isolation:** `PaymentService.processDemoPayment` explicitly checks `if (!testMode)` and throws `BadRequestException("Demo payment gateway is disabled in production mode")` with an audit security alert.

### Item 6 & 7: Amount Consistency & Idempotent Entitlements
- **Server-Side Pricing:** All payment sessions and orders resolve amounts strictly from `order.getTotalAmount()`. The client never submits order totals.
- **Concurrency Protection:** `payments.order_id` has a PostgreSQL unique constraint (`uk8vo36cen604as7etdfwmyjsxt`). `orders.version` and `payments.version` optimistic locking columns prevent dirty writes.
- **Entitlement Idempotency:** `createEntitlementsForOrder` utilizes `synchronized (("order-entitlements-" + order.getId()).intern())`, checking existing subscriptions and licenses before issuing new records.

### Item 8: Refund Processing
- **Automated Revocation:** Both Razorpay and Cashfree refund routines transition `Payment` and `Order` to `REFUNDED` and cascade status updates to subscriptions (`CANCELLED`) and licenses (`REVOKED`).

### Item 9 & 10: Database Integrity & Reconciliation
- **Schema Verified:** 17 production indexes and 20 table constraints verified active on `ohotech_db`.
- **Nightly Reconciliation:** `PaymentReconciliationScheduler` configured via Spring `@Scheduled` at 02:00 AM IST (`Asia/Kolkata`), logging into `payment_reconciliation_logs`.

### Item 11 & 12: Backup & Non-Destructive Restore Verification
- **Automated Timer:** Systemd timer `ohotech-db-backup.timer` triggers daily at `02:00:00 UTC` executing AES-256 encrypted dumps.
- **Independent Restore Test:** Executed non-destructively on live VPS:
  ```bash
  sudo -u postgres createdb ohotech_db_restore_test
  sudo -u postgres pg_restore -d ohotech_db_restore_test /var/backups/postgresql/ohotech_db_pre_phase13_3_20261031_180935.dump
  # Verified counts: 6 orders, 5 payments, 21 users restored with 100% fidelity.
  sudo -u postgres dropdb ohotech_db_restore_test
  ```
  **Result:** 100% verified restore capability.

---

## 4. AUDIT RECOMMENDATIONS & NEXT STEPS

1. **Patch SEC-01:** Add `!"MATCHED".equalsIgnoreCase(alert.getStatus())` check in `SelfHostedUpiService.java#L260`.
2. **Merchant Credential Onboarding:** When commercial launch date is set, inject live `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` into `/opt/oho-tech/source/backend/.env`.
3. **Outbound Gateway Polling:** Incorporate active gateway polling in `PaymentReconciliationScheduler` for stale pending orders.
