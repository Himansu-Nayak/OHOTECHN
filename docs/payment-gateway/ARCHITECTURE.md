# OHO TECH — Self-Hosted UPI Checkout & Merchant Payment Operations
## Architecture Specification

**Status**: Verified & Active Implementation  
**Target Platform**: OHO TECH Internal Digital Commerce & Turnkey Software Platform  
**Reference Model**: Self-Hosted Merchant UPI Payment Gateway (Inspired by YouPI-PG Architecture)  
**Date**: October 2026  

---

## 1. Executive Summary

OHO TECH requires an internal, self-hosted, sovereign UPI checkout experience and merchant payment operations engine. Rather than redirecting institutional buyers and software customers to proprietary, fee-heavy external checkout portals, OHO TECH provisions a mobile-first, low-friction checkout directly on `ohotechn.com`.

This system provides:
1. **Self-Hosted Sovereign UPI Flow**: Direct-to-merchant VPA settlement with dynamic NPCI-compliant `upi://pay` URIs, dynamic QR codes, and native mobile intent links (GPay, PhonePe, Paytm, BHIM, Navi, Cred).
2. **Provider-Independent Phone OTP Verification**: WhatsApp Business API / SMS OTP delivery abstraction with cryptographically salted SHA-256 storage, brute-force throttling, resend cooldowns, and audit logging.
3. **Database-Backed Single-Active-Payment & Slot Queue**: Pessimistic row locking on orders to guarantee exactly one active payment session per order. An atomic FIFO lease slot manager prevents simultaneous credit ambiguity on direct receiving bank accounts.
4. **Layered Payment Verification**:
   - **Tier 1 (Authoritative Gateway)**: Direct API/Webhook signature verification (Razorpay / Cashfree) when enabled.
   - **Tier 2 (Observer Telemetry Ingestion)**: Authenticated observer ingestion for bank credit alerts (device bearer token, replay-resistant RRN deduplication, amount matching within lease windows).
   - **Tier 3 (Customer UTR Submission)**: Real-time UTR reconciliation with banking ledger validation.
   - **Tier 4 (Manual Reconciliation)**: Escalation to Admin Operations Center for ambiguous or mismatched amounts.
5. **Cash & Card Counter Billing (POS)**: In-person sales interface supporting cash change calculation, external card terminal authorization codes, and instant counter QR billing.

---

## 2. Component Architecture

```
                  +----------------------------------------------+
                  |         OHO TECH Next.js Frontend            |
                  |  - /checkout (Self-Hosted UPI & Dynamic QR)  |
                  |  - /admin/counter-billing (POS Terminal)     |
                  |  - /admin?tab=payments (Operations Center)   |
                  +-----------------------+----------------------+
                                          |
                              HTTPS REST API (JSON)
                                          |
                                          v
+--------------------------------------------------------------------------------+
|                        Spring Boot 3.x Backend Engine                          |
|                                                                                |
|  [Controllers]                                                                 |
|   - UpiCheckoutController (/api/payments/upi/...)                              |
|   - PhoneVerificationController (/api/auth/phone-otp/...)                     |
|   - PaymentObserverController (/api/payments/observers/...)                   |
|   - CounterBillingController (/api/admin/counter-billing/...)                 |
|                                                                                |
|  [Domain Services]                                                             |
|   - SelfHostedUpiService: URI formatting, lease slots, state machines         |
|   - OtpDeliveryService (Interface): WhatsAppOtpService & DevTestOtpService    |
|   - PaymentObservationService: Ingestion, RRN parsing, automated settlement   |
|   - CounterBillingService: Cash drawer calculation, cashier audits            |
|                                                                                |
|  [Repositories & Entities]                                                     |
|   - Payment, Order, PaymentSlotLease, ObserverDevice, BankCreditAlert, User    |
+---------------------------------------+----------------------------------------+
                                        |
                            PostgreSQL Database Engine
                      (ACID Transactions, Pessimistic Locking)
```

---

## 3. Payment State Lifecycle

```
    [INITIATED]
        │
        ▼
   [AWAITING_PAYMENT] ──(Timeout / 10m Expiry)──► [EXPIRED]
        │
        ├─► [CUSTOMER_SUBMITTED_UTR] ──► [VERIFYING]
        │
        ├─► [OBSERVER_ALERT_MATCHED] ──► [VERIFYING]
        │
        ▼
   [SUCCESSFUL] ──► Automatically Provisions Entitlements (Licenses & Subs)
        │
        ▼
   (If Discrepancy / Ambiguity Detected)
        │
        ▼
   [RECONCILIATION_REQUIRED] ──(Admin Verification)──► [SUCCESSFUL]
```

---

## 4. Operational Invariants

1. **Zero Raw OTP Storage**: OTPs are generated with `SecureRandom` (6 digits), salted, and hashed using SHA-256 before storage in `otp_verifications`.
2. **One Active Payment Per Order**: Database constraint and `@Lock(LockModeType.PESSIMISTIC_WRITE)` prevent multiple concurrent pending payments on the same order.
3. **No Direct Fulfillment from Browser**: Fulfillment is exclusively triggered server-side upon verified webhook, validated observer credit alert, or authorized admin verification.
4. **Zero Live Charges in Test**: All automated integration fixtures run against H2 in-memory mode with test profile.
