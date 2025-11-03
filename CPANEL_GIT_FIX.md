# Fix cPanel Git Authentication Error

## The Problem

Error: `fatal: could not read Username for 'https://github.com': No such device or address`

This happens because cPanel's Git interface can't prompt for credentials.

## Solutions

### Solution 1: Use Terminal Instead (Easiest)

1. **Click "Terminal"** in cPanel (Advanced section)
2. **Run:**
   ```bash
   cd ~/public_html
   git clone https://github.com/trimtoolshub/IQCheck.git
   mkdir -p iq-test
   cp -r IQCheck/iq-app/* iq-test/
   cd iq-test
   ```
3. **Done!** Files are now in `~/public_html/iq-test`

### Solution 2: Make Repo Public

If your repo is private, make it public:
1. Go to https://github.com/trimtoolshub/IQCheck/settings
2. Scroll down to "Danger Zone"
3. Click "Change visibility" → "Make public"
4. Then use cPanel Git again

### Solution 3: Use SSH Instead (If you have SSH keys)

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   cat ~/.ssh/id_ed25519.pub
   ```
2. **Add to GitHub:**
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the public key
3. **Clone via SSH:**
   ```bash
   cd ~/public_html
   git clone git@github.com:trimtoolshub/IQCheck.git
   ```

### Solution 4: Upload Files Directly (Fastest)

1. **Download from GitHub:**
   - Go to https://github.com/trimtoolshub/IQCheck
   - Click green "Code" button
   - Click "Download ZIP"
2. **Upload to cPanel:**
   - Go to **File Manager** in cPanel
   - Navigate to `public_html`
   - Upload the ZIP file
   - Right-click → **Extract**
3. **Copy files:**
   - Navigate to `IQCheck-main/iq-app`
   - Select all files
   - Copy to `public_html/iq-test` (create folder first)

## Recommended: Use Terminal (Solution 1)

This is the fastest and most reliable method. Just run:
```bash
cd ~/public_html
git clone https://github.com/trimtoolshub/IQCheck.git
mkdir -p iq-test
cp -r IQCheck/iq-app/* iq-test/
cd iq-test
```

Then continue with the deployment steps!

