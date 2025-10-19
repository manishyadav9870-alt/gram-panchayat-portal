-- ============================================
-- FIX: Add created_at column to users table
-- ============================================
-- Run this SQL in your Railway PostgreSQL console

-- Step 1: Add created_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Step 2: Update existing users
UPDATE users 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Step 3: Verify the change
SELECT * FROM users;

-- You should now see the created_at column with timestamps!
