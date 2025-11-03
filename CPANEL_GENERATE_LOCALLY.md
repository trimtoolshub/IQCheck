# Generate Prisma Client Locally and Upload

## The Problem

Even with all fixes tried:
- NODE_OPTIONS set ✅
- ulimit increased ✅
- Static binary attempted ✅

**WebAssembly memory errors persist on the server.**

## Solution: Generate Locally, Upload to Server ✅

Generate Prisma client on your **Windows machine** (which has plenty of memory), then upload only the generated files to the server.

### Step 1: Generate on Your Windows Machine

On your local Windows computer:

```bash
cd C:\wamp64\www\IQ\iq-app
npm install  # Make sure dependencies are installed
npm exec prisma generate
```

**This should work on your local machine** since it has sufficient resources.

### Step 2: Copy Generated Files

After `prisma generate` completes, you'll have:

1. **`node_modules/.prisma`** folder - Contains generated Prisma client
2. **`node_modules/@prisma/client`** folder - Prisma client package

### Step 3: Upload to Server

**Option A: Via cPanel File Manager**

1. **Go to cPanel → File Manager**
2. **Navigate to** `trimsoftstudio.com/iqcheck`
3. **If `node_modules` folder doesn't exist, create it:**
   - Click "New Folder"
   - Name it `node_modules`
4. **Upload the folders:**
   - Create `.prisma` folder in `node_modules`
   - Upload contents of `C:\wamp64\www\IQ\iq-app\node_modules\.prisma` to `~/trimsoftstudio.com/iqcheck/node_modules/.prisma`
   - Upload `@prisma/client` folder similarly

**Option B: Via FTP**

1. **Use FTP client** (FileZilla, WinSCP, etc.)
2. **Connect to your server**
3. **Navigate to** `/home/rungrezc/trimsoftstudio.com/iqcheck/node_modules`
4. **Upload** `.prisma` and `@prisma/client` folders

**Option C: Compress and Upload (Easier)**

1. **On Windows, compress the folders:**
   - Right-click `node_modules\.prisma` → Send to → Compressed folder
   - Right-click `node_modules\@prisma\client` → Send to → Compressed folder

2. **Upload ZIP files** via cPanel File Manager

3. **Extract on server:**
   - Right-click ZIP → Extract
   - Move extracted folders to correct location

### Step 4: Verify on Server

In Terminal:

```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la node_modules/.prisma
ls -la node_modules/@prisma/client
```

**Both should exist!**

### Step 5: Run Migrations on Server

**On the server**, you only need to run migrations (no generate needed):

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma migrate deploy
```

**This should work** since the Prisma client is already generated!

### Step 6: Test the App

```bash
# Seed database (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/dev/seed

# Create admin (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## What You're Uploading

**Only these folders:**
- `node_modules/.prisma/` - Generated Prisma client
- `node_modules/@prisma/client/` - Prisma client package

**You DON'T need to upload:**
- All of `node_modules` (too large)
- Source files
- Other dependencies (npm install handles those)

## Alternative: Upload All node_modules (If Needed)

If you prefer, upload the **entire `node_modules`** folder:

1. **Compress** `node_modules` on Windows
2. **Upload ZIP** via cPanel File Manager
3. **Extract** on server: `~/trimsoftstudio.com/iqcheck/`
4. **Then run migrations only:**

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma migrate deploy
```

**Note**: This is a large upload (hundreds of MB), but ensures everything is there.

## Quick Checklist

- [ ] Generated Prisma client on Windows: `npm exec prisma generate`
- [ ] Copied `.prisma` folder to server
- [ ] Copied `@prisma/client` folder to server (if needed)
- [ ] Verified folders exist on server
- [ ] Ran migrations on server: `npm exec prisma migrate deploy`
- [ ] Seeded database
- [ ] Created admin user

## Why This Works

- ✅ **Avoids all server memory issues**
- ✅ **Uses local machine's resources**
- ✅ **Server only runs migrations** (lightweight)
- ✅ **Reliable and predictable**

## Summary

**Generate locally, upload generated files, run migrations on server!**

This completely bypasses the WebAssembly memory issue on your server. 🎉

