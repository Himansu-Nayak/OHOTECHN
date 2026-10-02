# OHO TECH Software Reseller Marketplace Architecture

## 1. Overview & Single Source of Truth
The OHO TECH Reseller Marketplace extends the existing Spring Boot and Next.js full-stack platform to enable software distribution from third-party developer agencies and software houses without inventing duplicate systems or parallel data models.

---

## 2. Core Entities & Data Architecture

### 2.1 Provider Agency Model (`Provider.java`)
- **Entity**: `com.ohotech.backend.entity.Provider` (Table: `providers`)
- **Attributes**:
  - `name`, `companyName`, `contactPerson`, `contactEmail`, `contactPhone`, `website`
  - `commercialTerms` (e.g. wholesale split, referral percentage, commission rates)
  - `technicalIntegrationType` (`API`, `WEBHOOK`, `SOURCE_CODE`, `DEDICATED_INSTANCE`, `HOSTED_SAAS`, `PENDING_SPECS`)
  - `integrationStatus` (`ACTIVE`, `IN_REVIEW`, `SUSPENDED`, `ONBOARDING`, `PENDING_API_INFO`)
  - `supportResponsibility` (`OHO_TECH`, `PROVIDER`, `SHARED`)
  - `deploymentResponsibility` (`OHO_TECH_VPS`, `PROVIDER_CLOUD`, `CUSTOMER_SELF_HOSTED`)
  - `contractStatus` (`DRAFT`, `ACTIVE`, `RENEWAL_DUE`, `TERMINATED`)
  - `active` (boolean toggle)

### 2.2 Product Extension (`Product.java`)
- Existing `Product` entity extended with minimal reseller attributes:
  - `slug`: Human-readable identifier for cataloging.
  - `provider`: Many-to-One relationship referencing `Provider`.
  - `providerCost`: Wholesale price from the agency (**strictly hidden from customers**).
  - `resellerMargin`: Markup applied by OHO TECH (**strictly hidden from customers**).
  - `price`: Final customer selling price (`price = providerCost + resellerMargin`).
  - `deploymentType`: Operational architecture (`MANAGED_CLOUD`, `VPS_DEDICATED`, `SAAS_SHARED`, `STANDALONE_LICENSE`).
  - `integrationStatus`: Defaults to `"Integration pending provider/API information"`.
  - `demoUrl` & `documentationUrl`: Direct product resources.
  - `featured`: Showcase indicator.

### 2.3 Operational Deployment Model (`Deployment.java`)
- Models the real provisioning state machine (no simulated fake cloud actions):
  - `PENDING` -> `ASSIGNED` -> `CONFIGURING` -> `TESTING` -> `READY` -> `LIVE` -> `SUSPENDED` -> `CANCELLED`
- Associates `order`, `product`, `user`, and `license`.
- Internal `adminNotes` are stripped out for customers; only customer-safe instructions and `accessUrl` are surfaced when `LIVE`.

---

## 3. Strict Security & Wholesale Margin Isolation

### 3.1 Serialization Isolation
- `ProductService.mapToPublicDto()`:
  - Explicitly nullifies `providerCost`, `resellerMargin`, `providerId`, and `providerName`.
  - Guarantees zero wholesale leakage to public visitors or authenticated customer clients.
- `ProductService.mapToAdminDto()`:
  - Provides full financial visibility to administrators (`ROLE_ADMIN`, `ROLE_SUPER_ADMIN`).

### 3.2 Role-Based Access Control (RBAC)
- `/api/admin/providers/**`: Restricted to `ROLE_ADMIN` and `ROLE_SUPER_ADMIN`.
- `/api/admin/deployments/**`: Restricted to administrators.
- `/api/deployments/my`: Restricted to authenticated users, returning only their owned software instances.
- Individual customer access `/api/deployments/{id}` validates ownership and rejects cross-customer queries with HTTP 403.

---

## 4. Operational Frontend Integration

### 4.1 Admin Console (`/admin`)
- **Provider Agencies View**: Management registry for partner agencies, commission rates, support handoff SLAs, and contract status.
- **Deployments & VPS View**: Operational kanban/table for assigned server engineers to track deployments, input access URLs, and provide customer handover notes.
- **Product Management**: Wholesale pricing calculator that dynamically computes customer selling prices based on wholesale agency cost + OHO TECH margin.

### 4.2 Customer Portal (`/my-products`)
- Displays real-time provisioning progress for purchased software solutions.
- Shows direct "Launch Application" CTA and deployment guidelines when the server is flagged as `LIVE`.

---

## 5. Live Production Verification

- **VPS Server**: `200.97.161.128`
- **Backend Service**: `ohotech-backend.service` (Spring Boot, Port 8080)
- **Frontend Service**: `ohotech-frontend.service` (Next.js 16 Turbopack, Port 3000)
- **Database**: PostgreSQL 17 (`ohotech_db`)
- **Status**: Live and verified across all public and authenticated endpoints.
