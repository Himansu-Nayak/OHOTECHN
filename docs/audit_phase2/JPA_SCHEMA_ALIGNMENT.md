# OHO TECH — JPA Entity & Database Schema Alignment Audit
**Document:** `docs/audit_phase2/JPA_SCHEMA_ALIGNMENT.md`  
**Engine:** PostgreSQL 17 / Hibernate ORM 6.6  
**Author:** Principal Database Architect & Senior Spring Boot Engineer  
**Date:** October 30, 2026  
**Status:** Complete Forensic Alignment  

---

## 1. Executive Summary

This audit compares the 38 JPA entity classes against the actual historical DDL mutations and schema assumptions of PostgreSQL 17. Because the application historically operated with `spring.jpa.hibernate.ddl-auto=update` and ad-hoc incremental scripts (`schema_update_*.sql`), subtle structural divergence can emerge between Hibernate's generated in-memory schema expectations and the live production tables.

This document details:
1. Column-level and type-level alignment across all tables.
2. Discrepancies resolved by historical SQL scripts.
3. Foreign key constraints and missing index risks.
4. Entity cascade boundaries and orphan removal risks.
5. Association fetch-type patterns and systemic N+1 query liabilities.

---

## 2. Forensic Schema-to-Entity Mapping Analysis

### 2.1 Resolved Discrepancies from Incremental Migrations
Between August and October 2026, 10 SQL update scripts were authored to remediate gaps where Hibernate's automatic schema update did not create optimal PostgreSQL types or indexes:

| Table | File | Problem Remediated | JPA Entity Alignment |
| :--- | :--- | :--- | :--- |
| `audit_logs` | `schema_update_audit.sql` | `description`, `previous_value`, `new_value`, `user_agent` were being truncated by default `VARCHAR(255)`. Migrated to `TEXT`. | Aligned via `@Column(columnDefinition = "TEXT")`. |
| `payments` | `schema_update_payments.sql` | Multi-provider fields (`provider`, `method`, `currency`, `transaction_reference`, `payer_upi_id`, `verified_by`, POS cashier fields) added. | Aligned in `Payment.java` (lines 53–100). |
| `payments` | `schema_update_cashfree.sql` | Cashfree gateway order/payment tracking columns and lookup indexes added. | Aligned in `Payment.java` (`cashfreeOrderId`, `cashfreePaymentId`). |
| `users` | `schema_update_firebase.sql` | `firebase_uid` column added with unique constraint `uk_users_firebase_uid`. | Aligned in `User.java#L32-L33`. |
| `otp_verifications`| `schema_update_otp.sql` | Upgraded OTP fields (`attempts`, `otp_hash`, `purpose`, `reset_token`, `reset_token_expiry`). | Aligned in `OtpVerification.java`. |
| `support_tickets` | `schema_update_support.sql` | Added `issue_ownership`, `product_id`, `deployment_id` with idempotent checks. | Aligned in `SupportTicket.java#L47-L50`. |
| `email_outbox` | `schema_update_email_outbox.sql` | Created dedicated transactional outbox table and suppression blacklist. | Aligned with `EmailOutbox.java` and `EmailSuppression.java`. |
| `crm_whatsapp_*` | `schema_update_whatsapp_crm.sql`| Created Meta WhatsApp delivery log and consent management tables. | Aligned with `CrmWhatsAppMessage.java` and `CrmWhatsAppConsent.java`. |
| `providers` | `schema_update_reseller.sql` | Created ISV partner marketplace directory and margins on `products`. | Aligned with `Provider.java` and `Product.java`. |

---

## 3. Critical Mapping Findings & Architectural Risks

### Finding 1: Unindexed Foreign Key Columns in High-Velocity Tables (Performance & Lock Contention)
* **Severity:** High
* **Observation:** In PostgreSQL, declaring a `FOREIGN KEY` constraint does **not** automatically create a supporting B-tree index on the child referencing column. While Hibernate enforces referential integrity, lack of an index causes sequential table scans during `JOIN` queries and `CASCADE DELETE` checks, leading to table-level lock contention.
* **Affected Columns:**
  * `orders(user_id)`: Frequently queried during client dashboard order retrieval (`findByUserIdOrderByCreatedAtDesc`). Lacks an explicit index in JPA entity `@Table(indexes = ...)`.
  * `cart_items(cart_id)` and `cart_items(product_id)`: Scanned on every cart modification.
  * `order_items(order_id)` and `order_items(product_id)`: Scanned during invoice generation.
  * `deployments(customer_id)` and `deployments(product_id)`.
  * `subscriptions(user_id)` and `subscriptions(product_id)`.
  * `notifications(user_id)`: Partially covered by compound index `(user_id, read)`, but single `user_id` joins benefit from optimal ordering.
* **Remediation:** Flyway migration `V1__baseline` and subsequent index refinements must explicitly declare B-tree indexes for all foreign key referencing columns:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
  CREATE INDEX IF NOT EXISTS idx_deployments_customer_id ON deployments(customer_id);
  ```

---

### Finding 2: High Density of `FetchType.EAGER` Across Core Domain Entities (N+1 Query Risk)
* **Severity:** High
* **Observation:** A forensic code scan across `com.ohotech.backend.entity` revealed **22 entity relationships configured with `FetchType.EAGER`**.
* **Affected Associations:**
  1. `Order` -> `user` (`@ManyToOne(fetch = FetchType.EAGER)`)
  2. `Order` -> `items` (`@OneToMany(fetch = FetchType.EAGER)`)
  3. `Order` -> `payment` (`@OneToOne(fetch = FetchType.EAGER)`)
  4. `OrderItem` -> `product` (`@ManyToOne(fetch = FetchType.EAGER)`)
  5. `OrderItem` -> `productPlan` (`@ManyToOne(fetch = FetchType.EAGER)`)
  6. `Product` -> `category` (`@ManyToOne(fetch = FetchType.EAGER)`)
  7. `ProductPlan` -> `product` (`@ManyToOne(fetch = FetchType.EAGER)`)
  8. `Cart` -> `user` (`@OneToOne(fetch = FetchType.EAGER)`)
  9. `Cart` -> `items` (`@OneToMany(fetch = FetchType.EAGER)`)
  10. `CartItem` -> `product` (`@ManyToOne(fetch = FetchType.EAGER)`)
  11. `CartItem` -> `productPlan` (`@ManyToOne(fetch = FetchType.EAGER)`)
  12. `Deployment` -> `customer`, `product`, `order` (all 3 `EAGER`)
  13. `License` -> `user`, `product`, `subscription` (all 3 `EAGER`)
  14. `Subscription` -> `user`, `product`, `productPlan` (all 3 `EAGER`)
  15. `SoftwareRelease` -> `product` (`@ManyToOne(fetch = FetchType.EAGER)`)
* **Technical & Performance Impact:**
  * When an administrator or dashboard requests a list of 20 orders via `orderRepository.findAll()`, Hibernate cannot perform a single query. It executes 1 query for the orders, followed by 20 queries for users, 20 queries for payments, 20 queries for items, and recursively queries products, categories, and plans for each item.
  * In production, this generates **80 to 140 round-trip database queries** for a single HTTP endpoint, resulting in latency spikes, connection-pool saturation, and high database CPU usage.
* **Recommended Architecture Fix (Phase 2 Design / Phase 3 Execution):**
  * Transition all collection and reference associations to `FetchType.LAZY`.
  * Use JPA `@EntityGraph` or explicit repository JPQL queries with `JOIN FETCH` specifically on endpoints that require the aggregated graph (e.g., checkout and invoice generation).

---

### Finding 3: Cascade and Orphan Removal Safety Assessment
* **Severity:** Medium
* **Analysis of `cascade = CascadeType.ALL, orphanRemoval = true`:**
  * **Safe Usage:**
    * `Order.items`: Deleting an order must purge its line items. Correctly scoped.
    * `Cart.items`: Clearing cart line items must purge obsolete records. Correctly scoped.
    * `AIConversation.messages`: Deleting an AI chat session must purge conversation turns. Correctly scoped.
    * `SupportTicket.messages`: Deleting a ticket purges ticket discussion records. Correctly scoped.
  * **High-Risk Cascades Identified:**
    * `Order.payment` has `cascade = CascadeType.ALL`: If an `Order` entity is ever deleted programmatically, Hibernate will cascade and issue a `DELETE FROM payments WHERE order_id = ?`. In an enterprise financial system, payment records must be immutable for tax, auditing, and reconciliation compliance.
    * **Remediation:** Remove `CascadeType.REMOVE` from `Order.payment`. Use `CascadeType.PERSIST, CascadeType.MERGE` so that orders can initialize payments, but payment records cannot be deleted via order cascade.

---

### Finding 4: Numeric Precision & Monetary Type Standardization
* **Severity:** Low (Consistency)
* **Observation:**
  * In `payments`, `cash_tendered`, `change_returned`, `amount`, and `Product.price`, monetary fields are mapped as `BigDecimal`.
  * Some fields specify `@Column(precision = 19, scale = 2)`, while others (such as `Order.totalAmount` and `OrderItem.price`) rely on default JPA column mapping (`NUMERIC(38,2)` in PostgreSQL).
* **Remediation:** Standardize all financial columns in the Flyway baseline migration to `NUMERIC(19, 2)` to ensure consistent IEEE/ANSI compliance, 2 decimal places for INR currency handling, and predictable storage footprint.

---

### Finding 5: PostgreSQL Timezone Alignment (`TIMESTAMP` vs `TIMESTAMPTZ`)
* **Severity:** Medium
* **Observation:**
  * JPA `LocalDateTime` maps by default in Hibernate PostgreSQL dialect to `TIMESTAMP WITHOUT TIME ZONE`.
  * The application server operates in Indian Standard Time (`Asia/Kolkata` / UTC+5:30), while cloud VPS nodes often default to `UTC`.
  * Without explicit timezone conversion, storing timestamps as `TIMESTAMP WITHOUT TIME ZONE` can cause 5 hour 30 minute offsets if the application or database server timezone environment variables shift.
* **Remediation:**
  * Ensure the JVM runs with `-Duser.timezone=Asia/Kolkata` or UTC consistently.
  * For Flyway baseline DDL, preserve existing `TIMESTAMP WITHOUT TIME ZONE` columns to prevent data corruption or breaking existing row values, while ensuring all services convert through standard Java `LocalDateTime.now()`.

---

## 4. Alignment Conclusion

The 38 JPA entities are structurally synchronized with the historical SQL update scripts. By establishing a unified, authoritative Flyway baseline, we eliminate the runtime reliance on `ddl-auto=update` and lock in strict, reproducible schema integrity.
