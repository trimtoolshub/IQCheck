# ⚠️ CRITICAL: Fix Node.js Version Error

## The Problem

Error: Node.js version **10.24.1** is too old!

**Your path shows**: `/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/10`  
**The `/10/` means you're using Node.js 10!** ❌

Your application requires:
- **Next.js 16.0.1** needs: Node.js >= 20.9.0
- **Prisma 6.18.0** needs: Node.js >= 18.18
- **React Hook Form 7.66.0** needs: Node.js >= 18.0.0
- **Stripe 19.2.0** needs: Node.js >= 16

**You're using Node.js 10.24.1** which is incompatible!

## The Error Messages

```
npm WARN notsup Unsupported engine for next@16.0.1: wanted: {"node":">=20.9.0"} (current: {"node":"10.24.1","npm":"6.14.12"})
npm WARN notsup Unsupported engine for prisma@6.18.0: wanted: {"node":">=18.18"} (current: {"node":"10.24.1","npm":"6.14.12"})
SyntaxError: Unexpected token ? (because Node.js 10 doesn't support optional chaining)
```

## Solution: Update Node.js Version

### Step 1: Check Available Versions

1. **Go to "Setup Node.js App"** in cPanel
2. **Click on your existing application**
3. **Look for "Node.js Version"** dropdown
4. **See what versions are available**

### Step 2: Update or Recreate App

**Option A: Update Node.js Version (If Available)**

1. **In "Setup Node.js App"**, click on your app
2. **Look for "Edit" or "Change Version"**
3. **Select Node.js 18.x or 20.x**
4. **Save changes**
5. **Restart the app**

**Option B: Delete and Recreate (Recommended)**

1. **Go to "Setup Node.js App"**
2. **Click on your application**
3. **Click "Delete" or "Remove"** (don't worry, your files are safe!)
4. **Click "Create Application"** again
5. **This time, select Node.js 18.x or 20.x** (NOT 10.x!)
6. **Configure:**
   - **Node.js Version**: **18.x or 20.x** (highest available)
   - **Application Mode**: Production
   - **Application Root**: `/home/rungrezc/trimsoftstudio.com/iqcheck`
   - **Application Startup File**: `server.js`
7. **Click "Create"**

### Step 3: Verify Node.js Version

In Terminal:
```bash
node --version
```

**Should show**: `v18.x.x` or `v20.x.x` (NOT v10.x.x!)

### Step 4: Clean Install

After updating Node.js version:

```bash
cd ~/trimsoftstudio.com/iqcheck
# Remove old node_modules (if exists)
rm -rf node_modules package-lock.json
# Install fresh
npm install
npm run build
```

## Why Node.js 10 Doesn't Work

**Node.js 10 is from 2018** - it's missing many modern JavaScript features:

- ❌ No optional chaining (`?.`)
- ❌ No nullish coalescing (`??`)
- ❌ Old npm version (6.x vs 10.x needed)
- ❌ Missing ES2020+ features

**Your app uses Next.js 16** which requires **Node.js 20.9+** minimum!

## Minimum Requirements

- ✅ **Node.js**: 18.18+ (minimum) or 20.9+ (recommended)
- ✅ **npm**: Comes with Node.js (usually 10.x with Node 20)

## If Only Node.js 10 is Available

**Contact your hosting provider** - they need to:
1. **Enable Node.js 18+ or 20+** in cPanel
2. **Update the Node.js Selector** to include newer versions

**Most modern cPanel hosts have Node.js 18+ or 20+** - make sure it's enabled!

## Quick Fix Steps

1. ✅ **Delete existing Node.js App** (if using Node.js 10)
2. ✅ **Create new app** with Node.js **18.x or 20.x**
3. ✅ **Verify**: `node --version` shows 18+ or 20+
4. ✅ **Reinstall**: `rm -rf node_modules && npm install`
5. ✅ **Build**: `npm run build`

**That's it!** Your app should work once Node.js version is correct. 🎉

