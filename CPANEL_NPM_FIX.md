# Fix "npm: command not found" in cPanel

## The Problem

Error: `bash: npm: command not found`

This happens because Node.js/npm is not in your terminal PATH, even though it may be installed via cPanel.

## Solutions

### Solution 1: Create Node.js App First (Recommended) ✅

**cPanel's Node.js App setup will configure the environment automatically.**

1. **Go to "Setup Node.js App"** (Software section)
2. **Create the application first** (even without installing dependencies yet)
3. **After creating the app, Node.js/npm will be available in Terminal**

Then run:
```bash
cd ~/trimsoftstudio.com/iqcheck
npm install
npm run build
```

**This is the easiest method!**

---

### Solution 2: Load Node.js Environment

After creating Node.js App, load the environment:

```bash
# Source Node.js environment (if available)
source ~/.bashrc
# or
export PATH=$PATH:/usr/local/bin

# Then try npm
npm --version
```

---

### Solution 3: Find npm Path

```bash
# Find where npm is installed
which npm
# or
whereis npm
# or
find /usr -name npm 2>/dev/null
# or
find /opt -name npm 2>/dev/null
```

**Then use full path:**
```bash
/usr/local/bin/npm install
# or whatever path you found
```

---

### Solution 4: Use Node.js App's npm Directly

1. **In cPanel "Setup Node.js App"**
2. **Click on your application**
3. **Look for "npm" or "Run npm" option**
4. **Some cPanel versions let you run npm commands directly in the interface**

---

### Solution 5: Install via Node.js App Interface

Some cPanel versions have a built-in npm installer:

1. **Go to "Setup Node.js App"**
2. **Click on your application**
3. **Look for "Install Dependencies" or "Run npm install" button**
4. **Click it** - cPanel will run npm install automatically

---

## Recommended Workflow

**Best approach for cPanel:**

1. ✅ **Create Node.js App first** (Step 4)
2. ✅ **Set environment variables** (Step 5)
3. ✅ **Then run npm install** in Terminal (after Node.js App is created)
4. ✅ **Then build** the app

**This ensures the environment is properly set up!**

---

## Verify Node.js is Available

After creating Node.js App, verify:

```bash
node --version
npm --version
```

Both should show version numbers.

If still not found, check Node.js App settings in cPanel - it should show the Node.js version you selected.

---

## Alternative: Use nvm (if available)

If your cPanel supports nvm:

```bash
# Load nvm
source ~/.nvm/nvm.sh

# Use Node.js
nvm use 18
# or whatever version

# Then npm should work
npm install
```

---

## Quick Check

Try these commands in Terminal:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# If both fail, Node.js isn't in PATH
# Solution: Create Node.js App first in cPanel
```

**Remember:** Creating the Node.js App in cPanel will configure everything automatically! 🎉

