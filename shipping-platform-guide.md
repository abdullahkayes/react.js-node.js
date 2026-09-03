# International Shipping Platform — Full Build Guide
### Stack: Node.js (Express) + React.js + MySQL
### Purpose: Paste each "KILO CODE PROMPT" block into your VS Code Kilo Code agent, one phase at a time.

---

## 0. How to use this document

Build this in **phases**, not all at once. Each phase below has:
- A short explanation (for you)
- A ready-to-paste prompt block (for Kilo Code)

Do the phases **in order**. Don't move to the next phase until the current one runs locally without errors. After each phase, commit to git (`git add . && git commit -m "phase X done"`).

---

## 1. Project Overview

A service-based international shipping platform similar to DHL/FedEx, with:

**Customer-facing:**
- Account signup/login (email + password, JWT auth)
- Get a shipping quote (by weight, dimensions, origin, destination, service type)
- Book a shipment (pickup address, delivery address, package details, payment)
- Track a shipment by tracking number (public, no login needed)
- View shipment history / invoices
- Address book

**Admin-facing:**
- Admin login (separate role)
- Manage shipments (update status, assign courier, add tracking events)
- Manage rate cards (per zone/weight pricing)
- Manage users
- Dashboard (shipments today, revenue, in-transit count)

**Courier/staff-facing (optional Phase 8):**
- Mobile-friendly page to scan/update a shipment's status

**Cross-cutting:**
- Email notifications on status change
- Payment integration (Stripe, or a local gateway if you're not in a Stripe-supported country — see note in Phase 5)
- File uploads (proof of delivery photo)

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React.js (Vite), React Router, Axios, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| ORM | Sequelize (easiest for Kilo Code to scaffold reliably) |
| Auth | JWT + bcrypt |
| Payments | Stripe (or SSLCommerz/Razorpay if targeting South Asia) |
| Email | Nodemailer + SMTP (or Resend/SendGrid) |
| File storage | Local `/uploads` for dev → S3-compatible bucket for production |
| Hosting | VPS (Ubuntu 22.04) with Nginx + PM2, or Railway/Render for a faster start |

---

## 3. Folder Structure

```
shipping-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, env config
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/      # auth, error handler, validation
│   │   ├── services/        # rate calculation, email, payment
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/         # auth context
│   │   ├── api/             # axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 4. Database Schema (MySQL)

Core tables to design around:

- **users** — id, name, email, password_hash, phone, role (`customer`/`admin`/`staff`), created_at
- **addresses** — id, user_id, label, full_name, phone, address_line1, address_line2, city, state, postal_code, country
- **rate_cards** — id, origin_zone, destination_zone, service_type (`standard`/`express`/`priority`), price_per_kg, base_fee, currency
- **shipments** — id, tracking_number (unique), user_id, sender_address_id, receiver_address_id, service_type, weight_kg, dimensions (JSON: length/width/height), declared_value, price, currency, payment_status, status (`pending`/`picked_up`/`in_transit`/`customs`/`out_for_delivery`/`delivered`/`cancelled`/`returned`), created_at
- **tracking_events** — id, shipment_id, status, location, note, created_at
- **payments** — id, shipment_id, provider, provider_ref, amount, currency, status, created_at
- **couriers** (optional) — id, name, phone, assigned_region

Indexes: `tracking_number` (unique), `shipments.user_id`, `tracking_events.shipment_id`.

---

## 5. Build Phases & Kilo Code Prompts

### Phase 0 — Project Scaffolding

**KILO CODE PROMPT:**
```
Create a monorepo folder structure for a shipping platform with two folders:
"backend" (Node.js + Express + Sequelize + MySQL) and "frontend" (React + Vite + TailwindCSS + React Router + Axios).

In backend, set up:
- package.json with dependencies: express, sequelize, mysql2, dotenv, bcryptjs, jsonwebtoken, cors, morgan, nodemailer, multer, express-validator
- src/config/db.js that connects to MySQL using environment variables DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- src/app.js that sets up express, cors, json body parsing, morgan logging, and a health check route GET /api/health
- server.js that loads app.js and starts the server on process.env.PORT || 5000
- .env.example with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT

In frontend, set up:
- A Vite React app with TailwindCSS configured
- React Router installed
- src/api/axios.js exporting a configured axios instance using import.meta.env.VITE_API_URL
- A basic App.jsx with placeholder Home page

Do not implement business logic yet, just the working skeleton. Confirm both apps run (backend on npm run dev, frontend on npm run dev) before finishing.
```

---

### Phase 1 — Database Models

**KILO CODE PROMPT:**
```
In the backend, using Sequelize, create models for: User, Address, RateCard, Shipment, TrackingEvent, Payment.

Fields:
- User: id, name, email (unique), password_hash, phone, role (enum: customer, admin, staff, default customer), timestamps
- Address: id, userId (FK to User), label, fullName, phone, addressLine1, addressLine2, city, state, postalCode, country
- RateCard: id, originZone, destinationZone, serviceType (enum: standard, express, priority), pricePerKg (decimal), baseFee (decimal), currency
- Shipment: id, trackingNumber (unique string), userId (FK), senderAddressId (FK to Address), receiverAddressId (FK to Address), serviceType, weightKg (decimal), dimensions (JSON), declaredValue (decimal), price (decimal), currency, paymentStatus (enum: unpaid, paid, refunded), status (enum: pending, picked_up, in_transit, customs, out_for_delivery, delivered, cancelled, returned, default pending), timestamps
- TrackingEvent: id, shipmentId (FK), status, location, note, timestamps
- Payment: id, shipmentId (FK), provider, providerRef, amount (decimal), currency, status, timestamps

Set up all associations (User hasMany Address/Shipment, Shipment belongsTo Address x2 with aliases "sender" and "receiver", Shipment hasMany TrackingEvent, Shipment hasOne Payment).

Create src/config/syncDb.js that syncs all models with the database, and wire it into server.js behind an environment flag DB_SYNC=true so I can run it once to create tables.

Show me the generated tracking_number format you'll use (should be something like SP + year + 9 random digits, unique, generated in a utility function utils/generateTrackingNumber.js).
```

---

### Phase 2 — Auth (Signup/Login)

**KILO CODE PROMPT:**
```
Implement authentication in the backend:
- POST /api/auth/register — validates input with express-validator, hashes password with bcryptjs, creates a User with role "customer", returns a JWT
- POST /api/auth/login — verifies email/password, returns a JWT containing { id, role }
- Middleware src/middleware/auth.js — verifies JWT from Authorization: Bearer header, attaches req.user
- Middleware src/middleware/requireRole.js — restricts routes by role (e.g. requireRole('admin'))
- GET /api/auth/me — returns current logged-in user's profile (protected)

On the frontend:
- Create an AuthContext (src/context/AuthContext.jsx) storing user + token in state and localStorage
- Pages: Login.jsx, Register.jsx with forms and error handling
- Axios instance should attach the JWT token automatically from context/localStorage to every request
- A ProtectedRoute component that redirects to /login if not authenticated, and an AdminRoute that also checks role === 'admin'

Test the full flow: register a user, log in, hit /api/auth/me successfully with the token.
```

---

### Phase 3 — Rate Calculation & Quote

**KILO CODE PROMPT:**
```
Implement a shipping quote feature:

Backend:
- Seed a few RateCard rows via a seed script (src/seeders/rateCards.js) covering zones like "domestic", "regional", "international" crossed with serviceType standard/express/priority
- POST /api/quotes — accepts { originCountry, destinationCountry, weightKg, dimensions, serviceType }, determines the zone pair (simple logic: same country = domestic, same continent = regional, else international — put this mapping in src/services/zoneService.js so it's easy to edit later), looks up the matching RateCard, calculates price = baseFee + (weightKg * pricePerKg), applies a dimensional-weight rule if L*W*H/5000 > actual weight, and returns { price, currency, serviceType, estimatedDays }
- estimatedDays can be a simple static map per serviceType (standard: 5-7, express: 2-3, priority: 1-2)

Frontend:
- A QuoteCalculator component/page with a form for origin, destination, weight, dimensions, and service type radio buttons, calling POST /api/quotes and displaying the price breakdown
- This page should be public (no login required)
```

---

### Phase 4 — Book a Shipment

**KILO CODE PROMPT:**
```
Implement shipment booking (requires login):

Backend:
- POST /api/addresses — create an address for the logged-in user; GET /api/addresses — list user's saved addresses
- POST /api/shipments — accepts sender address (existing addressId or new address object), receiver address (same), weightKg, dimensions, serviceType, declaredValue. It should: create addresses if new, call the same rate logic from Phase 3 to compute price, generate a unique tracking number, create the Shipment with status "pending" and paymentStatus "unpaid", create an initial TrackingEvent with status "pending" and note "Shipment created", and return the full shipment object
- GET /api/shipments — list the logged-in user's shipments (paginated)
- GET /api/shipments/:id — get one shipment with its addresses and tracking events (only if it belongs to the logged-in user, or user is admin)

Frontend:
- A multi-step BookShipment page: Step 1 addresses (pick saved or add new), Step 2 package details + live quote preview, Step 3 review & confirm
- A Dashboard page listing the user's shipments with status badges and a link to each shipment's detail page
- A ShipmentDetail page showing addresses, package info, price, and a tracking timeline (list of TrackingEvents)
```

---

### Phase 5 — Payment Integration

**KILO CODE PROMPT:**
```
Integrate Stripe payments for shipments:

Backend:
- POST /api/payments/create-intent — given a shipmentId, creates a Stripe PaymentIntent for shipment.price in the smallest currency unit, creates a Payment row with status "pending", returns the client_secret
- POST /api/payments/webhook — Stripe webhook endpoint (raw body, verified with STRIPE_WEBHOOK_SECRET) that on payment_intent.succeeded updates the Payment status to "paid" and the Shipment's paymentStatus to "paid"
- Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.example

Frontend:
- Install @stripe/stripe-js and @stripe/react-stripe-js
- A Checkout page/component using Stripe Elements that calls create-intent, confirms the card payment, then redirects to the shipment detail page on success

Note: if targeting a region where Stripe isn't available (e.g. Bangladesh), tell me and I'll give you an equivalent prompt for SSLCommerz instead — the flow is analogous (create session -> redirect -> IPN webhook -> mark paid).
```

---

### Phase 6 — Public Tracking

**KILO CODE PROMPT:**
```
Implement public tracking (no login required):

Backend:
- GET /api/track/:trackingNumber — public route, returns shipment status, service type, origin/destination city+country only (not full address for privacy), and the list of tracking events ordered by date

Frontend:
- A public TrackShipment page with a search box for a tracking number, calling the above endpoint and rendering a vertical timeline of tracking events with icons per status
- Add this as a prominent "Track your shipment" box on the Home page
```

---

### Phase 7 — Admin Panel

**KILO CODE PROMPT:**
```
Build an admin panel (protected by requireRole('admin')):

Backend:
- GET /api/admin/shipments — list all shipments with filters (status, date range, search by tracking number), paginated
- PATCH /api/admin/shipments/:id/status — updates shipment.status and creates a new TrackingEvent (status, location, note), and triggers an email notification (see below) to the shipment owner
- GET /api/admin/stats — returns counts: shipments today, in-transit, delivered this month, revenue this month (sum of paid payments)
- CRUD routes for RateCard: GET/POST/PUT/DELETE /api/admin/rate-cards
- GET /api/admin/users — list users

Email notifications:
- src/services/emailService.js using nodemailer with SMTP creds from .env
- Send an email whenever a shipment's status changes, using a simple HTML template with the tracking number and new status

Frontend:
- An /admin section with its own layout (sidebar nav), gated by AdminRoute
- AdminDashboard page showing the stats as cards
- AdminShipments page with a table, filters, and a status-update modal
- AdminRateCards page with a simple CRUD table
```

---

### Phase 8 — Polish & Hardening

**KILO CODE PROMPT:**
```
Harden the app for production:
- Add express-rate-limit to auth and quote routes
- Add helmet for security headers
- Add centralized error-handling middleware that never leaks stack traces in production
- Add input validation (express-validator) to every POST/PATCH route that doesn't have it yet
- Add a src/middleware/notFound.js for unmatched routes
- On the frontend, add a global error boundary and toast notifications (react-hot-toast) for API errors
- Add loading skeletons to Dashboard, ShipmentDetail, and Admin pages
- Write a README.md documenting setup steps, environment variables, and how to run migrations/seeders
```

---

## 6. Deployment Guide

You have two realistic paths. Pick one.

### Option A — Fast path: Railway / Render (good for MVP, less setup)

1. Push your repo to GitHub (backend and frontend as two services, or a monorepo with two build targets).
2. On Railway/Render: create a MySQL database add-on, note the connection credentials.
3. Deploy backend as a "Web Service": set env vars (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, STRIPE_SECRET_KEY, SMTP_*), build command `npm install`, start command `node server.js`.
4. Deploy frontend as a "Static Site": build command `npm run build`, publish directory `dist`, env var `VITE_API_URL=https://your-backend-url/api`.
5. Point your domain's DNS (A/CNAME records) at the platform per their instructions.

### Option B — Full control: VPS (Ubuntu 22.04) with Nginx + PM2

**KILO CODE PROMPT (ask it to generate these config files for you):**
```
Generate production deployment files for this project:
1. An ecosystem.config.js for PM2 that runs the backend as "shipping-api" with NODE_ENV=production, instances "max", exec_mode "cluster"
2. An nginx.conf server block that:
   - Serves the built frontend (dist folder) as static files on the domain root
   - Reverse-proxies /api/ to http://localhost:5000
   - Includes gzip compression and a redirect from http to https
3. A GitHub Actions workflow (.github/workflows/deploy.yml) that on push to main: SSHes into the VPS, pulls latest code, runs npm install and npm run build for frontend, runs npm install for backend, restarts PM2
4. A .env.production.example for both frontend and backend
```

Then on the server, roughly:

1. **Provision** an Ubuntu 22.04 VPS (DigitalOcean, Hetzner, Linode — any).
2. **Install** Node.js (via nvm or NodeSource), MySQL server, Nginx, PM2 (`npm i -g pm2`), and Certbot.
3. **Secure MySQL**: `sudo mysql_secure_installation`, create a dedicated DB user (don't use root in your app).
4. **Clone your repo** to `/var/www/shipping-platform`.
5. **Backend**: `npm install --production`, add real `.env`, run your seed/migration script, start with `pm2 start ecosystem.config.js`, then `pm2 save` and `pm2 startup` so it survives reboots.
6. **Frontend**: `npm install && npm run build`, this produces `dist/` — Nginx serves this directly.
7. **Nginx**: drop the generated config into `/etc/nginx/sites-available/shipping-platform`, symlink to `sites-enabled`, `sudo nginx -t`, `sudo systemctl reload nginx`.
8. **SSL**: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`.
9. **Firewall**: `ufw allow 'Nginx Full'`, `ufw allow OpenSSH`, `ufw enable`.
10. **DNS**: point your domain's A record to the VPS's IP.
11. **Monitoring**: `pm2 monit` for a quick check, or set up `pm2-logrotate` so logs don't fill the disk.

### Post-deployment checklist
- [ ] Stripe webhook URL updated to the production domain
- [ ] SMTP credentials are production ones (not a personal Gmail — use a transactional email provider)
- [ ] `.env` files are NOT committed to git (check `.gitignore`)
- [ ] Database backups scheduled (`mysqldump` cron job, or your host's managed backup)
- [ ] CORS on the backend restricted to your actual frontend domain, not `*`

---

## 7. Suggested Order of Work (summary)

1. Phase 0 — Scaffolding
2. Phase 1 — Models
3. Phase 2 — Auth
4. Phase 3 — Quotes
5. Phase 4 — Booking
6. Phase 5 — Payments
7. Phase 6 — Public tracking
8. Phase 7 — Admin panel
9. Phase 8 — Hardening
10. Deploy (Option A or B)

Feed Kilo Code one phase at a time, verify it runs, commit, then move on. If a phase's output looks wrong, paste the actual error back into Kilo Code rather than re-running the whole prompt — it'll fix it faster with the specific error in front of it.
