# Cashfree Complete Payment Gateway Integration Report

**System**: OHO TECH Platform (`https://ohotechn.com`)  
**Backend API**: `https://api.ohotechn.com`  
**Gateway Provider**: Cashfree Payments (`CASHFREE`)  
**Date**: November 1, 2026  
**Status**: INTEGRATION COMPLETE & SANDBOX VERIFIED  

---

## 1. Executive Summary

This report documents the end-to-end integration of Cashfree Payment Gateway into the existing OHO TECH payment architecture. The integration supports credit/debit cards, net banking (58+ banks), UPI (Google Pay, PhonePe, Paytm, BHIM, QR), and wallets.

Cashfree coexists alongside OHO TECH's existing payment options:
- Razorpay Payment Gateway
- UPIHost / Self-Hosted UPI (real-time dynamic QR with automated bank alert matching)
- Direct UPI (static manual verification)
- Cash on Delivery (COD) [DISCONTINUED & REPLACED BY ONLINE RAILS]
- Demo Quick Pay (restricted sandbox mode)

---

## 2. API Credentials Discovery & Status

During the automated discovery loop, the exact local credential image was located at `C:\Users\himan\OneDrive\Desktop\oho_tech\cashfree api.png` and verified against `APIKey (1).csv`:

- **File Path**: `C:\Users\himan\OneDrive\Desktop\oho_tech\cashfree api.png`
- **Git Status**: Explicitly git-ignored in `.gitignore` (`cashfree api*`, `*APIKey*`).
- **App ID**: `134622058f170bb82c5576251370226431`
- **Secret Key**: Masked: `cfsk_ma_prod_••••••••••••••••••••••••••••••••_adbecfed` (Length: 57 characters).
- **Environment Classified**: **PRODUCTION** (`cfsk_ma_prod_` prefix).
- **Production Guardrail**: In compliance with security directives, production credentials remain **inactive** until explicit user authorization. Automated and local testing is strictly configured to execute in **Sandbox mode**.

---

## 3. End-to-End Architecture & Sequence

```
[ Customer Browser ]
       │ 1. Place Order (Select CASHFREE)
       ▼
[ Next.js Checkout (page.tsx) ]
       │ 2. POST /api/payments/cashfree/create-order
       ▼
[ Spring Boot (PaymentController.java) ]
       │ 3. Authoritative DB amount calculation
       ▼
[ CashfreeGateway.java ]
       │ 4. POST /pg/orders (x-client-id, x-client-secret, x-api-version: 2025-01-01)
       ▼
[ Cashfree PG Server ]
       │ 5. Returns payment_session_id & order_id
       ▼
[ Next.js Checkout SDK (cashfree.js v3) ]
       │ 6. Opens Cashfree Modal (Cards, UPI, Netbanking)
       ▼
[ Webhook Ingestion & Dual Verification ]
       │ 7. Cashfree Webhook: POST /api/webhooks/cashfree
       │    (Base64 HMAC-SHA256 signature verification + 5-minute replay window)
       │ 8. Client fallback: POST /api/payments/cashfree/verify
       │    (Direct GET /pg/orders/{order_id}/payments verification)
       ▼
[ PostgreSQL Database (ohotech_db) ]
       │ 9. Atomic status transition: Order -> CONFIRMED, Payment -> SUCCESSFUL
       ▼
[ Post-Payment Services ]
       ├─ Software Provisioning & License Entitlements
       ├─ Cart Cleared
       └─ Customer Email & Dashboard Notification Dispatched
```

---

## 4. Backend Implementation Details

### 4.1 Configuration Ingestion (`application.properties`)
Configured to support canonical Cashfree property names:
```properties
cashfree.app-id=${CASHFREE_APP_ID:${CASHFREE_CLIENT_ID:}}
cashfree.client-id=${CASHFREE_CLIENT_ID:${cashfree.app-id:}}
cashfree.secret-key=${CASHFREE_SECRET_KEY:${CASHFREE_CLIENT_SECRET:}}
cashfree.client-secret=${CASHFREE_CLIENT_SECRET:${cashfree.secret-key:}}
cashfree.webhook-secret=${CASHFREE_WEBHOOK_SECRET:}
cashfree.environment=${CASHFREE_ENVIRONMENT:SANDBOX}
cashfree.api-version=${CASHFREE_API_VERSION:2025-01-01}
app.payment.cashfree-enabled=${PAYMENT_CASHFREE_ENABLED:true}
```

### 4.2 Core Backend Classes
- **`CashfreeGateway.java`**: Implements `PaymentGateway` interface. Generates order sessions (`createCashfreeOrderSession`), verifies webhook signatures (`verifyWebhookSignature`), prevents timestamp replay attacks (`verifyWebhookTimestamp`), queries payment status (`fetchCashfreePaymentStatus`), and processes webhook events.
- **`CashfreeWebhookController.java`**: Public webhook route at `/api/webhooks/cashfree`. Parses raw request bodies without mutation, extracts `x-webhook-signature` and `x-webhook-timestamp` headers, and enforces HMAC-SHA256 signature verification.
- **`PaymentController.java`**:
  - `POST /api/payments/cashfree/create-order`: Authenticated endpoint creating order session.
  - `POST /api/payments/cashfree/verify`: Authenticated server-side verification endpoint.
- **`PaymentService.java`**: Enforces user order ownership, prevents duplicate order payment, verifies amounts and currency, marks payments `SUCCESSFUL`, confirms orders, and provisions software entitlements.

---

## 5. Frontend Next.js Checkout Integration

- **SDK Loader**: `src/utils/cashfree.ts` dynamically loads official Cashfree Web SDK v3 (`https://sdk.cashfree.com/js/v3/cashfree.js`) on demand with singleton initialization.
- **Checkout Page**: `src/app/(marketing)/checkout/page.tsx` renders a dedicated Cashfree payment card with icon, title, description, and real-time total.
- **Payment Modal**: Seamless modal checkout (`redirectTarget: '_modal'`) preventing unnecessary page navigation and preserving cart state.
- **Dual Verification**: Following modal completion, the frontend invokes server-side verification (`/api/payments/cashfree/verify`) to ensure payment confirmation even if the customer's browser drops connection.

---

## 6. Database Schema & Idempotency

- **Table**: `payments`
  - `cashfree_order_id` (indexed via `idx_payments_cashfree_order_id`)
  - `cashfree_payment_id` (indexed via `idx_payments_cashfree_payment_id`)
- **Table**: `crm_webhook_events`
  - Unique constraint `uk_provider_event_id` (`provider`, `externalEventId`) prevents duplicate webhook execution.
  - Idempotency ensures duplicate event deliveries return `ALREADY_PROCESSED` with HTTP 200 without executing side effects twice.
