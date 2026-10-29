-- Schema Update for Email Outbox and Suppressions
CREATE TABLE IF NOT EXISTS email_outbox (
    id BIGSERIAL PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_key VARCHAR(100),
    category VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    error_message VARCHAR(1000),
    provider_message_id VARCHAR(255),
    idempotency_key VARCHAR(100),
    next_retry_at TIMESTAMP,
    sent_at TIMESTAMP,
    content_preview TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_outbox_status ON email_outbox(status);
CREATE INDEX IF NOT EXISTS idx_email_outbox_recipient ON email_outbox(recipient);
CREATE INDEX IF NOT EXISTS idx_email_outbox_created_at ON email_outbox(created_at);

CREATE TABLE IF NOT EXISTS email_suppressions (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    reason VARCHAR(255),
    source VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_suppression_email ON email_suppressions(email);
