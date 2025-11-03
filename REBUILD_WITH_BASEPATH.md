# Rebuild App with basePath Configuration

## Critical: Rebuild Required

After configuring `basePath: '/iqcheck'` in `next.config.ts`, you **MUST rebuild** the app for CSS and assets to load correctly.

## Step 1: Rebuild on Windows

**On your Windows machine:**

```bash
cd C:\wamp64\www\IQ\iq-app

# Pull latest changes (includes basePath config)
git pull

# Rebuild Next.js (this will now include /iqcheck basePath)
npm run build
```

**This rebuild is essential!** The new build will:
- ✅ Generate CSS files with `/iqcheck` prefix
- ✅ Generate asset paths with `/iqcheck` prefix
- ✅ Fix all internal links and routes

## Step 2: Upload New .next Folder

**After rebuild completes:**

1. **Compress the new `.next` folder:**
   - Right-click `.next` folder → Send to → Compressed (zipped) folder
   - Creates `.next.zip`

2. **Upload via FTP** (to bypass antivirus):
   - Use FileZilla or WinSCP
   - Upload `.next.zip` to `/home/rungrezc/trimsoftstudio.com/iqcheck/`

3. **Extract on server:**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   unzip .next.zip
   rm .next.zip
   ```

## Step 3: Upload Updated server.js

**The updated `server.js` also needs to be on the server:**

**Via Git (if using git):**
```bash
cd ~/trimsoftstudio.com/iqcheck
git pull
```

**Or upload manually via FTP:**
- Upload `server.js` from Windows to server

## Step 4: Restart App

**In cPanel:**
1. Go to "Setup Node.js App"
2. Click on your application
3. Click "Restart"
4. Wait 30 seconds
5. Refresh your website

## What Was Fixed

- ✅ **CSS will load** - Assets now have `/iqcheck` prefix
- ✅ **All links work** - Next.js handles basePath automatically
- ✅ **Test links point correctly** - All routes include `/iqcheck`

## Verification

**After restart, check:**

1. **CSS loads** - Page should have styling
2. **Test links work** - Click "Start Free Test" → Should go to `/iqcheck/test/start`
3. **No 404 errors** - All routes work correctly

## Summary

**Rebuild is critical!** Without rebuilding:
- ❌ CSS won't load (paths are wrong)
- ❌ Assets won't load (paths are wrong)
- ❌ Links might not work (paths are wrong)

**After rebuild:**
- ✅ Everything works with `/iqcheck` basePath! 🎉

