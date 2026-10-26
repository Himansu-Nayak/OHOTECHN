# OHO TECH — Payment & Financial Integrity Forensic Audit Report

**Date:** 2026-10-14  
**Auditor:** Payment & Financial Integrity Audit Team  
**Scope:** Razorpay, Cashfree, Direct UPI, Order Fulfillment, Entitlement Gateways  

---

## 1. Gateway Implementations & Status

| Gateway | Backend Service | Webhook Route | Signature Hardening | Frontend UI Status |
|:---|:---|:---|:---:|:---:|
| **Razorpay** | `RazorpayGateway.java` | `/api/payments/webhook` | Constant-time HMAC-SHA256 | `ACTIVE` |
| **Cashfree** | `CashfreeGateway.java` | `/api/webhooks/cashfree` | Constant-time HMAC-SHA256 Base64 | `MISSING IN UI` |
| **Direct UPI QR** | `DirectUpiGateway.java` | N/A (Manual UTR) | Administrative Verification | `ACTIVE` |
| **Cash on Delivery** | `CashOnDeliveryGateway.java` | N/A (Offline) | Administrative Approval | `ACTIVE` |
| **Demo Pay** | Internal Simulation | N/A | None (Vulnerable to abuse) | `ACTIVE` |

---

## 2. Financial Integrity Findings

### [PAY-001] Free Order Confirmation via `/api/payments/demo-pay`
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `PaymentController.java#L43-L49` permits any user with `ROLE_CUSTOMER` to mark their order as paid with `"DEMO_GATEWAY"`.
- **Impact:** Fraudulent order confirmations and unearned entitlement processing.
- **Fix:** Restrict to dev/test environments only.

### [PAY-002] Concurrency Flaw & Duplicate Entitlement Creation
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `Payment.java` and `Order.java` lack `@Version` for optimistic concurrency. `PaymentService.adminVerifyPayment` does not obtain a pessimistic write lock.
- **Impact:** Rapid duplicate administrative verify clicks trigger concurrent runs of `createEntitlementsForOrder`, generating duplicate license keys and subscription records.
- **Fix:** Add `@Version` to `Order` and `Payment`. Acquire `LockModeType.PESSIMISTIC_WRITE` in `adminVerifyPayment`.

### [PAY-003] Cashfree Gateway Absent in Checkout UI
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** Frontend `checkout/page.tsx` only offers `['UPI', 'COD', 'RAZORPAY', 'DEMO']`. Cashfree is completely missing from frontend state and components.
- **Impact:** Commercial disconnect; Cashfree accounts cannot process customer transactions.
- **Fix:** Integrate Cashfree JS checkout SDK into `checkout/page.tsx`.

### [PAY-004] Pre-filled Fake Shipping Address & Dummy Phone
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** Checkout pre-fills `'Demo Tech Park, Block B-402, Bengaluru'` and `'+91 98765 43210'`.
- **Impact:** Customer orders in production carry fake contact information unless manually edited.
- **Fix:** Set defaults to empty strings with mandatory form validation.
