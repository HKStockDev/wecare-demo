# Wecare Demo

Fundraising & community engagement platform demo for client presentation.

## Stack

- **Next.js** — User portal (mobile web) + Admin dashboard
- **Supabase** — Auth + `wecare_*` tables (isolated from existing stock-screener schema)
- **Stripe** — Simulated checkout UI (test card flow)
- **Tailwind CSS** — Styling matched to Wecare designs

## Run

```bash
cd wecare
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts (Supabase Auth)

| Role  | Email            | Password |
|-------|------------------|----------|
| User  | john@wecare.app  | demo123  |
| Admin | admin@wecare.app | admin123 |

## Routes

- `/` — Demo launcher
- `/login` → `/app` — User portal
- `/admin/login` → `/admin` — Admin dashboard

## Database

Wecare uses **prefixed tables** so it does not conflict with the existing stock-screener project:

- `wecare_profiles`, `wecare_campaigns`, `wecare_donations`
- `wecare_events`, `wecare_activities`, `wecare_notifications`
- RPC: `wecare_record_donation`

Re-apply schema + seed:

```bash
npm run db:setup
```

Credentials live in `.env.local` (gitignored).
