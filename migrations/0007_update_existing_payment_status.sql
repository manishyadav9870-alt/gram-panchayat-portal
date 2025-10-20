-- Update existing payment records to have 'pending' status if NULL

UPDATE property_payments 
SET status = 'pending' 
WHERE status IS NULL;
