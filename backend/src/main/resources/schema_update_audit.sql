-- OHO TECHN: PostgreSQL Table Migration for System Audit Trail
-- Ensures all human-readable audit fields use text-compatible types without truncation
ALTER TABLE audit_logs ALTER COLUMN description TYPE TEXT;
ALTER TABLE audit_logs ALTER COLUMN previous_value TYPE TEXT;
ALTER TABLE audit_logs ALTER COLUMN new_value TYPE TEXT;
ALTER TABLE audit_logs ALTER COLUMN user_agent TYPE TEXT;
