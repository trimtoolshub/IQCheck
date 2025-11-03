# cPanel Deployment Guide

**Good news!** This app can run on cPanel, and **SQLite will work** since cPanel has persistent file storage!

## ✅ Advantages of cPanel

- **SQLite works!** - cPanel has persistent file system (unlike Vercel)
- **No database changes needed** - Keep your SQLite setup
- **Full server access** - More control over the environment
- **Cost-effective** - Most hosting providers include cPanel

## Prerequisites

Your cPanel hosting must support:
- ✅ **Node.js** (version 16 or higher)
- ✅ **PM2** or similar process manager (usually included)
- ✅ **npm/yarn** package manager

Most modern cPanel hosts (like Hostinger, Bluehost, SiteGround) support Node.js.

## Step 1: Check Node.js Support

1. **Login to cPanel**
2. **Look for "Node.js Selector"** or **"Setup Node.js App"** in the Software section
3. **Check Node.js version** - Should be 16.0.1 or higher

If you don't see Node.js options, contact your hosting provider to enable it.

## Step 2: Upload Files

### Option A: Git Clone (Recommended)

1. **In cPanel, go to Terminal** (if available) or **File Manager**
2. **Navigate to your domain's public_html** or create a subdirectory:
   ```bash
   cd public_html
   mkdir iq-test
   cd iq-test
   ```
3. **Clone from GitHub**:
   ```bash
   git clone https://github.com/trimtoolshub/IQCheck.git .
   cd iq-app
   ```

### Option B: Upload via File Manager

1. **Download your code** from GitHub as ZIP
2. **In cPanel File Manager**, upload and extract to your directory
3. **Or use FTP** to upload files

## Step 3: Set Up Node.js App

1. **Go to "Node.js Selector"** in cPanel
2. **Click "Create Application"**
3. **Configure:**
   - **Node.js version**: 16.0.1 or higher
   - **Application root**: `/home/username/public_html/iq-test/iq-app`
   - **Application URL**: Choose your domain/subdomain
   - **Application startup file**: `server.js` (we'll create this)
   - **Application mode**: Production
4. **Click Create**

## Step 4: Install Dependencies

### Via Terminal:
```bash
cd ~/public_html/iq-test/iq-app
npm install --production
npm run build
```

### Via SSH (if available):
```bash
ssh username@your-domain.com
cd public_html/iq-test/iq-app
npm install --production
npm run build
```

## Step 5: Create Startup File

Create `server.js` in the `iq-app` directory:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

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
```

Update `package.json` to include this startup script:

```json
"scripts": {
  "dev": "next dev",
  "build": "prisma generate && next build",
  "start": "node server.js",
  "lint": "eslint"
}
```

## Step 6: Set Environment Variables

In cPanel **Node.js Selector**:

1. **Click on your application**
2. **Go to "Environment Variables"**
3. **Add:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=your-random-32-char-secret
   NEXTAUTH_URL=https://your-domain.com
   NODE_ENV=production
   ```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Step 7: Run Database Migrations

Via Terminal or SSH:

```bash
cd ~/public_html/iq-test/iq-app
npx prisma migrate deploy
npx prisma generate
```

## Step 8: Seed Database

After deployment:

```bash
curl -X POST https://your-domain.com/api/dev/seed
```

## Step 9: Create Admin User

```bash
curl -X POST https://your-domain.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## Step 10: Set Up Domain

1. **Point your domain** to the Node.js application
2. **Or use a subdomain** (e.g., `iq-test.yourdomain.com`)
3. **Update NEXTAUTH_URL** to match your domain

## Configuration Notes

### For SQLite on cPanel:

✅ **Works perfectly!** SQLite files persist in the file system.

The database will be at: `~/public_html/iq-test/iq-app/prisma/dev.db`

Make sure this file is:
- ✅ Writable by the Node.js process
- ✅ Backed up regularly (cPanel usually does this automatically)
- ✅ Not in `.gitignore` if you want to backup the DB

### Process Manager:

Most cPanel setups use **PM2** or similar. Your Node.js app should automatically restart if it crashes.

## Troubleshooting

### Node.js Not Available
- Contact your hosting provider
- Or use a host that supports Node.js (most do now)

### Permission Issues
```bash
chmod 755 ~/public_html/iq-test/iq-app
chmod 644 ~/public_html/iq-test/iq-app/prisma/dev.db
```

### Build Fails
- Make sure Node.js version is 16+
- Check npm install completes successfully
- Verify all dependencies are installed

### Port Issues
- cPanel Node.js Selector handles ports automatically
- Make sure your app uses `process.env.PORT`

## Advantages Over Vercel

✅ **SQLite works** - No need to change database  
✅ **More control** - Full server access  
✅ **Cost-effective** - Often cheaper than Vercel Pro  
✅ **Persistent storage** - Files persist between deployments  
✅ **Custom domain** - Easy domain setup  

## Limitations

⚠️ **No automatic deployments** - You need to manually deploy  
⚠️ **Less scalable** - Single server vs serverless  
⚠️ **Manual updates** - Need to SSH or use terminal  

## Quick Setup Checklist

- [ ] cPanel has Node.js support
- [ ] Files uploaded/copied to cPanel
- [ ] Node.js app created in cPanel
- [ ] Dependencies installed (`npm install`)
- [ ] Build completed (`npm run build`)
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Database seeded
- [ ] Admin user created
- [ ] Domain configured
- [ ] App accessible!

## Alternative: Managed Hosting with cPanel

If your current host doesn't support Node.js:
- **Hostinger** - Has cPanel + Node.js
- **A2 Hosting** - cPanel + Node.js support
- **InMotion Hosting** - cPanel + Node.js
- **SiteGround** - Has Node.js support

## Need Help?

Check with your hosting provider:
- Do they support Node.js?
- What Node.js versions are available?
- Is PM2 included?
- Can I run long-running processes?

Your app is ready for cPanel! SQLite will work perfectly there. 🎉

