# Build on Windows, Upload to Server

## Why This Works

- ✅ **Windows has no memory limits** - Build works perfectly
- ✅ **Bypasses all server WebAssembly issues** - Server doesn't need to build
- ✅ **Reliable and fast** - Predictable build process

## Step 1: Build on Windows

**On your Windows machine:**

```bash
cd C:\wamp64\www\IQ\iq-app

# Make sure everything is up to date
git pull

# Prisma client is already generated (we did this earlier)
# Now build Next.js
npm run build
```

**This should complete successfully!**

**Verify build:**
```bash
dir .next
```

**Should show the `.next` folder.**

## Step 2: Compress .next Folder

**After build completes:**

1. **Open File Explorer**
2. **Navigate to** `C:\wamp64\www\IQ\iq-app`
3. **Right-click `.next` folder**
4. **Send to → Compressed (zipped) folder**
5. **This creates `next.zip`** (or `.next.zip`)

**Note:** The `.next` folder can be large (100-500MB), so compression might take a minute.

## Step 3: Upload to Server

**Via cPanel File Manager:**

1. **Log into cPanel**
2. **Go to File Manager**
3. **Navigate to** `trimsoftstudio.com/iqcheck`
4. **Click Upload button**
5. **Upload `next.zip`** (or `.next.zip`)
6. **Wait for upload to complete** (might take a few minutes)

**Or via FTP:**
- Use FileZilla or WinSCP
- Upload `next.zip` to `/home/rungrezc/trimsoftstudio.com/iqcheck/`

## Step 4: Extract on Server

**In cPanel File Manager:**

1. **Navigate to** `trimsoftstudio.com/iqcheck`
2. **Right-click `next.zip`**
3. **Click "Extract"**
4. **Wait for extraction** (might take a minute)
5. **Delete the ZIP file** (to save space)

**Or via Terminal:**
```bash
cd ~/trimsoftstudio.com/iqcheck
unzip next.zip
rm next.zip  # Optional: delete ZIP to save space
```

## Step 5: Verify .next Folder

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

**If `.next` folder exists → Success! ✅**

## Step 6: Restart App

**In cPanel:**

1. **Go to "Setup Node.js App"**
2. **Click on your application** (`trimsoftstudio.com/iqcheck`)
3. **Click "Restart"**
4. **Wait 10-20 seconds**
5. **Refresh your website**

## Step 7: Test Your App

**Check if it works:**

```bash
curl https://trimsoftstudio.com/iqcheck
```

**Should return 200 OK, not 503!**

**Or open in browser:**
- `https://trimsoftstudio.com/iqcheck`

## Troubleshooting

### Build Fails on Windows

**If `npm run build` fails on Windows:**

```bash
# Make sure dependencies are installed
npm install

# Make sure Prisma client is generated
npm exec prisma generate

# Try build again
npm run build
```

### Upload Takes Too Long

**If `.next.zip` is too large:**

- **Option 1:** Use FTP (usually faster than File Manager)
- **Option 2:** Only upload `.next/server/` and `.next/static/` (skip cache)
- **Option 3:** Split into multiple ZIP files

### Extraction Fails

**If extraction fails on server:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Check available space
df -h .

# If space is low, delete old files first
# Then try extraction again
unzip next.zip -d .
```

## Summary

**Steps:**
1. ✅ **Build on Windows**: `npm run build`
2. ✅ **Compress `.next` folder**: Create ZIP
3. ✅ **Upload to server**: Via File Manager or FTP
4. ✅ **Extract on server**: Unzip `.next` folder
5. ✅ **Restart app**: In cPanel
6. ✅ **Test website**: Should work!

**This completely bypasses all server-side WebAssembly issues!** 🎉

