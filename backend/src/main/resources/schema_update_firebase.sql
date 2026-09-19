-- OHO TECHN: PostgreSQL Table Migration for Firebase Federated Identity Integration
-- Adds firebase_uid column with a UNIQUE constraint for fast lookup and duplicate prevention
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_users_firebase_uid'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT uk_users_firebase_uid UNIQUE (firebase_uid);
    END IF;
END $$;
