# Fix: NODE_OPTIONS Not Working in Terminal

## The Problem

You set `NODE_OPTIONS=--max-old-space-size=4096` in cPanel environment variables, but you're **still getting WebAssembly memory errors** when running commands in Terminal.

**Why?** Environment variables set in Node.js App are **only available to the running Node.js application**, not to Terminal commands.

## Solution: Set NODE_OPTIONS in Terminal

### Option 1: Export in Terminal Session (Recommended)

In Terminal, set it for the current session:

```bash
cd ~/trimsoftstudio.com/iqcheck
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
npm exec prisma migrate deploy
```

**This only works for the current Terminal session.**

### Option 2: Inline with Each Command

Set it with each command:

```bash
cd ~/trimsoftstudio.com/iqcheck
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma generate
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma migrate deploy
```

### Option 3: Use npm config

Set it via npm:

```bash
cd ~/trimsoftstudio.com/iqcheck
npm config set node-options "--max-old-space-size=4096"
npm exec prisma generate
npm exec prisma migrate deploy
```

### Option 4: Try Lower Memory Limit

If 4GB doesn't work, try 2GB:

```bash
cd ~/trimsoftstudio.com/iqcheck
export NODE_OPTIONS="--max-old-space-size=2048"
npm exec prisma generate
npm exec prisma migrate deploy
```

### Option 5: Try 8GB (If Available)

If server has more memory:

```bash
cd ~/trimsoftstudio.com/iqcheck
export NODE_OPTIONS="--max-old-space-size=8192"
npm exec prisma generate
npm exec prisma migrate deploy
```

## Check Available Memory First

Before setting memory limit, check what's available:

```bash
free -h
```

Look at "Mem" row - "available" shows how much memory you can use.

**Set NODE_OPTIONS to about 50-75% of available memory.**

## Recommended Approach

**Step 1: Check available memory:**
```bash
free -h
```

**Step 2: Set NODE_OPTIONS in Terminal:**
```bash
cd ~/trimsoftstudio.com/iqcheck
export NODE_OPTIONS="--max-old-space-size=4096"
```

**Step 3: Verify it's set:**
```bash
echo $NODE_OPTIONS
# Should show: --max-old-space-size=4096
```

**Step 4: Run Prisma commands:**
```bash
npm exec prisma generate
npm exec prisma migrate deploy
```

## Alternative: Generate Prisma Client Locally

If server memory is too limited:

1. **On your local machine** (Windows with Node.js 20):
   ```bash
   cd C:\wamp64\www\IQ\iq-app
   npm install
   npm exec prisma generate
   ```

2. **Copy generated files to server:**
   - Upload `node_modules/.prisma` folder
   - Upload `node_modules/@prisma/client` folder (if needed)

3. **Then on server, just run migrations:**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   npm exec prisma migrate deploy
   ```

## Quick Test

Test if memory setting works:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma --version
```

If this works without memory error, the setting is correct!

## If Still Getting Memory Errors

**If you've exported NODE_OPTIONS but still get memory errors:**

1. **Check available memory:**
   ```bash
   free -h
   ```

2. **Try static binary instead of WebAssembly:**
   ```bash
   export PRISMA_CLI_BINARY_TYPE=static
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm exec prisma generate
   ```

3. **Or generate Prisma client locally** and upload to server

**See `CPANEL_MEMORY_STILL_FAILING.md` for detailed solutions.**

## Summary

**The NODE_OPTIONS in cPanel environment variables only applies to the running Node.js app, not Terminal commands.**

**For Terminal commands, you need to export it in the Terminal session itself.**

Try:
```bash
cd ~/trimsoftstudio.com/iqcheck
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
```

**If still failing, try static binary or generate locally.** 🎉

