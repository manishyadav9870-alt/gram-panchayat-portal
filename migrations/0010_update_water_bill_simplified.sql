-- Drop water_connections table (not needed - using properties as master)
DROP TABLE IF EXISTS water_connections CASCADE;

-- Recreate water_payments table with simplified structure
DROP TABLE IF EXISTS water_payments CASCADE;

CREATE TABLE IF NOT EXISTS water_payments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  property_number VARCHAR(50) NOT NULL,
  payment_month VARCHAR(7) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_date DATE,
  receipt_number VARCHAR(50) UNIQUE,
  payment_method VARCHAR(50),
  remarks TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  verified_by VARCHAR(255),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_water_payments_property_number ON water_payments(property_number);
CREATE INDEX IF NOT EXISTS idx_water_payments_payment_month ON water_payments(payment_month);
CREATE INDEX IF NOT EXISTS idx_water_payments_status ON water_payments(status);

-- Add foreign key constraint to properties table
ALTER TABLE water_payments 
ADD CONSTRAINT fk_water_property 
FOREIGN KEY (property_number) 
REFERENCES properties(property_number) 
ON DELETE CASCADE;
