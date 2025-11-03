# Fix: Still Getting Memory Error Even With NODE_OPTIONS Set

## The Problem

Even though `NODE_OPTIONS="--max-old-space-size=4096"` is set correctly, you're **still getting WebAssembly memory errors**.

**Possible reasons:**
1. Server doesn't have 4GB available
2. System memory limit is too low
3. WebAssembly needs a different approach

## Solution 1: Check Available Memory First

Check how much memory your server actually has:

```bash
free -h
```

Look at the "Mem" row:
- **Available** shows how much memory you can actually use
- If "available" is less than 4GB, reduce NODE_OPTIONS

**If available memory is less than 4GB**, try:

```bash
export NODE_OPTIONS="--max-old-space-size=2048"  # 2GB
npm exec prisma generate
```

Or even lower:

```bash
export NODE_OPTIONS="--max-old-space-size=1024"  # 1GB
npm exec prisma generate
```

## Solution 2: Check System Memory Limits

Check if there's a system-wide memory limit:

```bash
ulimit -a
```

Look for `max memory size` - this might be restricting you.

**If limit is too low**, you might need to:
- Contact hosting provider
- Request memory limit increase
- Or use alternative approach

## Solution 3: Use Static Binary Instead of WebAssembly

Prisma can use static binaries instead of WASM. Try:

```bash
cd ~/trimsoftstudio.com/iqcheck
export PRISMA_CLI_BINARY_TYPE=static
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
```

Or:

```bash
cd ~/trimsoftstudio.com/iqcheck
PRISMA_CLI_BINARY_TYPE=static NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma generate
```

## Solution 4: Generate Prisma Client Locally (Recommended) ✅

If server memory is too limited, generate Prisma client on your **local machine**:

### On Your Local Windows Machine:

```bash
cd C:\wamp64\www\IQ\iq-app
npm install
npm exec prisma generate
```

### Then Upload to Server:

1. **Copy the generated files:**
   - `node_modules/.prisma` folder
   - `node_modules/@prisma/client` folder (if it changed)

2. **Upload via cPanel File Manager or FTP**

3. **On server, just run migrations** (no generate needed):

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma migrate deploy
```

**This avoids memory issues on the server!**

## Solution 5: Install Prisma Locally and Skip Generate

Another option - install Prisma dependencies locally:

1. **On local machine:**
   ```bash
   cd C:\wamp64\www\IQ\iq-app
   npm install
   ```

2. **Upload `node_modules` to server** (large, but works)

3. **Then on server:**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   npm exec prisma migrate deploy
   ```

## Solution 6: Use Prisma CLI from Different Location

Sometimes Prisma from npm cache works better:

```bash
cd ~/trimsoftstudio.com/iqcheck
rm -rf node_modules/.prisma
npm cache clean --force
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
```

## Solution 7: Skip Prisma Generate Entirely (For Now)

If you just need to get the app running:

1. **Manually create the database file:**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   touch prisma/dev.db
   ```

2. **Copy Prisma client from local build** (if you built locally)

3. **Focus on getting migrations working later**

## Recommended: Check Memory First

**Step 1: Check available memory:**
```bash
free -h
```

**Step 2: If memory is limited (< 2GB available):**
- Use Solution 4 (generate locally)
- Or try Solution 3 (static binary)

**Step 3: If memory is sufficient (> 4GB available):**
- Try Solution 6 (clean cache)
- Or increase NODE_OPTIONS to 8GB

## Quick Test

Try static binary approach:

```bash
cd ~/trimsoftstudio.com/iqcheck
PRISMA_CLI_BINARY_TYPE=static NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma --version
```

If this works without memory error, then:

```bash
PRISMA_CLI_BINARY_TYPE=static NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma generate
```

## Most Likely Solution

**If server memory is limited**, **Solution 4 (generate locally)** is your best bet:

1. Generate on your local machine (has more memory)
2. Upload generated files to server
3. Run migrations on server

**This completely avoids server memory issues!**

Try Solution 3 first (static binary), and if that doesn't work, use Solution 4 (generate locally). 🎉

