# Admin Panel Setup Guide

## How to Access Admin Panel

### Step 1: Create Admin User

You have two options:

**Option A: Via API (Development)**
```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

**Option B: Directly in Database**
1. Sign up or sign in with your email using Google/Facebook authentication
2. Connect to your database and update the user:
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

### Step 2: Sign In

1. Go to your app and sign in with the email you set as admin
2. Navigate to: `http://localhost:3000/admin`

The admin panel will check your role and allow access if you're an ADMIN.

## Google AdSense Setup

### Step 1: Register for Google AdSense

1. Go to https://www.google.com/adsense/
2. Sign up with your Google account
3. Add your website: `localhost:3000` (for testing) and your production domain
4. Complete the verification process
5. Get your Publisher ID: `ca-pub-XXXXXXXXXX`

### Step 2: Create Ad Units

1. In AdSense dashboard, go to "Ads" → "By ad unit"
2. Create a new ad unit (e.g., "Display ads")
3. Choose ad format: Responsive
4. Get your Ad Slot ID

### Step 3: Configure in App

1. Update the AdDisplay component in `src/app/test/[id]/report/page.tsx`
2. Replace `YOUR_PUBLISHER_ID` with your actual Publisher ID
3. Replace `YOUR_AD_SLOT_ID` with your actual Ad Slot ID

Or add to `.env.local`:
```
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_ID=YYYYYYYYYY
```

### Step 4: Add AdSense Script to Layout

Add to `src/app/layout.tsx`:
```tsx
<Script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

## Monetization Flow

### Share + Ad Flow
1. User shares → Ad shown → User watches ad
2. Repeat 5 times (5 shares + 5 ads)
3. Report unlocks after 5 ads watched

### Payment Flow
1. User pays $0.99 → Instant unlock (no ads needed)

## Features

### Admin Panel (`/admin`)
- **Dashboard Tab**: Revenue stats, email counts, test statistics
- **Email Management Tab**: View all emails, send emails to subscribers

### Revenue Tracking
- Payment revenue: Tracks $0.99 payments
- Ad revenue: Tracks ad views at $0.02 per view (configurable)

### Email Management
- Collects emails before showing results
- Tracks email source (report_unlock, share, payment)
- Admin can send emails to all subscribers

## Testing

### Test Share Flow
1. Complete a test
2. Enter email
3. Click share buttons (Facebook, Instagram, Copy Link)
4. After each share, ad modal appears
5. Watch ad (or click "I Watched the Ad")
6. Repeat 5 times to unlock

### Test Payment Flow
1. Complete a test
2. Enter email
3. Click "Pay $0.99 USD"
4. Complete Stripe checkout
5. Report unlocks instantly

### Test Admin Panel
1. Create admin user
2. Sign in
3. Navigate to `/admin`
4. View stats and manage emails

