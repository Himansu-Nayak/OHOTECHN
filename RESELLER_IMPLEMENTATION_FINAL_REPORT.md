# OHO TECH Software Reseller Marketplace — Final Implementation Report

**Date**: October 2, 2026  
**Repository**: [Himansu-Nayak/OHOTECHN](https://github.com/Himansu-Nayak/OHOTECHN)  
**Lead Architecture Assessment**: Google DeepMind Antigravity Pair Programmer  

---

## 1. Existing Architecture Discovered

During forensic inspection of the codebase, the following production architecture was established:
- **Backend**: Spring Boot 4.0 on Java 21 LTS with Maven (`mvnw`), Spring Data JPA, Hibernate Core 7.4.1, HikariCP, and Spring Security 6 with stateless JWT tokens (`JwtTokenProvider`, `JwtAuthenticationFilter`).
- **Database**: PostgreSQL 17 running on Port 5432 with JDBC URL `jdbc:postgresql://localhost:5432/OHOTECH`.
- **Payment Processing**: Multi-gateway payment engine supporting official Razorpay Java SDK (with HMAC-SHA256 signature verification and server-side payment capture checks), direct bank transfer / UPI with manual UTR reconciliation, and Cash on Delivery (COD).
- **Entitlements**: Authoritative cryptographic license key generation (`LicenseService`), seat activation tracking (`DeviceActivation`), and subscription management (`SubscriptionService`).
- **Frontend**: Next.js 16.3.0 with React 19 and Turbopack App Router, Tailwind CSS, Lucide icons, and Framer Motion. Modularized into clean, role-gated areas: public catalog (`/products`), customer self-service (`/my-products`), administrative operations (`/admin`), and developer diagnostics (`/developer`).

---

## 2. Existing Functionality Reused

In strict adherence to the **Master Rule — Repository is the Source of Truth**, zero parallel frameworks, fake databases, or mock endpoints were created. The following existing capabilities were directly reused:
1. **Order Processing**: Existing `OrderService` and `CartService` handle cart persistence, plan selection, and order initialization.
2. **Payment Architecture**: Existing `PaymentService` and `RazorpayWebhookController` handle order creation, HMAC-SHA256 signature verification, and idempotency.
3. **Entitlements Engine**: Existing `LicenseService` generates unique cryptographic keys (`OHO-XXXX-XXXX-XXXX`) and tracks device seat counts.
4. **Audit Trail**: Existing `AuditService` logs administrative and developer events with actor identity and timestamps into PostgreSQL.
5. **Customer Interface**: Existing `/my-products` route houses customer software entitlements, seat keys, and deployment tracking.
6. **Admin Primitives**: Existing `AdminUiPrimitives.tsx` provides high-density enterprise UI components (tables, badges, modal dialogs, search inputs, pagination) across the console.

---

## 3. New Entities

1. **`Provider.java`**:
   - Location: `backend/src/main/java/com/ohotech/backend/entity/Provider.java`
   - Attributes: `name`, `companyName`, `contactPerson`, `contactEmail`, `contactPhone`, `website`, `commercialTerms`, `commissionRate`, `technicalIntegrationType`, `integrationStatus`, `supportResponsibility`, `deploymentResponsibility`, `contractStatus`, `notes`, `active`, `createdAt`, `updatedAt`.
   - Purpose: Models the internal partner agency supplying software products to OHO TECH.
2. **`Deployment.java`**:
   - Location: `backend/src/main/java/com/ohotech/backend/entity/Deployment.java`
   - Attributes: `order`, `product`, `user`, `license`, `status`, `targetEnvironment`, `accessUrl`, `assignedEngineer`, `adminNotes`, `customerNotes`, `completedAt`, `createdAt`, `updatedAt`.
   - Purpose: Tracks real operational state machine transitions for software provisioning.
3. **`DeploymentStatus.java`**:
   - Enum: `PENDING`, `ASSIGNED`, `CONFIGURING`, `TESTING`, `READY`, `LIVE`, `SUSPENDED`, `CANCELLED`.

---

## 4. Modified Entities

1. **`Product.java`**:
   - Extended with reseller attributes:
     - `provider` (ManyToOne `Provider`)
     - `providerCost` (BigDecimal, internal wholesale cost)
     - `resellerMargin` (BigDecimal, internal OHO markup)
     - `slug` (String, unique catalog URL identifier)
     - `deploymentType` (`MANAGED_CLOUD`, `VPS_DEDICATED`, `SAAS_SHARED`, `STANDALONE_LICENSE`)
     - `integrationStatus` (Defaults to "Integration pending provider/API information")
     - `demoUrl` & `documentationUrl`
     - `lifecycleStatus` (`ACTIVE`, `DRAFT`, `PAUSED`, `ARCHIVED`)
     - `featured` (boolean)
2. **`SupportTicket.java`**:
   - Extended with `deploymentId` and `productId` links to support reseller product issue routing.

---

## 5. New APIs

1. **Provider Management (Admin Only)**:
   - `GET /api/admin/providers`: Paginated provider list with search.
   - `GET /api/admin/providers/all`: Active providers lookup.
   - `GET /api/admin/providers/{id}`: Detailed provider profile with wholesale terms.
   - `POST /api/admin/providers`: Onboard new provider agency.
   - `PUT /api/admin/providers/{id}`: Update provider agency.
   - `PATCH /api/admin/providers/{id}/status`: Toggle active status.
   - `DELETE /api/admin/providers/{id}`: Deactivate provider.
2. **Deployment Management (Admin & Developer)**:
   - `GET /api/admin/deployments`: Paginated deployment queue with status filters.
   - `GET /api/admin/deployments/{id}`: Full deployment record.
   - `POST /api/admin/deployments`: Initialize new deployment job.
   - `PUT /api/admin/deployments/{id}/status`: Update status, assigned engineer, and access URL.
   - `PUT /api/admin/deployments/{id}/customer-notes`: Update customer instructions.
   - `GET /api/developer/deployments`: Developer deployment queue.
   - `POST /api/developer/deployments/{id}/transition`: State transitions with audit trail.
3. **Customer Deployments (Authenticated Customer)**:
   - `GET /api/deployments/my`: Owned deployments. Internal `adminNotes` stripped.
   - `GET /api/deployments/{id}`: Owned deployment check. Rejects unauthorized access with HTTP 403.

---

## 6. Modified APIs

1. **`GET /api/products` & `GET /api/products/{id}`**:
   - Sanitized via `ProductService.mapToPublicDto()`: `providerCost`, `resellerMargin`, `providerId`, `providerName` are nullified and excluded from JSON output.
2. **`GET /api/products/slug/{slug}`**:
   - Returns compile-time `PublicProductDto` ensuring zero wholesale data leakage.
3. **`POST /api/payments/razorpay/verify` & `POST /api/admin/payments/{id}/verify`**:
   - Automatically initializes a `PENDING` `Deployment` record linked to the order, user, product, and license upon payment confirmation.

---

## 7. Database Changes

- **Schema Script**: `backend/src/main/resources/schema_update_reseller.sql`
- **Actions**:
  - `CREATE TABLE IF NOT EXISTS providers (...)` with indexes on name, active, contract_status.
  - `ALTER TABLE products ADD COLUMN IF NOT EXISTS ...` (`provider_id`, `provider_cost`, `reseller_margin`, `deployment_type`, `integration_status`, `demo_url`, `documentation_url`, `featured`).
  - Added foreign key constraint `fk_products_provider` with `ON DELETE SET NULL`.
  - `CREATE TABLE IF NOT EXISTS deployments (...)` with indexes on `user_id`, `order_id`, `product_id`, and `status`.

---

## 8. Admin Console Changes

- **Navigation**: Added "RESELLER MARKETPLACE" group to `AdminSidebar.tsx` with tabs:
  - **Provider Agencies** (`/admin?tab=providers`)
  - **Deployments & VPS** (`/admin?tab=deployments`)
- **Provider View (`AdminProvidersView.tsx`)**: High-density operational table with search, status filters, commercial terms drawer, add/edit modal, commission rates, and active toggles.
- **Deployments View (`AdminDeploymentsView.tsx`)**: Real deployment operations interface with status filtering, engineer assignment, server notes, access URL entry, and customer handover notes.
- **Product Management (`AdminProductsView.tsx`)**: Wholesale pricing calculator that computes customer selling price from wholesale cost + OHO margin.

---

## 9. Developer Studio Changes

- **Workspace Integration (`/developer`)**:
  - Embedded `AdminDeploymentsView` directly in the Developer Studio under the "Deployments" tab.
  - Allows assigned engineers to update environment configuration notes, verify smoke tests, and transition deployments from `CONFIGURING` to `TESTING` to `READY`.
  - Prohibits developers from viewing customer passwords, payment gateway secrets, or commercial wholesale splits.

---

## 10. Customer Portal Changes

- **My Products Portal (`/my-products`)**:
  - Automatically fetches customer deployments via `getMyDeploymentsApi()`.
  - Displays real-time provisioning badge (`PENDING`, `CONFIGURING`, `TESTING`, `READY`, `LIVE`).
  - Renders "Launch Application" CTA pointing to `accessUrl` **strictly when status is `LIVE` and access URL is present**.
  - Renders customer-safe setup instructions.
  - Strictly hides provider names, wholesale costs, margins, and admin notes.

---

## 11. Payment Integration

- **Flow**:
  1. Customer initiates payment via Razorpay SDK or offline UPI transfer.
  2. Backend performs server-side signature verification or admin UTR reconciliation.
  3. Order state becomes `PAID`.
  4. `PaymentService.createEntitlementsForOrder()` executes idempotently:
     - Creates active `Subscription` and `License` records.
     - Creates `Deployment` record in `PENDING` state.
     - Dispatches provisioning to `SoftwareProvisioningService`.
     - Clears user cart.
     - Sends confirmation email and in-app notifications.

---

## 12. Deployment Workflow

- **Lifecycle Transitions**:
  `PENDING` → `ASSIGNED` → `CONFIGURING` → `TESTING` → `READY` → `LIVE`
- **Audit Logging**: Every status change is captured in `AuditLog` via `AuditService.logUserEvent()`.
- **Pluggable Architecture**:
  - `ManualProvisioningProvider` (default fallback for manual VPS setup)
  - `ApiProvisioningProvider` (external agency API invocation)
  - `WebhookProvisioningProvider` (outbound webhook dispatch)
  - `HostedSaaSProvisioningProvider` (tenant creation)
  - `DedicatedInstanceProvisioningProvider` (automated VPS orchestration)

---

## 13. Security Controls & Audit Verification

1. **Wholesale Margin Isolation**:
   - `providerCost` and `resellerMargin` are never included in public or customer DTO responses.
   - Tested and verified in `ResellerMarketplaceTests.testStrictWholesalePriceIsolation()`.
2. **Customer Deployment Ownership**:
   - Customer can only query their own deployments (`/api/deployments/my`).
   - Querying another customer's deployment returns **HTTP 403 Forbidden**.
   - Tested and verified in `ResellerMarketplaceTests.testDeploymentLifecycleAndSecurity()`.
3. **Role-Based Access Control**:
   - Customer cannot access `/api/admin/providers` (returns **HTTP 403 Forbidden**).
   - Tested and verified in `ResellerMarketplaceTests.testCustomerCannotAccessProviderAdminApis()`.
4. **Secret Management**:
   - Zero hardcoded secrets in frontend or backend code.
   - Masked JDBC URLs in developer telemetry.
   - Admin notes stripped from all customer-facing endpoints.

---

## 14. Tests Executed

- **Backend Maven Test Suite**:
  - Command: `mvnw.cmd test` in `./backend`
  - Total Tests: **188 tests**
  - Failures: **0**
  - Errors: **0**
  - Skipped: **0**
  - Status: **BUILD SUCCESS**
- **Reseller Suite Coverage**:
  - `ResellerMarketplaceTests.testAdminCanRegisterProvider`: PASS
  - `ResellerMarketplaceTests.testCustomerCannotAccessProviderAdminApis`: PASS
  - `ResellerMarketplaceTests.testStrictWholesalePriceIsolation`: PASS
  - `ResellerMarketplaceTests.testDeploymentLifecycleAndSecurity`: PASS
  - `ResellerMarketplaceTests.testDeveloperDiagnosticsAccess`: PASS
  - `ResellerMarketplaceTests.testDeveloperApiKeyLifecycle`: PASS
  - `ResellerMarketplaceTests.testDeveloperWebhooksEndpoint`: PASS
  - `PaymentGatewaySecurityTests`: PASS (15 security tests)
  - `ProductOrderInvoiceTests`: PASS
  - `LicenseSubscriptionTests`: PASS

---

## 15. Build Results

- **Frontend Production Build**:
  - Command: `npm run build`
  - Compiler: Next.js 16.3.0 (Turbopack)
  - Result: **122 static and dynamic routes compiled successfully**
  - TypeScript: Zero errors (`npx tsc --noEmit` clean exit code 0)
  - Status: **PASS**
- **Backend Build**:
  - Command: `mvnw.cmd test`
  - Result: **BUILD SUCCESS (188/188 tests passed)**

---

## 16. Known Limitations

1. **Automated VPS Cloud API Provisioner**:
   - Full automated server spinning currently defaults to `ManualProvisioningProvider` unless an external VPS cloud API key (e.g. AWS EC2, DigitalOcean, or Hostinger VPS API) is configured in environment properties.
2. **Third-Party Agency Webhook Endpoints**:
   - External agencies that have not yet provided webhook endpoints default to the manual deployment queue until their technical specs are onboarded.

---

## 17. External Dependencies

1. **Razorpay Production Credentials**: Required in `.env` or system environment (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) for live production card/UPI capture.
2. **SMTP / Resend Credentials**: Required for customer email delivery of license keys and activation credentials.
3. **PostgreSQL 17**: Production database service must be running and accessible.

---

## 18. Production Deployment Requirements

- **VPS Server**: Ubuntu 22.04 LTS or 24.04 LTS (minimum 2 vCPU, 4GB RAM)
- **Database**: PostgreSQL 17 on Port 5432
- **Backend Runtime**: Eclipse Temurin OpenJDK 21 LTS (`java -jar backend.jar`)
- **Frontend Runtime**: Node.js 20 LTS (`node server.js` or `npm start`)
- **Web Server**: Nginx reverse proxy with SSL termination and WebSocket pass-through.
