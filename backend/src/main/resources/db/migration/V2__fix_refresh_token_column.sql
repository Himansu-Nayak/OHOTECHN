-- Migration V2: Clean up legacy rows and ensure valid column schema on PostgreSQL
DELETE FROM refresh_tokens WHERE token IS NULL;

DO $$
BEGIN
    -- 1. Fix otp_verifications legacy otp_code constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'otp_verifications' AND column_name = 'otp_code'
    ) THEN
        ALTER TABLE otp_verifications ALTER COLUMN otp_code DROP NOT NULL;
    END IF;

    -- 2. Ensure expiry_date exists on refresh_tokens
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'refresh_tokens' AND column_name = 'expiry_date'
    ) THEN
        ALTER TABLE refresh_tokens ADD COLUMN expiry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days');
    ELSE
        -- Update any existing NULL expiry_date values
        UPDATE refresh_tokens SET expiry_date = (CURRENT_TIMESTAMP + INTERVAL '7 days') WHERE expiry_date IS NULL;
    END IF;

END $$;
