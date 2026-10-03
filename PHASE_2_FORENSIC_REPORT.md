# OHO TECH — Phase 2 Forensic Repository Audit Report

**Audit Date**: October 2, 2026  
**Auditor**: Google DeepMind Antigravity Advanced Agentic Pair Programmer  
**Target Repository**: [Himansu-Nayak/OHOTECHN](https://github.com/Himansu-Nayak/OHOTECHN)  
**Execution Context**: Step 1 — Forensic Repository Audit before Phase 2 Implementation  

---

## 1. Existing Functionality

The repository contains an enterprise software distribution and reseller marketplace architecture grounded in the following functional pillars:

### 1.1 Provider / Partner Agency Management
- **Entity**: `Provider.java` (`providers` table in PostgreSQL 17).
- **Attributes**: Agency name, legal entity name, authorized contacts, website, internal commercial wholesale terms, commission rate %, technical integration type, integration status, support responsibility SLA, deployment responsibility SLA, contract status, and active toggle.
- **Service & Controller**: `ProviderService.java` and `AdminProviderController.java`.
- **Admin UI**: `AdminProvidersView.tsx` with search, status filters, add/edit modal drawer, and active status toggling.

### 1.2 Product Reseller Extension
- **Entity**: `Product.java` (`products` table).
- **Reseller Fields**: `provider_id` (FK to `Provider`), `providerCost` (wholesale cost from agency), `resellerMargin` (OHO TECH markup), `slug`, `deploymentType`, `integrationStatus`, `demoUrl`, `documentationUrl`, `lifecycleStatus`, `featured`.
- **Pricing Engine**: Server-authoritative calculation (`price = providerCost + resellerMargin`).
- **Wholesale Price Isolation**: `ProductService.mapToPublicDto()` nullifies wholesale fields for public visitors and customer users; `PublicProductDto` structurally omits wholesale fields.

### 1.3 Deployment Provisioning State Machine
- **Entity**: `Deployment.java` (`deployments` table).
- **Lifecycle Statuses**: `PENDING`, `ASSIGNED`, `CONFIGURING`, `TESTING`, `READY`, `LIVE`, `SUSPENDED`, `CANCELLED`.
- **Service & Controllers**: `DeploymentService.java`, `AdminDeploymentController.java`, `CustomerDeploymentController.java`, and `DeveloperController.java`.
- **Automated Payment Trigger**: Verified payments in `PaymentService.createEntitlementsForOrder()` automatically create a `Deployment` record in `PENDING` state and dispatch to `SoftwareProvisioningService`.
- **Customer Safe Isolation**: Internal `adminNotes` are stripped in `mapToCustomerDto()`. Customers can only view their own deployments. `accessUrl` is exposed to customers strictly when status reaches `LIVE`.

### 1.4 Commerce, Payments & Entitlements
- **Cart & Order**: `CartService.java`, `OrderService.java` (`Cart.java`, `Order.java`, `OrderItem.java`).
- **Payment Processing**: `PaymentService.java` supports Razorpay (HMAC-SHA256 signature verification + server-side payment fetch via official Java SDK), Direct UPI / Bank Transfer (with duplicate UTR detection), and COD.
- **Entitlements**: `LicenseService.java` issues 24-character cryptographic keys (`OHO-XXXX-XXXX-XXXX`), and `SubscriptionService.java` manages active software terms.

### 1.5 Portals & Operations
- **Admin Console (`/admin`)**: Single-page enterprise workspace with `AdminSidebar.tsx` managing Products, Providers, Deployments, Orders, Payments, Subscriptions, Licenses, CRM Leads, Quotes, Support Desk, Releases, and Settings.
- **Developer Studio (`/developer`)**: Engineering operations console with live JVM/HikariCP diagnostics, API key vault, real HTTP webhook simulator, operational deployments queue, and telemetry.
- **Customer Portal (`/my-products`)**: Self-service hub for purchased software solutions, license keys, device seats, real-time provisioning status, and application launch links.

---

## 2. Existing API Endpoints

### 2.1 Reseller & Provider Endpoints
- `GET /api/admin/providers`: Paginated provider list with search filter (`ROLE_ADMIN`).
- `GET /api/admin/providers/all`: Active providers lookup list (`ROLE_ADMIN`).
- `GET /api/admin/providers/{id}`: Detailed provider profile with wholesale terms (`ROLE_ADMIN`).
- `POST /api/admin/providers`: Register new provider agency (`ROLE_ADMIN`).
- `PUT /api/admin/providers/{id}`: Update provider agency (`ROLE_ADMIN`).
- `PATCH /api/admin/providers/{id}/status`: Toggle provider active state (`ROLE_ADMIN`).
- `DELETE /api/admin/providers/{id}`: Deactivate provider (`ROLE_ADMIN`).

### 2.2 Deployment & Provisioning Endpoints
- `GET /api/admin/deployments`: Paginated deployment list with status filter (`ROLE_ADMIN`).
- `GET /api/admin/deployments/{id}`: Full deployment record (`ROLE_ADMIN`).
- `POST /api/admin/deployments`: Initialize new deployment job (`ROLE_ADMIN`).
- `PUT /api/admin/deployments/{id}/status`: Update status, assigned engineer, and access URL (`ROLE_ADMIN`).
- `PUT /api/admin/deployments/{id}/customer-notes`: Update customer instructions (`ROLE_ADMIN`).
- `GET /api/developer/deployments`: Operational deployment queue (`ROLE_DEVELOPER`, `ROLE_ADMIN`).
- `POST /api/developer/deployments/{id}/transition`: State transitions (`ASSIGN`, `START_CONFIGURATION`, `MARK_TESTING`, `MARK_READY`, `MARK_LIVE`, `SUSPEND`, `CANCEL`) with audit logging (`ROLE_DEVELOPER`, `ROLE_ADMIN`).
- `GET /api/deployments/my`: Owned customer deployments with `adminNotes` stripped (`ROLE_CUSTOMER`, Authenticated).
- `GET /api/deployments/{id}`: Owned customer deployment check (returns HTTP 403 if unowned) (`ROLE_CUSTOMER`, Authenticated).

### 2.3 Product Catalog Endpoints
- `GET /api/products`: Paginated public catalog. `providerCost` and `resellerMargin` are null/omitted (Public).
- `GET /api/products/{id}`: Public product details. Wholesale fields are null/omitted (Public).
- `GET /api/products/slug/{slug}`: Public product details by slug using `PublicProductDto` (Public).
- `GET /api/admin/products`: Admin catalog with wholesale metrics and provider identities (`ROLE_ADMIN`).
- `POST /api/admin/products`, `PUT /api/admin/products/{id}`: Admin product management (`ROLE_ADMIN`).

### 2.4 Commerce & Payment Endpoints
- `POST /api/orders`: Order creation from active user cart (Authenticated).
- `POST /api/payments/razorpay/create-order`: Initialize Razorpay payment order (Authenticated).
- `POST /api/payments/razorpay/verify`: Cryptographic verification and entitlement creation (Authenticated).
- `POST /api/payments/upi/initiate`: Offline UPI intent generation (Authenticated).
- `POST /api/payments/upi/submit-utr`: Customer submits UTR reference (Authenticated).
- `POST /api/admin/payments/{id}/verify`: Admin approves manual UTR with duplicate check (`ROLE_ADMIN`).

---

## 3. Existing Database Relationships

```
+---------------+           +---------------+
|   providers   | 1       * |   products    |
|---------------|<----------|---------------|
| id (PK)       |           | id (PK)       |
| name (UNIQUE) |           | provider_id FK|
| commercial... |           | provider_cost |
| active        |           | reseller_marg.|
+---------------+           +---------------+
                                    | 1
                                    | *
+---------------+           +---------------+
|     users     | 1       * |  deployments  |
|---------------|<----------|---------------|
| id (PK)       |           | id (PK)       |
| email (UNIQUE)|           | product_id FK |
| role          |           | user_id FK    |
+---------------+           | order_id FK   |
        ^                   | license_id FK |
        | 1                 | status        |
        | *                 | access_url    |
+---------------+           | admin_notes   |
|    orders     | 1       1 | customer_notes|
|---------------|-----------+---------------+
| id (PK)       |
| user_id FK    |
| total_amount  |
| status        |
+---------------+
        | 1
        | 1
+---------------+
|   payments    |
|---------------|
| id (PK)       |
| order_id FK   |
| amount        |
| status        |
| rzp_order_id  |
+---------------+
```

- `products.provider_id` references `providers.id` with `ON DELETE SET NULL` (deleting or disabling a provider does not destroy catalog products or historical orders).
- `deployments.product_id` references `products.id` with `ON DELETE RESTRICT`.
- `deployments.user_id` references `users.id` with `ON DELETE RESTRICT`.
- `deployments.order_id` references `orders.id` with `ON DELETE SET NULL`.
- `deployments.license_id` references `licenses.id` with `ON DELETE SET NULL`.

---

## 4. Existing UI Routes

- `/`: Public homepage (Approved marketing hero, platform engines, director section, services).
- `/products`: Public turnkey software catalog with category tabs, search, and quick view modal.
- `/products/[id]`: Authoritative product details page with plan selection, feature overview, demo launch, and cart actions.
- `/cart` & `/checkout`: Order checkout with Razorpay modal and direct UPI payment options.
- `/my-products`: Customer self-service portal displaying active products, license keys, seats, provisioning badges, and application launch buttons.
- `/admin`: Enterprise administrative console with 5 operational pillars and sub-views.
- `/developer`: Engineering operations console with system diagnostics, API keys, webhooks, and assigned deployments.

---

## 5. Missing Functionality & Operational Gaps

1. **Deployment Filtering in Admin Console**:
   - `AdminDeploymentsView.tsx` currently only filters by `status`. It needs filtering by `provider`, `product`, and `customer` to satisfy enterprise operational requirements in Step 6.
2. **Provider Detail View (Products & Deployments Relationship)**:
   - In `AdminProvidersView.tsx`, admins can view provider metadata, but there is no direct sub-view to inspect all products associated with that provider and their active deployment count.
3. **Developer Studio Workspace Alignment**:
   - In `src/app/(marketing)/developer/page.tsx`, the tab for operational deployments embeds `AdminDeploymentsView`, which is functional, but developer-specific operations (e.g. testing checklist, environment configuration notes, handover verification) should be streamlined to focus solely on engineering actions rather than administrative commercial actions.
4. **Reseller API Contract Documentation**:
   - `RESELLER_API_CONTRACT.md` must be updated with an exhaustive table containing HTTP method, path, role, request body, response DTO, database action, and security rules for every reseller-related endpoint.

---

## 6. Duplicate Functionality Analysis

- **Zero Duplicate Panels**: Admin Console `/admin` and Developer Studio `/developer` share underlying API clients (`api/deployments.ts`, `api/providers.ts`) and primitives without creating parallel admin consoles.
- **Zero Parallel Catalogs**: Both public catalog (`/products`) and customer views (`/my-products`) read from the unified `ProductRepository` and `DeploymentRepository`.
- **Mock State Cleanup**: Prototype simulation timers in `/developer` were replaced by real HTTP webhook dispatchers and JVM diagnostics in `DeveloperController.java`.

---

## 7. Security & Data Leakage Risks (Evaluated & Mitigated)

| Risk Area | Threat Description | Existing Mitigation in Repository |
| :--- | :--- | :--- |
| **Wholesale Margin Leakage** | `providerCost` or `resellerMargin` exposed to customers via network inspection. | `ProductService.mapToPublicDto()` explicitly nullifies these fields; `PublicProductDto` structurally omits them at compile-time. Verified by `testStrictWholesalePriceIsolation`. |
| **Cross-Customer Deployment Access** | Customer queries another customer's `/api/deployments/{id}`. | `CustomerDeploymentController` verifies `deployment.getUserId().equals(currentUser.getId())` and throws **HTTP 403 Forbidden**. Verified by `testDeploymentLifecycleAndSecurity`. |
| **Admin Provider API Breach** | Customer calls `/api/admin/providers`. | Spring Security enforces `@PreAuthorize("hasAuthority('ROLE_ADMIN')")`. Rejects with **HTTP 403**. Verified by `testCustomerCannotAccessProviderAdminApis`. |
| **Premature Application Launch** | Customer launches application before testing/live sign-off. | UI renders "Launch Application" button strictly when `deployment.status === 'LIVE'` and `deployment.accessUrl` is non-empty. Cancelled/suspended deployments cannot be launched. |
| **Infrastructure Credential Exposure** | Internal server IPs or root passwords leaked via customer notes. | Separate fields: `adminNotes` (internal only, stripped in customer DTOs) and `customerNotes` (customer-safe instructions). |

---

## 8. Provider Integration Limitations

As OHO TECH acts as a reseller, the technical integration type reflects genuine operational capability:
- `PENDING_SPECS`: Default state. The external agency has not provided API specifications or webhook contracts. Requires manual engineer onboarding.
- `MANUAL`: Deployment fulfilled manually by OHO TECH or agency engineers on VPS instances.
- `API`: Automated provisioning only where agency provides an authenticated endpoint. If not provided, marked as **BLOCKED BY EXTERNAL DEPENDENCY**.
- `WEBHOOK`: Outbound event dispatch to agency webhook endpoint.
- `HOSTED_SAAS`: Multi-tenant account creation workflow.
- `DEDICATED_INSTANCE`: Single-tenant VPS deployment orchestration.

---

## 9. Deployment Limitations

- **No Fake Cloud Spin-Up**: The system does NOT pretend to spin up AWS EC2 or DigitalOcean droplets unless real cloud credentials and APIs are configured.
- **Manual VPS Provisioning Default**: When `ManualProvisioningProvider` is active, the deployment state machine requires an assigned engineer to configure the environment, conduct smoke testing, and explicitly transition the record to `LIVE`.

---

## 10. Files That Must NOT Be Changed

To prevent regressions in approved marketing designs and critical security/payment flows:
1. `src/components/layout/Header.tsx` & `Footer.tsx` (Approved public layouts).
2. `src/components/home/HeroExperience.tsx`, `DirectorSection.tsx`, `SelectedWork.tsx` (Approved marketing sections).
3. `backend/src/main/java/com/ohotech/backend/security/SecurityConfig.java` (Security filter chain and CORS policies).
4. `backend/src/main/java/com/ohotech/backend/security/JwtTokenProvider.java` (Cryptographic JWT signing).
5. `backend/src/main/java/com/ohotech/backend/service/LicenseService.java` (Authoritative cryptographic key algorithm).
6. `backend/src/main/java/com/ohotech/backend/service/PaymentService.java` (Core HMAC-SHA256 signature verification).

---

## Conclusion of Forensic Audit

The repository architecture is sound and ready for Phase 2 hardening. All subsequent enhancements must build directly upon this foundation.
