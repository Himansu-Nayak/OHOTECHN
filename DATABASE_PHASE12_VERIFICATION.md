# OHO TECH — Phase 12: Database Migration & Schema Compatibility Audit

**Auditor:** Principal Database & Application Security Auditor  
**Date:** 2026-10-31  
**Scope:** PostgreSQL 17 / 18 Schema Migrations, Indexes, Constraints & Row Compatibility  
**Target Environment:** Hostinger Cloud VPS (`ohotech_db` on PostgreSQL 18)  
**Overall Status:** **VERIFIED (Fully Backward-Compatible & Safe for Production Execution)**  

---

## 1. Migration Inventory & Execution Sequence

The complete payment infrastructure is governed by four sequential SQL migrations:

| Sequence | Migration File | Target Scope | Safety Mechanism |
|:---:|:---|:---|:---:|
| **1** | `schema_update_payments.sql` | Provider column, method, currency, transaction_ref, payer VPA | `ADD COLUMN IF NOT EXISTS`, default values |
| **2** | `schema_update_cashfree.sql` | `cashfree_order_id`, `cashfree_payment_id`, lookup indexes | `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS` |
| **3** | `schema_update_self_hosted_upi.sql` | `observer_devices`, `bank_credit_alerts`, `payment_slot_leases` | `CREATE TABLE IF NOT EXISTS`, unique constraints |
| **4** | `schema_update_payment_reconciliation.sql` | `orders.version`, `payments.version`, `payment_reconciliation_logs` | `ADD COLUMN IF NOT EXISTS`, default 0, indexes |

---

## 2. Forensic Analysis of `schema_update_payment_reconciliation.sql`

```sql
-- 1. Add optimistic locking version columns to orders and payments tables
ALTER TABLE orders ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;

-- 2. Create payment reconciliation log table
CREATE TABLE IF NOT EXISTS payment_reconciliation_logs (
    id BIGSERIAL PRIMARY KEY,
    executed_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    total_evaluated INT,
    matched_count INT,
    anomaly_count INT,
    status VARCHAR(50),
    triggered_by VARCHAR(50),
    anomalies_summary TEXT,
    created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for fast query resolution and audit scans
CREATE INDEX IF NOT EXISTS idx_recon_executed_at ON payment_reconciliation_logs (executed_at);
CREATE INDEX IF NOT EXISTS idx_recon_status ON payment_reconciliation_logs (status);
```

### 2.1 Compatibility & Safety Verification
1. **Existing Row Compatibility:**
   Adding `version BIGINT DEFAULT 0` with `DEFAULT 0` ensures that all existing rows in `orders` and `payments` automatically receive a version value of `0`. No `NULL` values will occur, satisfying Hibernate's `@Version` contract.
2. **PostgreSQL DDL Lock Safety:**
   In PostgreSQL 11+, `ALTER TABLE ... ADD COLUMN ... DEFAULT ...` does not rewrite the table; it updates metadata in $O(1)$ time without holding an exclusive lock on existing rows, eliminating downtime risks.
3. **Idempotency:**
   Every statement utilizes `IF NOT EXISTS`, allowing safe re-execution without throwing errors or creating duplicate indexes.
4. **PostgreSQL Version Compatibility:**
   Fully tested against standard PostgreSQL syntax; compatible with PostgreSQL 14, 15, 16, 17, and 18.

---

## 3. Database Indexes & Constraint Matrix

| Table | Constraint / Index Name | Columns | Purpose |
|:---|:---|:---|:---|
| `payments` | `idx_payments_cashfree_order_id` | `cashfree_order_id` | $O(1)$ lookup for incoming Cashfree webhooks and status checks. |
| `payments` | `idx_payments_cashfree_payment_id` | `cashfree_payment_id` | Quick lookup during refunds and chargebacks. |
| `payments` | `idx_payments_status` | `status` | High-speed filtering in Transaction Operations Center. |
| `bank_credit_alerts` | `uk_bank_alert_rrn` (Unique) | `rrn` | **Database-level defense:** Guarantees an identical bank RRN cannot be credited twice. |
| `crm_webhook_events` | `uk_provider_event_id` (Unique) | `(provider, external_event_id)` | **Database-level defense:** Prevents duplicate webhook execution at the SQL level. |
| `observer_devices` | `uk_observer_token_hash` (Unique) | `token_hash` | Prevents credential collision across registered hardware observers. |
| `payment_reconciliation_logs` | `idx_recon_executed_at` | `executed_at` | Rapid historical queries for administrative auditing. |

---

## 4. Rollback Strategy

Because all migrations are strictly additive:
- If a rollback of application code is needed, earlier backend versions can operate against the updated schema without modification because newly added columns are ignored by older versions.
- If physical removal of added structures is required:
  ```sql
  DROP TABLE IF EXISTS payment_reconciliation_logs CASCADE;
  ALTER TABLE payments DROP COLUMN IF EXISTS version;
  ALTER TABLE orders DROP COLUMN IF EXISTS version;
  ```

**Database Migration Verdict: VERIFIED (PASS)**
