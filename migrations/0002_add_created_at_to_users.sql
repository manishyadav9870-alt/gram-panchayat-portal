-- Add created_at column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Update existing users to have a created_at timestamp
UPDATE users SET created_at = NOW() WHERE created_at IS NULL;
