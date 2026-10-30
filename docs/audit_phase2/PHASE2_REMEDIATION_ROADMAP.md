# OHO TECH — Phase 2 Architecture Remediation Roadmap
**Document:** `docs/audit_phase2/PHASE2_REMEDIATION_ROADMAP.md`  
**Author:** Principal Database Architect & Senior Full Stack Engineer  
**Date:** October 30, 2026  
**Status:** Architecture Discovery Complete — Awaiting Approval for Phase 3 Execution  

---

## 1. Executive Summary & Forensic Conclusions

Phase 2 established a complete forensic architecture baseline for the OHO TECH database layer. All 38 domain tables, 37 JPA repositories, relationships, foreign keys, and indexes have been cataloged.

The repository audit proved conclusively that:
1. **Spring Data JPA is the Sole Authoritative ORM:** Prisma is completely unreferenced by the runtime application and can be safely deprecated without regressions.
2. **Flyway Migration Strategy is Fully Designed:** A non-destructive, baseline-compatible Flyway strategy (`baseline-on-migrate = true`) has been authored to transition away from runtime `ddl-auto=update` without risking live data.
3. **Zero Production Changes Have Been Applied:** All Phase 2 work has been conducted strictly in a read-only discovery, planning, and documentation capacity.

---

## 2. Verified Facts vs Assumptions vs Recommendations

### 2.1 Verified Facts
* The production schema consists of **38 tables** spanning Identity, Catalog, Orders, Payments, Licensing, Multi-Channel CRM, Support, and Audit Logs.
* There are **0 imports** of `@prisma/client` or Prisma runtime in `src/` or any Next.js route handlers.
* Automated testing executes against H2 in-memory DB (`application-test.properties`) with 243 passing test cases.
* 10 incremental SQL update scripts exist in `backend/src/main/resources/` reflecting historical schema changes.
* 22 entity relationships currently use `FetchType.EAGER`, creating potential N+1 query cascades on list endpoints.

### 2.2 Assumptions
* The production PostgreSQL 17 database already contains the columns introduced in `schema_update_*.sql` (e.g. `firebase_uid`, POS cashier columns, Cashfree order IDs, and support ticket ownership).
* Live production database access credentials and systemd daemon scripts are isolated on the target Hostinger KVM 2 VPS and managed via environment variables.

### 2.3 Recommendations
* **Adopt Flyway with `baseline-on-migrate = true`:** Introduces versioned, reproducible migration history without breaking existing live production tables.
* **Remove Prisma Dependencies:** Delete `prisma/`, `src/generated/prisma/`, and remove `@prisma/client` and `prisma` packages from `package.json` in Phase 3.
* **Standardize Foreign Key Indexes:** Ensure all 12 foreign key columns without explicit B-tree indexes are indexed in the baseline Flyway migration.
* **Calibrate HikariCP Connection Pool:** Set maximum pool size to 10 with leak detection threshold of 2500ms to protect the 2 vCPU / 4 GB RAM VPS.
* **Establish Mandatory Pre-Migration Snapshotting:** Never execute a schema migration without verifying an automated `pg_dump -Fc` snapshot.

### 2.4 Unresolved Questions for User Review
1. **Live Database Status:** Is the live Hostinger PostgreSQL 17 database currently populated with production client transactions, or is it in a pre-launch staging state?
2. **Prisma Removal Approval:** Does the team approve the removal of `@prisma/client` and `prisma` from `package.json` in Phase 3, given that 0 runtime files depend on it?

---

## 3. Step-by-Step Implementation Roadmap for Phase 3

```
+----------------------------------------------------------------------------------------------------+
|                                    PHASE 3 EXECUTION ROADMAP                                       |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  STEP 3.1: LAND FLYWAY DEPENDENCIES                                                                |
|    - Add `flyway-core` and `flyway-database-postgresql` to `backend/pom.xml`.                      |
|    - Verify Maven test compilation and surefire test suite execution.                              |
|                                                                                                    |
|  STEP 3.2: COMMIT V1 BASELINE SCRIPT                                                               |
|    - Place `V1__initial_production_baseline.sql` in `backend/src/main/resources/db/migration/`.    |
|    - Configure `spring.flyway.baseline-on-migrate=true` in `application.properties`.              |
|    - Set `spring.jpa.hibernate.ddl-auto=validate` for production profile.                         |
|                                                                                                    |
|  STEP 3.3: REMOVE PRISMA ARTIFACTS (UPON USER APPROVAL)                                           |
|    - Remove `@prisma/client` and `prisma` from `package.json`.                                     |
|    - Remove `prisma/` and `src/generated/prisma/`.                                                 |
|    - Update marketing string in `ProcessSection.tsx`.                                              |
|    - Verify `npx tsc --noEmit` and `npm run build`.                                                |
|                                                                                                    |
|  STEP 3.4: HIKARICP CONCURRENT POOL SIZING                                                         |
|    - Add calibrated connection pool settings to `application.properties`.                         |
|                                                                                                    |
|  STEP 3.5: PRE-MIGRATION BACKUP & VPS DRY-RUN                                                     |
|    - Execute pre-migration backup protocol on VPS target.                                          |
|    - Verify Flyway baseline execution in staging environment.                                      |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Risk Assessment & Mitigation Matrix

| Risk ID | Identified Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **RSK-01** | Flyway fails on existing production tables | **High** | Enabled `spring.flyway.baseline-on-migrate=true` and `baseline-version=1`. Live tables are tagged as baseline without duplicate re-creation. |
| **RSK-02** | Accidental data loss during migration | **Critical** | Mandatory pre-migration snapshot protocol (`pg_dump -Fc`) with checksum verification prior to any schema operation. |
| **RSK-03** | Connection pool starvation on 2 vCPU VPS | **Medium** | Capped HikariCP max pool size to 10; added leak detection threshold of 2500ms. |
| **RSK-04** | Dual ORM schema divergence | **Medium** | Phased removal of orphaned Prisma artifacts, establishing Spring Data JPA + Flyway as the single source of truth. |
| **RSK-05** | N+1 query performance degradation | **Medium** | Documented all 22 `FetchType.EAGER` relationships and mapped migration to `@EntityGraph` and `Pageable` queries. |

---

## 5. Phase 2 Completion Gate

All Phase 2 requirements are **100% complete**. 

As stipulated by the completion rule:
> *"Phase 2 discovery and design must finish before schema-changing implementation. Do not execute a production migration. Stop and request review when the migration design is ready."*

We are stopped and ready for your review and approval before proceeding with Phase 3 implementation.
