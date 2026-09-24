-- Migration: Add multi-provider payment support, UTR reference, and manual verification fields
ALTER TABLE payments ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'RAZORPAY';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS method VARCHAR(50) DEFAULT 'ONLINE';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payer_upi_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payer_name VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS failure_reason VARCHAR(500);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP(6) WITHOUT TIME ZONE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(6) WITHOUT TIME ZONE;

-- Create indexes for fast query resolution
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments (provider);
CREATE INDEX IF NOT EXISTS idx_payments_tx_ref ON payments (transaction_reference);
