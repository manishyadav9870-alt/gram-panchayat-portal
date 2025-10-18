// Simple database connection test script
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

console.log('🧪 Testing Database Connection...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  console.log('\n📝 Please update your .env file with the correct DATABASE_URL');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set');
console.log('📏 Length:', process.env.DATABASE_URL.length, 'characters');

// Parse and display connection details (without password)
try {
  const url = new URL(process.env.DATABASE_URL);
  console.log('\n🔍 Connection Details:');
  console.log('  Protocol:', url.protocol);
  console.log('  Host:', url.hostname);
  console.log('  Port:', url.port || '5432');
  console.log('  Database:', url.pathname.slice(1));
  console.log('  Username:', url.username);
  console.log('  Password:', '***' + url.password.slice(-4));
} catch (error) {
  console.error('⚠️  Could not parse DATABASE_URL:', error.message);
}

// Try to connect
console.log('\n🔌 Attempting to connect to database...');

try {
  const sql = neon(process.env.DATABASE_URL);
  
  // Test query
  console.log('📡 Sending test query...');
  const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
  
  console.log('\n✅ Connection successful!');
  console.log('⏰ Server time:', result[0].current_time);
  console.log('🗄️  PostgreSQL version:', result[0].pg_version.split(' ')[0], result[0].pg_version.split(' ')[1]);
  
  // Check if tables exist
  console.log('\n📊 Checking for tables...');
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  
  if (tables.length === 0) {
    console.log('⚠️  No tables found. Run "npm run db:push" to create tables.');
  } else {
    console.log('✅ Found', tables.length, 'tables:');
    tables.forEach(t => console.log('  -', t.table_name));
  }
  
  console.log('\n🎉 Database connection test completed successfully!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Connection failed!');
  console.error('Error:', error.message);
  
  if (error.message.includes('password authentication failed')) {
    console.log('\n💡 Tip: Check your DATABASE_URL password');
  } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
    console.log('\n💡 Tip: Check if PostgreSQL is running and the host/port are correct');
  }
  
  process.exit(1);
}
