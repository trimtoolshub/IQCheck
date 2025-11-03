# Quick Start Guide

## 📋 Admin Panel Access

### Method 1: Via API (Recommended)
```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

Then:
1. Sign in with that email (Google/Facebook)
2. Go to: `http://localhost:3000/admin`

### Method 2: Database
1. Sign in with your email
2. Update database:
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```
3. Go to: `http://localhost:3000/admin`

---

## 🎯 Google AdSense Setup

### Register with Google AdSense
1. Visit: https://www.google.com/adsense/
2. Sign up with your Google account
3. Add your website (localhost for testing, production domain for live)
4. Complete verification
5. Get your **Publisher ID** (format: `ca-pub-XXXXXXXXXX`)

### Configure in App
1. Create/update `.env.local`:
```
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_ID=YYYYYYYYYY
```

2. Restart your dev server

### Create Ad Units
1. In AdSense dashboard: **Ads** → **By ad unit**
2. Create new ad unit
3. Format: **Responsive**
4. Copy the **Ad Slot ID**

---

## 💰 Monetization Flow

### Option 1: Share + Watch Ads (FREE)
1. User shares (Facebook/Instagram/Copy Link) → Ad modal appears
2. User watches ad → Repeat
3. After **5 shares + 5 ads** → Report unlocks

### Option 2: Pay $0.99 (INSTANT)
1. User clicks "Pay $0.99 USD"
2. Complete Stripe checkout
3. Report unlocks instantly

---

## 🔧 Fixed Issues

✅ **Share Buttons** - Now working properly with error handling
✅ **Ad Display** - Shows after each share (5 shares = 5 ads)
✅ **Unlock Logic** - Requires 5 shares + 5 ads OR payment
✅ **Email Collection** - Required before showing results
✅ **Admin Panel** - Access via `/admin` (requires admin role)

---

## 📊 Admin Panel Features

### Dashboard Tab
- Total revenue (payments + ads)
- Email statistics
- Test completion stats
- Share analytics by platform
- Ad revenue by provider
- Recent payments list

### Email Management Tab
- View all collected emails
- Send emails to all subscribers
- Test email functionality

---

## 🚀 Next Steps

1. **Restart dev server** (if not already done)
2. **Create admin user** using the API method above
3. **Sign in** with that email
4. **Access admin panel** at `/admin`
5. **Configure AdSense** with your publisher ID
6. **Test the flow** - complete a test and try sharing

