# OHO TECH — Database Architecture Audit Report

**Audit Target:** Relational Persistence Layer  
**Engine:** PostgreSQL 17 (Default port 5432)  
**ORM / Data Mapping:** Spring Data JPA / Hibernate Core (Spring Boot 4.1.0)  
**Schema Definition Stubs:** `prisma/schema.prisma` & `backend/src/main/resources/schema_update_*.sql`  
**Audit Scope:** JPA Entities, Relations, Indexes, Cascade Rules, Connection Pool, and Dual-ORM Resolution  

---

## 1. Database Schema & Entity Inventory

The backend model consists of **55 JPA Entities and Enums** structured across core commerce, authentication, subscriptions, licensing, and communications:

```
Core Entities:
├── User & Access: User, Role, RefreshToken, ApiKey, OtpVerification
├── Product & Catalog: Product, Category, ProductPlan, ProductEmbedding, SoftwareRelease
├── Order & Commerce: Order, OrderItem, Cart, CartItem, Payment, PaymentSlotLease
├── Licenses & Provisioning: License, DeviceActivation, Deployment, Provider, Subscription
├── Communications & CRM: Lead, LeadActivity, LeadFollowUp, CrmWhatsAppConsent, CrmWhatsAppMessage,
│                         EmailOutbox, EmailSuppression, ContactEnquiry, SupportTicket, SupportTicketMessage
└── Financial & Telemetry: BankCreditAlert, ObserverDevice, AuditLog, WebhookEvent
```

---

## 2. Forensic Analysis: JPA vs. Prisma Ownership

### 2.1 The Dual-ORM Question
The repository contains both:
1. `prisma/schema.prisma` and `@prisma/client` in `package.json`.
2. 55 Spring Data JPA entity classes in `backend/src/main/java/com/ohotech/backend/entity/`.

### 2.2 Forensic Evidence
- A static code analysis searching for `PrismaClient` or `@prisma/client` imports across all `.ts` and `.tsx` files in `src/` revealed **zero usage**.
- The Next.js frontend interacts exclusively with database state via HTTP REST requests to the Spring Boot backend (`http://127.0.0.1:8080/api/*`).
- All 44 backend controllers interact directly with the PostgreSQL database through **37 Spring Data JPA Repositories**.
- **Conclusion:** Prisma is completely dormant, unlinked to production traffic, and constitutes dead code/artifacts.

### 2.3 Authoritative Schema Recommendation
* **Decision:** Codify **Spring Data JPA / PostgreSQL as the single authoritative schema owner**.
* **Action:** Deprecate `prisma/` and remove Prisma CLI and client libraries from `package.json`.
* **Migration Strategy:** Transition from Hibernate `ddl-auto=update` to version-controlled **Flyway** migrations located in `backend/src/main/resources/db/migration/`.

---

## 3. Database Connection Pool & Performance Tuning

### 3.1 HikariCP Configuration
The backend relies on Spring Boot’s default HikariCP connection pool:
- Default Maximum Pool Size: `10`
- Minimum Idle: `10`
- Connection Timeout: `30,000 ms`
- Idle Timeout: `600,000 ms`
- Max Lifetime: `1,800,000 ms`

### 3.2 Sizing Calibration for Hostinger KVM 2 VPS
The Hostinger KVM 2 VPS features 2 vCPU and 8 GB RAM.
According to the PostgreSQL connection pool formula:
$$\text{Pool Size} = (\text{CPU Cores} \times 2) + \text{Disk Spindle Effective Count} = (2 \times 2) + 1 = 5 \text{ to } 10$$
A maximum pool size of `10` to `15` is optimal and prevents memory exhaustion on the shared VPS host.

---

## 4. Forensic Findings & Architectural Defects

### Finding DB-01: Absence of Versioned Database Migration Engine (High)
* **Severity:** High
* **Files:** `backend/pom.xml`, `backend/src/main/resources/application.properties#L12`
* **Actual Problem:**
  The project relies on `spring.jpa.hibernate.ddl-auto=update` combined with manual, unversioned SQL patch scripts (`schema_update_whatsapp_crm.sql`, `schema_update_self_hosted_upi.sql`, etc.).
* **Business / Technical Impact:**
  Hibernate `update` never drops obsolete columns or foreign key constraints, cannot rename columns safely, and does not provide an audit trail of schema changes. Running unsynchronized SQL scripts across staging and production environments risks silent schema drift and catastrophic runtime query failures.
* **Recommended Correction:**
  Introduce `flyway-core` and `flyway-database-postgresql` into `pom.xml`. Consolidate all existing entity schemas into `V1__initial_schema.sql` and convert existing `schema_update_*.sql` scripts into sequential versioned migrations (`V2__...`, `V3__...`).
* **Dependencies & Risks:** High priority; requires baseline snapshot before enabling Flyway in production.
* **Verification Method:** Spin up clean PostgreSQL instance and verify Flyway executes all migrations from V1 to head without errors.

---

### Finding DB-02: Unindexed Foreign Keys and Filter Columns (Medium)
* **Severity:** Medium
* **Files:** `backend/src/main/java/com/ohotech/backend/entity/Lead.java`, `CrmWhatsAppMessage.java#L28`
* **Actual Problem:**
  Several heavily queried columns (e.g. `lead.status`, `crm_whatsapp_message.customer_phone`, `order.user_id`) lack explicit JPA `@Index` declarations in entity definitions, relying entirely on whether Hibernate or manual scripts generated them.
* **Business / Technical Impact:**
  Sequential table scans will degrade database query throughput as customer message volumes, audit records, and sales leads scale into tens of thousands of rows.
* **Recommended Correction:**
  Ensure composite indexes exist on `(customer_phone, created_at)` and `(status, created_at)` via `@Table(indexes = { ... })` annotations.
* **Dependencies & Risks:** Low risk.
* **Verification Method:** Inspect PostgreSQL `pg_stat_user_indexes` and `EXPLAIN ANALYZE` execution plans on admin message search queries.
