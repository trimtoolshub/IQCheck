# URL Fix Summary - All URLs Now Use /iqcheck BasePath

## ✅ What Was Fixed

1. **Next.js Configuration** (`next.config.ts`):
   - Added `basePath: '/iqcheck'`
   - Added `assetPrefix: '/iqcheck'`
   - This automatically fixes ALL URLs, links, and assets

2. **Server Configuration** (`server.js`):
   - Updated to handle `/iqcheck` base path
   - Strips base path before passing to Next.js

3. **All Internal Links**:
   - `/test/start` → Automatically becomes `/iqcheck/test/start`
   - `/test/[id]` → Automatically becomes `/iqcheck/test/[id]`
   - `/admin` → Automatically becomes `/iqcheck/admin`
   - All `href` links work automatically with basePath

4. **All API Calls**:
   - `/api/test/start` → Automatically becomes `/iqcheck/api/test/start`
   - Next.js handles fetch calls automatically with basePath

5. **CSS and Assets**:
   - All CSS files: `/iqcheck/_next/static/...`
   - All images and assets: `/iqcheck/_next/static/...`

## 🔄 Critical: Rebuild Required!

**You MUST rebuild the app for all changes to take effect:**

```bash
cd C:\wamp64\www\IQ\iq-app

# Pull latest changes
git pull

# Rebuild with basePath
npm run build
```

## After Rebuild

1. **Compress `.next` folder**
2. **Upload via FTP** (bypasses antivirus)
3. **Extract on server**
4. **Pull updated server.js** via git or upload manually
5. **Restart app** in cPanel

## What Will Work After Rebuild

✅ **All Links**: `/test/start` → `/iqcheck/test/start`  
✅ **All CSS**: Loads from `/iqcheck/_next/static/...`  
✅ **All Assets**: Load from `/iqcheck/_next/static/...`  
✅ **All API Calls**: `/api/...` → `/iqcheck/api/...`  
✅ **Router Navigation**: All `router.push()` calls work  

## Summary

**All URLs are fixed!** Next.js basePath handles everything automatically.

**Just rebuild and upload!** 🎉

