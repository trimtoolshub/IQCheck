# Quick cPanel Deployment Guide

Based on your cPanel, here's the fastest way to deploy:

## ✅ What You Have

I can see your cPanel has:
- ✅ **Setup Node.js App** (Software section)
- ✅ **Terminal** (Advanced section)
- ✅ **Git™ Version Control** (Files section)
- ✅ **File Manager** (Files section)

**Perfect!** All tools needed for deployment are available.

## 🚀 Quick Deployment Steps

### Step 1: Upload Files via Git

**Option A: Make Repo Public (Easiest)**

1. **Go to GitHub**: https://github.com/trimtoolshub/IQCheck/settings
2. **Scroll down to "Danger Zone"**
3. **Click "Change visibility"** → **"Make public"**
4. **Confirm** the change
5. **Then in Terminal** (in Advanced section):
   ```bash
   cd ~/trimsoftstudio.com
   git clone https://github.com/trimtoolshub/IQCheck.git
   mkdir -p iqcheck
   cp -r IQCheck/iq-app/* iqcheck/
   cd iqcheck
   ```

**Option A2: Use Personal Access Token (If repo stays private)**

1. **Create GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name it: "cPanel Deployment"
   - Select scope: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you'll only see it once!)

2. **In Terminal, use token for cloning:**
   ```bash
   cd ~/trimsoftstudio.com
   git clone https://YOUR_TOKEN@github.com/trimtoolshub/IQCheck.git
   mkdir -p iqcheck
   cp -r IQCheck/iq-app/* iqcheck/
   cd iqcheck
   ```
   (Replace `YOUR_TOKEN` with your actual token)

**Option B: Use cPanel Git (if repo is public)**

1. **Make sure your GitHub repo is PUBLIC** (Settings → Change visibility)
2. **Click "Git™ Version Control"** (in Files section)
3. **Click "Create"** (top right)
4. **Fill in:**
   - **Repository URL**: `https://github.com/trimtoolshub/IQCheck.git`
   - **Repository Path**: `/home/rungrezc/repositories/iqcheck`
   - **Repository Branch**: `main`
5. **Click "Create"**

**Option C: Download ZIP and Upload (No Git Needed - RECOMMENDED)**

This avoids all authentication issues!

1. **Download ZIP from GitHub:**
   - Go to https://github.com/trimtoolshub/IQCheck
   - Click green **"Code"** button
   - Click **"Download ZIP"**
   - Save the ZIP file to your computer

2. **Upload via cPanel File Manager:**
   - In cPanel, click **"File Manager"** (Files section)
   - Navigate to `trimsoftstudio.com` folder
   - Click **"Upload"** (top toolbar)
   - Select your downloaded ZIP file
   - Wait for upload to complete

3. **Extract and Setup:**
   - **Right-click** the ZIP file → **"Extract"**
   - This creates `IQCheck-main` folder
   - **Create new folder** `iqcheck` (if it doesn't exist)
   - **Navigate into** `IQCheck-main/iq-app`
   - **Select all files** (Ctrl+A or Cmd+A)
   - **Copy** them (Ctrl+C or Cmd+C)
   - **Navigate to** `trimsoftstudio.com/iqcheck`
   - **Paste** all files (Ctrl+V or Cmd+V)

4. **In Terminal, verify:**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   ls -la
   ```
   (You should see files like `package.json`, `server.js`, etc.)

### Step 2: Verify Files Are in Place

**If you used Option A or A2:**
```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la
```
You should see `package.json`, `server.js`, `prisma/`, etc.

**If you used Option B (cPanel Git), run in Terminal:**
```bash
mkdir -p ~/trimsoftstudio.com/iqcheck
cp -r ~/repositories/iqcheck/iq-app/* ~/trimsoftstudio.com/iqcheck/
cd ~/trimsoftstudio.com/iqcheck
```

**If you used Option C (ZIP Upload):**
Files should already be in `trimsoftstudio.com/iqcheck`
Verify in Terminal:
```bash
cd ~/trimsoftstudio.com/iqcheck
ls -la
```

### Step 3: Install Dependencies

**Important:** npm may not be in your PATH. Try these options:

**Option 1: Use Node.js App Environment (Recommended)**

1. **Create Node.js App first** (Step 4 below) - cPanel will set up the environment
2. **Then in Terminal**, Node.js will be available after creating the app

**Option 2: Find npm Path**

In Terminal:
```bash
# Find Node.js installation
which node
# or
whereis node

# If Node.js is installed, find npm:
which npm
# or
find /usr -name npm 2>/dev/null
```

**Option 3: Create Node.js App First (Recommended)**

1. **Skip to Step 4** - Create Node.js App in cPanel first
2. **cPanel will automatically set up Node.js environment**
3. **Then come back and run npm install**

After Node.js App is created, in Terminal:
```bash
cd ~/trimsoftstudio.com/iqcheck
npm install
npm run build
```

**Option 4: Use Full Path (If found)**

If you find npm path (e.g., `/usr/local/bin/npm`):
```bash
cd ~/trimsoftstudio.com/iqcheck
/usr/local/bin/npm install
/usr/local/bin/npm run build
```

### Step 3 or 4: Create Node.js App First

**If npm is not found, create Node.js App first - this sets up the environment!**

1. **Click "Setup Node.js App"** (in Software section)
2. **Click "Create Application"** button
3. **Configure:**
   - **Node.js Version**: Select **18.x** or **20.x** (highest available)
   - **Application Mode**: **Production**
   - **Application Root**: `/home/rungrezc/trimsoftstudio.com/iqcheck`
   - **Application URL**: 
     - Use domain: `iqcheck.trimsoftstudio.com` (create subdomain first if needed)
     - Or main domain if configured
   - **Application Startup File**: `server.js`
4. **Click "Create"**

**After creating the app, Node.js and npm will be available in Terminal!**

Now run install (if you skipped Step 3):
```bash
cd ~/trimsoftstudio.com/iqcheck
npm install
npm run build
```

### Step 5: Set Environment Variables

1. **After creating the app, click on it**
2. **Go to "Environment Variables" tab**
3. **Add:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)
   NEXTAUTH_URL=https://your-chosen-domain.com
   NODE_ENV=production
   ```
4. **Click "Save"**

### Step 6: Setup Database

In Terminal:
```bash
cd ~/trimsoftstudio.com/iqcheck
npx prisma migrate deploy
npx prisma generate
```

### Step 7: Seed Database

```bash
curl -X POST http://localhost:PORT/api/dev/seed
```
(Replace PORT with the port shown in Node.js App settings)

Or:
```bash
curl -X POST https://your-domain.com/api/dev/seed
```

### Step 8: Restart App

1. **Go to "Setup Node.js App"**
2. **Click on your application**
3. **Click "Restart App"**
4. **Check logs** if needed

## 📋 Checklist

- [ ] Git repository cloned
- [ ] Files copied to `~/trimsoftstudio.com/iqcheck`
- [ ] Node.js app created
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Build completed
- [ ] Database migrated
- [ ] Database seeded
- [ ] Admin user created
- [ ] App running!

## 🎯 Your App URL

After deployment, your app will be available at:
- `https://iqcheck.trimsoftstudio.com` (if using subdomain)
- OR `https://trimsoftstudio.com/iqcheck` (if using main domain)

## 💡 Tips

1. **SQLite will work!** - Your database file will be at `/home/rungrezc/trimsoftstudio.com/iqcheck/prisma/dev.db`

2. **Backups** - cPanel automatically backs up files, including your SQLite database

3. **Logs** - Check app logs in "Setup Node.js App" → Your App → View Logs

4. **Restart** - If you make changes, restart the app in cPanel

## 🔧 Troubleshooting

**Can't find "Setup Node.js App"?**
- Contact your hosting provider to enable Node.js support

**"npm: command not found"?** ✅ FIXED
- **Solution: Create Node.js App first** (Step 4) - this sets up the environment
- After creating the app, npm will be available in Terminal
- See `CPANEL_NPM_FIX.md` for detailed solutions

**Build fails?**
- Make sure Node.js version is 16+ (18+ recommended)
- Check Terminal for error messages
- Make sure you ran `npm install` first

**Database permissions?**
```bash
chmod 644 ~/trimsoftstudio.com/iqcheck/prisma/dev.db
chmod 755 ~/trimsoftstudio.com/iqcheck/prisma
```

Your app is ready for cPanel deployment! SQLite will work perfectly. 🎉

