# cPanel Deployment - Specific Path Configuration

## Your Configuration

- **Location**: `/home/rungrezc/trimsoftstudio.com/iqcheck`
- **Domain**: `trimsoftstudio.com`
- **App URL**: `iqcheck.trimsoftstudio.com` (subdomain) or main domain

## Step-by-Step Commands

### Step 1: Clone and Setup Files

In Terminal:
```bash
cd ~/trimsoftstudio.com
git clone https://github.com/trimtoolshub/IQCheck.git
mkdir -p iqcheck
cp -r IQCheck/iq-app/* iqcheck/
cd iqcheck
```

### Step 2: Install Dependencies

```bash
cd ~/trimsoftstudio.com/iqcheck
npm install
npm run build
```

### Step 3: Create Node.js App in cPanel

1. **Click "Setup Node.js App"** (Software section)
2. **Click "Create Application"**
3. **Configure:**
   - **Node.js Version**: 18.x or 20.x (highest available)
   - **Application Mode**: Production
   - **Application Root**: `/home/rungrezc/trimsoftstudio.com/iqcheck`
   - **Application URL**: 
     - Create subdomain `iqcheck.trimsoftstudio.com` first (in Subdomains section)
     - Or use main domain if you want it at root
   - **Application Startup File**: `server.js`
4. **Click "Create"**

### Step 4: Set Environment Variables

1. **After creating the app, click on it**
2. **Go to "Environment Variables" tab**
3. **Add:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=(generate: openssl rand -base64 32)
   NEXTAUTH_URL=https://iqcheck.trimsoftstudio.com
   NODE_ENV=production
   ```
4. **Click "Save"**

### Step 5: Setup Database

```bash
cd ~/trimsoftstudio.com/iqcheck
npx prisma migrate deploy
npx prisma generate
```

### Step 6: Seed Database

```bash
curl -X POST https://iqcheck.trimsoftstudio.com/api/dev/seed
```

### Step 7: Create Admin User

```bash
curl -X POST https://iqcheck.trimsoftstudio.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

### Step 8: Restart App

1. **Go to "Setup Node.js App"**
2. **Click on your application**
3. **Click "Restart App"**

## Quick Reference

**Path**: `/home/rungrezc/trimsoftstudio.com/iqcheck`
**URL**: `https://iqcheck.trimsoftstudio.com`
**Database**: `~/trimsoftstudio.com/iqcheck/prisma/dev.db`

## Troubleshooting

**Files not found?**
```bash
ls -la ~/trimsoftstudio.com/iqcheck
```

**Permissions issue?**
```bash
chmod 755 ~/trimsoftstudio.com/iqcheck
chmod 644 ~/trimsoftstudio.com/iqcheck/prisma/dev.db
```

**Check if app is running:**
- Go to "Setup Node.js App" → Your App → View Logs

Your app is configured for this specific path! 🎉

