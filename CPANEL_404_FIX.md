# Fix 404 Not Found Error

## The Problem

Getting **404 Not Found** when accessing your application.

This means the route isn't being found or the app isn't configured correctly.

## Common Causes

1. **Node.js app URL not configured correctly** in cPanel
2. **Application root path incorrect** in cPanel
3. **App not running** or crashed
4. **Wrong domain/subdomain** mapping
5. **.next folder not in correct location**

## Step-by-Step Fix

### Step 1: Check Node.js App Configuration

**In cPanel → "Setup Node.js App":**

1. **Click on your application**
2. **Check these settings:**
   - **Application Root**: Should be `/home/rungrezc/trimsoftstudio.com/iqcheck`
   - **Application URL**: Should match your domain/subdomain
   - **Startup File**: Should be `server.js`

3. **Verify the app is running:**
   - Status should be **Green/Running**
   - If **Red/Stopped**, click **"Start"**

### Step 2: Check .next Folder Location

**On server (Terminal):**
```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la .next
```

**The `.next` folder should be in:**
```
/home/rungrezc/trimsoftstudio.com/iqcheck/.next
```

**If `.next` is in wrong location, move it:**
```bash
# If .next is in wrong place, move it to app root
mv /path/to/wrong/location/.next ~/trimsoftstudio.com/iqcheck/.next
```

### Step 3: Check server.js Location

**Verify server.js exists in app root:**
```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la server.js
```

**Should exist!** If not, make sure it's uploaded.

### Step 4: Check Application URL

**In cPanel Node.js App, check:**

1. **What URL is configured?**
   - `trimsoftstudio.com/iqcheck` (subdirectory)
   - `iqcheck.trimsoftstudio.com` (subdomain)
   - `trimsoftstudio.com` (main domain)

2. **Try accessing the exact URL configured:**
   - If configured as subdomain: `https://iqcheck.trimsoftstudio.com`
   - If configured as subdirectory: `https://trimsoftstudio.com/iqcheck`
   - If configured as main domain: `https://trimsoftstudio.com`

### Step 5: Check Application Logs

**In cPanel Node.js App:**

1. **Click on your application**
2. **Go to "Logs" tab** (or "Application Logs")
3. **Check for errors:**
   - File not found errors
   - Port conflicts
   - Module not found errors
   - Path errors

### Step 6: Verify File Structure

**On server, check file structure:**
```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la

# Should show:
# - .next/ (folder)
# - server.js (file)
# - package.json (file)
# - node_modules/ (folder)
# - prisma/ (folder)
# - src/ (folder)
```

### Step 7: Test Direct Access

**Try accessing the app directly:**

```bash
# Check what port the app is running on
# Look in cPanel Node.js App settings

# Try localhost access (if SSH available)
curl http://localhost:PORT

# Or check the exact URL from cPanel
```

## Common Solutions

### Solution 1: Check URL Configuration

**If app is configured as subdomain:**
```bash
# Try subdomain URL
curl https://iqcheck.trimsoftstudio.com
```

**If app is configured as subdirectory:**
```bash
# Try subdirectory URL
curl https://trimsoftstudio.com/iqcheck
```

**Check what URL is set in cPanel Node.js App!**

### Solution 2: Restart App After Upload

**After uploading `.next` folder:**

1. **Restart the app** in cPanel:
   - Go to "Setup Node.js App"
   - Click on application
   - Click "Restart"
   - Wait 30 seconds

2. **Try again:**
```bash
curl https://trimsoftstudio.com/iqcheck
```

### Solution 3: Recreate Node.js App

**If nothing works, recreate the app:**

1. **Delete existing Node.js app** in cPanel
2. **Create new app:**
   - Node.js version: **20.x**
   - Application root: `/home/rungrezc/trimsoftstudio.com/iqcheck`
   - Application URL: Choose correct subdomain or path
   - Startup file: `server.js`
   - Application mode: **Production**
3. **Set environment variables** again
4. **Start the app**

### Solution 4: Check Environment Variables

**Verify environment variables are set:**

1. **In cPanel Node.js App**
2. **Go to "Environment Variables" tab**
3. **Verify these are set:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=(some value)
   NEXTAUTH_URL=https://trimsoftstudio.com/iqcheck
   NODE_ENV=production
   ```

## Quick Checklist

- [ ] Node.js app is **running** (green status)
- [ ] Application root is **correct** (`/home/rungrezc/trimsoftstudio.com/iqcheck`)
- [ ] `.next` folder exists in **app root**
- [ ] `server.js` exists in **app root**
- [ ] Using **correct URL** (subdomain vs subdirectory)
- [ ] Environment variables are **set**
- [ ] App was **restarted** after upload

## Most Likely Issue

**Wrong URL or app not running.**

1. **Check what URL is configured in cPanel** Node.js App
2. **Use that exact URL** to access
3. **Make sure app status is "Running"**

**What URL does your cPanel Node.js App show?** That's the URL you should use! 🎯

