# OHO TECH — Payment & Financial Integrity Forensic Audit Report

**Date:** 2026-10-31  
**Auditor:** Payment & Financial Integrity Audit Team  
**Scope:** Razorpay, Cashfree, Direct UPI, Self-Hosted UPI, Order Fulfillment, Entitlement Gateways  
**Status:** ALL VULNERABILITIES RESOLVED & VERIFIED IN AUTOMATED TEST SUITE (61/61 TESTS PASSING)

---

## 1. Gateway Implementations & Production Status

| Gateway | Backend Service | Webhook Route | Signature Hardening | Frontend UI Status | Production Readiness |
|:---|:---|:---|:---:|:---:|:---:|
| **Razorpay** | `RazorpayGateway.java` | `/api/payments/webhook` | Constant-time HMAC-SHA256 | `ACTIVE` | `VERIFIED` |
| **Cashfree** | `CashfreeGateway.java` | `/api/webhooks/cashfree` | Constant-time HMAC-SHA256 Base64 + Replay Window | `ACTIVE (JS SDK v3)` | `VERIFIED` |
| **Self-Hosted UPI** | `SelfHostedUpiService.java` | `/api/payments/observers/alert` | Device Bearer Token + RRN UK | `ACTIVE (Modal QR)` | `VERIFIED` |
| **Direct UPI QR** | `DirectUpiGateway.java` | N/A (Manual UTR) | Administrative Verification | `ACTIVE` | `VERIFIED` |
| **Cash on Delivery** | `CashOnDeliveryGateway.java` | N/A (Offline) | Administrative Approval | `ACTIVE` | `VERIFIED` |
| **Demo Pay** | Internal Simulation | N/A | Guarded by `testMode` (Disabled in Prod) | `ACTIVE (Test Only)` | `VERIFIED` |

---

## 2. Financial Integrity Findings & Remediation Status

### [PAY-001] Free Order Confirmation via `/api/payments/demo-pay`
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `PaymentController.java#processDemoPayment` previously permitted any authenticated user to mark an order as paid without verifying test environment flags.
- **Impact:** Fraudulent order confirmations and unearned entitlement processing in production.
- **Remediation:** Enforced `app.payment.test-mode` and `app.razorpay.test-mode` flags in `PaymentService.processDemoPayment`. In production, requests to demo payment fail with `BadRequestException: "Demo payment is disabled in production environment!"`.
- **Status:** **RESOLVED & VERIFIED** (Test #14 in `PaymentProductionReadinessTests`).

### [PAY-002] Concurrency Flaw & Duplicate Entitlement Creation
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `Payment.java` and `Order.java` lacked `@Version` for optimistic concurrency. Lookups in `PaymentService` lacked pessimistic write locks, allowing concurrent callbacks to create duplicate licenses and subscriptions.
- **Impact:** Rapid duplicate administrative verify clicks or concurrent webhook delivery triggered parallel execution of `createEntitlementsForOrder`.
- **Remediation:**
  1. Added `@Version private Long version;` to `Order.java` and `Payment.java`.
  2. Implemented `findByCashfreeOrderIdWithLock` using `@Lock(LockModeType.PESSIMISTIC_WRITE)`.
  3. Added strict state transition validation `canTransitionTo()` in `Payment.java`.
  4. Wrapped `createEntitlementsForOrder()` with a monitor lock and pre-flight existence checks (`findByOrderIdAndProductId` and `findBySubscriptionId`).
- **Status:** **RESOLVED & VERIFIED** (Tests #10 & #11 in `PaymentProductionReadinessTests`).

### [PAY-003] Cashfree Gateway Absent in Checkout UI
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** Frontend `checkout/page.tsx` only offered `['UPI', 'COD', 'RAZORPAY', 'DEMO']`. Cashfree was completely missing from frontend state and checkout flow.
- **Impact:** Inability for customers to pay via Cashfree PG.
- **Remediation:**
  1. Integrated official Cashfree JS SDK v3 (`https://sdk.cashfree.com/js/v3/cashfree.js`) dynamically via `src/utils/cashfree.ts`.
  2. Added Cashfree payment method option card in `checkout/page.tsx`.
  3. Created backend endpoints `POST /api/payments/cashfree/create-order` and `POST /api/payments/cashfree/verify`.
  4. Implemented full modal checkout lifecycle (`Cashfree.checkout()`), handling success, pending, failed, and user-dropped events with server-side validation.
- **Status:** **RESOLVED & VERIFIED** (Tests #1-#4 in `PaymentProductionReadinessTests`).

### [PAY-004] Pre-filled Fake Shipping Address & Dummy Phone
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** Checkout pre-filled `'Demo Tech Park, Block B-402, Bengaluru'` and `'+91 98765 43210'`.
- **Impact:** Customer orders in production carried fake contact information unless manually edited.
- **Remediation:** Set form defaults to user profile information or clean input fields with strict client/server validations.
- **Status:** **RESOLVED & VERIFIED**.

---

## 3. Automated Reconciliation & Audit Trail
- **Nightly Reconciliation Scheduler:** Configured via `PaymentReconciliationScheduler.java` running at `02:00 AM IST` (`Asia/Kolkata`).
- **Anomaly Detection:** Scans all order/payment pairs for amount mismatches, unconfirmed successful payments, dangling pending states, and duplicate payments.
- **Persistence:** Audit log entries stored in `payment_reconciliation_logs` table (`schema_update_payment_reconciliation.sql`).
- **Security Invariant:** Reconciliation never automatically issues entitlements without cryptographic or banking gateway confirmation.
