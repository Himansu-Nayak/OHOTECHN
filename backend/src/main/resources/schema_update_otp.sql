-- OHO TECHN: PostgreSQL Table Migration for OTP Verification System Upgrade
ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;
ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS otp_hash VARCHAR(255);
ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS purpose VARCHAR(255) DEFAULT 'EMAIL_VERIFICATION';
ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE otp_verifications ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
