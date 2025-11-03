# Upload Generated Prisma Files to cPanel Server

## ✅ Success! Prisma Client Generated Locally

Your Prisma client has been successfully generated on Windows. Now you need to upload the generated files to your cPanel server.

## What Was Generated

1. **`src/generated/prisma/`** - Main generated client (custom output path) ✅
2. **`node_modules/.prisma/`** - Standard Prisma location ✅
3. **`node_modules/@prisma/client/`** - Prisma client package ✅

## What to Upload

Since your project uses custom output (`src/generated/prisma`), you **must upload**:
- **`src/generated/prisma/`** folder (most important!)

**Recommended to also upload** (for compatibility):
- **`node_modules/.prisma/`** folder
- **`node_modules/@prisma/client/`** folder

## Step-by-Step Upload Instructions

### Option 1: Compress and Upload via cPanel File Manager (Easiest) ✅

#### Step 1: Compress Folders on Windows

1. **Open File Explorer** and navigate to:
   ```
   C:\wamp64\www\IQ\iq-app
   ```

2. **Right-click on `src` folder** → **Send to** → **Compressed (zipped) folder**
   - This creates `src.zip`
   - The `src.zip` will contain `src/generated/prisma/`

3. **Create a folder for Prisma node_modules:**
   - Create a temporary folder: `C:\wamp64\www\IQ\prisma_upload`
   - Copy `node_modules\.prisma` to this folder
   - Copy `node_modules\@prisma\client` to this folder
   - Right-click the folder → **Send to** → **Compressed (zipped) folder**
   - Name it `prisma_node_modules.zip`

#### Step 2: Upload to Server

1. **Log into cPanel**
2. **Go to File Manager**
3. **Navigate to** `/home/rungrezc/trimsoftstudio.com/iqcheck/`
4. **Upload both ZIP files:**
   - `src.zip`
   - `prisma_node_modules.zip`

#### Step 3: Extract on Server

1. **Right-click `src.zip`** → **Extract**
   - This will extract `src/generated/prisma/` to the correct location

2. **Right-click `prisma_node_modules.zip`** → **Extract**
   - Navigate to extracted folder
   - Copy `.prisma` folder to `node_modules/.prisma`
   - Copy `@prisma` folder to `node_modules/@prisma`

### Option 2: Upload Individual Folders via File Manager

1. **Go to cPanel → File Manager**
2. **Navigate to** `trimsoftstudio.com/iqcheck`

3. **Upload `src/generated` folder:**
   - Click **Upload** button
   - Select `C:\wamp64\www\IQ\iq-app\src\generated` folder
   - Upload entire folder
   - Should extract to `trimsoftstudio.com/iqcheck/src/generated/prisma/`

4. **Create `node_modules` folder if it doesn't exist:**
   - Click **New Folder**
   - Name it `node_modules`

5. **Upload Prisma folders:**
   - Click **Upload**
   - Upload `node_modules/.prisma` from Windows
   - Upload `node_modules/@prisma/client` from Windows

### Option 3: Upload via FTP (Fastest for Large Files)

1. **Use FTP client** (FileZilla, WinSCP, etc.)
2. **Connect to server**
3. **Navigate to** `/home/rungrezc/trimsoftstudio.com/iqcheck/`

4. **Upload these folders:**
   - `src/generated/prisma/` → `trimsoftstudio.com/iqcheck/src/generated/prisma/`
   - `node_modules/.prisma/` → `trimsoftstudio.com/iqcheck/node_modules/.prisma/`
   - `node_modules/@prisma/client/` → `trimsoftstudio.com/iqcheck/node_modules/@prisma/client/`

## Step 4: Verify Upload on Server

**In cPanel Terminal:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Check main generated folder
ls -la src/generated/prisma/

# Check node_modules folders
ls -la node_modules/.prisma/
ls -la node_modules/@prisma/client/
```

**All should exist!**

## Step 5: Run Migrations on Server

**Once files are uploaded, run migrations:**

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma migrate deploy
```

**This should work now** since Prisma client is already generated!

## Step 6: Test the App

```bash
# Seed database (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/dev/seed

# Create admin user (optional)
curl -X POST https://trimsoftstudio.com/iqcheck/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## Quick Checklist

- [ ] Compressed `src` folder (contains `src/generated/prisma/`)
- [ ] Compressed Prisma `node_modules` folders
- [ ] Uploaded ZIP files to server
- [ ] Extracted ZIP files on server
- [ ] Verified folders exist: `src/generated/prisma/`, `node_modules/.prisma/`, `node_modules/@prisma/client/`
- [ ] Ran migrations: `npm exec prisma migrate deploy`
- [ ] Seeded database (optional)
- [ ] Created admin user (optional)

## Important Notes

1. **Main folder**: `src/generated/prisma/` is the most important - your code imports from here!

2. **File size**: The `query_engine-windows.dll.node` file is ~20MB. This is normal.

3. **Server will need Linux binary**: After upload, Prisma will need to download the Linux query engine on first run. This is automatic and lightweight.

4. **Permissions**: Make sure uploaded files have correct permissions:
   ```bash
   chmod -R 755 src/generated/prisma
   chmod -R 755 node_modules/.prisma
   chmod -R 755 node_modules/@prisma/client
   ```

## Summary

**Most Important:** Upload `src/generated/prisma/` folder - this is what your code uses!

The server will automatically download the Linux query engine on first use, so don't worry about the Windows `.dll.node` file.

After upload, run migrations and you're done! 🎉

