# Fix 503 Error - Service Unavailable

## The Problem

Getting **503 Service Unavailable** error when accessing your application.

This means the Node.js app is not running or not configured correctly.

## Common Causes

1. **Node.js app not started** in cPanel
2. **Application not built** (missing `.next` folder)
3. **Environment variables** not set
4. **App crashed** on startup
5. **Port not configured** correctly

## Step-by-Step Fix

### Step 1: Check Node.js App Status

1. **Go to cPanel → "Setup Node.js App"**
2. **Find your application** (`trimsoftstudio.com/iqcheck`)
3. **Check status**:
   - ✅ **Green/Running** = App is running
   - ❌ **Red/Stopped** = App is not running
   - ⚠️ **Yellow/Paused** = App is paused

**If app is stopped:**
- Click **"Start"** or **"Restart"** button
- Wait a few seconds
- Refresh your website

### Step 2: Build the Application

**The app must be built before it can run:**

```bash
cd ~/trimsoftstudio.com/iqcheck

# Check if build folder exists
ls -la .next

# If .next folder doesn't exist, build the app
npm run build
```

**Important:** Make sure `npm run build` completes successfully!

### Step 3: Check Environment Variables

**In cPanel Node.js App:**

1. **Click on your application**
2. **Go to "Environment Variables" tab**
3. **Verify these are set:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=(some-random-string)
   NEXTAUTH_URL=https://trimsoftstudio.com/iqcheck
   NODE_ENV=production
   ```

**If missing, add them and restart the app!**

### Step 4: Check Application Logs

**In cPanel Node.js App:**

1. **Click on your application**
2. **Go to "Logs" tab** (or "Application Logs")
3. **Check for errors:**
   - Database connection errors
   - Missing environment variables
   - Port conflicts
   - Module not found errors

**Common errors to look for:**
- `Cannot find module`
- `Error: ENOENT: no such file or directory`
- `Port already in use`
- `DATABASE_URL not set`

### Step 5: Verify Startup File

**Check if `server.js` exists:**

```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la server.js
```

**If missing, create it:**

```bash
cat > server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
EOF
```

### Step 6: Restart the App

**After making changes:**

1. **Go to cPanel → "Setup Node.js App"**
2. **Click on your application**
3. **Click "Restart"** button
4. **Wait 10-20 seconds**
5. **Refresh your website**

## Quick Checklist

- [ ] Node.js app is **started** (green status in cPanel)
- [ ] Application is **built** (`.next` folder exists)
- [ ] `server.js` exists in app root
- [ ] Environment variables are set
- [ ] Database exists (`prisma/dev.db`)
- [ ] No errors in application logs
- [ ] App was restarted after changes

## Common Solutions

### Solution 1: Build + Restart

```bash
cd ~/trimsoftstudio.com/iqcheck
npm run build
```

Then **restart app in cPanel**.

### Solution 2: Check Logs for Errors

**In Terminal:**

```bash
cd ~/trimsoftstudio.com/iqcheck
cat ~/logs/app.log  # or check in cPanel Logs tab
```

**Fix any errors shown.**

### Solution 3: Recreate Node.js App

If nothing works:

1. **Delete the Node.js app** in cPanel
2. **Create new app**:
   - Node.js version: **20.x** (or 18.x)
   - Application root: `/home/rungrezc/trimsoftstudio.com/iqcheck`
   - Startup file: `server.js`
   - Application mode: **Production**
3. **Set environment variables** again
4. **Build the app**: `npm run build`
5. **Start the app** in cPanel

## Verify It Works

**After restarting:**

```bash
# Check app status (should show running)
curl https://trimsoftstudio.com/iqcheck

# Or test API
curl https://trimsoftstudio.com/iqcheck/api/dev/seed
```

**Should return 200 OK, not 503!**

## Summary

**Most common fix:**
1. ✅ **Build the app**: `npm run build`
2. ✅ **Check environment variables** are set
3. ✅ **Restart the app** in cPanel
4. ✅ **Check logs** for errors

**The app must be built before it can run!** `.next` folder is required.

Try building and restarting first - that fixes 90% of 503 errors! 🎉

