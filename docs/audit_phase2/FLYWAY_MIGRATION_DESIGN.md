# OHO TECH — Production-Grade Flyway Migration Architecture & Design
**Document:** `docs/audit_phase2/FLYWAY_MIGRATION_DESIGN.md`  
**Engine:** PostgreSQL 17 / Spring Boot 4.1.0 / Flyway 10+  
**Author:** Principal Database Architect & Senior Spring Boot Engineer  
**Date:** October 30, 2026  
**Status:** Architecture Specification (Zero Production Modification in Phase 2)  

---

## 1. Executive Summary & Migration Objectives

This specification defines the migration strategy to transition the OHO TECH database from unversioned, dynamic runtime DDL mutations (`spring.jpa.hibernate.ddl-auto=update`) to an immutable, version-controlled, audit-traceable Flyway migration pipeline.

### Guiding Architectural Principles:
1. **Zero Data Loss:** Existing live production records (customers, orders, payments, invoices, software releases, CRM leads, support tickets, audit logs) must remain strictly intact.
2. **Zero Table Destruction:** No `DROP TABLE`, `TRUNCATE`, or destructive type alterations.
3. **Seamless Baseline on Live Database:** An existing production database must not fail when Flyway is introduced. Existing tables must be recognized as baseline version 1 via `baseline-on-migrate: true`.
4. **Reproducibility for Fresh Environments:** A new developer machine, test runner, or staging environment must bootstrap the complete 38-table schema identically from scratch.
5. **Strict Schema Validation in Production:** Once Flyway is enabled, Hibernate DDL auto-generation will be set to `validate` in production, ensuring Hibernate verifies schema matching without executing unvetted DDL changes.

---

## 2. Dependency Specification & Spring Boot Compatibility

In Spring Boot 3.x and 4.x, Flyway modularized database drivers. To support PostgreSQL 17, both the core engine and the dedicated PostgreSQL database extension must be present in `backend/pom.xml`:

```xml
<!-- Flyway Database Migration Support -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

*Note: In Phase 2, this dependency design is fully vetted. The actual landing into `pom.xml` will be performed in Phase 3 after architecture review.*

---

## 3. Baseline Migration Strategy (`baseline-on-migrate`)

The primary challenge in introducing Flyway to an existing production database is avoiding errors when Flyway tries to run `CREATE TABLE` against tables that already exist.

### How the Baseline Strategy Operates:

```
+-------------------------------------------------------------------------------------------------+
|                               FLYWAY INITIAL BOOTSTRAP DECISION FLOW                            |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   1. Flyway checks if metadata table `flyway_schema_history` exists in PostgreSQL.             |
|                                                                                                 |
|   Case A: Live Production Database (Tables already exist, but NO `flyway_schema_history`)       |
|     --> `baseline-on-migrate = true` triggers.                                                  |
|     --> Flyway creates `flyway_schema_history`.                                                 |
|     --> Flyway inserts row: version='1', description='Initial Production Baseline',             |
|         type='BASELINE', state='SUCCESS'.                                                       |
|     --> Flyway skips executing `V1__initial_production_baseline.sql` because version 1 is       |
|         marked as already baseline!                                                             |
|     --> Zero conflicts, zero duplicate table creation errors, zero downtime!                    |
|                                                                                                 |
|   Case B: Fresh Database (New developer machine, CI/CD, or Staging environment)                 |
|     --> Database is completely empty.                                                           |
|     --> `flyway_schema_history` does not exist, AND no existing domain tables exist.             |
|     --> Flyway creates `flyway_schema_history`.                                                 |
|     --> Flyway executes `V1__initial_production_baseline.sql` from start to finish.             |
|     --> All 38 tables, constraints, foreign keys, and indexes are created cleanly.              |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

---

## 4. Application Configuration Specification

### 4.1 Production Configuration (`application-prod.properties` / `application.properties`)
```properties
# ==============================================================================
# FLYWAY PRODUCTION CONFIGURATION
# ==============================================================================
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=1
spring.flyway.baseline-description=Initial Production Baseline
spring.flyway.table=flyway_schema_history
spring.flyway.locations=classpath:db/migration
spring.flyway.validate-on-migrate=true
spring.flyway.out-of-order=false

# Disable Hibernate runtime DDL modification in production
spring.jpa.hibernate.ddl-auto=validate
```

### 4.2 Automated Testing Configuration (`application-test.properties`)
In the test profile (H2 in-memory mode), Flyway is disabled to allow H2 in-memory dynamic schema creation (`create-drop`) without PostgreSQL dialect syntax conflicts:
```properties
spring.flyway.enabled=false
spring.jpa.hibernate.ddl-auto=create-drop
```

---

## 5. Complete Baseline DDL Specification (`V1__initial_production_baseline.sql`)

The baseline file will be placed in `backend/src/main/resources/db/migration/V1__initial_production_baseline.sql`.

It consolidates the 38 tables, all unique constraints, foreign keys, and indexes in correct topological dependency order:

```sql
-- ==============================================================================
-- OHO TECH — V1__initial_production_baseline.sql
-- PostgreSQL 17 Database Architecture Baseline
-- Target: OHOTECH Production Database
-- Idempotent, safe for existing tables and fresh bootstrap environments
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. IDENTITY & ACCESS CONTROL
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    official_email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) UNIQUE,
    firebase_uid VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    lockout_until TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS api_keys (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(32) NOT NULL,
    key_hash VARCHAR(128) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    scope VARCHAR(64) NOT NULL DEFAULT 'READ_WRITE',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    last_used_at TIMESTAMP WITHOUT TIME ZONE,
    expires_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS otp_verifications (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    target VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255),
    purpose VARCHAR(50) DEFAULT 'EMAIL_VERIFICATION',
    expiry_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 2. RESELLER MARKETPLACE & CATALOG
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS providers (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    website VARCHAR(255),
    commercial_terms VARCHAR(2000),
    commission_rate NUMERIC(19, 2),
    technical_integration_type VARCHAR(50) NOT NULL DEFAULT 'STANDALONE_BINARY',
    integration_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    support_responsibility VARCHAR(50) NOT NULL DEFAULT 'OHO_TECH_TIER_1',
    deployment_responsibility VARCHAR(50) NOT NULL DEFAULT 'AUTOMATED_CONTAINER',
    contract_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    notes VARCHAR(2000),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    icon VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(2000),
    price NUMERIC(19, 2) NOT NULL,
    provider_cost NUMERIC(19, 2),
    reseller_margin NUMERIC(19, 2),
    provider_id BIGINT REFERENCES providers(id) ON DELETE SET NULL,
    integration_status VARCHAR(50) DEFAULT 'READY',
    deployment_type VARCHAR(50) DEFAULT 'STANDALONE_SERVER',
    lifecycle_status VARCHAR(50) DEFAULT 'ACTIVE',
    license_model VARCHAR(50) DEFAULT 'PERPETUAL_SUBSCRIPTION',
    support_model VARCHAR(50) DEFAULT 'STANDARD_SLA',
    demo_url VARCHAR(500),
    documentation_url VARCHAR(500),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    stock INTEGER NOT NULL DEFAULT 999,
    image_url VARCHAR(500),
    service_type VARCHAR(255),
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS product_plans (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    price NUMERIC(19, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    billing_type VARCHAR(50) NOT NULL,
    duration_days INTEGER DEFAULT 365,
    activation_limit INTEGER DEFAULT 1,
    trial_days INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS product_embeddings (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    content_text TEXT NOT NULL,
    embedding_json TEXT NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 3. CARTS, ORDERS & INVOICES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS carts (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    total_amount NUMERIC(19, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_plan_id BIGINT REFERENCES product_plans(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(19, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount NUMERIC(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    shipping_address VARCHAR(1000),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_plan_id BIGINT REFERENCES product_plans(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(19, 2) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. PAYMENTS & SELF-HOSTED UPI
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    cashfree_order_id VARCHAR(255),
    cashfree_payment_id VARCHAR(255),
    youpi_payment_id VARCHAR(100) UNIQUE,
    amount NUMERIC(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    method VARCHAR(50) NOT NULL DEFAULT 'ONLINE',
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    transaction_reference VARCHAR(255),
    payer_upi_id VARCHAR(255),
    payer_name VARCHAR(255),
    failure_reason VARCHAR(500),
    admin_notes TEXT,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITHOUT TIME ZONE,
    cashier_user_id BIGINT,
    cash_tendered NUMERIC(19, 2),
    change_returned NUMERIC(19, 2),
    card_terminal_ref VARCHAR(255),
    card_terminal_id VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS payment_slot_leases (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    delta_amount NUMERIC(19, 2) NOT NULL,
    total_payable NUMERIC(19, 2) NOT NULL,
    merchant_vpa VARCHAR(255) NOT NULL,
    payee_name VARCHAR(255) NOT NULL,
    slot_reference VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    acquired_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    released_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS bank_credit_alerts (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    device_id BIGINT,
    rrn VARCHAR(100) UNIQUE,
    amount NUMERIC(19, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payer_upi VARCHAR(255),
    raw_message TEXT,
    received_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    matched_payment_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    confidence_score NUMERIC(5, 2) DEFAULT 1.00,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS observer_devices (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    last_seen_at TIMESTAMP WITHOUT TIME ZONE,
    registered_by BIGINT,
    ip_address VARCHAR(100)
);

-- ------------------------------------------------------------------------------
-- 5. LICENSING, SOFTWARE RELEASES, DEPLOYMENTS & SUBSCRIPTIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_plan_id BIGINT REFERENCES product_plans(id) ON DELETE SET NULL,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITHOUT TIME ZONE,
    expiry_date TIMESTAMP WITHOUT TIME ZONE,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS licenses (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE SET NULL,
    license_key VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    activation_limit INTEGER NOT NULL DEFAULT 1,
    activations_count INTEGER NOT NULL DEFAULT 0,
    issued_at TIMESTAMP WITHOUT TIME ZONE,
    expires_at TIMESTAMP WITHOUT TIME ZONE,
    last_validated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS device_activations (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    license_id BIGINT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    machine_fingerprint VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    ip_address VARCHAR(100),
    os_info VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    activated_at TIMESTAMP WITHOUT TIME ZONE,
    last_heartbeat_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS software_releases (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version VARCHAR(255) NOT NULL,
    release_notes VARCHAR(2000),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    platform VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    release_date TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS deployments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    target_environment VARCHAR(50) NOT NULL DEFAULT 'HOSTINGER_VPS',
    status VARCHAR(50) NOT NULL,
    custom_domain VARCHAR(255),
    server_ip VARCHAR(100),
    admin_url VARCHAR(500),
    deployment_log TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 6. MULTI-CHANNEL CRM & NOTIFICATIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS crm_leads (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    estimated_budget NUMERIC(19, 2),
    interested_product VARCHAR(255),
    requirements_summary TEXT,
    assigned_to_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    external_lead_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS crm_activities (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    performed_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_follow_ups (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    assigned_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL,
    action_item VARCHAR(1000) NOT NULL,
    outcome_notes TEXT,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_whatsapp_messages (
    id BIGSERIAL PRIMARY KEY,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(150),
    template_name VARCHAR(100) NOT NULL,
    language_code VARCHAR(20) DEFAULT 'en',
    parameters_json TEXT,
    category VARCHAR(30) DEFAULT 'MARKETING',
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    wamid VARCHAR(255),
    idempotency_key VARCHAR(100),
    error_message VARCHAR(1000),
    dispatched_by VARCHAR(100),
    lead_id BIGINT,
    delivered_at TIMESTAMP WITHOUT TIME ZONE,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS crm_whatsapp_consents (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(50) NOT NULL UNIQUE,
    opt_in BOOLEAN NOT NULL DEFAULT TRUE,
    source VARCHAR(100),
    purpose VARCHAR(100) DEFAULT 'ALL',
    opted_in_at TIMESTAMP WITHOUT TIME ZONE,
    opted_out_at TIMESTAMP WITHOUT TIME ZONE,
    revocation_reason VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS crm_webhook_events (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    provider VARCHAR(255) NOT NULL,
    external_event_id VARCHAR(255),
    external_lead_id VARCHAR(255),
    event_type VARCHAR(255),
    received_at TIMESTAMP WITHOUT TIME ZONE,
    status VARCHAR(50),
    attempt_count INTEGER DEFAULT 0,
    processed_at TIMESTAMP WITHOUT TIME ZONE,
    error_reason TEXT,
    payload_summary TEXT,
    CONSTRAINT uk_provider_event_id UNIQUE (provider, external_event_id)
);

CREATE TABLE IF NOT EXISTS contact_enquiries (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    service_type VARCHAR(255),
    subject VARCHAR(255),
    budget VARCHAR(100),
    timeline VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS email_outbox (
    id BIGSERIAL PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_key VARCHAR(100),
    category VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    error_message VARCHAR(1000),
    provider_message_id VARCHAR(255),
    idempotency_key VARCHAR(100),
    next_retry_at TIMESTAMP WITHOUT TIME ZONE,
    sent_at TIMESTAMP WITHOUT TIME ZONE,
    content_preview TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS email_suppressions (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    reason VARCHAR(255),
    source VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    actor_user_id BIGINT,
    actor_name VARCHAR(255),
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255),
    entity_id VARCHAR(255),
    description TEXT,
    previous_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 7. SUPPORT TICKETING & AI DESK
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    description VARCHAR(4000) NOT NULL,
    department VARCHAR(50) NOT NULL DEFAULT 'TECHNICAL',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    customer_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    assigned_to_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    order_id BIGINT,
    product_id BIGINT,
    deployment_id BIGINT,
    issue_ownership VARCHAR(50) NOT NULL DEFAULT 'OHO_TECH',
    sla_due_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    resolved_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS support_ticket_messages (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    message VARCHAR(4000) NOT NULL,
    internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS ai_usage (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT,
    feature VARCHAR(64) NOT NULL,
    model VARCHAR(64) NOT NULL,
    prompt_tokens INTEGER,
    candidate_tokens INTEGER,
    total_tokens INTEGER,
    timestamp TIMESTAMP WITHOUT TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 8. COMPREHENSIVE PERFORMANCE & INTEGRITY INDEXES
-- ------------------------------------------------------------------------------

-- Users & Auth
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_apikey_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_apikey_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_apikey_active ON api_keys(active);

-- Catalog & Products
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_provider ON products(provider_id);
CREATE INDEX IF NOT EXISTS idx_product_plans_product ON product_plans(product_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_product ON product_embeddings(product_id);

-- Orders, Items & Cart
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);
CREATE INDEX IF NOT EXISTS idx_payments_gateway ON payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_cashfree_order ON payments(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_cashfree_payment ON payments(cashfree_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_verified_by ON payments(verified_by);
CREATE INDEX IF NOT EXISTS idx_payment_leases_order ON payment_slot_leases(order_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_bank_alerts_rrn ON bank_credit_alerts(rrn);
CREATE INDEX IF NOT EXISTS idx_observer_token ON observer_devices(token_hash);

-- Licensing & Deployments
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_product ON licenses(product_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_activations_license ON device_activations(license_id);
CREATE INDEX IF NOT EXISTS idx_deployments_customer ON deployments(customer_id);
CREATE INDEX IF NOT EXISTS idx_deployments_product ON deployments(product_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_product ON subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_releases_product ON software_releases(product_id);

-- CRM & Messaging
CREATE INDEX IF NOT EXISTS idx_leads_email ON crm_leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON crm_leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON crm_leads(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_ext_id ON crm_leads(external_lead_id);
CREATE INDEX IF NOT EXISTS idx_activity_lead ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON crm_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_followup_lead ON crm_follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_followup_status ON crm_follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_followup_scheduled ON crm_follow_ups(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON crm_whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_recipient ON crm_whatsapp_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_wamid ON crm_whatsapp_messages(wamid);
CREATE INDEX IF NOT EXISTS idx_whatsapp_idempotency ON crm_whatsapp_messages(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_wa_consent_phone ON crm_whatsapp_consents(phone);
CREATE INDEX IF NOT EXISTS idx_wa_consent_optin ON crm_whatsapp_consents(opt_in);
CREATE INDEX IF NOT EXISTS idx_webhook_status ON crm_webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_provider_lead ON crm_webhook_events(provider, external_lead_id);

-- Support, Notifications & Audit
CREATE INDEX IF NOT EXISTS idx_tickets_code ON support_tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_dept ON support_tickets(department);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON support_tickets(client_email);
CREATE INDEX IF NOT EXISTS idx_tickets_issue_ownership ON support_tickets(issue_ownership);
CREATE INDEX IF NOT EXISTS idx_tickets_product_id ON support_tickets(product_id);
CREATE INDEX IF NOT EXISTS idx_tickets_deployment_id ON support_tickets(deployment_id);
CREATE INDEX IF NOT EXISTS idx_ticket_msgs_ticket ON support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_msgs_created ON support_ticket_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON email_outbox(status);
CREATE INDEX IF NOT EXISTS idx_email_outbox_recipient ON email_outbox(recipient);
CREATE INDEX IF NOT EXISTS idx_email_outbox_created_at ON email_outbox(created_at);
CREATE INDEX IF NOT EXISTS idx_email_suppression_email ON email_suppressions(email);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);
```

---

## 6. Migration Operational Procedures

### 6.1 Validation Procedure (`flyway:validate`)
Before deploying changes to staging or production, execute:
```bash
./mvnw flyway:validate -Dflyway.configFiles=src/main/resources/application-prod.properties
```
This checks that all previously applied migrations match their checksums exactly.

### 6.2 Error Recovery & Repair Protocol (`flyway:repair`)
If a migration fails mid-way on a non-production test environment due to a syntax issue:
1. Fix the SQL script.
2. Run:
   ```bash
   ./mvnw flyway:repair
   ```
   This cleans up the failed state in `flyway_schema_history` and re-aligns checksums.

---

## 7. Migration Design Summary

This Flyway design guarantees zero data loss, safe coexistence with existing production tables via `baseline-on-migrate: true`, and reproducible bootstrap for future environments.
