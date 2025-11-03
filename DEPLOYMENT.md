# Vercel Deployment Guide

This guide will help you deploy your IQ test app to Vercel using GitHub.

## Prerequisites

✅ Vercel account
✅ GitHub account
✅ Code pushed to a GitHub repository

## Step 1: Push Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it (e.g., `iq-test-app`)
   - Make it Public or Private
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub:**
   ```bash
   cd iq-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Set Up Database (Important!)

⚠️ **SQLite won't work on Vercel** - Vercel is serverless and has no persistent file system.

### Why SQLite Doesn't Work:
- Serverless functions are stateless
- No persistent file storage
- Database file would be lost between requests
- Multiple functions can't share the same SQLite file

### Option 1: Vercel Postgres (Recommended - Easiest)

1. Go to your Vercel project dashboard
2. Click on **Storage** tab
3. Click **Create Database** → **Postgres**
4. Choose a plan (free tier available)
5. Vercel will automatically provide the connection string as `DATABASE_URL`

### Option 2: Turso (SQLite-Compatible Serverless)

If you prefer to keep SQLite compatibility:
1. Go to https://turso.tech/
2. Create account and database
3. Get connection string (SQLite-compatible)
4. Works with your existing Prisma schema!

### Option 3: Other Cloud Databases

- **Supabase** (Free tier): https://supabase.com
- **Neon** (Serverless Postgres): https://neon.tech
- **PlanetScale** (MySQL): https://planetscale.com

After setting up the database, update your `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite" (or keep "sqlite" if using Turso)
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
npx prisma migrate dev --name migrate_to_postgres
```

## Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click **Add New Project**

2. **Import from GitHub:**
   - Select your repository
   - Click **Import**

3. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `iq-app` (if your repo root contains the iq-app folder)
     - OR set to `.` if iq-app is the repo root
   - **Build Command**: `npm run build` (or `cd iq-app && npm run build` if needed)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

4. **Add Environment Variables:**
   Click **Environment Variables** and add:

   ### Required:
   ```env
   DATABASE_URL=your_database_connection_string
   NEXTAUTH_SECRET=generate_a_random_secret_here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

   ### Optional (for payments):
   ```env
   STRIPE_SECRET_KEY=sk_test_or_sk_live_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

   ### Optional (for Pakistani payments):
   ```env
   JAZZCASH_MERCHANT_ID=your_merchant_id
   JAZZCASH_PASSWORD=your_password
   JAZZCASH_INTEGRITY_SALT=your_salt
   
   EASYPAISA_STORE_ID=your_store_id
   EASYPAISA_MERCHANT_ID=your_merchant_id
   EASYPAISA_API_KEY=your_api_key
   
   PAKPAY_MERCHANT_ID=your_merchant_id
   PAKPAY_API_KEY=your_api_key
   ```

   ### Optional (for OAuth):
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   FACEBOOK_CLIENT_ID=your_facebook_app_id
   FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
   ```

5. **Deploy:**
   - Click **Deploy**
   - Wait for build to complete

## Step 4: Run Database Migrations

After first deployment, you need to run migrations:

1. **Option A - Via Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   npx prisma migrate deploy
   ```

2. **Option B - Via Vercel Dashboard:**
   - Go to your project → **Settings** → **Install Vercel CLI**
   - Or use a database seed script after migration

## Step 5: Seed the Database

1. **Create a seed script** or use the API endpoint:
   ```bash
   curl -X POST https://your-app.vercel.app/api/dev/seed
   ```

2. **Create admin user:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/create \
     -H "Content-Type: application/json" \
     -d '{"email": "your-admin-email@gmail.com"}'
   ```

## Step 6: Configure Production URLs

1. Update `NEXTAUTH_URL` in Vercel environment variables:
   - Use your actual Vercel URL: `https://your-app.vercel.app`

2. Update OAuth redirect URLs:
   - **Google Console**: Add `https://your-app.vercel.app/api/auth/callback/google`
   - **Facebook App**: Add `https://your-app.vercel.app/api/auth/callback/facebook`

## Step 7: Set Up Webhooks (Stripe)

1. Go to Stripe Dashboard → **Webhooks**
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret and add to Vercel env: `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure database is accessible from Vercel
- Check build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- For Vercel Postgres, connection string is auto-provided

### Prisma Issues
- Add `postinstall` script to `package.json`:
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

### Migrations Not Running
- Run migrations manually after deployment
- Or add migration to build process

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Database set up (Postgres/MySQL, not SQLite)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations run
- [ ] Database seeded with questions
- [ ] Admin user created
- [ ] OAuth redirect URLs updated
- [ ] Webhooks configured (if using Stripe)
- [ ] Test the deployed app

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Prisma on Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Next.js Deployment**: https://nextjs.org/docs/deployment

