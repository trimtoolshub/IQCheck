# Pakistani Payment Gateways Setup

This guide helps you configure JazzCash, EasyPaisa, and PakPay for payments in Pakistan.

## Supported Providers

1. **JazzCash** - Most popular mobile wallet in Pakistan
2. **EasyPaisa** - Telenor's mobile wallet service
3. **PakPay** - Pakistani payment gateway

## Step 1: Get API Credentials

### JazzCash

1. Go to [JazzCash Developer Portal](https://developer.jazzcash.com.pk/)
2. Sign up for a merchant account
3. Get your credentials:
   - **Merchant ID** (MerchantID)
   - **Password** (Password)
   - **Integrity Salt** (IntegritySalt)

### EasyPaisa

1. Go to [Telenor Easypaisa Developer Portal](https://developer.telenor.com.pk/)
2. Register as a merchant
3. Get your credentials:
   - **Store ID** (StoreId)
   - **Merchant ID** (MerchantId)
   - **API Key** (API Key)

### PakPay

1. Visit [PakPay Website](https://pakpay.com/)
2. Contact them for merchant account
3. Get your credentials:
   - **Merchant ID**
   - **API Key**

## Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# JazzCash Configuration
JAZZCASH_MERCHANT_ID=your_merchant_id_here
JAZZCASH_PASSWORD=your_password_here
JAZZCASH_INTEGRITY_SALT=your_integrity_salt_here

# EasyPaisa Configuration
EASYPAISA_STORE_ID=your_store_id_here
EASYPAISA_MERCHANT_ID=your_merchant_id_here
EASYPAISA_API_KEY=your_api_key_here

# PakPay Configuration
PAKPAY_MERCHANT_ID=your_merchant_id_here
PAKPAY_API_KEY=your_api_key_here
```

## Step 3: How It Works

When a user from Pakistan (`countryCode: "PK"`) tries to pay:

1. System automatically detects Pakistan location
2. Uses Pakistani payment providers instead of Stripe
3. Default provider is JazzCash (can be changed)
4. Amount is PKR 99.00 (instead of USD $0.99)

## Step 4: Testing

### JazzCash Test Mode
- Use test credentials provided by JazzCash
- Test transactions don't charge real money
- Check JazzCash sandbox documentation

### EasyPaisa Test Mode
- Use test credentials from Telenor developer portal
- Test transactions are free
- Verify webhook callbacks

### PakPay Test Mode
- Contact PakPay for test credentials
- Use test environment for development

## Step 5: Payment Flow

```
User clicks "Pay PKR 99"
    ↓
System checks country code
    ↓
Pakistan detected? → Use JazzCash/EasyPaisa/PakPay
    ↓
Create payment session
    ↓
Redirect to provider payment page
    ↓
User completes payment
    ↓
Provider redirects back to your site
    ↓
Mark test session as paid
```

## Implementation Status

⚠️ **Current Status**: Basic structure is in place, but actual API integrations need to be completed.

### To Complete Integration:

1. **JazzCash**: 
   - Implement actual API call to JazzCash payment gateway
   - Handle payment notifications/callbacks
   - Update `/payments/jazzcash/return` route

2. **EasyPaisa**:
   - Implement EasyPaisa API integration
   - Set up webhook for payment confirmation
   - Update `/payments/easypaisa/callback` route

3. **PakPay**:
   - Implement PakPay API integration
   - Handle return URL and callbacks
   - Update `/payments/pakpay/return` route

## API Documentation Links

- **JazzCash**: https://developer.jazzcash.com.pk/
- **EasyPaisa**: https://developer.telenor.com.pk/
- **PakPay**: Contact PakPay directly for API documentation

## Security Notes

⚠️ **Never commit credentials to git!** All payment credentials should be in `.env.local` (already in `.gitignore`)

⚠️ **Use test/sandbox mode** during development

⚠️ **Verify webhook signatures** in production to ensure payment authenticity

## Support

For issues with specific payment gateways:
- **JazzCash**: support@jazzcash.com.pk
- **EasyPaisa**: developer support through Telenor portal
- **PakPay**: Contact PakPay support

## Default Behavior

- If no payment provider is specified, system defaults to **JazzCash** for Pakistani users
- If provider credentials are missing, payment will fail with a clear error message
- For non-Pakistani users, Stripe is used by default

