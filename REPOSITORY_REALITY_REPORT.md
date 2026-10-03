# OHO TECH Repository Reality Report
**Inspection Date**: October 2, 2026  
**Repository**: [Himansu-Nayak/OHOTECHN](https://github.com/Himansu-Nayak/OHOTECHN)  
**Evaluator**: Antigravity (Google DeepMind Advanced Agentic Pair Programmer)

---

## Executive Summary

This forensic report documents the complete architectural reality of the OHO TECH production codebase prior to software-reseller marketplace integration. Every finding in this report is grounded in the actual codebase: Spring Boot 4.0 / Java 21 backend, PostgreSQL 17 database, and Next.js 16 (React 19 / Turbopack) App Router frontend.

The repository already possesses substantial enterprise infrastructure for commerce, payments, licensing, administration, and developer operations. The objective of the software-reseller marketplace is to extend this existing architecture cleanly—keeping OHO TECH as the outward-facing seller/brand while handling external software provider agencies as an internal operational relationship with strict wholesale cost and margin isolation.

---

## 1. Existing Architecture

### 1.1 Backend Architecture
- **Language & Runtime**: Java 21 LTS, Spring Boot 4.0 (`backend/pom.xml`)
- **Persistence & ORM**: Spring Data JPA / Hibernate Core 7.4.1 / HikariCP connection pool
- **Database**: PostgreSQL 17 on Port 5432 (`OHOTECH` database, configured via `application.properties`)
- **Security**: Spring Security 6 with stateless JWT authentication filter (`JwtAuthenticationFilter`), BCrypt password hashing, and role-based method security (`@EnableMethodSecurity`, `@PreAuthorize`)
- **External Integrations**:
  - **Razorpay**: Official Java SDK (`razorpay-java:1.4.3`) for order creation, HMAC-SHA256 signature verification, server-side payment capture/refunds, and webhook ingestion (`RazorpayWebhookController`)
  - **Direct UPI & Bank Transfer**: Native manual UTR transaction verification workflow with duplicate UTR detection
  - **Email**: Spring Mail / Resend integration with HTML email templating (`EmailTemplateService`)
  - **AI / LLM**: Google Gemini API (`gemini-2.5-flash` model, embeddings, automated document & ticket classification)
  - **Firebase Admin SDK**: Optional server-side Firebase Authentication integration (`FirebaseService`)

### 1.2 Frontend Architecture
- **Framework**: Next.js 16.3.0 with Turbopack, React 19, TypeScript
- **Styling & UI**: Tailwind CSS, PostCSS, Lucide React icons, Motion (Framer Motion)
- **State & Context**:
  - `AuthContext`: User session, JWT token persistence in `localStorage`, role resolution
  - `CartContext`: Shopping cart state, local and server-synchronized cart items
  - `ToastContext`: System-wide toast notification alerts
- **Routing Strategy**:
  - Public marketing routes: `/`, `/about`, `/contact`, `/pricing`, `/services`, `/solutions/[industry]`, `/work/[slug]`, `/insights/[slug]`
  - Commerce routes: `/products`, `/products/[id]`, `/cart`, `/checkout`, `/orders`
  - Customer Self-Service: `/my-products`, `/licenses`, `/subscriptions`, `/downloads`, `/support`
  - Administrative Control Center: `/admin` (Tabbed single-page enterprise operational console)
  - Developer Operations: `/developer` (Diagnostics, API key vault, webhook simulator, operational deployments, telemetry)

---

## 2. Existing Product Model

### 2.1 Backend Entity (`Product.java`)
Location: `backend/src/main/java/com/ohotech/backend/entity/Product.java`
- **Table**: `products`
- **Fields**:
  - `id` (Long, PK, Auto-increment)
  - `name` (String, Not Null)
  - `slug` (String, unique catalog identifier)
  - `description` (String, length 2000)
  - `price` (BigDecimal, Not Null — customer-facing selling price)
  - `providerCost` (BigDecimal — wholesale cost from provider, internal only)
  - `resellerMargin` (BigDecimal — OHO TECH markup, internal only)
  - `provider` (ManyToOne `Provider`, lazy-loaded, foreign key `provider_id`)
  - `integrationStatus` (String — defaults to "Integration pending provider/API information")
  - `deploymentType` (String — defaults to "MANAGED_CLOUD")
  - `lifecycleStatus` (String — "ACTIVE", "DRAFT", "PAUSED", "ARCHIVED")
  - `demoUrl` (String — live demo URL)
  - `documentationUrl` (String — product documentation URL)
  - `featured` (boolean)
  - `stock` (Integer, defaults to 100)
  - `imageUrl` (String)
  - `serviceType` (String)
  - `category` (ManyToOne `Category`, eager-loaded, foreign key `category_id`)
  - `active` (boolean, defaults to true)
  - `createdAt`, `updatedAt` (LocalDateTime)

### 2.2 Product Pricing & Wholesale Isolation Rules
- **Financial Calculation**: `price = providerCost + resellerMargin`.
- **Public Serialization (`mapToPublicDto` / `PublicProductDto`)**:
  - `providerCost`: `null` (never leaked to public visitors or customers)
  - `resellerMargin`: `null` (never leaked)
  - `providerId`: `null` (never leaked)
  - `providerName`: `null` (never leaked)
- **Admin Serialization (`mapToAdminDto` / `AdminProductDto`)**:
  - Fully exposed only to authorized `ROLE_ADMIN` and `ROLE_DEVELOPER` principals.

---

## 3. Existing Order Flow

### 3.1 Order Lifecycle
Location: `backend/src/main/java/com/ohotech/backend/service/OrderService.java`
```
CUSTOMER ADDS PRODUCT/PLAN TO CART
             ↓
POST /api/orders (createOrderFromCart)
             ↓
Validate Cart Items & Product Plans
             ↓
Create Order in PENDING status (Order.java)
             ↓
Await Payment via Razorpay or UPI
```

### 3.2 Order Status Enumeration (`OrderStatus.java`)
- `PENDING`: Initial state when order is placed from cart
- `CONFIRMED`: Order approved or verified
- `PAID`: Payment successfully captured and verified
- `PROCESSING`: Operational processing underway
- `SHIPPED`: Physical or hardware delivery in transit
- `DELIVERED`: Delivered/Completed
- `CANCELLED`: Order cancelled or rejected
- `REFUNDED`: Payment refunded, licenses revoked

---

## 4. Existing Payment Flow

### 4.1 Payment Verification Architecture
Location: `backend/src/main/java/com/ohotech/backend/service/PaymentService.java`
- **Supported Payment Methods**:
  1. **Razorpay Online Gateway**:
     - `POST /api/payments/razorpay/create-order`: Backend initializes order using official Razorpay Java SDK. Returns `razorpayOrderId`.
     - `POST /api/payments/razorpay/verify`: Customer submits `razorpayOrderId`, `razorpayPaymentId`, and `razorpaySignature`.
     - Backend performs cryptographic **HMAC-SHA256 signature verification** against `razorpay.key-secret`.
     - In live mode, backend queries `razorpay.payments.fetch(paymentId)` to verify amount (in paise) and status (`captured` or `authorized`).
  2. **Direct Bank Transfer / UPI**:
     - Customer submits UTR transaction reference (`payerUpiId`, `payerName`, `transactionReference`).
     - State becomes `PENDING` with method `UPI` or `BANK_TRANSFER`.
     - Admin verifies via `POST /api/admin/payments/{id}/verify` with duplicate UTR validation.
  3. **Cash on Delivery (COD)**:
     - Available for physical/hardware devices.

### 4.2 Entitlements Trigger (`createEntitlementsForOrder`)
When payment is confirmed `SUCCESSFUL` and order status becomes `PAID`:
1. `Subscription` is created or retrieved for each purchased product/plan.
2. `License` with unique cryptographic key is generated and activated.
3. `Deployment` record is created in `PENDING` state with target environment matching `product.getDeploymentType()`.
4. Automated provisioning dispatch is invoked via `SoftwareProvisioningService.dispatchProvisioning(deployment)`.
5. Customer cart is cleared.
6. Email and in-app notifications are dispatched to the customer.

---

## 5. Existing License Flow

### 5.1 Backend License Model (`License.java`)
Location: `backend/src/main/java/com/ohotech/backend/entity/License.java`
- Table: `licenses`, unique index on `licenseKey`
- Attributes:
  - `licenseKey`: Format `OHO-XXXX-XXXX-XXXX` generated by `LicenseService.generateUniqueLicenseKey()`
  - `status`: `LicenseStatus` (`ACTIVE`, `EXPIRED`, `REVOKED`, `SUSPENDED`)
  - `activationLimit`: Integer (device seats limit, default 1)
  - `activationCount`: Integer (number of currently active device hardware activations)
  - `user`: Owning customer
  - `product`: Licensed software product
  - `productPlan`: Associated plan tier (e.g. Starter, Professional, Enterprise)
  - `subscription`: Associated subscription
  - `issuedAt`, `expiresAt`, `revokedAt`

### 5.2 Device Activation
Location: `backend/src/main/java/com/ohotech/backend/entity/DeviceActivation.java`
- Tracks machine hardware fingerprints, OS details, IP addresses, and activation heartbeats.

---

## 6. Existing Subscription Flow

### 6.1 Backend Subscription Model (`Subscription.java`)
Location: `backend/src/main/java/com/ohotech/backend/entity/Subscription.java`
- Table: `subscriptions`
- Status: `SubscriptionStatus` (`ACTIVE`, `EXPIRED`, `CANCELLED`, `TRIAL`)
- Attributes:
  - `startDate`, `expiryDate` (null for `LIFETIME` billing)
  - `autoRenew`: boolean
  - Associated `order`, `product`, `productPlan`, and `user`
- Handled by `SubscriptionService` and `TrialService` for free trial evaluations.

---

## 7. Existing Admin Architecture

### 7.1 Frontend Admin Console (`/admin`)
Location: `src/app/(marketing)/admin/page.tsx`
The Admin Console is structured into five operational pillars with a sidebar navigation (`AdminSidebar.tsx`):
1. **Overview**: Dashboard (`AdminDashboardView.tsx`), Business Analytics (`AdminAnalyticsView.tsx`)
2. **Commerce**: Products (`AdminProductsView.tsx`), Orders (`AdminOrdersView.tsx`), Payments (`AdminPaymentsView.tsx`), Subscriptions (`AdminSubscriptionsView.tsx`), Licenses (`AdminLicensesView.tsx`)
3. **Reseller Marketplace**:
   - Provider Agencies (`AdminProvidersView.tsx`): Full CRUD, partner details, commission rates, support SLAs, contract statuses.
   - Deployments & VPS (`AdminDeploymentsView.tsx`): Real operational queue with status filters, engineer assignment, server notes, access URL configuration.
4. **Customers & CRM**: Customers (`AdminCustomersView.tsx`), Customer 360 (`Customer360View`), Leads & Enquiries (`AdminLeadsView.tsx`), Sales Pipeline (`CrmPipeline`), Quotes (`AdminQuotesView.tsx`), Support Desk (`AdminSupportDeskView.tsx`)
5. **Platform & Operations**: Releases (`AdminReleasesView.tsx`), Payment Gateways (`AdminGatewaysView.tsx`), AI Operations (`AdminAiTab.tsx`), Settings & Audit Logs (`AdminSettingsView.tsx`)

### 7.2 Backend Admin Controllers
- `AdminController.java`: Global admin stats and overview metrics
- `AdminProviderController.java`: `/api/admin/providers/**`
- `AdminDeploymentController.java`: `/api/admin/deployments/**`
- `AdminPaymentGatewayController.java`: `/api/admin/gateways/**`
- `AdminAiController.java`: `/api/admin/ai/**`

---

## 8. Existing Developer Architecture

### 8.1 Frontend Developer Studio (`/developer`)
Location: `src/app/(marketing)/developer/page.tsx`
- Restricted to `ROLE_DEVELOPER` and `ROLE_ADMIN`.
- Tabs:
  - **Operational Deployments**: Directly embeds `AdminDeploymentsView` for operational engineers to view assigned deployments, update technical notes, configure environments, and mark systems ready/live.
  - **Analytics**: Real telemetry on device activations, downloads, OS distribution (`getDeveloperAnalyticsApi`).
  - **API Keys Vault**: Management and generation of backend programmatic API keys.
  - **Webhooks Simulator**: Dispatches real HTTP requests to external URLs and records execution latency and HTTP status in `WebhookEventRepository`.
  - **System Diagnostics**: Displays live JVM memory, heap usage %, thread counts, uptime, database connection pool status, and masked JDBC URLs.
  - **Audit Logs**: Technical audit log stream from `AuditService`.

### 8.2 Backend Developer Controller (`DeveloperController.java`)
Location: `backend/src/main/java/com/ohotech/backend/controller/DeveloperController.java`
- Endpoints:
  - `GET /api/developer/config`: Active profiles, platform version.
  - `GET /api/developer/diagnostics`: Live JVM, HikariCP, OS metrics.
  - `GET /api/developer/keys`, `POST /api/developer/keys`, `POST /api/developer/keys/{id}/revoke`: API key vault.
  - `GET /api/developer/webhooks`, `POST /api/developer/webhooks/test`: Webhook history & real HTTP dispatcher.
  - `GET /api/developer/audit-logs`: Technical audit log stream.
  - `GET /api/developer/analytics`: Telemetry analytics.
  - `GET /api/developer/deployments`: Operational deployment queue.
  - `POST /api/developer/deployments/{id}/transition`: State transitions (`ASSIGN`, `START_CONFIGURATION`, `MARK_TESTING`, `MARK_READY`, `MARK_LIVE`, `SUSPEND`, `CANCEL`) with audit logging.

---

## 9. Existing Customer Architecture

### 9.1 Frontend Customer Portal (`/my-products`)
Location: `src/app/(marketing)/my-products/page.tsx`
- Restricted to authenticated customers.
- Displays:
  - Entitled products purchased by the customer
  - Active cryptographic license keys with one-click copy
  - Device seat allocation
  - Provisioning and deployment tracking status (`PENDING`, `CONFIGURING`, `TESTING`, `READY`, `LIVE`)
  - Customer-safe handover instructions
  - "Launch Application" button pointing to `deployment.accessUrl` (ONLY rendered when status is `LIVE` and access URL is present)
  - Direct links to `/downloads` and `/licenses`
- **Wholesale Isolation**: Customer NEVER sees provider name, wholesale cost, OHO margin, or internal admin notes.

### 9.2 Backend Customer Deployment Controller (`CustomerDeploymentController.java`)
Location: `backend/src/main/java/com/ohotech/backend/controller/CustomerDeploymentController.java`
- Endpoints:
  - `GET /api/deployments/my`: Returns strictly deployments owned by `currentUser.getId()`. Internal `adminNotes` are stripped (`mapToCustomerDto`).
  - `GET /api/deployments/{id}`: Validates ownership. If another customer attempts to access, returns **HTTP 403 Forbidden**. Internal `adminNotes` are nullified.

---

## 10. Existing Database Structure

### 10.1 Schema Strategy
- **Mode**: Hibernate `ddl-auto=update` in development with complementary manual schema migration scripts located in `backend/src/main/resources/`:
  - `schema_update_payments.sql`
  - `schema_update_audit.sql`
  - `schema_update_support.sql`
  - `schema_update_otp.sql`
  - `schema_update_firebase.sql`
- **Primary Tables**:
  - `users`: Core identity, roles (`ROLE_CUSTOMER`, `ROLE_ADMIN`, `ROLE_DEVELOPER`, `ROLE_SUPPORT`), email verification, lockout tracking.
  - `providers`: Software provider agencies, commercial terms, integration status, support/deployment SLAs.
  - `products`: Software solutions catalog, wholesale cost, reseller margin, provider FK, category FK.
  - `orders` & `order_items`: Order records, financial totals, status.
  - `payments`: Razorpay and offline transaction details, HMAC signatures, UTR numbers, audit verification.
  - `deployments`: Instance provisioning state machine, assigned engineers, access URLs, customer and admin notes.
  - `subscriptions` & `licenses`: Entitlements, cryptographic keys, seat counts, expiration dates.
  - `audit_logs`: User and system operational audit events with actor metadata.
  - `api_keys`: Encrypted programmatic developer tokens.
  - `webhook_events`: Ingested and dispatched webhook events.

---

## 11. Existing Authentication / RBAC

### 11.1 Role Hierarchy (`Role.java`)
- `ROLE_CUSTOMER`: Default role for all public registrants. Permitted to browse products, place orders, make payments, track owned deployments, and manage owned licenses.
- `ROLE_DEVELOPER`: Technical infrastructure engineers. Permitted access to developer diagnostics, webhook testing, system telemetry, and assigned deployment operations.
- `ROLE_SUPPORT`: Help desk staff. Permitted access to support tickets and customer enquiries.
- `ROLE_ADMIN`: Full administrative control over providers, wholesale costs, margins, deployments, catalog, financial reconciliation, and user roles.

### 11.2 Security Configuration (`SecurityConfig.java`)
- CSRF disabled (stateless JWT architecture).
- HSTS, Content Type Options, and same-origin frame options enforced.
- Rate limiting filter (`RateLimitingFilter`) applied before authentication.
- Strict route authorization matching:
  - `/api/auth/**`, `/api/health`, `/api/contact`, `/api/ai/**` -> Public
  - `GET /api/products/**`, `GET /api/categories/**` -> Public
  - `/api/deployments/my`, `/api/products/my` -> Authenticated
  - `/api/deployments/**` -> Authenticated with ownership check
  - `/api/admin/**` -> `hasAuthority('ROLE_ADMIN')`
  - `/api/developer/**` -> `hasAnyAuthority('ROLE_ADMIN', 'ROLE_DEVELOPER')`

---

## 12. Existing Deployment / Release Architecture

### 12.1 Software Releases (`SoftwareRelease.java`)
- Models downloadable software builds (Windows `.exe`, macOS `.dmg`, Linux `.AppImage`, Docker Compose bundles).
- Gated by `SoftwareReleaseService.isUserEntitledToProduct()` to verify that the user holds an active subscription, valid license, or paid order before allowing binary downloads.

### 12.2 Deployment Engine (`Deployment.java` & `DeploymentService.java`)
- Lifecycle transitions:
  `PENDING` -> `ASSIGNED` -> `CONFIGURING` -> `TESTING` -> `READY` -> `LIVE` -> `SUSPENDED` -> `CANCELLED`
- Pluggable Provisioning Provider abstraction:
  - `SoftwareProvisioningProvider` interface
  - `ManualProvisioningProvider` (default fallback for manual engineer provisioning)
  - `ApiProvisioningProvider` (external agency REST provisioning)
  - `WebhookProvisioningProvider` (external agency webhook provisioning)
  - `HostedSaaSProvisioningProvider` (tenant creation)
  - `DedicatedInstanceProvisioningProvider` (single-tenant VPS provisioning)
- Automatically initiated on payment confirmation.

---

## 13. Existing Gaps

While the core entities and workflows exist and pass tests, the following operational and architectural gaps were identified during inspection:

1. **Compile-Time Public Product DTO Enforcement in Public Endpoints**:
   - `ProductController.getProducts` and `ProductController.getProductById` return `ProductDto` (which has `providerCost` and `resellerMargin` fields, set to `null` via `mapToPublicDto`). While safe at runtime, migrating to the structurally immutable `PublicProductDto` guarantees at compile-time that wholesale fields cannot ever be serialized or leaked.
2. **Developer Studio Frontend Mock State Cleanliness**:
   - `src/app/(marketing)/developer/page.tsx` contained lingering placeholder arrays for users and simulation timers from earlier prototypes, even though real backend endpoints (`/api/developer/diagnostics`, `/api/developer/keys`, `/api/developer/webhooks`) exist.
3. **Database Schema Script for Reseller Marketplace**:
   - While JPA automatically creates/updates `providers` and `deployments` tables via Hibernate, a dedicated SQL migration file `schema_update_reseller.sql` should be provided in `backend/src/main/resources/` for clean DBA execution and production auditability.
4. **Documentation Artifacts**:
   - The master specifications `RESELLER_PROVIDER_ONBOARDING_CHECKLIST.md` and `RESELLER_IMPLEMENTATION_FINAL_REPORT.md` must be formalized to satisfy Phase 29 & 30 requirements.

---

## 14. Files That Must Be Modified

The following files participate directly in closing the identified gaps:

| Component | File Path | Modification Purpose |
| :--- | :--- | :--- |
| **Backend Controller** | `backend/src/main/java/com/ohotech/backend/controller/ProductController.java` | Ensure `PublicProductDto` is returned for public catalog endpoints to provide compile-time wholesale isolation. |
| **Database Migration** | `backend/src/main/resources/schema_update_reseller.sql` | Provide idempotent PostgreSQL 17 DDL script for `providers`, `deployments`, and `products` reseller columns. |
| **Documentation** | `RESELLER_MARKETPLACE_ARCHITECTURE.md` | Complete full system architecture documentation. |
| **Documentation** | `RESELLER_PROVIDER_ONBOARDING_CHECKLIST.md` | Complete partner agency onboarding checklist. |
| **Documentation** | `RESELLER_IMPLEMENTATION_FINAL_REPORT.md` | Complete comprehensive final implementation report. |

---

## 15. Files That Must NOT Be Modified

To protect existing working functionality, approved designs, and critical payment/licensing integrity, the following files MUST NOT be modified:

| Component | File Path | Preservation Rationale |
| :--- | :--- | :--- |
| **Security Core** | `backend/src/main/java/com/ohotech/backend/security/SecurityConfig.java` | Security filter chain, CORS configuration, and RBAC rules are tested and verified. |
| **Token Handling** | `backend/src/main/java/com/ohotech/backend/security/JwtTokenProvider.java` | Cryptographic JWT signing and validation logic must remain untouched. |
| **Payment Signature** | `backend/src/main/java/com/ohotech/backend/service/PaymentService.java` (Core verification) | HMAC-SHA256 signature verification and Razorpay payment fetch logic are working and pass 100% of tests. |
| **License Generation**| `backend/src/main/java/com/ohotech/backend/service/LicenseService.java` | Key generation and seat activation algorithm is established and active in production. |
| **Order Processing** | `backend/src/main/java/com/ohotech/backend/service/OrderService.java` | Cart checkout, total calculation, and order entity creation are stable and tested. |
| **Public Header** | `src/components/layout/Header.tsx` | Approved public navigation layout. |
| **Public Footer** | `src/components/layout/Footer.tsx` | Approved public footer layout and legal links. |
| **Approved Marketing**| `src/components/home/HeroExperience.tsx`, `DirectorSection.tsx`, `SelectedWork.tsx` | Approved marketing sections must remain strictly untouched. |

---

## Conclusion & Readiness

The repository inspection confirms that **OHO TECH already has a sound foundation** for the Software Reseller Marketplace. The existing `Provider`, `Product`, and `Deployment` models align with the business goals. Wholesale isolation is enforced in backend services, payment verification automatically triggers deployment records, and tests confirm that customers cannot access internal wholesale data or other customers' deployments.

We are ready to proceed with the remaining verification, documentation, and targeted refinements in accordance with the user instructions.
