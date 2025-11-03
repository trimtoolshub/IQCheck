# Fix: cPanel Antivirus Blocks .next.zip Upload

## The Problem

cPanel's antivirus flagged `.next.zip` as a virus:
```
Sanesecurity.Foxhole.JS_Zip_12.UNOFFICIAL FOUND
```

**Why?** This is a **false positive**. The `.next` folder contains JavaScript files from the Next.js build, and some antivirus scanners incorrectly flag JavaScript/Node.js files in ZIP archives.

## Solution: Upload via FTP (Bypasses Antivirus) ✅

**FTP usually bypasses the cPanel antivirus scanner.**

### Option 1: Upload via FTP (Recommended) ✅

**Use FileZilla, WinSCP, or any FTP client:**

1. **Connect to your server via FTP:**
   - Host: `trimsoftstudio.com` (or your server IP)
   - Username: `rungrezc`
   - Password: (your FTP password)
   - Port: `21` (or `21` for FTPS)

2. **Navigate to** `/home/rungrezc/trimsoftstudio.com/iqcheck`

3. **Upload `.next.zip`** via FTP
   - FTP usually doesn't scan for viruses
   - Should upload successfully

4. **Then extract on server** via Terminal:
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   unzip .next.zip
   rm .next.zip
   ```

### Option 2: Upload .next Folder Directly (No ZIP)

**Instead of compressing, upload the `.next` folder directly:**

**Via FTP:**

1. **In FileZilla/WinSCP**, navigate to local: `C:\wamp64\www\IQ\iq-app`
2. **Navigate to server**: `/home/rungrezc/trimsoftstudio.com/iqcheck`
3. **Drag and drop** the entire `.next` folder
4. **Wait for upload** (might take a few minutes)

**This bypasses antivirus because it's not a ZIP file.**

### Option 3: Upload Essential Parts Only

**Upload only the essential parts of `.next`:**

**Required folders/files:**
- `.next/server/` - Server-side code (most important!)
- `.next/static/` - Static assets
- `.next/BUILD_ID` - Build ID file

**Optional (can be skipped):**
- `.next/cache/` - Will be regenerated
- `.next/dev/` - Only needed for development

**Via FTP, upload these folders individually.**

### Option 4: Use Git to Push .next

**If `.next` is tracked in Git (or you add it temporarily):**

**On Windows:**
```bash
cd C:\wamp64\www\IQ\iq-app

# Add .next to git (temporarily)
git add .next
git commit -m "Add build output"
git push origin main
```

**On Server:**
```bash
cd ~/trimsoftstudio.com/iqcheck
git pull
```

**Note:** `.next` is usually in `.gitignore`, so you might need to:
```bash
# Temporarily remove from .gitignore
# Or force add it
git add -f .next
```

### Option 5: Contact Hosting Provider

**If FTP also gets blocked, contact your hosting provider:**

1. **Explain** it's a false positive
2. **Ask them to whitelist** `.next.zip` or your FTP account
3. **Or ask them to disable antivirus** for ZIP uploads (if possible)

## Recommended: Use FTP

**Best approach - Upload via FTP:**

1. **Download FileZilla** (free): https://filezilla-project.org/
2. **Connect to server** via FTP
3. **Upload `.next.zip`**
4. **Extract on server** via Terminal

**FTP usually bypasses antivirus scans!**

## After Upload

**Once `.next` folder is on server:**

```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la .next

# Should show:
# - .next/server/
# - .next/static/
# - .next/BUILD_ID
```

**Then restart app in cPanel:**
1. Go to "Setup Node.js App"
2. Click on your application
3. Click "Restart"
4. Wait 10-20 seconds
5. Refresh your website

## Alternative: Build on Server Without Prisma

**If all upload methods fail, you could try:**

1. **Modify package.json** to skip Prisma during build
2. **Or use a different build approach**

But FTP should work! 🎉

## Summary

**cPanel antivirus is blocking the ZIP - use FTP instead:**

✅ **Upload via FTP** (bypasses antivirus)
✅ **Or upload `.next` folder directly** (no ZIP needed)
✅ **Extract on server** via Terminal
✅ **Restart app** in cPanel

**FTP is your best bet!** 🚀

