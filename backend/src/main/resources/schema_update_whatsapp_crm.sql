-- Schema update for WhatsApp CRM Messaging & Delivery Webhooks
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
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON crm_whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_recipient ON crm_whatsapp_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_wamid ON crm_whatsapp_messages(wamid);
CREATE INDEX IF NOT EXISTS idx_whatsapp_idempotency ON crm_whatsapp_messages(idempotency_key);

-- Table for customer WhatsApp opt-in and consent management
CREATE TABLE IF NOT EXISTS crm_whatsapp_consents (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(50) NOT NULL UNIQUE,
    opt_in BOOLEAN NOT NULL DEFAULT true,
    source VARCHAR(100),
    purpose VARCHAR(100) DEFAULT 'ALL',
    opted_in_at TIMESTAMP,
    opted_out_at TIMESTAMP,
    revocation_reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wa_consent_phone ON crm_whatsapp_consents(phone);
CREATE INDEX IF NOT EXISTS idx_wa_consent_optin ON crm_whatsapp_consents(opt_in);
