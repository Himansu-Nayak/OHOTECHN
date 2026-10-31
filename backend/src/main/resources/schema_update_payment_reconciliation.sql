-- ==============================================================================
-- OHO TECHN: Payment Reconciliation & Optimistic Locking Schema Update
-- Database: PostgreSQL 17 / 18
-- Target: OHOTECH Production Database (Hostinger VPS)
-- ==============================================================================

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
