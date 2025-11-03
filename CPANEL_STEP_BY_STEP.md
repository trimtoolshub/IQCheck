# Step-by-Step cPanel Deployment

Based on your cPanel, here's the exact steps:

## Step 1: Upload Files

### Option A: Use Git (Easiest)

1. **In cPanel, click "Git™ Version Control"** (under Files section)
2. **Click "Create"**
3. **Configure:**
   - **Repository URL**: `https://github.com/trimtoolshub/IQCheck.git`
   - **Repository Path**: `/home/rungrezc/repositories/iqcheck`
   - **Repository Branch**: `main`
4. **Click "Create"**
5. **After cloning, copy to your domain:**
   ```bash
   cp -r /home/rungrezc/repositories/iqcheck/iq-app /home/rungrezc/public_html/iq-test
   ```
   Or use File Manager to copy the `iq-app` folder to `public_html/iq-test`

### Option B: Use Terminal

1. **Click "Terminal"** (under Advanced section)
2. **Navigate to public_html:**
   ```bash
   cd ~/public_html
   ```
3. **Clone from GitHub:**
   ```bash
   git clone https://github.com/trimtoolshub/IQCheck.git
   cd IQCheck
   cp -r iq-app ~/public_html/iq-test
   cd ~/public_html/iq-test
   ```

## Step 2: Set Up Node.js App

1. **In cPanel, click "Setup Node.js App"** (under Software section)
2. **Click "Create Application"**
3. **Configure:**
   - **Node.js Version**: Select 16.x or higher (20.x is ideal)
   - **Application Mode**: Production
   - **Application Root**: `/home/rungrezc/public_html/iq-test`
   - **Application URL**: Select your domain/subdomain
     - If you want it on main domain: `rungrez.com`
     - Or subdomain: `iq-test.rungrez.com` (create subdomain first)
   - **Application Startup File**: `server.js`
   - **Load App from File**: Leave as default
4. **Click "Create"**
5. **Note the port number** - cPanel will assign one automatically

## Step 3: Install Dependencies & Build

1. **In Terminal:**
   ```bash
   cd ~/public_html/iq-test
   npm install
   npm run build
   ```

## Step 4: Set Environment Variables

1. **In cPanel, go back to "Setup Node.js App"**
2. **Click on your application**
3. **Go to "Environment Variables" tab**
4. **Add these variables:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=generate-random-32-char-string
   NEXTAUTH_URL=https://your-domain.com
   NODE_ENV=production
   PORT=(auto-filled by cPanel)
   ```
5. **Generate NEXTAUTH_SECRET:**
   - Use Terminal: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32
6. **Click "Save"**

## Step 5: Run Database Migrations

In Terminal:
```bash
cd ~/public_html/iq-test
npx prisma migrate deploy
npx prisma generate
```

## Step 6: Start the Application

1. **Go back to "Setup Node.js App"**
2. **Click on your application**
3. **Click "Restart App"** button
4. **Check status** - should show "Running"

## Step 7: Seed Database

In Terminal:
```bash
curl -X POST http://localhost:PORT/api/dev/seed
```
Or from your domain:
```bash
curl -X POST https://your-domain.com/api/dev/seed
```

## Step 8: Create Admin User

```bash
curl -X POST https://your-domain.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## Step 9: Configure Domain

1. **If using subdomain:**
   - Go to **"Subdomains"** (under Domains)
   - Create `iq-test.rungrez.com`
   - Point to `/home/rungrezc/public_html/iq-test`

2. **If using main domain:**
   - Your Node.js app should be accessible via the URL you set
   - May need to configure domain routing in cPanel

## Troubleshooting

### App Not Starting
- Check logs in Node.js App → View Logs
- Make sure `server.js` exists
- Verify all environment variables are set

### Database Errors
- Make sure `prisma/dev.db` file has write permissions:
  ```bash
  chmod 644 ~/public_html/iq-test/prisma/dev.db
  ```
- Verify migrations ran successfully

### Port Issues
- cPanel handles ports automatically
- Check assigned port in Node.js App settings

## Quick Checklist

- [ ] Files uploaded to `~/public_html/iq-test`
- [ ] Node.js App created in cPanel
- [ ] Environment variables set
- [ ] Dependencies installed (`npm install`)
- [ ] Build completed (`npm run build`)
- [ ] Migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded
- [ ] Admin user created
- [ ] App restarted and running
- [ ] Domain configured

Your app should now be live! 🎉

