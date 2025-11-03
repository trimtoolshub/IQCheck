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

**Option A: Use Terminal (Recommended)**

1. **Click "Terminal"** (in Advanced section)
2. **Run these commands:**
   ```bash
   cd ~/public_html
   git clone https://github.com/trimtoolshub/IQCheck.git
   mkdir -p iq-test
   cp -r IQCheck/iq-app/* iq-test/
   cd iq-test
   ```

**Option B: Use cPanel Git (if repo is public)**

1. **Make sure your GitHub repo is PUBLIC** (Settings → Change visibility)
2. **Click "Git™ Version Control"** (in Files section)
3. **Click "Create"** (top right)
4. **Fill in:**
   - **Repository URL**: `https://github.com/trimtoolshub/IQCheck.git`
   - **Repository Path**: `/home/rungrezc/repositories/iqcheck`
   - **Repository Branch**: `main`
5. **Click "Create"**

**Option C: Upload via File Manager**

1. **Download ZIP from GitHub**: Go to https://github.com/trimtoolshub/IQCheck → Code → Download ZIP
2. **In cPanel File Manager**, navigate to `public_html`
3. **Upload the ZIP file**
4. **Extract** it
5. **Copy `iq-app` folder contents** to `public_html/iq-test`

### Step 2: Copy Files to Public Directory (If using Option A, skip this)

If you used **Option A** (Terminal), you're already done!

If you used **Option B** (cPanel Git), run in Terminal:
```bash
mkdir -p ~/public_html/iq-test
cp -r ~/repositories/iqcheck/iq-app/* ~/public_html/iq-test/
cd ~/public_html/iq-test
```

If you used **Option C** (File Manager), files should already be in `public_html/iq-test`

### Step 3: Install Dependencies

In Terminal:
```bash
cd ~/public_html/iq-test
npm install
npm run build
```

### Step 4: Create Node.js App

1. **Click "Setup Node.js App"** (in Software section)
2. **Click "Create Application"** button
3. **Configure:**
   - **Node.js Version**: Select **18.x** or **20.x** (highest available)
   - **Application Mode**: **Production**
   - **Application Root**: `/home/rungrezc/public_html/iq-test`
   - **Application URL**: 
     - Option 1: Create subdomain `iq-test.rungrez.com` (create it first in Subdomains)
     - Option 2: Use main domain `rungrez.com` (if you want it on main domain)
   - **Application Startup File**: `server.js`
4. **Click "Create"**

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
cd ~/public_html/iq-test
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
- [ ] Files copied to `~/public_html/iq-test`
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
- `https://iq-test.rungrez.com` (if using subdomain)
- OR `https://rungrez.com` (if using main domain)

## 💡 Tips

1. **SQLite will work!** - Your database file will be at `/home/rungrezc/public_html/iq-test/prisma/dev.db`

2. **Backups** - cPanel automatically backs up files, including your SQLite database

3. **Logs** - Check app logs in "Setup Node.js App" → Your App → View Logs

4. **Restart** - If you make changes, restart the app in cPanel

## 🔧 Troubleshooting

**Can't find "Setup Node.js App"?**
- Contact your hosting provider to enable Node.js support

**Build fails?**
- Make sure Node.js version is 16+ (18+ recommended)
- Check Terminal for error messages

**Database permissions?**
```bash
chmod 644 ~/public_html/iq-test/prisma/dev.db
chmod 755 ~/public_html/iq-test/prisma
```

Your app is ready for cPanel deployment! SQLite will work perfectly. 🎉

