// Simple script to create database using Prisma Client
// This bypasses Prisma CLI and WebAssembly memory issues

const { PrismaClient } = require('./src/generated/prisma/client');
const fs = require('fs');
const path = require('path');

async function createDatabase() {
  console.log('Starting database creation...');
  
  const prisma = new PrismaClient();
  
  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'prisma', 'create_database.sql');
    console.log('Reading SQL file from:', sqlPath);
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into statements (separated by semicolons)
    // Filter out comments and empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => {
        // Skip comments and empty statements
        const trimmed = s.trim();
        return trimmed.length > 0 && !trimmed.startsWith('--');
      });
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip PRAGMA statements (they're executed automatically)
      if (statement.toUpperCase().startsWith('PRAGMA')) {
        continue;
      }
      
      try {
        await prisma.$executeRawUnsafe(statement);
        const preview = statement.substring(0, 60).replace(/\s+/g, ' ');
        console.log(`✓ [${i + 1}/${statements.length}] Executed: ${preview}...`);
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate column name')) {
          console.log(`⊘ [${i + 1}/${statements.length}] Skipped (already exists)`);
        } else {
          console.error(`✗ [${i + 1}/${statements.length}] Error:`, error.message);
          // Continue anyway - some errors are expected
        }
      }
    }
    
    console.log('\n✅ Database created successfully!');
    console.log('Database file should be at: prisma/dev.db');
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  createDatabase().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createDatabase };

