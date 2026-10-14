# OHO TECH — Master Architecture Modernization Backlog

**Document Status:** ACTIVE & MAINTAINED  
**Date Created:** 2026-10-14  
**Project:** OHO TECH / OHOTECHN  
**Repository:** `https://github.com/Himansu-Nayak/OHOTECH`  
**Standard:** Zero breaking changes, zero regressions, strict type-safety, and test-verified incremental execution.

---

## 1. Backlog Overview & Prioritization Strategy

This backlog tracks identified technical debt, architectural improvements, and refactoring targets across the OHO TECH enterprise platform. Tasks are scored and prioritized based on:
1. **Risk to Live Transactions & Licensing (Priority 1 — Critical / High)**
2. **Component Maintainability & Code Health (Priority 2 — Medium)**
3. **Developer Experience & Long-term Scalability (Priority 3 — Low / Future)**

---

## 2. Prioritized Work Items

### Epic A: Frontend Modernization & Component Decoupling

| ID | Item | Scope | Priority | Status | Description |
|---|---|---|:---:|:---:|---|
| **FE-01** | Payment Status UI Extraction | `src/app/(marketing)/checkout/page.tsx` | High | `COMPLETED` | Extracted payment feedback states into `src/components/ui/PaymentStatusFeedback.tsx` with animations, UTR tracking, and phone support context. |
| **FE-02** | ESLint Configuration & Rule Compliance | `eslint.config.mjs`, `dashboard/page.tsx` | High | `COMPLETED` | Added `.agents/**` to `globalIgnores` and resolved React Hook rule violation in dashboard activity feed. `npm run lint` passes with 0 errors. |
| **FE-03** | Domain Types Modularization | `src/api/types/` | Medium | `COMPLETED` | Refactored monolithic `types.ts` (887 lines, 76 symbols) into 14 domain modules under `src/api/types/*.types.ts` while preserving 100% backward compatibility via `src/api/types/index.ts` and `src/api/types.ts`. |
| **FE-04** | Product Detail Component Decoupling | `src/app/(marketing)/products/[id]/page.tsx` | Medium | `COMPLETED` | Extracted `ProductTechnicalTabs.tsx` (5 architecture tabs), `ProductEngineeringCallout.tsx`, and `ProductPurchaseSuccessSection.tsx`. Reduced monolithic page from 1615 to 1070 lines while verifying 0 TypeScript/ESLint/Build errors. |
| **FE-05** | Legacy API Client Shim Consolidation | `src/lib/api.ts` vs `src/api/client.ts` | Low | `PLANNED` | Audit all remaining consumers of `src/lib/api.ts` and direct them to `src/api/client.ts` to prevent diverging configurations. |

---

### Epic B: Backend Clean Architecture & Domain Grouping

| ID | Item | Scope | Priority | Status | Description |
|---|---|---|:---:|:---:|---|
| **BE-01** | Cashfree Webhook Idempotency & Entitlements | `CashfreeGateway.java`, `CashfreeWebhookController.java` | High | `COMPLETED` | Deterministic SHA-256 fallback event IDs, constant-time HMAC-SHA256 verification, and strict admin approval gating. 15/15 tests passing. |
| **BE-02** | Cashfree Database Migration | `backend/src/main/resources/schema_update_cashfree.sql` | High | `READY_FOR_DEPLOYMENT` | DDL script prepared for production PostgreSQL migration with safe rollback steps. |
| **BE-03** | Domain Package Organization | `com.ohotech.backend.controller.*`, `com.ohotech.backend.entity.*` | Medium | `PLANNED` | Organize 35 flat controllers and 48 entities into domain-bounded packages (`catalog`, `ordering`, `billing`, `licensing`, `identity`, `deployments`, `support`, `ai`). |
| **BE-04** | Unified Gateway Abstraction | `com.ohotech.backend.service.payment` | Medium | `PLANNED` | Unify Razorpay and Cashfree gateway lifecycle methods under a strict `PaymentGateway` interface for automated refund and webhook routing. |

---

### Epic C: Testing, Reliability & Verification

| ID | Item | Scope | Priority | Status | Description |
|---|---|---|:---:|:---:|---|
| **QA-01** | Frontend Static Type Safety | `tsconfig.json` | High | `VERIFIED` | `npx tsc --noEmit` verified clean with 0 errors. |
| **QA-02** | Frontend Production Compilation | Next.js Build Pipeline | High | `VERIFIED` | `npm run build` cleanly generates all 122 pages. |
| **QA-03** | Backend Automated Test Suite | Maven Surefire | High | `VERIFIED` | 204 unit and integration tests passing cleanly. |
| **QA-04** | End-to-End Checkout Flow Test | Next.js + Spring Boot | Medium | `PLANNED` | Automated integration scenario covering Cart -> Checkout -> Gateway Webhook -> Admin Approval -> License Issue. |

---

## 3. Definition of Done (DoD) for Refactoring Items
Before marking any item as completed:
1. `npx tsc --noEmit` must pass with 0 errors.
2. `npm run lint -- --quiet` must pass with 0 errors.
3. `npm run build` must compile successfully without warnings.
4. `mvn test-compile` and all backend tests must pass without failures.
5. Zero modifications to visual styling, branding, or UI animations.
6. Zero bypassing of security controls, payment signature checks, or admin approval gates.
