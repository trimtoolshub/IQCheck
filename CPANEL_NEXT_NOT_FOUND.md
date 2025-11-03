# Fix "next: command not found"

## The Problem

Error: `bash: next: command not found`

This means Next.js CLI is not in your Terminal PATH.

## Solution: Use npx or npm exec

**Since Next.js is installed via npm, use npx or npm exec:**

### Option 1: Use npx (Recommended) ✅

```bash
cd ~/trimsoftstudio.com/iqcheck
npx next build
```

**npx finds and runs Next.js from node_modules automatically.**

### Option 2: Use npm exec

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec next build
```

**npm exec is equivalent to npx.**

### Option 3: Use Full Path

**If npx doesn't work, find Next.js binary:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Find Next.js binary
find node_modules -name next 2>/dev/null

# Or use the executable directly
node_modules/.bin/next build
```

### Option 4: Temporarily Modify package.json

**Edit package.json to skip Prisma generate:**

```bash
cd ~/trimsoftstudio.com/iqcheck
nano package.json
```

**Change:**
```json
"build": "prisma generate && next build",
```

**To:**
```json
"build": "next build",
```

**Then run:**
```bash
npm run build
```

(But this still might fail if next isn't found - use Option 1 instead!)

## Quick Fix

**Just use npx:**

```bash
cd ~/trimsoftstudio.com/iqcheck
npx next build
```

**This should work!** npx finds Next.js in node_modules automatically.

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

## Summary

**Don't use:**
```bash
next build  # ❌ Command not found
```

**Use instead:**
```bash
npx next build  # ✅ Finds Next.js in node_modules
```

**Or:**
```bash
npm exec next build  # ✅ Also works
```

Try `npx next build` - it should work! 🎉

