# OHO TECH — Engineering & Coding Standards

**Status:** APPROVED & ACTIVE  
**Last Updated:** 2026-10-14  
**Applies To:** Next.js (Frontend), Spring Boot (Backend), PostgreSQL (Persistence)

---

## 1. Frontend Standards (TypeScript & React 19 / Next.js 16)

### A. Naming Conventions
- **React Components & Files:** PascalCase (e.g. `PaymentStatusFeedback.tsx`, `CheckoutAmountBreakdown.tsx`).
- **Custom Hooks:** camelCase with `use` prefix (e.g. `useProducts.ts`, `useAuth.ts`).
- **Utilities & Services:** camelCase (e.g. `formatInr`, `cartUtils.ts`, `apiClient`).
- **Interfaces & Types:** PascalCase (e.g. `ProductDto`, `CartItem`, `ApiResponse`).
- **Constants & Enums:** UPPER_SNAKE_CASE for static runtime constants; PascalCase for type definitions and TypeScript enums/unions.

### B. Architecture & Code Boundaries
- **Component Decoupling:** Presentation components must receive typed props and callbacks. Business rules and complex state transformations should be isolated into hooks, utilities, or domain services.
- **Type-Safety:** Strict type-checking (`"strict": true`) without using broad `any` or `@ts-ignore` to suppress legitimate type issues.
- **Module Resolution:** Use path aliases configured in `tsconfig.json` (e.g. `@/api/...`, `@/components/...`).
- **Hooks Rules:** Never invoke React Hooks conditionally or after early return statements. All hooks must execute unconditionally at the top of the component body.
- **Imports:** Prefer `import type` for type-only imports to eliminate circular runtime dependencies and keep bundle sizes optimal.

---

## 2. Backend Standards (Java 21 / Spring Boot 4.1.0)

### A. Naming Conventions
- **Classes & Interfaces:** PascalCase (e.g. `PaymentService`, `CashfreeGateway`, `OrderRepository`).
- **Methods & Variables:** camelCase (e.g. `adminApprovePayment`, `verifyWebhookSignature`).
- **Constants:** UPPER_SNAKE_CASE (e.g. `CASHFREE_API_VERSION`, `DEFAULT_PAGE_SIZE`).
- **Package Names:** lowercase dot-separated (e.g. `com.ohotech.backend.service.payment`).

### B. Architecture & Layering
- **Controller Layer:** Handles HTTP request routing, path/query validation, and delegating to services. No raw database queries or direct business mutations inside controllers.
- **Service Layer:** Transaction boundary (`@Transactional`), business rules, domain orchestration, and gateway delegations.
- **Repository Layer:** Spring Data JPA interfaces. Custom queries use parameterized JPQL or native SQL to prevent SQL injection.
- **Entity Layer:** JPA entities with proper indexing, audited timestamps (`@CreationTimestamp`, `@UpdateTimestamp`), and foreign key relationships.

---

## 3. Persistence & Database Standards

- **PostgreSQL 17 Target:** All schema changes must be codified into safe, repeatable SQL migration scripts with corresponding verification checks.
- **Column & Table Naming:** snake_case for tables and columns (e.g. `webhook_event`, `event_id`, `created_at`).
- **Data Integrity:** Foreign keys, unique constraints on idempotency identifiers, and non-nullable critical audit columns.

---

## 4. Security & Cryptographic Standards

- **Constant-Time Comparison:** All HMAC-SHA256 signature verifications must utilize constant-time comparison (`MessageDigest.isEqual`) to prevent timing side-channel attacks.
- **Admin Approval Gate:** Payment verification never automatically activates software licenses. License keys and download access strictly require explicit admin review (`PaymentService.adminApprovePayment`).
- **Zero Secrets in Git:** Never commit live API keys, client secrets, webhook secrets, or private keys to source control.
