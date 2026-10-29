-- OHO TECH: PostgreSQL Schema Migration for Self-Hosted UPI Checkout & Merchant Payment Operations

-- 1. Payment Slot Leases (FIFO settlement queue & single-active-payment slot)
CREATE TABLE IF NOT EXISTS payment_slot_leases (
    id BIGSERIAL PRIMARY KEY,
    merchant_vpa VARCHAR(255) NOT NULL,
    order_id BIGINT NOT NULL,
    payment_id BIGINT,
    acquired_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    released_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slot_leases_vpa_status ON payment_slot_leases (merchant_vpa, status);
CREATE INDEX IF NOT EXISTS idx_slot_leases_order ON payment_slot_leases (order_id);
CREATE INDEX IF NOT EXISTS idx_slot_leases_expires ON payment_slot_leases (expires_at);

-- 2. Observer Devices (Companion Android / Notification Forwarder registration)
CREATE TABLE IF NOT EXISTS observer_devices (
    id BIGSERIAL PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    last_seen_at TIMESTAMP WITHOUT TIME ZONE,
    registered_by BIGINT,
    ip_address VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_observer_devices_token ON observer_devices (token_hash);

-- 3. Bank Credit Alerts (Incoming bank SMS / Notification stream)
CREATE TABLE IF NOT EXISTS bank_credit_alerts (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT,
    rrn VARCHAR(100) UNIQUE,
    amount NUMERIC(19, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payer_upi VARCHAR(255),
    raw_message TEXT,
    received_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    matched_payment_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    confidence_score NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bank_alerts_status ON bank_credit_alerts (status);
CREATE INDEX IF NOT EXISTS idx_bank_alerts_rrn ON bank_credit_alerts (rrn);
CREATE INDEX IF NOT EXISTS idx_bank_alerts_matched_pay ON bank_credit_alerts (matched_payment_id);

-- 4. Counter Billing POS Fields on Payments Table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS cashier_user_id BIGINT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS cash_tendered NUMERIC(19, 2);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS change_returned NUMERIC(19, 2);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS card_terminal_ref VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS card_terminal_id VARCHAR(100);
