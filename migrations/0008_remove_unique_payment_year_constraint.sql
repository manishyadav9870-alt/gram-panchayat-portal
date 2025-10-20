-- Remove unique constraint on property_number and payment_year
-- This allows multiple payments for same property in same year

ALTER TABLE property_payments 
DROP CONSTRAINT IF EXISTS property_payments_property_number_payment_year_key;

-- Keep the property_number index for performance
CREATE INDEX IF NOT EXISTS idx_payments_property_year ON property_payments(property_number, payment_year);
