-- ==============================================================================
-- OHO TECHN RESELLER MARKETPLACE SCHEMA MIGRATION SCRIPT
-- Database: PostgreSQL 17
-- Target: OHOTECH Production Database
-- ==============================================================================

-- 1. Create Providers Table
CREATE TABLE IF NOT EXISTS providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    commercial_terms VARCHAR(2000),
    commission_rate NUMERIC(5, 2),
    technical_integration_type VARCHAR(50) DEFAULT 'PENDING_SPECS',
    integration_status VARCHAR(50) DEFAULT 'PENDING_API_INFO',
    support_responsibility VARCHAR(50) DEFAULT 'OHO_TECH',
    deployment_responsibility VARCHAR(50) DEFAULT 'OHO_TECH_VPS',
    contract_status VARCHAR(50) DEFAULT 'DRAFT',
    notes VARCHAR(2000),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and filtering providers
CREATE INDEX IF NOT EXISTS idx_providers_name ON providers (name);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers (active);
CREATE INDEX IF NOT EXISTS idx_providers_contract_status ON providers (contract_status);

-- 2. Extend Products Table with Reseller Wholesale Attributes
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS provider_cost NUMERIC(19, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS reseller_margin NUMERIC(19, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS provider_id BIGINT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS integration_status VARCHAR(255) DEFAULT 'Integration pending provider/API information';
ALTER TABLE products ADD COLUMN IF NOT EXISTS deployment_type VARCHAR(100) DEFAULT 'MANAGED_CLOUD';
ALTER TABLE products ADD COLUMN IF NOT EXISTS lifecycle_status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE products ADD COLUMN IF NOT EXISTS demo_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS documentation_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add Foreign Key for Product -> Provider (safely)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_products_provider'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT fk_products_provider 
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_provider_id ON products (provider_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);

-- 3. Create Deployments Table
CREATE TABLE IF NOT EXISTS deployments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    license_id BIGINT REFERENCES licenses(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    target_environment VARCHAR(100) DEFAULT 'CLOUD_MANAGED',
    access_url VARCHAR(500),
    assigned_engineer VARCHAR(255),
    admin_notes VARCHAR(2000),
    customer_notes VARCHAR(2000),
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and isolation queries
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments (user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_order_id ON deployments (order_id);
CREATE INDEX IF NOT EXISTS idx_deployments_product_id ON deployments (product_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments (status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments (created_at DESC);
