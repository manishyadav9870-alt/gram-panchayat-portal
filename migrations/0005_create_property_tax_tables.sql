-- Create Property Tax Tables

-- Properties Master Table
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  property_number VARCHAR(50) UNIQUE NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  owner_name_mr VARCHAR(255),
  address TEXT NOT NULL,
  address_mr TEXT,
  area_sqft INTEGER NOT NULL,
  annual_tax DECIMAL(10,2) NOT NULL,
  registration_year INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Property Payments Table
CREATE TABLE IF NOT EXISTS property_payments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  property_number VARCHAR(50) NOT NULL REFERENCES properties(property_number),
  payment_year INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  payment_method VARCHAR(50),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_number, payment_year)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_number ON properties(property_number);
CREATE INDEX IF NOT EXISTS idx_payments_property ON property_payments(property_number);
CREATE INDEX IF NOT EXISTS idx_payments_year ON property_payments(payment_year);

-- Insert sample properties for testing
INSERT INTO properties (property_number, owner_name, owner_name_mr, address, address_mr, area_sqft, annual_tax, registration_year)
VALUES 
  ('GP/2025/001', 'Rahul Sharma', 'राहुल शर्मा', 'Main Road, Kishore', 'मुख्य रस्ता, किशोर', 1000, 5000.00, 2023),
  ('GP/2025/002', 'Priya Patil', 'प्रिया पाटील', 'School Road, Kishore', 'शाळा रस्ता, किशोर', 1500, 7500.00, 2022),
  ('GP/2025/003', 'Amit Kumar', 'अमित कुमार', 'Temple Street, Kishore', 'मंदिर रस्ता, किशोर', 800, 4000.00, 2024)
ON CONFLICT (property_number) DO NOTHING;

-- Insert sample payment for one property
INSERT INTO property_payments (property_number, payment_year, amount_paid, payment_date, receipt_number, payment_method)
VALUES 
  ('GP/2025/002', 2024, 7500.00, '2024-04-15', 'RCP/2024/001', 'Online'),
  ('GP/2025/002', 2025, 7500.00, '2025-03-20', 'RCP/2025/001', 'Cash')
ON CONFLICT (property_number, payment_year) DO NOTHING;
