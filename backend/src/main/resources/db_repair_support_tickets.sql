-- ==============================================================================
-- OHO TECH — Support Tickets Schema Repair & Ownership Alignment (DB-001)
-- Target Database: ohotech_db
-- Target Application User: ohotech_user
-- ==============================================================================
-- This script resolves PSQLException: ERROR: must be owner of table support_tickets
-- and adds missing columns that caused schema drift between Hibernate entities and DB.
-- Execute with postgres superuser privileges.
-- ==============================================================================

-- 1. Transfer Table & Sequence Ownership to ohotech_user
ALTER TABLE IF EXISTS support_tickets OWNER TO ohotech_user;
ALTER TABLE IF EXISTS support_ticket_messages OWNER TO ohotech_user;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'support_tickets_id_seq') THEN
        ALTER SEQUENCE support_tickets_id_seq OWNER TO ohotech_user;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'support_ticket_messages_id_seq') THEN
        ALTER SEQUENCE support_ticket_messages_id_seq OWNER TO ohotech_user;
    END IF;
END $$;

-- 2. Grant table and sequence permissions
GRANT ALL PRIVILEGES ON TABLE support_tickets TO ohotech_user;
GRANT ALL PRIVILEGES ON TABLE support_ticket_messages TO ohotech_user;

-- 3. Safely add missing columns to align with SupportTicket entity
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS product_id BIGINT;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS deployment_id BIGINT;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS issue_ownership VARCHAR(50) DEFAULT 'OHO_TECH';

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_tickets_product_id ON support_tickets(product_id);
CREATE INDEX IF NOT EXISTS idx_tickets_deployment_id ON support_tickets(deployment_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON support_tickets(customer_user_id);
