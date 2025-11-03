# Quick Stripe Setup Guide

## Quick Steps:

1. **Get Stripe Test Keys:**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy your **Secret key** (starts with `sk_test_...`)

2. **Add to `.env.local`:**
   Open your `.env.local` file and add:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
   ```

3. **Restart Dev Server:**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## Testing Payments:

Use these test card numbers:
- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`
- 🔐 3D Secure: `4000 0025 0000 3155`

Use any:
- Future expiry (e.g., `12/34`)
- Any 3-digit CVC
- Any postal code

## Current Status:

✅ `.env.local` file exists
⚠️ Add `STRIPE_SECRET_KEY` to enable payments

## Need Help?

See `STRIPE_SETUP.md` for detailed instructions.

