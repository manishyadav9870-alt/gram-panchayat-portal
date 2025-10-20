-- Create Water Connections Table
CREATE TABLE IF NOT EXISTS water_connections (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_number VARCHAR(50) NOT NULL UNIQUE,
  house_number VARCHAR(100) NOT NULL,
  consumer_name TEXT NOT NULL,
  consumer_name_mr TEXT,
  address TEXT NOT NULL,
  address_mr TEXT,
  monthly_charge NUMERIC(10, 2) NOT NULL,
  connection_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create Water Payments Table
CREATE TABLE IF NOT EXISTS water_payments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_number VARCHAR(50) NOT NULL,
  house_number VARCHAR(100) NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_water_connections_house_number ON water_connections(house_number);
CREATE INDEX IF NOT EXISTS idx_water_connections_status ON water_connections(status);
CREATE INDEX IF NOT EXISTS idx_water_payments_connection_number ON water_payments(connection_number);
CREATE INDEX IF NOT EXISTS idx_water_payments_house_number ON water_payments(house_number);
CREATE INDEX IF NOT EXISTS idx_water_payments_payment_month ON water_payments(payment_month);
CREATE INDEX IF NOT EXISTS idx_water_payments_status ON water_payments(status);

-- Add foreign key constraint
ALTER TABLE water_payments 
ADD CONSTRAINT fk_water_connection 
FOREIGN KEY (connection_number) 
REFERENCES water_connections(connection_number) 
ON DELETE CASCADE;
