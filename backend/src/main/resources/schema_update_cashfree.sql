-- ==============================================================================
-- OHO TECHN: Cashfree Payment Gateway Integration & Webhook Tracking Migration
-- Database: PostgreSQL 17
-- Target: OHOTECH Production Database
-- ==============================================================================

-- 1. Add Cashfree Order and Payment tracking columns to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS cashfree_order_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS cashfree_payment_id VARCHAR(255);

-- 2. Indexes for O(1) webhook resolution and payment tracking
CREATE INDEX IF NOT EXISTS idx_payments_cashfree_order_id ON payments (cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_cashfree_payment_id ON payments (cashfree_payment_id);
