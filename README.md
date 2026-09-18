# Restro Foods — Full-Stack MERN Restaurant Platform

A production-style restaurant ordering platform built with MongoDB, Express, React, and Node.js.

## Features

- **Menu & Ordering** — browse dishes with search, category filters, veg-only filter, and sorting; add to cart; checkout.
- **Authentication** — secure JWT auth (httpOnly cookies), bcrypt password hashing, register/login/logout, protected routes, role-based access (user/admin).
- **Payments** — real Stripe Checkout integration (card payments) plus Cash on Delivery, with a webhook to confirm payment.
- **Reviews & Ratings** — customers can rate and review dishes; ratings roll up to each dish automatically.
- **Table Reservations** — book a table by date/time/guest count; manage/cancel your own reservations.
- **Order Tracking** — order history, order detail with a visual status timeline.
- **Admin Dashboard** — revenue chart, orders-by-status chart, top-selling dishes, and full CRUD for menu items, plus order/reservation/review/user management.
- **Dark mode**, responsive design, toast notifications, animated UI (Tailwind CSS v4 + Framer Motion).

## Tech Stack

- **Frontend:** React 19 (Vite), Redux Toolkit, React Router, Tailwind CSS v4, Axios, Recharts, Framer Motion, React Hot Toast.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Stripe, express-validator, helmet, rate limiting.

## Project Structure

```
restro-foods-mern/
├── server/            Express API
│   ├── config/        DB connection
│   ├── controllers/   Route handlers
│   ├── middleware/    Auth, error handling, validation
│   ├── models/        Mongoose schemas
│   ├── routes/        API routes
│   ├── seed/          Demo data + seeder script
│   └── server.js
└── client/            React app (Vite)
    └── src/
        ├── api/            Axios API modules
        ├── app/            Redux store
        ├── features/       Redux slices (auth, cart, ui)
        ├── components/     Reusable UI components
        └── pages/          Route pages (+ pages/admin)
```

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env` (already configured for you in this project) with:

```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<random secret>
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=<your Stripe secret key>
STRIPE_WEBHOOK_SECRET=<your Stripe webhook signing secret>
```

Seed the database with demo menu items and accounts:

```bash
npm run seed
```

This creates:
- Admin login: `admin@restrofoods.com` / `admin123`
- Customer login: `customer@restrofoods.com` / `customer123`

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### 3. Stripe setup (for real card payments)

1. Create a free account at https://dashboard.stripe.com and switch to **Test mode**.
2. Copy your **Secret key** into `server/.env` as `STRIPE_SECRET_KEY`.
3. Copy your **Publishable key** into `client/.env` as `VITE_STRIPE_PUBLISHABLE_KEY`.
4. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
   Copy the printed webhook signing secret into `server/.env` as `STRIPE_WEBHOOK_SECRET`.
5. Use Stripe's test card `4242 4242 4242 4242` with any future expiry date and any CVC.

> Even without a webhook running, the app still confirms payment via the `/order-success` page, which verifies the Checkout Session directly as a fallback.

## Notes

- `server/.env` and `client/.env` are gitignored — never commit real secrets.
- The admin dashboard is available at `/admin` for the admin account only.
