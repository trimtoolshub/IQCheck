# Fix GitHub Authentication Error in cPanel

## The Error

```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/...'
```

**Why?** GitHub no longer supports password authentication for Git operations. You need a Personal Access Token or make the repo public.

## Solutions (Choose One)

### Solution 1: Make Repo Public (Easiest) ✅ RECOMMENDED

**Steps:**
1. Go to https://github.com/trimtoolshub/IQCheck/settings
2. Scroll down to **"Danger Zone"**
3. Click **"Change visibility"**
4. Select **"Make public"**
5. Type repository name to confirm
6. Click **"I understand, change repository visibility"**

**Then clone normally:**
```bash
cd ~/trimsoftstudio.com
git clone https://github.com/trimtoolshub/IQCheck.git
```

**Pros:** Simple, no tokens needed  
**Cons:** Repository is public

---

### Solution 2: Use Personal Access Token (Keep Repo Private)

**Create Token:**
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: "cPanel Deployment"
4. Select scope: `repo` (full control)
5. Click **"Generate token"**
6. **Copy the token immediately!** (You won't see it again)

**Clone with Token:**
```bash
cd ~/trimsoftstudio.com
git clone https://YOUR_TOKEN@github.com/trimtoolshub/IQCheck.git
```

**Replace `YOUR_TOKEN` with your actual token.**

**Example:**
```bash
git clone https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/trimtoolshub/IQCheck.git
```

**Pros:** Keeps repo private  
**Cons:** Token management needed

---

### Solution 3: Download ZIP Instead (Easiest - No Git!) ✅ FASTEST

**This avoids all authentication issues!**

**Steps:**
1. **Download ZIP:**
   - Go to https://github.com/trimtoolshub/IQCheck
   - Click **"Code"** (green button)
   - Click **"Download ZIP"**
   - Save ZIP to your computer

2. **Upload via cPanel File Manager:**
   - In cPanel → **File Manager** (Files section)
   - Navigate to `trimsoftstudio.com`
   - Click **"Upload"** button
   - Select ZIP file and upload

3. **Extract:**
   - **Right-click** ZIP file → **"Extract"**
   - Creates `IQCheck-main` folder

4. **Copy Files:**
   - Navigate to `IQCheck-main/iq-app`
   - **Select all files** (Ctrl+A)
   - **Copy** (Ctrl+C)
   - **Create folder** `iqcheck` (if needed)
   - **Paste** files (Ctrl+V)

5. **Done!** Files are now in `trimsoftstudio.com/iqcheck`

**Pros:** No authentication, simple, fast  
**Cons:** Manual update process

---

### Solution 4: Use SSH Keys (For Future Updates)

**Setup SSH:**
1. **Generate SSH key in Terminal:**
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   cat ~/.ssh/id_ed25519.pub
   ```

2. **Add to GitHub:**
   - Go to https://github.com/settings/keys
   - Click **"New SSH key"**
   - Paste public key
   - Save

3. **Clone via SSH:**
   ```bash
   cd ~/trimsoftstudio.com
   git clone git@github.com:trimtoolshub/IQCheck.git
   ```

**Pros:** No passwords/tokens needed, secure  
**Cons:** Initial setup required

---

## Recommended Approach

**For first deployment:** Use **Solution 3 (ZIP Download)** - it's the fastest and avoids all auth issues.

**For future updates:** Make repo **public (Solution 1)** or use **SSH (Solution 4)**.

---

## After Getting Files

Once files are in `~/trimsoftstudio.com/iqcheck`, continue with:

```bash
cd ~/trimsoftstudio.com/iqcheck
npm install
npm run build
```

Then proceed with Node.js App setup in cPanel!

