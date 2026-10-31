# OHO TECH — Payment Gateway Production Readiness & Financial Integrity Audit Report

**Report Version:** 1.0.0-PROD-AUDIT  
**Date:** 2026-10-31  
**Audit Lead:** Senior Payment Systems Architect & Application Security Auditor  
**Repository:** `OHO TECH`  
**Target Infrastructure:** Hostinger Cloud VPS (`200.97.161.128`), PostgreSQL 18, Spring Boot 4.1 (`ohotech-backend.service`), Next.js 16 via PM2 (`oho_tech`)  
**Overall Readiness Verdict:** **PRODUCTION READY — VERIFIED**

---

## 1. Executive Summary

An exhaustive architectural investigation, implementation remediation, and automated security verification was executed across the entire multi-gateway payment subsystem of OHO TECH. All outstanding gateway integrations—specifically Cashfree PG, Razorpay, Self-Hosted UPI QR, Direct UPI Manual UTR, and Counter Billing—have been brought to production-grade financial integrity.

All 14 mission-critical payment failure, concurrency, and security scenarios were authored as automated regression tests in [`PaymentProductionReadinessTests.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/test/java/com/ohotech/backend/PaymentProductionReadinessTests.java). Together with existing test suites, **61 out of 61 payment tests pass with 0 failures and 0 errors**. Additionally, the frontend TypeScript static analysis (`npx tsc --noEmit`), ESLint (`npm run lint`), and full production build (`npm run build`) passed with 122/122 pages successfully prerendered.

---

## 2. Original Audit Findings & Forensic Diagnosis

Prior to this remediation, an architectural and security audit revealed four critical vulnerabilities that compromised financial integrity:

| Finding ID | Severity | Impact Summary | Root Cause |
|:---|:---:|:---|:---|
| **PAY-001** | **High** | Free order confirmation via `/api/payments/demo-pay` | `PaymentController.java` allowed any authenticated `ROLE_CUSTOMER` user to mark orders as paid without checking production environment flags. |
| **PAY-002** | **High** | Concurrent callbacks & duplicate entitlement creation | `Order.java` and `Payment.java` lacked `@Version` optimistic locking; `PaymentRepository` had no pessimistic locks; fulfillment was not idempotent, generating multiple licenses and subscriptions per payment. |
| **PAY-003** | **Medium** | Cashfree Gateway completely absent in Checkout UI | Frontend `checkout/page.tsx` lacked Cashfree SDK, configuration, and state handling; customer checkouts could only select Razorpay, UPI, or COD. |
| **PAY-004** | **Medium** | Pre-filled dummy shipping address and phone | Default state contained hardcoded mock address and phone, which risked polluting production fulfillment data. |

---

## 3. Implemented Fixes & Architectural Remediation

### Phase 1 & 2: Cashfree JS SDK & Server-Side Integration
1. **Dynamic Cashfree SDK Loader:**
   Created [`src/utils/cashfree.ts`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/src/utils/cashfree.ts) to load the official Cashfree JS SDK v3 (`https://sdk.cashfree.com/js/v3/cashfree.js`) dynamically on demand.
2. **Checkout UI Option Card:**
   Added the Cashfree payment method card to [`src/app/(marketing)/checkout/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/src/app/(marketing)/checkout/page.tsx), featuring active state styling, security badges, and responsive action handlers.
3. **Session Generation Backend:**
   Implemented `createCashfreePaymentSession` in [`PaymentService.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/PaymentService.java) and exposed `POST /api/payments/cashfree/create-order` in [`PaymentController.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/controller/PaymentController.java). Creates an order session using Cashfree PG APIs and persists a `PENDING` payment record.
4. **Server-Side Payment Verification:**
   Implemented `verifyCashfreePayment` in [`PaymentService.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/PaymentService.java) and exposed `POST /api/payments/cashfree/verify`. Verifies payment status directly against Cashfree REST APIs, validates amount/currency match, clears the customer's cart, and triggers idempotent software provisioning.
5. **Modal Lifecycle Handling:**
   Handled `SUCCESS`, `PENDING`, `FAILED`, and `USER_DROPPED` callbacks from `Cashfree.checkout()`, ensuring user cancellation records a failed payment without downgrading the order, leaving it ready for retry.

### Phase 3: Financial Integrity & Concurrency Controls
1. **Optimistic Locking (`PAY-002`):**
   Added `@Version private Long version;` to both [`Order.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/Order.java) and [`Payment.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/Payment.java) to detect and block concurrent write collisions.
2. **Pessimistic Row Locking:**
   Added `@Lock(LockModeType.PESSIMISTIC_WRITE)` query `findByCashfreeOrderIdWithLock` to [`PaymentRepository.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/repository/PaymentRepository.java) to serialize rapid concurrent webhook callbacks.
3. **Strict Payment State Machine:**
   Implemented `canTransitionTo(PaymentStatus newStatus)` in [`Payment.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/Payment.java). Terminal states (`SUCCESSFUL`, `REFUNDED`) are permanently locked and cannot be overridden by delayed failure callbacks or user drops.
4. **Idempotent Entitlement Provisioning:**
   Synchronized `createEntitlementsForOrder()` by order ID and added pre-flight deduplication queries (`findByOrderIdAndProductId` and `findBySubscriptionId`). Repeated calls return the existing license without re-minting software keys.
5. **Server-Side Pricing Invariant:**
   Order amounts are exclusively read from `Order.totalAmount` in PostgreSQL. Client-supplied price payloads are completely disregarded.

### Phase 4: Production Security & Secret Isolation
1. **Cryptographic Webhook Signature Verification:**
   - **Cashfree:** Computes HMAC-SHA256 Base64 over `{timestamp}{rawBody}` using `cashfree.webhook-secret` and validates in constant time.
   - **Razorpay:** Computes HMAC-SHA256 over `{order_id}|{payment_id}` using `razorpay.webhook-secret`.
2. **Webhook Replay Protection:**
   Cashfree webhook timestamps are verified with a 300,000 ms (5-minute) drift tolerance (`verifyWebhookTimestamp`), rejecting expired or replayed events.
3. **Demo Payment Production Guard (`PAY-001`):**
   `processDemoPayment` checks `testMode` (configured via `app.payment.test-mode` / `app.razorpay.test-mode`). In production, it immediately rejects requests with HTTP 400.
4. **Cross-Customer Authorization Guard:**
   Both `createCashfreePaymentSession` and `verifyCashfreePayment` enforce `order.getUser().getId().equals(userId)`. Cross-customer manipulation attempts are rejected with HTTP 404.
5. **No Secret Leaks:**
   Zero gateway secrets or client secrets are exposed to the frontend or printed in plain text in logs.

### Phase 5: Automated Nightly Payment Reconciliation
1. **Scheduled Reconciliation Engine:**
   Created [`PaymentReconciliationScheduler.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/PaymentReconciliationScheduler.java) running automatically every night at `02:00 AM IST` (`Asia/Kolkata`) via `@Scheduled(cron = "${app.payment.reconciliation.cron:0 0 2 * * ?}", zone = "Asia/Kolkata")`.
2. **Discrepancy Detection & Classification:**
   Identifies:
   - `AMOUNT_MISMATCH`: Payment amount diverges from order total.
   - `UNCONFIRMED_SUCCESSFUL_PAYMENT`: Payment is successful but order remains pending.
   - `PENDING_TIMEOUT`: Payment has remained pending for over 24 hours.
   - `DUPLICATE_PAYMENT_FOR_ORDER`: Multiple payments recorded for the same order.
3. **Audit Trail Persistence:**
   Reconciliation outcomes are saved to [`PaymentReconciliationLog.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/PaymentReconciliationLog.java) and surfaced to administrators in the Transaction Operations Center.
4. **Zero-Grant Guard:**
   Reconciliation operates strictly as a detective control; it never automatically grants licenses without cryptographic proof of payment.

---

## 4. Modified & Created Artifacts

### Backend Codebase
- [`backend/src/main/java/com/ohotech/backend/controller/PaymentController.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/controller/PaymentController.java) — Added Cashfree session creation & verification endpoints.
- [`backend/src/main/java/com/ohotech/backend/service/PaymentService.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/PaymentService.java) — Cashfree session generation, verification logic, idempotency checks, demo pay guard, reconciliation report enhancements.
- [`backend/src/main/java/com/ohotech/backend/service/payment/CashfreeGateway.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/payment/CashfreeGateway.java) — Cashfree API calls, webhook signature & timestamp verification, test-mode health checks.
- [`backend/src/main/java/com/ohotech/backend/entity/Order.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/Order.java) — Added `@Version private Long version;` for optimistic locking.
- [`backend/src/main/java/com/ohotech/backend/entity/Payment.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/Payment.java) — Added `@Version private Long version;` and `canTransitionTo()` state validation.
- [`backend/src/main/java/com/ohotech/backend/repository/PaymentRepository.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/repository/PaymentRepository.java) — Added pessimistic lock query `findByCashfreeOrderIdWithLock`.
- [`backend/src/main/java/com/ohotech/backend/dto/CashfreeOrderResponseDto.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/dto/CashfreeOrderResponseDto.java) — DTO for Cashfree order creation session.
- [`backend/src/main/java/com/ohotech/backend/dto/CashfreeVerificationRequest.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/dto/CashfreeVerificationRequest.java) — DTO for payment verification payload.
- [`backend/src/main/java/com/ohotech/backend/dto/PaymentConfigDto.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/dto/PaymentConfigDto.java) — Added `cashfreeEnabled` and `cashfreeEnvironment`.
- [`backend/src/main/java/com/ohotech/backend/service/PaymentReconciliationScheduler.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/service/PaymentReconciliationScheduler.java) — Automated 2:00 AM IST cron job.
- [`backend/src/main/java/com/ohotech/backend/entity/PaymentReconciliationLog.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/entity/PaymentReconciliationLog.java) — JPA entity for reconciliation audit logs.
- [`backend/src/main/java/com/ohotech/backend/repository/PaymentReconciliationLogRepository.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/java/com/ohotech/backend/repository/PaymentReconciliationLogRepository.java) — Repository for audit logs.

### Frontend Codebase
- [`src/utils/cashfree.ts`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/src/utils/cashfree.ts) — Official Cashfree JS SDK v3 dynamic loader.
- [`src/app/(marketing)/checkout/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/src/app/(marketing)/checkout/page.tsx) — Cashfree payment card option, modal orchestration, cancellation handling.
- [`src/api/payments.ts`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/src/api/payments.ts) — Exported `createCashfreeOrderApi` and `verifyCashfreePaymentApi`.
- [`src/api/types/payment.types.ts`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/src/api/types/payment.types.ts) — TypeScript interfaces for Cashfree DTOs.

### Database Migrations
- [`backend/src/main/resources/schema_update_payment_reconciliation.sql`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/main/resources/schema_update_payment_reconciliation.sql) — PostgreSQL 18 migration adding `version` columns to `orders` and `payments`, creating `payment_reconciliation_logs` table and indexes.

---

## 5. Verification & Test Evidence

### 5.1 Fourteen Production Readiness Scenarios ([`PaymentProductionReadinessTests.java`](file:///c:/Users/himan/OneDrive/Desktop/oho_tech/backend/src/test/java/com/ohotech/backend/PaymentProductionReadinessTests.java))

| Test # | Scenario Tested | Mechanism | Verification Result |
|:---:|:---|:---|:---:|
| **1** | Successful Cashfree Payment Session & Verification | MockMvc `POST /cashfree/create-order` + `POST /cashfree/verify` | **PASSED** (Payment SUCCESSFUL, Order CONFIRMED, License generated) |
| **2** | Failed Payment Webhook Handling | MockMvc `POST /api/webhooks/cashfree` (PAYMENT_FAILED_WEBHOOK) | **PASSED** (Payment marked FAILED, Order remains PENDING for retry) |
| **3** | Pending Payment Initiation | MockMvc `POST /cashfree/create-order` | **PASSED** (Payment PENDING, correct server amount returned) |
| **4** | Cancelled / User Dropped Checkout | MockMvc `POST /api/webhooks/cashfree` (PAYMENT_USER_DROPPED_WEBHOOK) | **PASSED** (Payment marked FAILED with reason "User closed modal") |
| **5** | Duplicate Webhook Delivery Idempotency | MockMvc duplicate delivery of identical Cashfree webhook | **PASSED** (First: SUCCESS, Second: ALREADY_PROCESSED) |
| **6** | Invalid Webhook Signature Rejection | MockMvc forged signature payload | **PASSED** (HTTP 400 Bad Request returned, event dropped) |
| **7** | Incorrect Payment Amount Rejection | MockMvc webhook reporting ₹100 instead of ₹15,000 | **PASSED** (HTTP 400 Bad Request, tampering prevented) |
| **8** | Incorrect Currency Verification | Entity & DTO currency assertion on non-INR currency | **PASSED** (Currency must match INR) |
| **9** | Cross-Customer Order Access Rejection | Customer B attempts to initiate/verify Customer A's order | **PASSED** (HTTP 404 Not Found returned for both endpoints) |
| **10** | Concurrent Payment Callbacks Isolation | Rapid successive webhook calls for same order | **PASSED** (Exactly one SUCCESSFUL payment, 0 duplicate updates) |
| **11** | Duplicate Entitlement Prevention | `createEntitlementsForOrder` invoked repeatedly | **PASSED** (Exactly 1 subscription and 1 license created) |
| **12** | Refund Processing & Entitlement Revocation | MockMvc `POST /api/admin/payments/{id}/refund` | **PASSED** (Subscription CANCELLED, License REVOKED) |
| **13** | Reconciliation Discrepancy Detection | MockMvc `GET /api/admin/payments/reconciliation` | **PASSED** (Detected amount mismatch and pending anomalies) |
| **14** | Demo Payment Production Guard | MockMvc `POST /api/payments/demo-pay` in test mode | **PASSED** (Rejects in production mode, allowed in test mode) |

**Maven Surefire Execution Output:**
```
[INFO] Running com.ohotech.backend.PaymentProductionReadinessTests
[INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 20.65 s
[INFO] BUILD SUCCESS
```

### 5.2 Full Payment Regression Suite
```
- CashfreeWebhookIntegrationTests:  15 tests, 0 failures, 0 errors (PASS)
- PaymentGatewaySecurityTests:       19 tests, 0 failures, 0 errors (PASS)
- SelfHostedUpiPaymentTests:         13 tests, 0 failures, 0 errors (PASS)
- PaymentProductionReadinessTests:   14 tests, 0 failures, 0 errors (PASS)
========================================================================
Total Payment Test Suite:            61 tests, 0 failures, 0 errors (100% PASS)
```

### 5.3 Frontend Quality Gates
- **TypeScript Static Check (`npx tsc --noEmit`):** 0 errors, exited `0`.
- **ESLint Linting (`npm run lint -- --quiet`):** 0 errors, 0 warnings, exited `0`.
- **Production Build (`npm run build`):** 122/122 pages prerendered successfully, exited `0`.

---

## 6. Remaining Risks & Operational Safeguards

1. **Third-Party Cashfree Webhook Outages:**
   If Cashfree's webhook delivery system experiences downtime, customer checkouts are not blocked because the frontend checkout invokes client-side server verification (`verifyCashfreePaymentApi`) immediately upon modal close. Webhook acts as a reliable asynchronous fallback.
2. **Clock Drift on Hostinger VPS:**
   The Cashfree replay protection allows 300 seconds (5 minutes) of clock drift. Ensure NTP/chrony synchronization is enabled on the VPS:
   ```bash
   sudo timedatectl set-ntp true
   timedatectl status
   ```
3. **Database Migration Synchronization:**
   The `version` columns on `orders` and `payments` must be applied before restarting backend services to ensure Hibernate does not encounter schema discrepancies.

---

## 7. Production Configuration Checklist

Before activating Cashfree live in production, configure the following environment variables in `/etc/systemd/system/ohotech-backend.service.d/override.conf` or the VPS `.env`:

```ini
# Cashfree Production Credentials
CASHFREE_CLIENT_ID=CF_PROD_YOUR_ACTUAL_CLIENT_ID
CASHFREE_CLIENT_SECRET=CF_PROD_YOUR_ACTUAL_CLIENT_SECRET
CASHFREE_WEBHOOK_SECRET=CF_PROD_YOUR_ACTUAL_WEBHOOK_SECRET
CASHFREE_ENVIRONMENT=PRODUCTION
CASHFREE_API_VERSION=2025-01-01
APP_PAYMENT_CASHFREE_ENABLED=true

# Production Security Flags
APP_PAYMENT_TEST_MODE=false
APP_RAZORPAY_TEST_MODE=false

# Reconciliation Configuration
APP_PAYMENT_RECONCILIATION_ENABLED=true
APP_PAYMENT_RECONCILIATION_CRON=0 0 2 * * ?
```

In the Cashfree Merchant Dashboard (`https://merchant.cashfree.com`):
- Webhook URL: `https://ohotechn.com/api/webhooks/cashfree`
- Webhook API Version: `2025-01-01`
- Subscribed Events: `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `PAYMENT_USER_DROPPED_WEBHOOK`

---

## 8. Deployment & Rollback Instructions

### 8.1 Database Migration (Step 1)
Connect to PostgreSQL 18 on the Hostinger VPS and execute:
```bash
sudo -u postgres psql -d ohotech_db -f backend/src/main/resources/schema_update_payment_reconciliation.sql
```

### 8.2 Backend Deployment (Step 2)
```bash
cd /opt/ohotech/backend
git pull origin feat/phase3-architecture-modernization
./mvnw clean package -DskipTests
sudo systemctl daemon-reload
sudo systemctl restart ohotech-backend.service
sudo journalctl -u ohotech-backend.service -f -n 50
```

### 8.3 Frontend Deployment (Step 3)
```bash
cd /opt/ohotech/frontend
git pull origin feat/phase3-architecture-modernization
npm install
npm run build
pm2 restart oho_tech
pm2 logs oho_tech --lines 30
```

### 8.4 Rollback Procedure
If any unexpected issues arise:
1. **Frontend:**
   Set `APP_PAYMENT_CASHFREE_ENABLED=false` or rollback frontend build:
   ```bash
   git revert HEAD
   npm run build && pm2 restart oho_tech
   ```
2. **Backend:**
   Disable Cashfree dynamically via environment configuration without redeploying:
   ```bash
   sudo systemctl set-environment APP_PAYMENT_CASHFREE_ENABLED=false
   sudo systemctl restart ohotech-backend.service
   ```
3. The database migration is strictly additive (`ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`), meaning older backend code remains 100% backward-compatible without requiring database rollback.
