# Create Database Manually (Bypass Prisma - No WebAssembly)

## The Problem

Even with `PRISMA_CLI_BINARY_TYPE=static`, Prisma still shows WebAssembly memory errors. This happens because Prisma CLI itself uses WebAssembly internally.

## Solution: Create Database with SQLite Directly ✅

**Bypass Prisma entirely** - use SQLite directly to create the database schema. This completely avoids WebAssembly.

## Step 1: Upload SQL Script to Server

**On Windows:**
1. Copy `prisma/create_database.sql` to the server
2. Or create the file directly on the server

**On Server via cPanel File Manager:**
1. Go to `trimsoftstudio.com/iqcheck/prisma/`
2. Create file `create_database.sql`
3. Copy the SQL content from `prisma/create_database.sql`

## Step 2: Create Database with SQLite

**In Terminal:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Check if sqlite3 is available
sqlite3 --version

# If sqlite3 is not available, install it (may need to ask hosting provider)
# OR use the SQL file with Prisma client (read below)
```

### Option A: Use sqlite3 Command (If Available)

```bash
cd ~/trimsoftstudio.com/iqcheck

# Create database file
touch prisma/dev.db

# Run SQL script
sqlite3 prisma/dev.db < prisma/create_database.sql

# Verify database was created
ls -la prisma/dev.db
```

### Option B: Use Node.js Script (No Prisma CLI)

**Create a simple Node.js script** that uses Prisma Client (not CLI):

**On server, create file `create_db.js`:**

```javascript
const { PrismaClient } = require('./src/generated/prisma/client');
const fs = require('fs');
const sql = fs.readFileSync('./prisma/create_database.sql', 'utf8');

async function createDatabase() {
  const prisma = new PrismaClient();
  
  // Execute raw SQL
  await prisma.$executeRawUnsafe(sql);
  
  console.log('Database created successfully!');
  await prisma.$disconnect();
}

createDatabase().catch(console.error);
```

**Then run:**

```bash
cd ~/trimsoftstudio.com/iqcheck
node create_db.js
```

### Option C: Use Prisma Client Directly (Simplest) ✅

**Since Prisma client is already generated and uploaded, use it directly:**

**On server, create file `create_db.js`:**

```javascript
const { PrismaClient } = require('./src/generated/prisma/client');
const fs = require('fs');

async function createDatabase() {
  const prisma = new PrismaClient();
  
  // Read SQL file
  const sql = fs.readFileSync('./prisma/create_database.sql', 'utf8');
  
  // Split into statements and execute
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  for (const statement of statements) {
    if (statement.trim().startsWith('--') || statement.trim().length === 0) {
      continue;
    }
    try {
      await prisma.$executeRawUnsafe(statement);
      console.log('Executed:', statement.substring(0, 50) + '...');
    } catch (error) {
      // Ignore "table already exists" errors
      if (!error.message.includes('already exists')) {
        console.error('Error:', error.message);
      }
    }
  }
  
  console.log('Database created successfully!');
  await prisma.$disconnect();
}

createDatabase().catch(console.error);
```

**Then run:**

```bash
cd ~/trimsoftstudio.com/iqcheck
node create_db.js
```

## Step 3: Verify Database

**Check if database file exists:**

```bash
ls -la prisma/dev.db
```

**Should show the database file!**

**Verify tables exist (if sqlite3 is available):**

```bash
sqlite3 prisma/dev.db ".tables"
```

**Should show all tables:**
- User
- Account
- Session
- VerificationToken
- Question
- TestSession
- Answer
- Payment
- Setting
- AdView
- Share
- Email

## Step 4: Test the App

**Once database is created, test it:**

```bash
# Seed database (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/dev/seed

# Create admin (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## Why This Works

- ✅ **No Prisma CLI** - we're not running `prisma migrate` or `prisma db push`
- ✅ **Uses Prisma Client only** - which is already generated and doesn't use WebAssembly for SQL execution
- ✅ **Direct SQL execution** - simple and reliable
- ✅ **Bypasses all memory issues** - no WebAssembly allocation needed

## Alternative: Even Simpler - Let App Create Tables

If creating the database manually is too complex, you can let your app create tables on first use:

**Modify your app** to check if tables exist, and create them if not. But for production, it's better to create the database manually first.

## Summary

**Best approach:**

1. ✅ **Upload `prisma/create_database.sql`** to server
2. ✅ **Create `create_db.js`** script on server (using Prisma Client)
3. ✅ **Run `node create_db.js`** - this uses Prisma Client (already generated) to execute SQL
4. ✅ **Verify database exists** with `ls -la prisma/dev.db`

This completely bypasses Prisma CLI and WebAssembly! 🎉

