# Stripe Setup for Development

This guide will help you configure Stripe for development/testing.

## Step 1: Get Stripe Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in to your Stripe account
3. Toggle to **Test Mode** (toggle in the top right of the dashboard)
4. Go to **Developers** → **API keys**
5. Copy your **Publishable key** (starts with `pk_test_...`)
6. Click **Reveal test key** and copy your **Secret key** (starts with `sk_test_...`)

## Step 2: Create Environment File

Create a `.env.local` file in the `iq-app` directory (if it doesn't exist):

```bash
cd iq-app
touch .env.local  # On Windows: type nul > .env.local
```

## Step 3: Add Stripe Keys

Add the following to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE  # Optional for local dev

# Required for NextAuth (if not already set)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here  # Generate a random string
```

**Important**: 
- Replace `sk_test_YOUR_SECRET_KEY_HERE` with your actual Stripe test secret key
- For local development, you can skip `STRIPE_WEBHOOK_SECRET` (it's only needed for webhooks in production)

## Step 4: Restart Dev Server

After adding the environment variables, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then start it again
npm run dev
```

## Testing Payments

1. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`
   
2. Use any future expiry date (e.g., `12/34`)
3. Use any 3-digit CVC
4. Use any postal code

## Troubleshooting

### "Payment processing not available"
- Make sure `STRIPE_SECRET_KEY` is set in `.env.local`
- Make sure you've restarted the dev server after adding the key
- Check that the key starts with `sk_test_` (test mode)

### "Invalid API Key"
- Make sure you copied the full key
- Make sure you're using test keys (not live keys)
- Make sure there are no extra spaces or quotes around the key

### Webhooks (for production)
- For local development, webhooks aren't needed
- For production, you'll need to set up webhooks in Stripe Dashboard
- Use a tool like [Stripe CLI](https://stripe.com/docs/stripe-cli) for local webhook testing

## Example `.env.local` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghijklmnopqrstuvwxyz

# Google OAuth (optional)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (optional)
# FACEBOOK_CLIENT_ID=your-facebook-app-id
# FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

## Security Notes

⚠️ **Never commit `.env.local` to git!** It's already in `.gitignore`

⚠️ **Never use live Stripe keys in development!** Always use test keys (`sk_test_...`)

⚠️ **For production**, use environment variables on your hosting platform (Vercel, Heroku, etc.)

