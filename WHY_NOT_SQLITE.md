# Why SQLite Doesn't Work on Vercel (and Alternatives)

## Why SQLite Fails on Vercel

Vercel is a **serverless platform** which means:

1. **No Persistent File System**
   - Each function execution is stateless
   - Files written during runtime are lost after execution
   - SQLite needs a persistent file to store data

2. **Read-Only File System**
   - Vercel functions have a read-only file system (except `/tmp`)
   - `/tmp` is cleared between invocations
   - SQLite database file would be lost every time

3. **Horizontal Scaling Issues**
   - Multiple serverless functions can't share the same SQLite file
   - Each function would have its own isolated database
   - Data would be inconsistent across requests

4. **Deployment Issues**
   - Each deployment creates a fresh environment
   - Database file wouldn't persist across deployments
   - Data would be lost on every redeploy

## Alternative Solutions

### Option 1: Keep SQLite Locally, Use Postgres on Vercel (Recommended)

**Best of both worlds:**
- Use SQLite for local development (fast, simple)
- Use Postgres for production on Vercel (reliable, scalable)

**How to set it up:**
1. Keep `sqlite` in `schema.prisma` for local dev
2. Create a separate `schema.prisma.production` for Vercel
3. Or use environment-based configuration

### Option 2: Use Turso (SQLite-Compatible Serverless Database)

**Turso** is a serverless SQLite-compatible database that works with Vercel:

1. **Go to**: https://turso.tech/
2. **Create account** and database
3. **Get connection string** (looks like SQLite)
4. **Use with Prisma** - it's compatible with SQLite schema!

**Pros:**
- Keep your SQLite schema
- Serverless and scalable
- Works with Prisma
- Free tier available

**Cons:**
- Another service to manage
- Slight differences from pure SQLite

### Option 3: Use Different Hosting Platform

If you really want to keep pure SQLite, consider:

**Fly.io** - Supports SQLite with persistent volumes:
- Can mount persistent storage
- SQLite works well there
- Good for apps that need file-based databases

**Railway** - Also supports persistent storage:
- Can deploy with SQLite
- Persistent volumes available

**Render** - Similar to Railway

## Recommended Approach

**For now:** Keep SQLite locally, switch to Postgres for Vercel

1. **Local Development:** Keep using SQLite (it's perfect for dev!)
2. **Production (Vercel):** Use Postgres (Vercel Postgres is free and easy)
3. **Same Schema:** Your Prisma schema mostly stays the same, just change the `provider`

The migration from SQLite to Postgres is usually painless because:
- Prisma abstracts the differences
- Most SQL is compatible
- Only minor syntax differences

## Quick Setup: Dual Database Setup

You can have both SQLite (local) and Postgres (production) by using environment variables:

```prisma
datasource db {
  provider = env("DATABASE_PROVIDER") == "postgresql" ? "postgresql" : "sqlite"
  url      = env("DATABASE_URL")
}
```

Or simply switch when deploying:
- Local: `DATABASE_URL="file:./dev.db"` with `sqlite`
- Production: `DATABASE_URL="postgresql://..."` with `postgresql`

## Bottom Line

**Vercel = Serverless = No SQLite**

But you have options:
1. ✅ Use Postgres on Vercel (easiest, recommended)
2. ✅ Use Turso (SQLite-compatible, serverless)
3. ✅ Use a different hosting platform (Fly.io, Railway)

**My recommendation:** Use Postgres on Vercel - it's the most reliable and Vercel makes it super easy with their built-in Postgres offering.

