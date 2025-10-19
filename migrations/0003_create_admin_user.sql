-- Create default admin user
-- Password: admin123 (plain text for demo - in production use bcrypt)
INSERT INTO users (username, password, role, created_at) 
VALUES ('admin', 'admin123', 'admin', NOW())
ON CONFLICT (username) DO UPDATE 
SET password = 'admin123', role = 'admin', created_at = NOW();

-- Create a test manager user  
INSERT INTO users (username, password, role, created_at) 
VALUES ('Manish', 'password123', 'admin', NOW())
ON CONFLICT (username) DO UPDATE 
SET password = 'password123', role = 'admin', created_at = NOW();
