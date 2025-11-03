# Fix: Prisma Migrate Memory Error - Use Static Binary

## The Problem

Even with Prisma client generated locally and uploaded, `prisma migrate deploy` still shows:
```
RangeError: WebAssembly.Instance(): Out of memory
```

**Why?** Prisma CLI itself might be trying to use WebAssembly, or it's trying to download/validate the Linux query engine.

## Solution: Use Static Prisma Binary

Force Prisma to use static binaries instead of WebAssembly:

### Option 1: Set Environment Variable (Easiest) ✅

**In Terminal, before running migrate:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Set environment variable to use static binary
export PRISMA_CLI_BINARY_TYPE=static

# Now run migrate
npm exec prisma migrate deploy
```

**Or in one command:**

```bash
cd ~/trimsoftstudio.com/iqcheck
PRISMA_CLI_BINARY_TYPE=static npm exec prisma migrate deploy
```

### Option 2: Use prisma db push Instead (Simpler)

`prisma db push` is simpler and might avoid the WebAssembly issue:

```bash
cd ~/trimsoftstudio.com/iqcheck

# Set static binary type
export PRISMA_CLI_BINARY_TYPE=static

# Use db push (simpler, no migration files needed)
npm exec prisma db push
```

**Note:** `db push` will create the database schema directly from your `schema.prisma` file. This is simpler than migrations.

### Option 3: Delete Windows Engine, Let Prisma Download Linux (Risk: Memory Error)

**⚠️ WARNING:** This might still trigger memory error if Prisma tries to use WebAssembly.

```bash
cd ~/trimsoftstudio.com/iqcheck

# Delete Windows query engine
rm src/generated/prisma/query_engine-windows.dll.node

# Try migrate (Prisma should download Linux engine)
export PRISMA_CLI_BINARY_TYPE=static
npm exec prisma migrate deploy
```

**If this still fails with memory error, use Option 1 or 2 instead.**

## Recommended: Use Static Binary + db push

**Easiest and most reliable:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Set static binary
export PRISMA_CLI_BINARY_TYPE=static

# Push schema to database (creates all tables)
npm exec prisma db push

# Verify database was created
ls -la prisma/dev.db
```

**This should work!** `prisma db push` is simpler and less likely to trigger WebAssembly issues.

## Alternative: Create Database Manually (If All Else Fails)

If Prisma still fails, you can create the database manually:

```bash
cd ~/trimsoftstudio.com/iqcheck

# Create database directory
mkdir -p prisma

# Create SQLite database file
touch prisma/dev.db

# Set permissions
chmod 644 prisma/dev.db
```

Then use `prisma db push` with static binary:

```bash
export PRISMA_CLI_BINARY_TYPE=static
npm exec prisma db push
```

## After Database is Created

**Verify database exists:**

```bash
ls -la prisma/dev.db
```

**Should show the database file!**

**Then test the app:**

```bash
# Seed database (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/dev/seed

# Create admin (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## Why Static Binary Works

- **Static binaries** are pre-compiled and don't use WebAssembly
- **No memory allocation issues** - binaries are ready to run
- **Faster** - no compilation needed

## Quick Summary

**Best approach:**

```bash
cd ~/trimsoftstudio.com/iqcheck
export PRISMA_CLI_BINARY_TYPE=static
npm exec prisma db push
```

This creates your database schema without WebAssembly memory issues! 🎉

