# IQCheck

A scientifically designed IQ test platform with adaptive testing, real-time scoring, and detailed cognitive insights.

## Features

- 🧠 **Adaptive Intelligence Testing** - Questions adjust based on your performance
- 📊 **Real-time IQ Calculation** - See your percentile ranking in real-time
- 💰 **Multiple Payment Options** - Stripe for international, JazzCash/EasyPaisa/PakPay for Pakistan
- 📧 **Email Collection & Management** - Built-in email marketing system
- 📱 **Mobile-First Design** - Optimized for all devices
- 🔐 **Admin Dashboard** - Track revenue, manage emails, view statistics

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Setup Database

```bash
# Run migrations
npx prisma migrate dev

# Seed questions
curl -X POST http://localhost:3000/api/dev/seed
```

### Create Admin User

```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"email": "your-admin-email@gmail.com"}'
```

## Documentation

- **Quick Start**: See [QUICK_START.md](./QUICK_START.md)
- **Deployment**: See [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
- **Admin Setup**: See [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Stripe Setup**: See [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- **Pakistani Payments**: See [PAKISTAN_PAYMENT_SETUP.md](./PAKISTAN_PAYMENT_SETUP.md)

## Tech Stack

- **Next.js 16** - React framework
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **Stripe** - International payments
- **SQLite/PostgreSQL** - Database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Deploy on Vercel

See [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md) for detailed deployment instructions.
