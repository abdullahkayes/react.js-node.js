# Dazzling Shipping — International Shipping Platform

A service-based international shipping platform (DHL/FedEx clone) built with Node.js/Express, React.js, and MySQL.

## Features

**Customer-facing:**
- Account signup/login with JWT authentication
- Shipping quotes by weight, dimensions, origin/destination, service type
- Shipment booking with pickup/delivery addresses, package details, and payment
- Public shipment tracking by tracking number (no login required)
- Shipment history and invoices
- Address book

**Admin-facing:**
- Admin login and dashboard with stats
- Manage shipments (update status, tracking events)
- Manage rate cards (zone/weight pricing)
- Manage users

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| ORM | Sequelize |
| Auth | JWT + bcrypt |
| Payments | Stripe |
| Email | Nodemailer (SMTP) |
| File Storage | Local `/uploads` (dev) → S3-compatible (prod) |

## Project Structure

```
shipping-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, syncDb.js
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # auth, rate-limit, error handler, etc.
│   │   ├── services/        # rate, zone, email services
│   │   ├── utils/           # tracking number generator
│   │   ├── seeders/         # rate card seed data
│   │   └── app.js
│   ├── .env / .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/             # axios instance
│   │   ├── components/      # reusable components
│   │   ├── context/         # AuthContext
│   │   ├── layouts/         # AdminLayout
│   │   ├── pages/           # all page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env / .env.production.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
├── .github/workflows/deploy.yml
├── ecosystem.config.js
├── nginx.conf
└── README.md
```

## Setup

### Prerequisites

- Node.js v18+
- MySQL 8+
- npm / yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
npm run dev
```

Set `DB_SYNC=true` in `.env` for the first run to auto-sync database tables. Then run the rate card seeder:

```bash
npm run seed
```

For subsequent runs, set `DB_SYNC=false` (tables already exist).

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### Environment Variables

**Backend `.env`:**
- `DB_HOST` — MySQL host
- `DB_USER` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — Database name
- `DB_SYNC` — `true` to sync tables on startup
- `JWT_SECRET` — Secret for JWT signing (use a long random string)
- `JWT_EXPIRES_IN` — Token expiry (e.g., `7d`)
- `PORT` — API server port (default: 5000)
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — SMTP credentials

**Frontend `.env`:**
- `VITE_API_URL` — Backend API URL (e.g., `http://localhost:5000/api`)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key

### Database Migration / Sync

Tables are auto-synced via Sequelize when `DB_SYNC=true`. For production, use `DB_SYNC=false` and set up tables manually or via sync script:

```bash
node src/config/syncDb.js
```

### Seeding

```bash
npm run seed
```

This seeds rate cards covering domestic, regional, and international zones for standard, express, and priority service types.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/me` — Get current user profile (requires auth)
- `POST /api/auth/logout` — Logout (requires auth)

### Quotes
- `POST /api/quotes` — Calculate a shipping quote (public)

### Addresses
- `GET /api/addresses` — List user's addresses (requires auth)
- `POST /api/addresses` — Create an address (requires auth)
- `GET /api/addresses/:id` — Get a specific address (requires auth)

### Shipments
- `POST /api/shipments` — Book a shipment (requires auth)
- `GET /api/shipments` — List user's shipments, paginated (requires auth)
- `GET /api/shipments/:id` — Get a shipment with details (requires auth)

### Tracking
- `GET /api/track/:trackingNumber` — Public tracking by tracking number

### Payments
- `POST /api/payments/create-intent` — Create Stripe PaymentIntent (requires auth)
- `POST /api/payments/webhook` — Stripe webhook endpoint (public)

### Admin (requires admin role)
- `GET /api/admin/shipments` — List all shipments with filters
- `PATCH /api/admin/shipments/:id/status` — Update shipment status
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/rate-cards` — List rate cards
- `POST /api/admin/rate-cards` — Create rate card
- `PUT /api/admin/rate-cards/:id` — Update rate card
- `DELETE /api/admin/rate-cards/:id` — Delete rate card
- `GET /api/admin/users` — List users

## Deployment

### Option A: Railway / Render (Fast)

1. Push to GitHub.
2. Create a MySQL database add-on.
3. Deploy backend as a Web Service with env vars.
4. Deploy frontend as a Static Site with `npm run build`, publish `dist`.
5. Set `VITE_API_URL` to your backend URL.

### Option B: VPS (Ubuntu 22.04 + Nginx + PM2)

See `nginx.conf` for the Nginx server block. Deploy with the GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Provision Ubuntu 22.04 VPS.
2. Install Node.js, MySQL, Nginx, PM2, Certbot.
3. Clone repo to `/var/www/shipping-platform`.
4. Backend: `npm install --production`, set up `.env`, run `node src/config/syncDb.js` and `npm run seed`.
5. Start: `pm2 start ecosystem.config.js --env production`, then `pm2 save` and `pm2 startup`.
6. Frontend: `npm install && npm run build`.
7. Configure Nginx: copy `nginx.conf` to `/etc/nginx/sites-available/`, symlink to `sites-enabled`, `sudo nginx -t && sudo systemctl reload nginx`.
8. SSL: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`.

### Post-Deployment Checklist
- [ ] Stripe webhook URL updated to production domain
- [ ] SMTP credentials set to production provider (not personal Gmail)
- [ ] `.env` files are NOT committed to git
- [ ] Database backups scheduled (mysqldump cron)
- [ ] CORS restricted to your frontend domain
