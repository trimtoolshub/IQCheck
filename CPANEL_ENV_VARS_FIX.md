# Fix Environment Variables in cPanel

## Your Current Environment Variables

Looking at your setup:

1. ✅ **DATABASE_URL**: `file:./prisma/dev.db` - **CORRECT** (SQLite)
2. ❌ **NEXTAUTH_SECRET**: `(generate with: openssl rand -base64 32)` - **WRONG!** Needs actual secret
3. ✅ **NEXTAUTH_URL**: `https://trimsoftstudio.com/iqcheck` - **CORRECT** (if that's your domain)
4. ✅ **NODE_ENV**: `production` - **CORRECT**
5. ✅ **NODE_OPTIONS**: `--max-old-space-size=4096` - **CORRECT**

## Critical Fix Needed

### Fix NEXTAUTH_SECRET

**The value `(generate with: openssl rand -base64 32)` is just a note - you need an actual secret!**

**Generate a secret:**

1. **In Terminal:**
   ```bash
   openssl rand -base64 32
   ```
   
2. **Copy the output** (something like: `aB3xK9mP2qR7sT4uV8wX1yZ5bC6dE0fG=`)
   
3. **Go to cPanel "Setup Node.js App"** → Your App → Environment Variables
   
4. **Click Edit** on `NEXTAUTH_SECRET`
   
5. **Replace the value** with the generated secret
   
6. **Click Save**

## Verify NEXTAUTH_URL

Make sure `NEXTAUTH_URL` matches your actual domain:

- If your app is at: `https://iqcheck.trimsoftstudio.com` → Set to that
- If your app is at: `https://trimsoftstudio.com/iqcheck` → Set to that
- Should match the URL where users access your app

## All Environment Variables Should Be

```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=<your-generated-secret-here>
NEXTAUTH_URL=https://trimsoftstudio.com/iqcheck (or your actual domain)
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096
```

## Quick Fix Steps

1. **Generate secret in Terminal:**
   ```bash
   openssl rand -base64 32
   ```

2. **Copy the output**

3. **In cPanel:**
   - Go to "Setup Node.js App"
   - Click your app
   - Environment Variables tab
   - Click Edit on NEXTAUTH_SECRET
   - Paste the generated secret
   - Save

4. **Restart the app** in Node.js App settings

## After Fixing

Your environment variables should be ready! Continue with:

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma generate
npm exec prisma migrate deploy
```

Good luck! 🎉

