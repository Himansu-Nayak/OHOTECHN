# OHO TECH — Architecture Decisions Record (ADR)

**Status:** APPROVED & ACTIVE  
**Last Updated:** 2026-10-14  

---

## ADR 001: Centralized API Client Architecture

### Context
Historically, applications risk having multiple ways to invoke HTTP APIs, causing inconsistent authorization header injection, redundant base URL definitions, and divergent error parsing. In OHO TECH, an older compatibility shim existed at `src/lib/api.ts` pointing to `src/api/client.ts`.

### Decision
1. `src/api/client.ts` is the single source of truth for all frontend API communication.
2. All domain API methods (`auth.ts`, `products.ts`, `orders.ts`, `payments.ts`, `deployments.ts`, etc.) must import directly from `src/api/client.ts`.
3. `src/lib/api.ts` is maintained as a zero-overhead backward-compatibility re-export shim to protect any external or dynamic consumer without duplicating logic.

### Consequences
- Eliminates duplicate token management.
- Guarantees consistent error normalization (`ApiError`) and status handling across all features.

---

## ADR 002: Domain-Driven Modular State Management

### Context
Certain pages (e.g. `src/app/(marketing)/checkout/page.tsx` and `src/app/(marketing)/products/[id]/page.tsx`) handle multiple payment options, modal states, script injection, and QR rendering within a single large component, which makes testing and maintenance difficult.

### Decision
1. Separate payment method options and status flows into focused feature subcomponents:
   - `CheckoutAmountBreakdown`: Handles cart itemization and price calculations.
   - `UpiPaymentSection`: Manages dynamic QR code rendering, intent deep linking, and UTR submission.
   - `PaymentMethodSelector`: Renders payment provider choices (Cashfree PG, Razorpay PG, Direct UPI QR, COD, Demo Pay).
   - `PaymentStatusFeedback`: Displays animated success, failure, and pending states with retry options.
2. Maintain local UI state in focused hooks/contexts while keeping shared cross-application state in `CartContext` and `AuthContext`.

### Consequences
- Improves reusability and visual clarity.
- Preserves 100% of existing behavior, design, and styling.
- Zero extra third-party state library bloat (avoids unnecessary Redux/Zustand overhead).

---

## ADR 003: Payment Gateway Extensibility & Webhook Idempotency

### Context
OHO TECH supports multiple payment providers:
- Razorpay Online PG
- Cashfree Online PG (UPI, Cards, NetBanking, Wallets)
- Direct Dynamic UPI QR (Indian Bank)
- Cash on Delivery (COD)
- Demo Testing Mode

### Decision
1. The backend preserves the `PaymentGateway` interface and `PaymentGatewayRegistry` pattern.
2. All gateway webhook endpoints (`/api/webhooks/cashfree`, `/api/webhooks/razorpay`) must:
   - Compute cryptographic HMAC-SHA256 signatures over unmodified raw request bodies using constant-time equality comparisons (`MessageDigest.isEqual`).
   - Transition successful payments to `PaymentStatus.SUCCESSFUL` and advance orders to `OrderStatus.CONFIRMED`.
   - Strictly require explicit administrator approval (`PaymentService.adminApprovePayment`) to advance an order to `OrderStatus.PAID` and issue software licenses/entitlements.
   - Employ deterministic idempotency keys stored in `WebhookEvent` to gracefully de-duplicate retried deliveries.

### Consequences
- Prevents double provisioning of software licenses.
- Guards against payment webhook tampering or replay attacks.
- Guarantees zero downtime when switching or adding payment providers.

---

## ADR 004: Domain-Based Type Modularization

### Context
`src/api/types.ts` was an 887-line monolith containing 76 interfaces, DTOs, and union types across 14 distinct business domains (auth, products, providers, orders, payments, subscriptions, licenses, deployments, CRM, support, admin, and developer diagnostics). This coupled unrelated domains and increased merge conflicts and import bloat.

### Decision
1. Organize types into focused domain modules under `src/api/types/*.types.ts` (`common`, `user`, `auth`, `product`, `provider`, `deployment`, `payment`, `order`, `subscription`, `license`, `support`, `crm`, `admin`, `developer`).
2. Provide a barrel export in `src/api/types/index.ts` and maintain `src/api/types.ts` as a 100% backward-compatible root re-export shim.
3. Enforce strict type-only imports (`import type`) across domain modules to prevent circular runtime dependencies.

### Consequences
- Clean domain isolation and zero circular dependency hazards.
- 100% backward compatibility for all existing `@/api/types`, `./types`, and `../api/types` consumers.
- No breaking changes or runtime bundle regressions.
