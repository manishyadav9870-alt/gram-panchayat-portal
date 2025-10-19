-- Migration: Add Marathi fields to complaints table
-- This migration adds support for storing Marathi translations of complaint data

-- Add Marathi fields to complaints table
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS name_mr TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS address_mr TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS category_mr TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS description_mr TEXT;

-- Add comments for documentation
COMMENT ON COLUMN complaints.name_mr IS 'Complainant name in Marathi (auto-translated or user-entered)';
COMMENT ON COLUMN complaints.address_mr IS 'Address in Marathi (auto-translated or user-entered)';
COMMENT ON COLUMN complaints.category_mr IS 'Category in Marathi (auto-translated)';
COMMENT ON COLUMN complaints.description_mr IS 'Complaint description in Marathi (auto-translated or user-entered)';
