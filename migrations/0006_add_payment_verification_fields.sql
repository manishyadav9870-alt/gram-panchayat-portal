-- Add verification fields to property_payments table

ALTER TABLE property_payments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;

-- Update existing payments to 'verified' status
UPDATE property_payments 
SET status = 'verified' 
WHERE status IS NULL OR status = 'pending';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_status ON property_payments(status);
