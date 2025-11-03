# Fix: WebAssembly Out of Memory Error

## The Error

```
RangeError: WebAssembly.Instance(): Out of memory: Cannot allocate Wasm memory for new instance
```

This happens because **Prisma is trying to load WebAssembly modules** but the server doesn't have enough memory.

## Solutions

### Solution 1: Increase Node.js Memory Limit (Recommended) ✅

Set a higher memory limit for Node.js:

```bash
cd ~/trimsoftstudio.com/iqcheck
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma migrate deploy
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma generate
```

Or export it first:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma migrate deploy
npm exec prisma generate
```

**4096 MB = 4 GB** - adjust based on your server's available memory.

### Solution 2: Use Full Path with Memory Option

```bash
cd ~/trimsoftstudio.com/iqcheck
NODE_OPTIONS="--max-old-space-size=4096" /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/node /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npm exec prisma migrate deploy
NODE_OPTIONS="--max-old-space-size=4096" /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/node /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npm exec prisma generate
```

### Solution 3: Set in Environment Variables (Permanent)

Add to your Node.js App environment variables in cPanel:

1. **Go to "Setup Node.js App"**
2. **Click on your application**
3. **Go to "Environment Variables" tab**
4. **Add:**
   ```
   NODE_OPTIONS=--max-old-space-size=4096
   ```
5. **Click "Save"**
6. **Restart the app**

Then in Terminal:
```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma migrate deploy
npm exec prisma generate
```

### Solution 4: Reduce Memory Usage

Try a lower memory limit first:

```bash
NODE_OPTIONS="--max-old-space-size=2048" npm exec prisma migrate deploy
NODE_OPTIONS="--max-old-space-size=2048" npm exec prisma generate
```

**2048 MB = 2 GB** - try this if 4GB is too much.

### Solution 5: Use Binary Instead of WebAssembly

Prisma can use native binaries instead of WASM. Check if available:

```bash
export PRISMA_CLI_BINARY_TYPE=static
npm exec prisma migrate deploy
npm exec prisma generate
```

Or:
```bash
PRISMA_CLI_BINARY_TYPE=static npm exec prisma migrate deploy
PRISMA_CLI_BINARY_TYPE=static npm exec prisma generate
```

### Solution 6: Check Available Memory

First, check how much memory is available:

```bash
free -h
```

Or:
```bash
cat /proc/meminfo | grep MemAvailable
```

**If available memory is less than 1GB**, you might need to:
- Upgrade your hosting plan
- Ask hosting provider to increase limits
- Use a different approach

### Solution 7: Run Migrations in Smaller Steps

If memory is very limited, try running migrations separately:

```bash
cd ~/trimsoftstudio.com/iqcheck

# Just generate Prisma client (smaller memory footprint):
NODE_OPTIONS="--max-old-space-size=2048" npm exec prisma generate

# Then deploy migrations:
NODE_OPTIONS="--max-old-space-size=2048" npm exec prisma migrate deploy
```

## Recommended Approach

**Best solution for cPanel:**

1. **Add NODE_OPTIONS to environment variables** (Solution 3) - permanent fix
2. **Or use inline with each command** (Solution 1) - quick fix

```bash
cd ~/trimsoftstudio.com/iqcheck

# Try with 4GB first:
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma generate
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma migrate deploy

# If that fails, try 2GB:
NODE_OPTIONS="--max-old-space-size=2048" npm exec prisma generate
NODE_OPTIONS="--max-old-space-size=2048" npm exec prisma migrate deploy
```

## Check Server Limits

Your server might have memory limits. Check:

```bash
ulimit -a
```

Look for `max memory size` - this shows your current limit.

If it's too low, you might need to:
- Contact hosting provider
- Upgrade plan
- Request memory limit increase

## Alternative: Generate Client Locally

If server memory is too limited:

1. **Generate Prisma client on your local machine** (with Node.js 20)
2. **Upload `node_modules/.prisma` folder** to server
3. **Skip `prisma generate` on server**

Not ideal, but works if server memory is insufficient.

## Quick Test

Test with a simple Prisma command:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm exec prisma --version
```

If this works, the memory setting is correct!

## Summary

**Most likely to work:**

```bash
cd ~/trimsoftstudio.com/iqcheck
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
npm exec prisma migrate deploy
```

**If 4GB doesn't work, try 2GB or 8GB** based on your server's available memory.

Good luck! 🎉

