// Quick fix script to add created_at column to users table
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🔧 Connecting to database...');
const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function fixDatabase() {
  try {
    console.log('📝 Adding created_at column to users table...');
    
    // Add created_at column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW() NOT NULL
    `);
    
    console.log('✅ Column added successfully!');
    
    // Update existing users to have a created_at timestamp
    await db.execute(sql`
      UPDATE users 
      SET created_at = NOW() 
      WHERE created_at IS NULL
    `);
    
    console.log('✅ Existing users updated!');
    
    // Verify the change
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'created_at'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verification successful! Column exists:', result.rows[0]);
    } else {
      console.log('⚠️  Warning: Could not verify column creation');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('👋 Database connection closed');
  }
}

fixDatabase()
  .then(() => {
    console.log('🎉 Database fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database fix failed:', error);
    process.exit(1);
  });
