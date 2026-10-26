# OHO TECH — Database & Data Integrity Forensic Audit Report

**Audit Target:** Hostinger VPS `200.97.161.128` (PostgreSQL 18 Cluster `18-main`)  
**Date:** 2026-10-14  
**Auditor:** Database & Infrastructure Team  

---

## 1. Production Database Overview

- **Database Name:** `ohotech_db`
- **Tables:** 31 public tables
- **Total Records:** 380+ live records
- **Data Integrity:** 0 orphaned orders, 0 orphaned order items, 0 orphaned payments, 0 orphaned licenses.

---

## 2. Forensic Database Findings

### [DB-001] Schema Drift & Table Ownership Failure on `support_tickets`
- **Severity:** Critical
- **Confidence:** Confirmed
- **Evidence:** Table `support_tickets` is owned by `postgres` instead of application role `ohotech_user`. Hibernate boot fails with `PSQLException: ERROR: must be owner of table support_tickets`.
- **Impact:** Columns `product_id` and `issue_ownership` are missing from production DB, causing HTTP 500 crashes on support ticket routes.
- **Fix:**
  ```sql
  ALTER TABLE support_tickets OWNER TO ohotech_user;
  ALTER TABLE support_ticket_messages OWNER TO ohotech_user;
  ALTER SEQUENCE support_tickets_id_seq OWNER TO ohotech_user;
  ALTER SEQUENCE support_ticket_messages_id_seq OWNER TO ohotech_user;
  ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS product_id BIGINT;
  ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS issue_ownership VARCHAR(50) DEFAULT 'OHO_TECH';
  ```

### [DB-002] Missing Foreign Key Indexes Causing Sequential Scans
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** Zero indexes exist on `orders(user_id)`, `order_items(order_id)`, `subscriptions(user_id)`, `licenses(user_id)`, and `cart_items(cart_id)`.
- **Impact:** Full-table scans degrade performance linearly as customer activity scales.
- **Fix:** Add standard B-tree indexes on all relational foreign key columns.

### [DB-003] Absence of Database Migration Tooling
- **Severity:** High
- **Confidence:** Confirmed
- **Evidence:** `pom.xml` contains neither Flyway nor Liquibase. Schemas are updated via Hibernate DDL or manual SQL scripts.
- **Impact:** Risk of unversioned schema divergence between staging and production.
- **Fix:** Introduce Flyway baseline migration (`V1__baseline.sql`).

### [DB-004] Strict Unique Constraint on `payments.order_id` Blocks Retries
- **Severity:** Medium
- **Confidence:** Confirmed
- **Evidence:** Unique constraint `uk8vo36cen604as7etdfwmyjsxt` exists on `payments(order_id)`.
- **Impact:** If an initial payment attempt fails, subsequent retry attempts fail with database constraint violations.
- **Fix:** Convert to partial unique index enforcing uniqueness only on `status = 'SUCCESS'`.
