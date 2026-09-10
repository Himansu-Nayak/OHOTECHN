-- =============================================================================
-- Migration V3: Developer Configuration & Feature Controls
-- =============================================================================

CREATE TABLE IF NOT EXISTS system_configurations (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_type VARCHAR(50) NOT NULL,
    encrypted_value TEXT,
    masked_value VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    source VARCHAR(50) NOT NULL DEFAULT 'DEVELOPER_CONFIG',
    updated_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_configurations_key ON system_configurations(config_key);
CREATE INDEX IF NOT EXISTS idx_system_configurations_type ON system_configurations(config_type);

CREATE TABLE IF NOT EXISTS feature_flags (
    id BIGSERIAL PRIMARY KEY,
    flag_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    updated_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);

-- Seed baseline feature flags
INSERT INTO feature_flags (flag_key, name, description, enabled, category, updated_by)
VALUES 
    ('CRM_ENABLED', 'CRM & Lead Management', 'Enables public contact enquiries and admin CRM pipelines', true, 'OPERATIONAL', 'SYSTEM'),
    ('DEMO_REQUESTS_ENABLED', 'Demo Request Bookings', 'Allows prospective enterprise clients to book live product demos', true, 'COMMERCE', 'SYSTEM'),
    ('QUOTE_REQUESTS_ENABLED', 'Enterprise Quote Inquiries', 'Allows custom turnkey software quote submissions', true, 'COMMERCE', 'SYSTEM'),
    ('CUSTOMER_REGISTRATION_ENABLED', 'Customer Self-Registration', 'Allows new visitors to create customer accounts', true, 'AUTHENTICATION', 'SYSTEM'),
    ('EMAIL_NOTIFICATIONS_ENABLED', 'Email Notifications', 'Controls whether transactional emails & notifications are dispatched', true, 'COMMUNICATIONS', 'SYSTEM'),
    ('MAINTENANCE_MODE', 'System Maintenance Mode', 'Puts public routes in maintenance while allowing Admin/Developer access', false, 'OPERATIONAL', 'SYSTEM'),
    ('PUBLIC_SIGNUP_ENABLED', 'Public Signups', 'Toggles public onboarding availability', true, 'AUTHENTICATION', 'SYSTEM')
ON CONFLICT (flag_key) DO NOTHING;
