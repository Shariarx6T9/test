# RailMate Bangladesh – Backend Layer

Production-ready backend implementation for the RailMate Bangladesh marketing website, built with **Next.js App Router**, **Supabase**, **Resend**, and **PostHog**.

---

## Architecture Overview

```
railmate-website-backend/
├── app/api/
│   ├── contact/route.ts            # Contact form
│   ├── newsletter/route.ts         # Newsletter subscription
│   ├── waitlist/route.ts           # Waitlist sign-up
│   ├── analytics/route.ts          # Custom event ingestion
│   ├── download-cta/route.ts       # App download tracking
│   ├── business-inquiry/route.ts   # Enterprise/partnership forms
│   ├── auth/
│   │   ├── send-otp/route.ts       # Email OTP dispatch (6-digit code)
│   │   ├── verify-otp/route.ts     # Email OTP verification (completes sign-in)
│   │   ├── callback/route.ts       # Google OAuth callback only
│   │   └── signout/route.ts        # Session teardown
│   └── upload/
│       ├── avatar/route.ts         # Avatar image uploads
│       └── community-photo/route.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client (anon key)
│   │   ├── server.ts               # Server client (cookie session)
│   │   └── admin.ts                # Admin client (service role)
│   ├── auth/
│   │   ├── helpers.ts              # Auth utility functions
│   │   └── upload.ts               # Storage upload helpers
│   ├── validators/                 # Zod schemas per feature
│   ├── email/
│   │   ├── resend.ts               # Resend client + send wrapper
│   │   └── templates.ts            # HTML email templates
│   ├── env.ts                      # Env validation (fail-fast)
│   ├── errors.ts                   # Error classes + response builders
│   └── rate-limit.ts               # Upstash Redis + in-memory fallback
├── middleware.ts                   # Session refresh + security headers
├── types/index.ts                  # Shared TypeScript types
└── supabase/migrations/
    ├── 001_create_tables.sql
    ├── 002_rls_policies.sql
    └── 003_storage.sql
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.x |
| npm | ≥ 10.x |
| Supabase account | — |
| Resend account | — |
| PostHog account | — |

---

## Step 1 – Copy Files Into Your Project

This folder is designed to be **merged into your existing Next.js project root**:

```bash
# From the extracted ZIP directory
cp -r railmate-website-backend/app/api/*         your-project/app/api/
cp -r railmate-website-backend/lib/*             your-project/lib/
cp    railmate-website-backend/middleware.ts      your-project/
cp -r railmate-website-backend/types/*           your-project/types/
cp -r railmate-website-backend/supabase/         your-project/supabase/
cp    railmate-website-backend/.env.example      your-project/
```

---

## Step 2 – Install Dependencies

```bash
npm install @supabase/ssr @supabase/supabase-js resend zod
```

**Optional – Upstash Redis for distributed rate limiting:**
```bash
npm install @upstash/redis
```

---

## Step 3 – Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in **all** values. See comments in the file for where to find each key.

### Required Variables

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API |
| `RESEND_API_KEY` | resend.com → API Keys |
| `EMAIL_FROM` | Verified domain in Resend |
| `ADMIN_EMAIL` | Your team's notification inbox |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project Settings |
| `POSTHOG_API_KEY` | Same as above |

---

## Step 4 – Run Database Migrations

### Option A – Supabase CLI (recommended)

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### Option B – Supabase SQL Editor

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project → **SQL Editor**
3. Run each file in order:
   - `supabase/migrations/001_create_tables.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage.sql`

---

## Step 5 – Configure Supabase Auth

1. Go to **Authentication → Providers**
2. Enable **Email**, then go to **Authentication → Email Templates → Magic Link**
   and edit the template to show `{{ .Token }}` as the 6-digit code instead of
   (or in addition to) the `{{ .ConfirmationURL }}` button. This app uses
   `send-otp` + `verify-otp` (typed code), not a clickable link — without this
   template edit, Supabase's default template still includes the link.
3. Enable **Google** OAuth:
   - Create a Google OAuth app at [console.cloud.google.com](https://console.cloud.google.com)
   - Set authorized redirect URI to: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret into Supabase

4. Go to **Authentication → URL Configuration**:
   - Site URL: `https://railmatebd.com`
   - Redirect URL: `https://railmatebd.com/api/auth/callback` (used by Google OAuth only)

---

## Step 6 – Verify Resend Sender Domain

1. Log in to [resend.com](https://resend.com)
2. Go to **Domains** → Add Domain (`railmatebd.com`)
3. Add the provided DNS records to your domain registrar
4. Wait for verification (usually < 5 minutes)

---

## Step 7 – Local Development

```bash
npm run dev
```

Test each endpoint:

```bash
# Contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Hello","message":"This is a test message from the contact form."}'

# Newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"subscriber@example.com","source":"homepage"}'

# Waitlist
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"earlybird@example.com","name":"Early Bird","source_page":"/features"}'

# Analytics
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event_name":"page_view","platform":"web","locale":"en-BD"}'

# Download CTA
curl -X POST http://localhost:3000/api/download-cta \
  -H "Content-Type: application/json" \
  -d '{"platform":"android","locale":"bn","source_page":"/"}'

# Business inquiry
curl -X POST http://localhost:3000/api/business-inquiry \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Acme Corp","contact_name":"Jane Doe","email":"jane@acme.com","inquiry_type":"partnership","message":"We would like to discuss a strategic partnership for our railway operations."}'
```

---

## API Reference

### POST /api/contact
| Field | Type | Rules |
|-------|------|-------|
| name | string | 2–100 chars |
| email | string | valid email |
| subject | string | 5–200 chars |
| message | string | 20–5000 chars |

Rate limit: 5 requests / 10 minutes per IP.

### POST /api/newsletter
| Field | Type | Rules |
|-------|------|-------|
| email | string | valid email |
| source | string? | max 100 chars |

### POST /api/waitlist
| Field | Type | Rules |
|-------|------|-------|
| email | string | valid email |
| name | string | 2–100 chars |
| source_page | string? | max 200 chars |
| metadata | object? | arbitrary JSON |

### POST /api/analytics
Single event or batch (`{ events: [...] }`, max 50):
| Field | Type | Rules |
|-------|------|-------|
| event_name | string | lowercase snake_case |
| session_id | uuid? | — |
| user_id | uuid? | — |
| properties | object? | arbitrary JSON |
| locale | string? | max 20 chars |
| platform | enum? | web\|ios\|android\|unknown |

### POST /api/download-cta
| Field | Type | Rules |
|-------|------|-------|
| platform | enum | ios\|android\|unknown |
| locale | string? | max 20 chars |
| source_page | string? | max 200 chars |

### POST /api/business-inquiry
| Field | Type | Rules |
|-------|------|-------|
| company_name | string | 2–200 chars |
| contact_name | string | 2–100 chars |
| email | string | valid email |
| phone | string? | 7–20 digit pattern |
| inquiry_type | enum | partnership\|enterprise\|api_access\|advertising\|other |
| message | string | 20–5000 chars |

### POST /api/auth/send-otp
| Field | Type | Rules |
|-------|------|-------|
| email | string | valid email |

Sends a 6-digit code by email. Rate limited 3 req / 10 min per IP.

### POST /api/auth/verify-otp
| Field | Type | Rules |
|-------|------|-------|
| email | string | valid email |
| token | string | exactly 6 digits |

Completes sign-in and sets the session cookie. Rate limited 5 attempts / 10 min
per email (brute-force guard on the 6-digit code).

### GET /api/auth/callback
Google OAuth redirect only — email sign-in does not use this route. Query params: `code`, `next`, `error`.

### POST /api/auth/signout
Clears session. No body required.

### POST /api/upload/avatar
Multipart form: `file` (JPEG/PNG/WebP/GIF, max 5 MB). **Requires authentication.**

### POST /api/upload/community-photo
Multipart form: `file` (JPEG/PNG/WebP/GIF, max 10 MB). **Requires authentication.**

---

## Security Checklist

- [x] All inputs validated with Zod before DB write
- [x] Rate limiting on every public endpoint
- [x] `SUPABASE_SERVICE_ROLE_KEY` never exposed to client
- [x] RLS enabled on all tables
- [x] Service role bypasses RLS only on server-side admin client
- [x] Security headers on all responses (CSP, HSTS, X-Frame-Options)
- [x] Open-redirect prevention on `/api/auth/callback`
- [x] OTP verification rate-limited per email (brute-force guard on the 6-digit code)
- [x] File type and size validation before upload
- [x] Structured, non-leaking error responses in production

---

## Monitoring

- **Supabase Dashboard** – table row counts, query performance
- **PostHog** – event funnels, user flows, download CTA conversion
- **Resend Dashboard** – email delivery rates, bounces
- **Vercel Analytics** – API route latency, error rates
