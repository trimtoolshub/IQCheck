# Quick Deploy to Vercel

## 🚀 Fast Track Deployment

### 1. Push to GitHub (if not already done)

```bash
cd iq-app
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to**: https://vercel.com/new
2. **Import your GitHub repository**
3. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: Leave empty if iq-app is repo root, or set to `iq-app`
4. **Add Environment Variables** (click "Environment Variables" button):
   
   **Required:**
   ```
   DATABASE_URL=your_postgres_url_here
   NEXTAUTH_SECRET=generate-random-string-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
   
   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Or use: https://generate-secret.vercel.app/32

5. **Click Deploy** 🎉

### 3. Set Up Database (IMPORTANT!)

⚠️ **SQLite doesn't work on Vercel** - You need Postgres:

**Option A: Vercel Postgres (Easiest)**
1. In your Vercel project → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Copy the connection string
4. Add it as `DATABASE_URL` environment variable

**Option B: Supabase (Free)**
1. Go to https://supabase.com → Create project
2. Get connection string from Settings → Database
3. Add as `DATABASE_URL` in Vercel

### 4. Update Database Schema

After setting up Postgres, you need to update Prisma schema:

1. **Edit** `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Run migrations locally first**:
   ```bash
   npx prisma migrate dev --name init_postgres
   ```

3. **Push to GitHub**

4. **Deploy again** - Vercel will run migrations

### 5. Seed Database After Deployment

Once deployed:

```bash
curl -X POST https://your-app.vercel.app/api/dev/seed
```

### 6. Create Admin User

```bash
curl -X POST https://your-app.vercel.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## ✅ Checklist

- [ ] Code on GitHub
- [ ] Vercel project created
- [ ] Postgres database set up
- [ ] Prisma schema updated to Postgres
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Database seeded
- [ ] Admin user created
- [ ] Test the app!

## 🎯 That's It!

Your app should now be live at: `https://your-app.vercel.app`

See `DEPLOYMENT.md` for detailed instructions.

