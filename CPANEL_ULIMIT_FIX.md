# Fix: Process Memory Limit (ulimit) Issue

## Your Current Limits

From `ulimit -a`:
- **max memory size**: 4194304 KB = **4GB** ✅ (matches NODE_OPTIONS)
- **virtual memory**: 4194304 KB = **4GB**

The limit is 4GB, which matches your NODE_OPTIONS. However, **WebAssembly might need a larger chunk allocated at once**.

## Solution 1: Increase ulimit (Recommended) ✅

Increase the memory limit for the current session:

```bash
cd ~/trimsoftstudio.com/iqcheck
ulimit -m 8388608  # 8GB (in KB)
ulimit -v 8388608  # 8GB virtual memory
export NODE_OPTIONS="--max-old-space-size=8192"  # 8GB
npm exec prisma generate
```

Or set to unlimited:

```bash
ulimit -m unlimited
ulimit -v unlimited
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
```

## Solution 2: Use Static Binary (Easiest) ✅✅

**This avoids WebAssembly entirely** and should work immediately:

```bash
cd ~/trimsoftstudio.com/iqcheck
export PRISMA_CLI_BINARY_TYPE=static
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
```

**This is the easiest solution!** Static binaries don't use WebAssembly.

## Solution 3: Make ulimit Permanent

Add to `~/.bashrc`:

```bash
echo 'ulimit -m unlimited' >> ~/.bashrc
echo 'ulimit -v unlimited' >> ~/.bashrc
source ~/.bashrc
```

Then try Prisma again.

## Solution 4: Generate Locally (If Above Don't Work)

If ulimit can't be increased or static binary doesn't work:

### On Your Windows Machine:
```bash
cd C:\wamp64\www\IQ\iq-app
npm install
npm exec prisma generate
```

### Upload to Server:
1. Copy `node_modules/.prisma` folder
2. Upload via cPanel File Manager to `~/trimsoftstudio.com/iqcheck/node_modules/.prisma`
3. On server, just run migrations:
   ```bash
   npm exec prisma migrate deploy
   ```

## Recommended: Try Static Binary First

**Easiest and most likely to work:**

```bash
cd ~/trimsoftstudio.com/iqcheck
export PRISMA_CLI_BINARY_TYPE=static
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
npm exec prisma migrate deploy
```

**Static binaries avoid WebAssembly**, so they work even with memory limits!

## Why Static Binary Works

- ✅ No WebAssembly (avoids memory allocation issues)
- ✅ Native binaries (faster and more reliable)
- ✅ Works with existing memory limits
- ✅ Same functionality

## Quick Test

Try static binary:

```bash
cd ~/trimsoftstudio.com/iqcheck
export PRISMA_CLI_BINARY_TYPE=static
npm exec prisma --version
```

If this works without memory error, then:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm exec prisma generate
```

## Summary

**Your ulimit is 4GB**, which matches NODE_OPTIONS, but **WebAssembly might need more at once**.

**Best solution**: Use **static binary** (Solution 2) - it avoids WebAssembly entirely!

**Alternative**: Increase ulimit to 8GB or unlimited (Solution 1)

Try static binary first - it's the easiest! 🎉

