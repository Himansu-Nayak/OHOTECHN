# OHO TECH — Self-Hosted UPI Checkout & Merchant Payment Operations
## Test Matrix & Quality Assurance Plan

### 1. Test Suite Coverage

| Component | Target Test Class | Scope & Key Invariants |
|---|---|---|
| **Phone Verification Service** | `SelfHostedUpiPaymentTests.java` | 6-digit OTP generation, SHA-256 hash storage, 3-attempt limit lockout, 60s cooldown, 5-minute expiry, single-use consumption. |
| **Self-Hosted UPI Engine** | `SelfHostedUpiPaymentTests.java` | Dynamic NPCI URI generation (`upi://pay`), GPay/PhonePe intent links, one-active-payment idempotency, slot lease acquisition & timeout release. |
| **Bank Observer Ingestion** | `SelfHostedUpiPaymentTests.java` | Device bearer token validation, bank credit SMS/alert parsing, RRN deduplication, automated match & software license fulfillment. |
| **Ambiguity Reconciliation** | `SelfHostedUpiPaymentTests.java` | Mismatched alert amounts or unclaimed credits transition to `RECONCILIATION_REQUIRED` without premature fulfillment. |
| **Counter Billing POS** | `SelfHostedUpiPaymentTests.java` | Cashier tender & change calculation, external card terminal reference logging, automatic order fulfillment, cashier audit trail. |
| **Access Control (RBAC)** | `SelfHostedUpiPaymentTests.java` | Customers and unauthenticated users are forbidden from observer ingestion and counter billing endpoints. |
| **Browser UI Automation** | `v15-self-hosted-upi-qa.js` | Puppeteer end-to-end checkout flow: QR code rendering, intent buttons, mobile view, counter billing interface. |
