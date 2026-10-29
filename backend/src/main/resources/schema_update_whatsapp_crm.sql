-- Schema update for WhatsApp CRM Messaging
CREATE TABLE IF NOT EXISTS crm_whatsapp_messages (
    id BIGSERIAL PRIMARY KEY,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(150),
    template_name VARCHAR(100) NOT NULL,
    language_code VARCHAR(20) DEFAULT 'en',
    parameters_json TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    wamid VARCHAR(255),
    error_message VARCHAR(1000),
    dispatched_by VARCHAR(100),
    lead_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON crm_whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_recipient ON crm_whatsapp_messages(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_wamid ON crm_whatsapp_messages(wamid);
