# Velocita Prestige - Vehicle Rental Management System

A comprehensive, production-grade Vehicle Rental Management System engineered with **React 19, TypeScript, Tailwind CSS, Node.js Express**, and **PostgreSQL DDL schema**.

---

## 1. System Architecture

```
├── /schema.sql                    # Complete PostgreSQL DDL Schema (Tables, Enums, Foreign Keys, Indexes)
├── /.env.example                  # Environment configuration template
├── /server.ts                     # Production Node.js Express server
├── /vite.config.ts                # Vite dev server with integrated API middleware
├── /server/
│   ├── db.ts                      # Persistent database engine with double-booking prevention & audit logging
│   └── api.ts                     # Express REST API router (Auth, Vehicles, Bookings, Admin, Reports)
└── /src/
    ├── types.ts                   # Core TypeScript domain models
    ├── context/AuthContext.tsx     # Session management & role-based authentication
    ├── services/api.ts            # Client-side typed REST API client
    ├── components/                # Modular UI components
    │   ├── Navbar.tsx             # Top bar contract-compliant header
    │   ├── Footer.tsx             # Unboxed editorial footer
    │   ├── VehicleCard.tsx        # Zero-pill vehicle card with real photography & specs
    │   ├── BookingModal.tsx       # Live schedule quote, date validation & booking
    │   └── ImageWithFallback.tsx  # Resilient fallback component for images
    └── pages/
        ├── HomePage.tsx           # Page 1: Hero, quick search, featured fleet, testimonials
        ├── LoginPage.tsx          # Page 2: Auth with show/hide password & 1-click test credentials
        ├── RegisterPage.tsx       # Page 3: Customer registration with validation
        ├── VehiclesPage.tsx       # Page 4: Catalog with category, price, seat, and transmission filters
        ├── VehicleDetailPage.tsx  # Page 5: Specifications, photo gallery, and live pricing quote
        ├── MyBookingsPage.tsx     # Page 7: Customer reservations, vouchers & cancellation refunds
        ├── ProfilePage.tsx        # Page 8: Driver license and personal contact management
        ├── ContactPage.tsx        # Page 9: Fleet concierge message submission
        ├── AboutPage.tsx          # Page 10: Fleet standards & vehicle hygiene protocols
        └── admin/
            ├── AdminLayout.tsx        # Sidebar navigation & demo database reset trigger
            ├── AdminDashboardPage.tsx # Page 11: Real-time KPIs, revenue & fleet utilization
            ├── AdminVehiclesPage.tsx  # Page 12: Fleet CRUD with booking dependency safety
            ├── AdminBookingsPage.tsx  # Page 13: Booking workflow, dispatch & vehicle returns
            ├── AdminCustomersPage.tsx # Page 14: Customer directory & account control
            ├── AdminPaymentsPage.tsx  # Page 15: Transaction ledger & refund tracking
            └── AdminReportsPage.tsx   # Page 16: Revenue reports, CSV export & audit logs
```

---

## 2. Default Test Credentials

For quick evaluation, pre-seeded accounts are provided with 1-click fill buttons on the login screen:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@velocita.com` | `admin123` | Full access to Admin Console, fleet CRUD, dispatch & CSV reports |
| **Customer** | `customer@velocita.com` | `customer123` | Reserve vehicles, view receipts, and cancel bookings |

---

## 3. PostgreSQL Database Schema (`schema.sql`)

The application includes a complete relational database definition with foreign key integrity, index optimization, and enum types:

1. **`users`**: Customer and administrative accounts, secure password hashes, driver license numbers, contact details.
2. **`vehicles`**: Vehicle makes, models, registration numbers (unique), daily rental rates, transmission, seating capacity, station locations, and status flags (`available`, `rented`, `maintenance`, `archived`).
3. **`bookings`**: Unique reference codes (`VEL-XXXXX`), pickup/return dates, station hubs, rental duration, subtotal, insurance, taxes, security deposit, and status (`pending`, `confirmed`, `active`, `completed`, `cancelled`, `rejected`).
4. **`payments`**: Transaction references, payment methods, amounts, paid timestamps, and refund statuses.
5. **`vehicle_returns`**: Recorded odometer readings, fuel/battery percentages, condition notes, and damage surcharges.
6. **`contact_messages`**: Concierge inquiry submissions with resolution tracking.
7. **`audit_logs`**: Immutable security trail of all administrative and booking actions.

To run migrations against your external PostgreSQL instance:
```bash
psql -h localhost -U postgres -d velocita_rental_db -f schema.sql
```

To test a Supabase PostgreSQL connection, set `SUPABASE_DB_URL` (or `DATABASE_URL`) in `.env`, then run:
```bash
npm run db:test-supabase
```
The script uses TLS with certificate verification disabled for Supabase pooler compatibility, runs a harmless `SELECT 1`, and reports success or the connection/query error. Use this only with a trusted database endpoint; do not disable certificate verification in production application connections.

---

## 4. REST API Documentation

### Authentication & Profiles
- `POST /api/auth/register`: Register new customer with password confirmation and duplicate email checks.
- `POST /api/auth/login`: Authenticate and receive a secure 7-day session token.
- `GET /api/auth/me`: Validate current session and retrieve profile.
- `PUT /api/auth/profile`: Update driver license, phone, and billing address.

### Vehicles & Availability
- `GET /api/vehicles`: Query fleet with search, category, transmission, seat capacity, price boundaries, and date availability.
- `GET /api/vehicles/:id`: Retrieve single vehicle details with gallery and specifications.
- `POST /api/vehicles/check-availability`: Validate vehicle availability for given dates and calculate itemized price breakdown (subtotal, insurance, 8% tax, security deposit).

### Bookings & Returns
- `POST /api/bookings`: Validate reservation and insert it into the Supabase `bookings` table using server-side `DATABASE_URL`, then mirror it to the local store and create its payment record. Requires the Supabase bookings table to have the documented snake_case columns.
- `GET /api/bookings/my`: Retrieve authenticated customer's reservations.
- `GET /api/bookings/:id`: Retrieve single booking with itemized voucher receipt.
- `POST /api/bookings/:id/cancel`: Cancel reservation, issue full refund, and free vehicle schedule.

### Administrator Operations
- `GET /api/admin/db-view`: Temporary admin-only snapshot of all vehicles, bookings, and users. User password hashes are excluded and server logs contain only the requesting admin ID and record counts. Send an admin bearer token; for example, use `curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/db-view`. In a logged-in browser, run `fetch('/api/admin/db-view', { headers: { Authorization: \`Bearer ${localStorage.getItem('velocita_auth_token')}\` } }).then((response) => response.json()).then(console.log)` in the developer console.
- `GET /api/admin/overview`: Return fleet KPIs, recorded revenue from actual payments, and utilization rate.
- `GET /api/admin/vehicles`: Full fleet inventory.
- `POST /api/admin/vehicles`: Insert a new vehicle into Supabase, then mirror it to the local store; registration numbers are checked for duplicates.
- `PUT /api/admin/vehicles/:id`: Update vehicle specifications and daily rates.
- `DELETE /api/admin/vehicles/:id`: Safe vehicle deletion (prevents deleting vehicles with active bookings; archives if past bookings exist).
- `GET /api/admin/bookings`: Comprehensive dispatch list.
- `PATCH /api/admin/bookings/:id/status`: Transition workflow (`pending` -> `confirmed` -> `active` -> `completed` -> `cancelled`).
- `POST /api/admin/returns`: Log vehicle return inspection (odometer, fuel %, damage fee) and return vehicle to `available`.
- `GET /api/admin/customers`: Customer directory with lifetime trip counts and spend.
- `PATCH /api/admin/customers/:id`: Suspend or reactivate customer accounts.
- `GET /api/admin/payments`: Financial transactions ledger.
- `GET /api/admin/reports`: Summary analytics or download CSV (`?type=bookings&format=csv`, `?type=revenue&format=csv`, `?type=vehicles&format=csv`).
- `GET /api/admin/audit-logs`: System audit trail.
- `POST /api/setup/seed`: Reset database to fresh demo fleet state.

---

## 5. Installation & Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server** (includes client hot build and integrated API backend):
   ```bash
   npm run dev
   ```
3. **Build and Run Production Server**:
   ```bash
   npm run build
   npm start
   ```

---

## 6. External Services Requiring Configuration in Production

For full enterprise production deployment, configure the following external credentials in `.env`:
1. **Production PostgreSQL Database**: Set `DATABASE_URL` or `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.
2. **Payment Gateway**: Connect Stripe or Braintree credentials to replace the built-in test payment processor.
3. **Cloud Object Storage**: AWS S3 or Google Cloud Storage bucket credentials for fleet photograph uploads.
