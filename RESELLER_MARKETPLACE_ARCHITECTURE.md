# OHO TECH Software Reseller Marketplace Architecture Specification

**Status**: Verified & Operational  
**Platform**: Spring Boot 4.0 (Java 21 LTS) + Next.js 16 (React 19 / Turbopack)  
**Database**: PostgreSQL 17  
**Repository**: [Himansu-Nayak/OHOTECHN](https://github.com/Himansu-Nayak/OHOTECHN)  

---

## 1. High-Level Architecture Overview

OHO TECH operates as the primary software merchant and brand of record. Third-party software providers and engineering agencies supply turnkey software products, ERP engines, and SaaS applications to OHO TECH under wholesale and reseller agreements.

### Core Business Axioms:
1. **Single Brand Presence**: Customers always purchase from and interact with OHO TECH. The external provider/agency remains an internal operational relationship.
2. **Strict Financial Isolation**: Wholesale provider costs, profit margins, and agency contracts are internal operational secrets. They are strictly isolated and never exposed to customers or public endpoints.
3. **Operational Truth**: Real operational states (`PENDING` → `ASSIGNED` → `CONFIGURING` → `TESTING` → `READY` → `LIVE`) are tracked without simulated progress or fake cloud actions.
4. **Server-Authoritative Pricing**: Selling prices are governed strictly on the server: `price = providerCost + resellerMargin`.

```
+-------------------------------------------------------------------------------+
|                             OHO TECH MARKETPLACE                              |
+-------------------------------------------------------------------------------+
       |                                                 |
       v                                                 v
+-----------------------------+               +-----------------------------+
|    PUBLIC CATALOG & STORE   |               |     CUSTOMER PORTAL         |
|  - OHO TECH Branded Catalog |               |  - My Products              |
|  - Customer Selling Price   |               |  - License Keys (Seats)     |
|  - Features & Real Demos    |               |  - Provisioning Lifecycle   |
|  - Add to Cart & Checkout   |               |  - Launch App (When LIVE)   |
+-----------------------------+               +-----------------------------+
               |                                             ^
               v                                             |
+-------------------------------------------------------------------------------+
|                      BACKEND COMMERCE & PROVISIONING                          |
|  - OrderService: Validates cart & active products                             |
|  - PaymentService: Razorpay HMAC-SHA256 signature verification / Offline UTR  |
|  - LicenseService: Issues cryptographic license key (OHO-XXXX-XXXX-XXXX)      |
|  - DeploymentService: Creates & tracks operational deployment pipeline       |
|  - ProvisioningService: Modular dispatch (Manual / API / Webhook / SaaS / VPS)|
+-------------------------------------------------------------------------------+
       ^                                                 ^
       |                                                 |
+-----------------------------+               +-----------------------------+
|        ADMIN CONSOLE        |               |      DEVELOPER STUDIO       |
|  - Provider Agency CRUD     |               |  - Assigned Deployments     |
|  - Wholesale Cost & Margins |               |  - Environment Config & QA  |
|  - Financial Analytics      |               |  - System Diagnostics       |
|  - Engineer Assignment      |               |  - Webhook Delivery Tests   |
+-----------------------------+               +-----------------------------+
       |                                                 |
       +-------------------------------------------------+
                               |
                               v
               +-------------------------------+
               |    INTERNAL PROVIDER / AGENCY |
               |  - Contract & Wholesale Terms |
               |  - Integration Specifications |
               |  - Support SLA & Handover     |
               +-------------------------------+
```

---

## 2. Database Model

The database schema runs on **PostgreSQL 17** with Hibernate JPA mapping and idempotent migration scripts (`schema_update_reseller.sql`).

### 2.1 Provider Entity (`providers`)
Models the external agency providing software solutions to OHO TECH.
- `id` (BIGSERIAL PK): Unique identifier.
- `name` (VARCHAR(255) NOT NULL UNIQUE): Agency brand or trade name.
- `company_name` (VARCHAR(255)): Registered legal entity name.
- `contact_person` (VARCHAR(255)): Key partner manager name.
- `contact_email` (VARCHAR(255)): Official communication email.
- `contact_phone` (VARCHAR(50)): Phone number.
- `website` (VARCHAR(255)): Agency website.
- `commercial_terms` (VARCHAR(2000)): Internal wholesale arrangements (e.g. 60/40 revenue split).
- `commission_rate` (NUMERIC(5, 2)): Default commission percentage.
- `technical_integration_type` (VARCHAR(50)): `API`, `WEBHOOK`, `SOURCE_CODE`, `DEDICATED_INSTANCE`, `HOSTED_SAAS`, `PENDING_SPECS`.
- `integration_status` (VARCHAR(50)): `ACTIVE`, `IN_REVIEW`, `SUSPENDED`, `ONBOARDING`, `PENDING_API_INFO`.
- `support_responsibility` (VARCHAR(50)): `OHO_TECH`, `PROVIDER`, `SHARED`.
- `deployment_responsibility` (VARCHAR(50)): `OHO_TECH_VPS`, `PROVIDER_CLOUD`, `CUSTOMER_SELF_HOSTED`.
- `contract_status` (VARCHAR(50)): `DRAFT`, `ACTIVE`, `RENEWAL_DUE`, `TERMINATED`.
- `notes` (VARCHAR(2000)): Internal operational notes.
- `active` (BOOLEAN DEFAULT TRUE): Availability toggle.
- `created_at`, `updated_at` (TIMESTAMP).

### 2.2 Product Entity Extension (`products`)
- `provider_id` (BIGINT FK → `providers(id)` ON DELETE SET NULL): Associated agency.
- `provider_cost` (NUMERIC(19, 2)): Wholesale cost from provider. **STRICTLY CONFIDENTIAL**.
- `reseller_margin` (NUMERIC(19, 2)): OHO TECH markup. **STRICTLY CONFIDENTIAL**.
- `price` (NUMERIC(19, 2)): Customer selling price (`provider_cost + reseller_margin`).
- `deployment_type` (VARCHAR(100)): `MANAGED_CLOUD`, `VPS_DEDICATED`, `SAAS_SHARED`, `STANDALONE_LICENSE`.
- `integration_status` (VARCHAR(255)): Current operational integration state.
- `demo_url` (VARCHAR(500)): Live interactive demo link.
- `documentation_url` (VARCHAR(500)): Customer knowledge base link.
- `featured` (BOOLEAN): Showcase flag on marketplace homepage.

### 2.3 Deployment Entity (`deployments`)
Models customer software instance provisioning.
- `id` (BIGSERIAL PK): Unique deployment job identifier.
- `order_id` (BIGINT FK → `orders(id)` ON DELETE SET NULL): Parent purchase order.
- `product_id` (BIGINT FK → `products(id)` ON DELETE RESTRICT): Purchased software product.
- `user_id` (BIGINT FK → `users(id)` ON DELETE RESTRICT): Customer owner.
- `license_id` (BIGINT FK → `licenses(id)` ON DELETE SET NULL): Issued software license key.
- `status` (VARCHAR(50) NOT NULL): Current state (`PENDING`, `ASSIGNED`, `CONFIGURING`, `TESTING`, `READY`, `LIVE`, `SUSPENDED`, `CANCELLED`).
- `target_environment` (VARCHAR(100)): Target host configuration (`CLOUD_MANAGED`, `VPS_HOSTED`, etc.).
- `access_url` (VARCHAR(500)): Production customer access URL (visible to customer ONLY when status is `LIVE`).
- `assigned_engineer` (VARCHAR(255)): Name of the developer or ops engineer assigned.
- `admin_notes` (VARCHAR(2000)): Internal server credentials/IPs. **NEVER EXPOSED TO CUSTOMER**.
- `customer_notes` (VARCHAR(2000)): Customer-facing setup instructions.
- `completed_at` (TIMESTAMP): Set when deployment is transitioned to `LIVE`.

---

## 3. API Model & Contract Specification

### 3.1 Public Endpoints
- `GET /api/products`: Paginated public catalog. Maps to `PublicProductDto` / `mapToPublicDto`. `providerCost`, `resellerMargin`, `providerId`, `providerName` are **null** and omitted.
- `GET /api/products/{id}`: Product details. Wholesale fields are omitted.
- `GET /api/products/slug/{slug}`: Product details by slug. Wholesale fields are omitted.

### 3.2 Customer Endpoints
- `GET /api/deployments/my`: Retrieves all deployments owned by the authenticated customer. `adminNotes` are stripped.
- `GET /api/deployments/{id}`: Retrieves specific deployment. Rejects unowned requests with **HTTP 403 Forbidden**. Strips `adminNotes`.

### 3.3 Admin Endpoints
- `GET /api/admin/providers`: Paginated list of software providers.
- `GET /api/admin/providers/{id}`: Detailed provider profile with commercial terms.
- `POST /api/admin/providers`: Onboard new provider agency.
- `PUT /api/admin/providers/{id}`: Update provider agency.
- `PATCH /api/admin/providers/{id}/status`: Toggle provider active state.
- `GET /api/admin/deployments`: Paginated deployment queue with status filters.
- `GET /api/admin/deployments/{id}`: Full deployment record with internal admin notes.
- `PUT /api/admin/deployments/{id}/status`: Update deployment status, assign engineer, set access URL.
- `PUT /api/admin/deployments/{id}/customer-notes`: Update customer instructions.

### 3.4 Developer Endpoints
- `GET /api/developer/deployments`: Operational deployment queue.
- `POST /api/developer/deployments/{id}/transition`: State transitions (`ASSIGN`, `START_CONFIGURATION`, `MARK_TESTING`, `MARK_READY`, `MARK_LIVE`, `SUSPEND`, `CANCEL`) with audit logging.
- `GET /api/developer/diagnostics`: Live JVM memory, thread counts, HikariCP connection pool metrics.
- `POST /api/developer/webhooks/test`: Real HTTP dispatcher testing external webhooks.

---

## 4. Role-Based Access Control (RBAC)

| Resource / Endpoint | `ROLE_CUSTOMER` | `ROLE_DEVELOPER` | `ROLE_ADMIN` | Anonymous Public |
| :--- | :---: | :---: | :---: | :---: |
| `GET /api/products/**` | Allowed (Wholesale Hidden) | Allowed | Allowed (Full Wholesale) | Allowed (Wholesale Hidden) |
| `POST /api/orders` | Allowed | Allowed | Allowed | Denied (HTTP 401) |
| `POST /api/payments/**` | Allowed | Allowed | Allowed | Denied (HTTP 401) |
| `GET /api/deployments/my` | Allowed (Owned Only) | Allowed (Owned Only) | Allowed (All) | Denied (HTTP 401) |
| `GET /api/deployments/{id}` | Allowed (Owned Only) | Allowed | Allowed | Denied (HTTP 401) |
| `POST /api/developer/**` | Denied (HTTP 403) | Allowed | Allowed | Denied (HTTP 401) |
| `POST /api/admin/providers/**` | Denied (HTTP 403) | Denied (HTTP 403) | Allowed | Denied (HTTP 401) |
| `PUT /api/admin/deployments/**`| Denied (HTTP 403) | Denied (HTTP 403) | Allowed | Denied (HTTP 401) |

---

## 5. End-to-End Payment & Provisioning Workflow

```
[Customer selects Product & Plan]
                ↓
[POST /api/orders] -> Order created (Status: PENDING)
                ↓
[POST /api/payments/razorpay/create-order] -> Razorpay Order initialized
                ↓
[Customer completes Razorpay checkout modal]
                ↓
[POST /api/payments/razorpay/verify]
                ↓
- Cryptographic HMAC-SHA256 signature verification
- Server-side Razorpay SDK payment fetch (verifies captured status & exact paise)
- Payment status -> SUCCESSFUL, Order status -> PAID
                ↓
[createEntitlementsForOrder(order)]
  1. Create Subscription (status: ACTIVE)
  2. Create License (cryptographic key: OHO-XXXX-XXXX-XXXX, status: ACTIVE)
  3. Create Deployment (status: PENDING, targetEnvironment: MANAGED_CLOUD)
  4. Dispatch to SoftwareProvisioningService (Manual / API / Webhook)
  5. Clear Customer Cart
  6. Dispatch Confirmation Email & In-App Notification
```

---

## 6. Deployment Provisioning State Machine

```
   PENDING  (Initialized upon verified order payment)
      ↓
   ASSIGNED (Admin or Lead assigns ops/cloud engineer)
      ↓
 CONFIGURING (Engineer provisions VPS, configures DB, installs Docker Compose)
      ↓
   TESTING  (Engineer runs health checks, SSL verification, smoke tests)
      ↓
    READY   (Deployment verified, awaiting final production go-ahead)
      ↓
    LIVE    (Access URL configured, "Launch Application" unlocked for customer)
      ↓ (Optional lifecycle actions)
  SUSPENDED / CANCELLED
```

---

## 7. Security Model & Wholesale Isolation

1. **DTO Separation**:
   - `PublicProductDto`: Compile-time structural guarantee of zero wholesale leakage.
   - `ProductDto.mapToPublicDto()`: Overrides `providerCost = null`, `resellerMargin = null`, `providerId = null`, `providerName = null`.
   - `JsonInclude(NON_NULL)`: Omits null attributes entirely from serialized JSON strings.
2. **Access Control**:
   - Customer ownership checks in `CustomerDeploymentController`.
   - Admin notes (`adminNotes`) stripped in `mapToCustomerDto()`.
3. **Audit Trail**:
   - Every administrative and developer transition is captured in `AuditLog` via `AuditService.logUserEvent()`.
   - Passwords, credit card tokens, JWT secrets, and API keys are strictly excluded from audit logs.

---

## 8. Environment Variables

| Variable | Default / Description | Sensitivity |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/OHOTECH` | Medium |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Secret |
| `SPRING_DATASOURCE_PASSWORD` | PostgreSQL user password | Secret |
| `JWT_SECRET` | 32+ byte cryptographic secret for token signing | Critical Secret |
| `RAZORPAY_KEY_ID` | Razorpay Merchant Key ID (`rzp_live_...`) | Medium |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Critical Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret | Critical Secret |
| `FRONTEND_URL` | `https://ohotechn.com` | Low |
| `PORT` | `8080` | Low |

---

## 9. Production Deployment Requirements

- **Operating System**: Linux (Ubuntu 22.04 LTS / 24.04 LTS) or Windows Server
- **Database Engine**: PostgreSQL 17
- **Reverse Proxy**: Nginx with SSL termination via Let's Encrypt / Cloudflare
- **Java Virtual Machine**: Eclipse Temurin OpenJDK 21 LTS
- **Node.js Runtime**: Node.js 20 LTS / 22 LTS
