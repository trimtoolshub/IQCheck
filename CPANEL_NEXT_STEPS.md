# ✅ Node.js 20 Setup Complete - Next Steps

## ✅ Success!

Your path shows: `/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/`

**This means you're using Node.js 20** - Perfect! ✅

## Next Steps

### Step 1: Verify Node.js Version

In Terminal:
```bash
node --version
```

**Should show**: `v20.x.x` ✅

### Step 2: Clean Install (Remove Old Node.js 10 Dependencies)

Since you had Node.js 10 before, clean up old dependencies:

```bash
cd ~/trimsoftstudio.com/iqcheck
rm -rf node_modules package-lock.json
```

### Step 3: Install Dependencies

Now install with correct Node.js version:

```bash
npm install
```

**This should work now!** Node.js 20 supports all your packages.

### Step 4: Build the App

```bash
npm run build
```

**This should complete successfully!**

### Step 5: Set Environment Variables

1. **Go to "Setup Node.js App"** in cPanel
2. **Click on your application**
3. **Go to "Environment Variables" tab**
4. **Add:**
   ```
   DATABASE_URL=file:./prisma/dev.db
   NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)
   NEXTAUTH_URL=https://iqcheck.trimsoftstudio.com
   NODE_ENV=production
   ```
5. **Click "Save"**

### Step 6: Setup Database

```bash
cd ~/trimsoftstudio.com/iqcheck
npx prisma migrate deploy
npx prisma generate
```

### Step 7: Seed Database

```bash
curl -X POST https://iqcheck.trimsoftstudio.com/api/dev/seed
```

### Step 8: Create Admin User

```bash
curl -X POST https://iqcheck.trimsoftstudio.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

### Step 9: Restart App

1. **Go to "Setup Node.js App"**
2. **Click on your application**
3. **Click "Restart App"**
4. **Check logs** if needed

## Verification Checklist

- [x] Node.js 20 app created (path shows `/20/`)
- [ ] Node.js version verified (`node --version` shows v20.x.x)
- [ ] Old dependencies removed
- [ ] `npm install` completed successfully
- [ ] `npm run build` completed successfully
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Database seeded
- [ ] Admin user created
- [ ] App restarted and running

## Troubleshooting

**If `npm install` still fails:**
- Make sure you're in the correct directory: `cd ~/trimsoftstudio.com/iqcheck`
- Verify Node.js: `node --version` (should show v20.x.x)
- Verify npm: `npm --version`

**If build fails:**
- Check error messages
- Make sure all dependencies installed successfully
- Verify `package.json` exists

**If app doesn't start:**
- Check logs in "Setup Node.js App" → Your App → View Logs
- Verify `server.js` exists
- Check environment variables are set

## You're Almost There! 🎉

Node.js 20 is correct - now just install dependencies and build!

