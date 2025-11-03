// Simple script to create database using SQLite directly
// This completely bypasses Prisma - no dependencies needed!

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function createDatabase() {
  console.log('Creating database with SQLite...');
  
  const dbPath = path.join(__dirname, 'prisma', 'dev.db');
  const sqlPath = path.join(__dirname, 'prisma', 'create_database.sql');
  
  // Check if sqlite3 is available
  let sqlite3Available = false;
  try {
    execSync('sqlite3 --version', { stdio: 'ignore' });
    sqlite3Available = true;
    console.log('✓ sqlite3 command is available');
  } catch (e) {
    console.log('⚠ sqlite3 command not found - will try alternative method');
  }
  
  // Read SQL file
  console.log('Reading SQL file from:', sqlPath);
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ SQL file not found:', sqlPath);
    console.error('Please make sure prisma/create_database.sql exists');
    process.exit(1);
  }
  
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  if (sqlite3Available) {
    // Method 1: Use sqlite3 command (if available)
    console.log('Using sqlite3 command...');
    
    // Create database file if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '');
      console.log('Created database file:', dbPath);
    }
    
    try {
      // Write SQL to temp file and execute
      const tempSqlFile = path.join(__dirname, 'prisma', 'temp_create.sql');
      fs.writeFileSync(tempSqlFile, sql);
      
      execSync(`sqlite3 "${dbPath}" < "${tempSqlFile}"`, {
        stdio: 'inherit'
      });
      
      // Clean up temp file
      fs.unlinkSync(tempSqlFile);
      
      console.log('\n✅ Database created successfully using sqlite3!');
      console.log('Database file:', dbPath);
      
    } catch (error) {
      console.error('❌ Error executing SQL:', error.message);
      process.exit(1);
    }
  } else {
    // Method 2: Manual SQL execution (if sqlite3 not available)
    console.log('⚠ sqlite3 not available - cannot create database automatically');
    console.log('\n📝 Please create the database manually:');
    console.log('\nOption 1: Install sqlite3 on your server');
    console.log('  - Contact your hosting provider');
    console.log('  - Or ask them to install sqlite3');
    console.log('\nOption 2: Use cPanel File Manager');
    console.log('  1. Create file: prisma/dev.db (empty file)');
    console.log('  2. Set permissions: chmod 644 prisma/dev.db');
    console.log('  3. Then use a SQLite GUI tool or ask hosting provider');
    console.log('\nOption 3: Use Prisma Client (if @prisma/client is installed)');
    console.log('  Run: node create_db.js (requires npm install first)');
    
    console.log('\nSQL file is ready at:', sqlPath);
    console.log('You can execute it manually using any SQLite tool.');
    
    process.exit(1);
  }
  
  // Verify database was created
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log(`\n✅ Database file exists: ${stats.size} bytes`);
  } else {
    console.error('\n❌ Database file was not created!');
    process.exit(1);
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

