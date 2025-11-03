# Build Next.js Locally and Upload .next Folder

## The Problem

Even running `npx next build` directly triggers:
```
RangeError: WebAssembly.instantiate(): Out of memory
```

**Why?** Next.js imports Prisma during build time, and Prisma tries to load WebAssembly modules, which fails on the server.

## Solution: Build Locally on Windows, Upload .next Folder ✅

Since your local Windows machine works perfectly, build there and upload the build output.

### Step 1: Build on Windows

**On your local Windows machine:**

```bash
cd C:\wamp64\www\IQ\iq-app

# Make sure dependencies are installed locally
npm install

# Prisma client is already generated (we did this earlier)
# Now build Next.js
npm run build
```

**This should work perfectly on Windows!**

### Step 2: Compress .next Folder

**After build completes:**

```bash
# Check that .next folder exists
dir .next

# Compress the .next folder
# Right-click .next folder → Send to → Compressed (zipped) folder
# This creates .next.zip
```

### Step 3: Upload to Server

**Via cPanel File Manager:**

1. **Go to cPanel → File Manager**
2. **Navigate to** `trimsoftstudio.com/iqcheck`
3. **Upload** `.next.zip`
4. **Extract** `.next.zip` in the `iqcheck` folder
5. **Verify** `.next` folder exists:
   ```bash
   ls -la .next
   ```

### Step 4: Upload Other Build Files (If Needed)

**Also upload these files/folders from Windows:**

- `.next/` folder (most important!)
- `public/` folder (if you have static assets)
- `node_modules/` (if needed, but can install on server)

**Optional - Only if needed:**

```bash
# If you have custom public folder
cp -r public ~/trimsoftstudio.com/iqcheck/public
```

### Step 5: Restart App on Server

**After uploading .next folder:**

1. **Go to cPanel → "Setup Node.js App"**
2. **Click on your application**
3. **Click "Restart"**
4. **Wait 10-20 seconds**
5. **Refresh your website**

### Step 6: Verify Build Files

**On server, check:**

```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la .next

# Should show:
# - .next/server/
# - .next/static/
# - .next/BUILD_ID
# etc.
```

## Alternative: Build Only Server Files

**If uploading entire .next is too large, you can:**

1. **Build on Windows** (creates `.next` folder)
2. **Upload only necessary files:**
   - `.next/server/` (server-side code)
   - `.next/static/` (static assets)
   - `.next/BUILD_ID`
3. **Skip**:
   - `.next/cache/` (will be regenerated)
   - Source maps (optional)

## Quick Checklist

- [ ] Built on Windows: `npm run build` ✅
- [ ] Compressed `.next` folder: `.next.zip` ✅
- [ ] Uploaded to server via File Manager ✅
- [ ] Extracted on server ✅
- [ ] Verified `.next` folder exists ✅
- [ ] Restarted app in cPanel ✅
- [ ] Tested website ✅

## Why This Works

- ✅ **No WebAssembly issues** - build happens on Windows
- ✅ **Uses all local resources** - Windows has plenty of memory
- ✅ **Server just runs the app** - doesn't need to build
- ✅ **Reliable and fast** - predictable build process

## After Build Upload

**Your app should now work!**

Test it:
```bash
curl https://trimsoftstudio.com/iqcheck
```

**Should return 200 OK, not 503!**

## Summary

**Build locally, upload `.next` folder, restart app!**

This completely bypasses all WebAssembly memory issues on the server! 🎉

