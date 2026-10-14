# OHO TECH — API Architecture & Contracts Specification

**Status:** APPROVED & ACTIVE  
**Last Updated:** 2026-10-14  

---

## 1. Overview

The OHO TECH API layer coordinates communication between the Next.js App Router frontend and the Spring Boot 4.1.0 backend service. It guarantees type-safe request/response payloads, secure authentication header propagation, and zero exposure of internal administrative or partner-cost data to public clients.

---

## 2. Frontend API Client Structure

All frontend network communication flows through dedicated domain modules powered by `src/api/client.ts`:

- `src/api/client.ts`: Core HTTP transport using Fetch API, automatic bearer token injection from LocalStorage, base URL resolution, and `ApiError` normalization.
- `src/api/auth.ts`: Authentication, registration, OTP verification, and password reset.
- `src/api/products.ts`: Software catalog listing, details, and search.
- `src/api/plans.ts`: Product licensing tiers and subscription pricing plans.
- `src/api/orders.ts`: Order creation, invoice downloads, and customer order history.
- `src/api/payments.ts`: Razorpay order initialization, Cashfree order creation, UPI QR generation, UTR submission, and admin approvals.
- `src/api/licenses.ts`: License key activations, hardware bindings, and revocations.
- `src/api/subscriptions.ts`: SaaS subscription lifecycle and free trial starts.
- `src/api/deployments.ts`: Multi-environment deployment requests and status tracking.
- `src/api/crm.ts`: Lead capture, CRM pipeline management, and customer 360 views.
- `src/api/support.ts`: Support tickets and helpdesk communications.
- `src/api/admin.ts`: Admin console metrics, settings, and audit logs.
- `src/api/developer.ts`: Developer API keys, diagnostics, and webhooks.

### Compatibility Entry Point
- `src/api/types.ts`: Backward-compatibility root re-exporter pointing to `src/api/types/index.ts` (14 domain-bounded modules).

---

## 3. Backend REST Controller Architecture

The Spring Boot backend organizes REST endpoints under `/api/`:

| Path Prefix | Target Domain | Authorization Requirement |
|---|---|---|
| `/api/auth/**` | Authentication & Identity | Public |
| `/api/products/**` | Software Catalog | Public (Read), `ROLE_ADMIN` (Write) |
| `/api/orders/**` | Ordering & Checkout | `ROLE_CUSTOMER` / `ROLE_ADMIN` |
| `/api/payments/**` | Payment Gateways | `ROLE_CUSTOMER` (Init), `ROLE_ADMIN` (Approve/Reconcile) |
| `/api/webhooks/**` | Gateway Webhooks | Public endpoint with cryptographic HMAC-SHA256 signature verification |
| `/api/licenses/**` | Software Licensing | Authenticated |
| `/api/subscriptions/**` | SaaS Subscriptions | Authenticated |
| `/api/deployments/**` | Cloud Deployments | `ROLE_CUSTOMER` (Read), `ROLE_ADMIN` (Manage) |
| `/api/admin/**` | Platform Administration | `ROLE_ADMIN` |
| `/api/developer/**` | Developer Hub | `ROLE_DEVELOPER` / `ROLE_ADMIN` |

---

## 4. Security & Data Protection Guardrails

1. **Provider Margin Privacy:** Public endpoints for products (`/api/products`) never return `providerCost` or `resellerMargin`. These fields are strictly filtered or masked unless the request is authenticated with `ROLE_ADMIN`.
2. **Signature Verification:** Both `/api/webhooks/cashfree` and `/api/webhooks/razorpay` require HMAC-SHA256 verification computed over the unmodified raw HTTP request payload before any database lookup or mutation.
3. **Admin Licensing Gate:** Incoming payment success events advance orders to `CONFIRMED`. Entitlements and software license keys are released only upon explicit admin approval (`PaymentService.adminApprovePayment`).
