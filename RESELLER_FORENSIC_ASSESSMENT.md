# OHO TECH Software Reseller Marketplace — Forensic Repository Assessment

## Executive Summary & Forensic Scope
This document constitutes the Phase 0 forensic evaluation of the **OHO TECH** platform repository (`Himansu-Nayak/OHOTECHN`). It documents existing architecture, data schemas, API contracts, RBAC tiers, and user journeys to ensure the Software Reseller Marketplace capability is natively integrated into the system of record without introducing duplicate systems, simulated cloud mocks, or fake product data.

---

## 1. Existing Architecture & Single Source of Truth

### 1.1 Backend Stack
- **Framework**: Spring Boot 4.1.0 on Java 21 LTS
- **Data Layer**: Spring Data JPA / Hibernate Core 7.4.1 / HikariCP
- **Database**: PostgreSQL 17 on port 5432 (`ohotech_db`)
- **Security & RBAC**: Spring Security with stateless JWT (`JwtTokenProvider`, `CustomUserDetailsService`), password encryption via BCrypt.
- **Roles**:
  - `ROLE_CUSTOMER`: End-users, purchasing clients, software license owners.
  - `ROLE_ADMIN`: Platform operators, catalog managers, finance managers.
  - `ROLE_SUPER_ADMIN`: Root administrators with configuration override.
  - `ROLE_DEVELOPER`: Technical engineers, infrastructure specialists, systems telemetry.
- **External Gateways**:
  - **Payment**: Razorpay Gateway (HMAC-SHA256 signature verification + server-side payment fetch) + Offline Direct Bank Transfer (UPI intent + UTR manual verification).
  - **Email**: Resend / JavaMailSender with HTML templating.
  - **AI**: Google Gemini (`gemini-2.5-flash`).

### 1.2 Frontend Stack
- **Framework**: Next.js 16.3.0 (React 19 / Turbopack App Router)
- **Styling**: Tailwind CSS, PostCSS, Lucide React icons.
- **Routing**:
  - Marketing: `/`, `/services`, `/about`, `/contact`, `/pricing`
  - Marketplace & Commerce: `/products`, `/products/[id]`, `/cart`, `/checkout`, `/orders`
  - Customer Portal: `/my-products`, `/profile`, `/support`
  - Administration: `/admin` (Tabbed modules: Dashboard, Products, Orders, Users, Licenses, Subscriptions, CRM, Providers, Deployments)
  - Developer Operations: `/developer` (Diagnostics, API Keys, Webhook Simulator, Telemetry, Audit Logs)

---

## 2. Existing Data Entities & Schema Map

| Domain | Entity | Existing Capabilities | Extension Requirements for Reseller Marketplace |
| :--- | :--- | :--- | :--- |
| **Catalog** | `Product.java` | `id`, `name`, `price`, `description`, `imageUrl`, `category`, `stock`, `active`, `featured`, `slug`, `demoUrl`, `documentationUrl` | Add explicit lifecycle `status` (`DRAFT`, `ACTIVE`, `PAUSED`, `ARCHIVED`). Link to `Provider` entity. Wholesale cost & margin fields (`providerCost`, `resellerMargin`) strictly isolated. |
| **Agencies** | `Provider.java` | Registered in DB: `name`, `companyName`, `contactPerson`, `contactEmail`, `contactPhone`, `commercialTerms`, `technicalIntegrationType`, `integrationStatus`, `supportResponsibility`, `deploymentResponsibility`, `contractStatus` | Enforce strict enum validations: integration types (`API`, `WEBHOOK`, `SOURCE_CODE`, `DEDICATED_INSTANCE`, `HOSTED_SAAS`, `PENDING_SPECS`), integration statuses, and support SLAs. |
| **Provisioning** | `Deployment.java` | Linked to `Order`, `Product`, `User`, `License`. Status enum: `PENDING`, `ASSIGNED`, `CONFIGURING`, `TESTING`, `READY`, `LIVE`, `SUSPENDED`, `CANCELLED`. | Add automatic creation upon payment verification in `PaymentService`. Surface operational state transitions in Developer & Admin panels with audit logs. |
| **Orders** | `Order.java` | `id`, `user`, `totalAmount`, `status` (`PENDING`, `CONFIRMED`, `PAID`, `CANCELLED`, `REFUNDED`), `items` (`OrderItem`) | Preserved 100%. No modifications required. Serves as parent contract for provisioning. |
| **Payments** | `Payment.java` | `id`, `order`, `amount`, `status`, `provider`, `method`, `razorpayOrderId`, `razorpayPaymentId`, `transactionReference` | Server-side HMAC-SHA256 signature verification. Triggers entitlement generation upon `SUCCESSFUL`. |
| **Entitlements** | `License.java` | `licenseKey`, `status` (`ACTIVE`, `EXPIRED`, `REVOKED`, `SUSPENDED`), `activationLimit`, `activationCount` | Tied to deployment and subscription. Handed over when deployment reaches `LIVE`. |
| **Entitlements** | `Subscription.java` | `startDate`, `expiryDate`, `autoRenew`, `status` (`ACTIVE`, `EXPIRED`, `CANCELLED`) | Handles recurring SaaS / software subscription tiers. |
| **Support** | `SupportTicket.java` | `ticketCode`, `subject`, `description`, `department`, `priority`, `status`, `customer`, `orderId` | Add support ownership routing (`OHO_TECH`, `PROVIDER`, `INFRASTRUCTURE`, `CUSTOMER_CONFIG`) and deployment links. |
| **Audit** | `AuditLog.java` | `action`, `entityName`, `entityId`, `details`, `user`, `timestamp` | Captures all state machine transitions and commercial edits. |

---

## 3. Existing API & RBAC Endpoints

### 3.1 Public & Customer Endpoints
- `GET /api/products` & `GET /api/products/{id}`: Public catalog browse.
  - **Security Mandate**: DTO mapping must completely exclude `providerCost`, `resellerMargin`, `providerId`, `providerName`, and `commercialTerms`.
- `POST /api/orders`: Order creation from active user cart.
- `POST /api/payments/razorpay/create-order` & `/verify`: Server-side payment initialization and validation.
- `GET /api/deployments/my` & `GET /api/deployments/{id}`: Customer deployment tracking. Strictly filtered by `user.id == currentUser.id`.

### 3.2 Internal Administrative & Developer Endpoints
- `GET /api/admin/providers`: Provider agencies registry with wholesale terms.
- `POST /api/admin/providers`: Provider onboarding.
- `PUT /api/admin/providers/{id}`: Provider terms update.
- `GET /api/admin/deployments`: Comprehensive deployment queue.
- `PUT /api/admin/deployments/{id}`: Administrative status & engineer assignment.
- `POST /api/developer/deployments/{id}/transition`: Operations engineer transition endpoint with validation and audit logging.
- `GET /api/admin/analytics`: Financial performance metrics (`customerRevenue`, `providerCost`, `grossMargin`, `refunds`, `netRevenue`).

---

## 4. Reusable vs Missing Components

### Reusable Components (Zero Duplication)
1. **Cart & Checkout Workflow**: Existing `OrderService` and `PaymentService` handle cart accumulation, plan selection, Razorpay order creation, and offline UTR submission.
2. **Entitlements Engine**: Existing `LicenseService` and `SubscriptionService` generate 24-character cryptographically random license keys and subscription tracking.
3. **Audit Logging Framework**: Existing `AuditService` logs administrative modifications with user principal context.
4. **Customer UI Structure**: Existing `/my-products` page renders purchased software entitlements and licensing cards.

### Missing or Incomplete Components to Implement
1. **Separate Compile-Time DTOs for Product**:
   - `PublicProductDto`: Excludes wholesale metrics by definition.
   - `CustomerProductDto`: Adds owned deployment context for customer portal.
   - `AdminProductDto`: Contains provider identity, wholesale cost, markup, and gross margin.
2. **Provider Provisioning Abstraction (`SoftwareProvisioningProvider`)**:
   - Interfaces and modular implementations (`ManualProvisioningProvider`, `ApiProvisioningProvider`, `WebhookProvisioningProvider`, `HostedSaaSProvisioningProvider`, `DedicatedInstanceProvisioningProvider`).
3. **Automatic Deployment Trigger**:
   - Upon payment verification in `PaymentService.createEntitlementsForOrder()`, dispatch a `PENDING` deployment record linked to the order, user, product, and license.
4. **Developer Workspace Operations**:
   - Developer Studio (`/developer`) needs a live Operational Deployments tab directly hooked to the backend deployment state machine with state transitions (`ASSIGN`, `START_CONFIG`, `TESTING`, `READY`, `LIVE`, `SUSPEND`, `CANCEL`).
5. **Support Ticket Reseller Extension**:
   - Ticket linking to `deploymentId` and `productId`, with issue ownership classification.
6. **Financial Analytics Extension**:
   - Expand `AnalyticsDto` and `AnalyticsService` to compute real gross margin, provider cost liabilities, and net revenue directly from database records.

---

## 5. Potential Conflicts, Security Risks & Mitigation

| Potential Risk | Root Cause | Mitigation Strategy |
| :--- | :--- | :--- |
| **Wholesale Margin Leak** | Single shared `ProductDto` inadvertently serializing null or zero values | Implement separate, decoupled DTO classes (`PublicProductDto` vs `AdminProductDto`). Public DTO has no wholesale properties in its class signature. |
| **IDOR Vulnerability on Deployments** | Customer requesting `/api/deployments/{id}` for another user's instance | Strict ownership check in `DeploymentService.getDeploymentForCustomer()`: verify `deployment.getUser().getId().equals(currentUser.getId())`, otherwise throw `ResourceNotFoundException`. |
| **Fake Automated Provisioning** | Simulating a cloud launch when no API credentials exist | Enforce `ManualProvisioningProvider` by default. Mark integration explicitly as `"Integration pending provider/API information"`. Never show fake completion bars. |
| **Ghost Products** | Management list containing 50+ categories not backed by software | Only render products saved in the database with `active = true` and `status = ACTIVE`. Mark any pending provider products as draft or onboarding. |
| **Database Schema Inconsistencies** | In production, Hibernate `validate` failing on missing columns | Run clean DDL migrations adding columns with default values (`featured`, `slug`, `providerCost`, `resellerMargin`, `status`). |

---

## 6. Implementation Phasing Order

1. **Phase 1-2**: Separate Product DTOs (`PublicProductDto`, `AdminProductDto`, `CustomerProductDto`) + Provider enum types + Product lifecycle status.
2. **Phase 6-7**: `SoftwareProvisioningProvider` SPI layer + Auto-creation of `Deployment` on payment verification in `PaymentService`.
3. **Phase 10**: Developer Operations Deployment Workspace in `/developer` and `DeveloperController`.
4. **Phase 13-14**: Financial Analytics Margin Engine in `AnalyticsService` + Support Ticket entity routing.
5. **Phase 23-24**: Automated Security & Isolation Tests (`mvn test`, `tsc`, `npm run build`).
6. **Phase 25**: VPS Deployment and Verification.
