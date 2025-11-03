# Fix "npx: command not found" in cPanel

## The Problem

Error: `bash: npx: command not found`

Even though Node.js 20 is set up in your Node.js App, `npx` might not be in your Terminal PATH.

## Solutions

### Solution 1: Use Full Path to npx (Recommended) ✅

Use the full path to npx from your Node.js 20 installation:

```bash
/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx prisma migrate deploy
/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx prisma generate
```

### Solution 2: Add Node.js 20 to PATH (For Current Session)

Add Node.js 20 bin directory to your PATH:

```bash
export PATH="/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin:$PATH"
npx --version  # Verify npx is now available
npx prisma migrate deploy
npx prisma generate
```

**Note**: This only works for the current Terminal session. If you close Terminal, you'll need to run this again.

### Solution 3: Use npm exec Instead of npx (RECOMMENDED) ✅

`npm exec` is equivalent to `npx` and built into npm:

```bash
cd ~/trimsoftstudio.com/iqcheck
npm exec prisma migrate deploy
npm exec prisma generate
```

**This should work immediately!** `npm` is available from your Node.js 20 installation, so `npm exec` should work even if `npx` doesn't.

### Solution 4: Navigate to Node.js bin Directory

```bash
cd /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin
./npx prisma migrate deploy
./npx prisma generate
```

### Solution 5: Use npm run Scripts (If Available)

Check if `package.json` has scripts that use npx internally:

```bash
npm run migrate  # If you have this script
```

## Quick Commands with Full Path

Here are the commands you need with full path:

```bash
cd ~/trimsoftstudio.com/iqcheck

# Migrate database
/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx prisma migrate deploy

# Generate Prisma client
/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx prisma generate
```

## Make it Easier - Create Alias (Optional)

Add to your `~/.bashrc` for permanent access:

```bash
echo 'export PATH="/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Then `npx` will work normally in future Terminal sessions.

## Verify npx is Available

After using Solution 2 (adding to PATH), verify:

```bash
npx --version
# Should show version number
which npx
# Should show: /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx
```

## Recommended Workflow

**Easiest approach:**

1. **Set PATH once per Terminal session:**
   ```bash
   export PATH="/home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin:$PATH"
   ```

2. **Then use npx normally:**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Or use full path (no PATH setup needed):**
   ```bash
   cd ~/trimsoftstudio.com/iqcheck
   /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx prisma migrate deploy
   /home/rungrezc/nodevenv/trimsoftstudio.com/iqcheck/20/bin/npx prisma generate
   ```

## After Fixing npx

Continue with:

```bash
cd ~/trimsoftstudio.com/iqcheck
# Use one of the solutions above for npx
# Then continue:
curl -X POST https://iqcheck.trimsoftstudio.com/api/dev/seed
curl -X POST https://iqcheck.trimsoftstudio.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

That's it! npx should work with one of these solutions. 🎉

