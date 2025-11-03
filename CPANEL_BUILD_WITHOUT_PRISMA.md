# Build Next.js Without Prisma Generate (Fix WebAssembly Memory Error)

## The Problem

When running `npm run build`, it tries to run `prisma generate` which triggers:
```
RangeError: WebAssembly.Instance(): Out of memory
```

**Why?** The build script in `package.json` is:
```json
"build": "prisma generate && next build"
```

## Solution: Build Without Prisma Generate

**Since Prisma client is already generated and uploaded, skip the generate step!**

### Option 1: Build Directly (Recommended) ✅

**Skip `npm run build` - run Next.js build directly:**

```bash
cd ~/trimsoftstudio.com/iqcheck
next build
```

**This only builds Next.js, doesn't run Prisma generate.**

### Option 2: Use Custom Build Script

**Create a temporary build script:**

```bash
cd ~/trimsoftstudio.com/iqcheck
npx next build
```

**Same as Option 1 - just uses npx.**

### Option 3: Modify Build Script Temporarily

**Edit package.json to skip Prisma generate:**

**On server, edit `package.json`:**

```bash
cd ~/trimsoftstudio.com/iqcheck
nano package.json
```

**Change this line:**
```json
"build": "prisma generate && next build",
```

**To:**
```json
"build": "next build",
```

**Save and exit** (Ctrl+X, then Y, then Enter)

**Then run:**
```bash
npm run build
```

### Option 4: Use Environment Variable

**Skip Prisma generate with environment variable:**

```bash
cd ~/trimsoftstudio.com/iqcheck
SKIP_PRISMA_GENERATE=true next build
```

(Requires modifying build script to check this variable)

## Quick Fix

**Just run this instead of `npm run build`:**

```bash
cd ~/trimsoftstudio.com/iqcheck
next build
```

**That's it!** Next.js will build successfully since Prisma client is already generated.

## After Build

**Verify build succeeded:**

```bash
ls -la .next
```

**Should show the `.next` folder with build files.**

**Then restart your app in cPanel:**
1. Go to "Setup Node.js App"
2. Click on your application
3. Click "Restart"
4. Wait 10-20 seconds
5. Refresh your website

## Why This Works

- ✅ **Prisma client already exists** - `src/generated/prisma/` is already on server
- ✅ **No WebAssembly needed** - we're not running Prisma generate
- ✅ **Next.js builds successfully** - uses existing Prisma client

## Summary

**Don't run `npm run build` - it triggers Prisma generate!**

**Instead, run:**
```bash
next build
```

**This builds Next.js only, using the already-generated Prisma client!** 🎉

