# RailMate Bangladesh – Vercel Deployment Guide

## Prerequisites

- Vercel account linked to your GitHub repository
- All local development steps completed (see README.md)
- Domain `railmate.app` or equivalent configured in Vercel

---

## Step 1 – Add Environment Variables to Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add every variable from `.env.example` with the production values.

### Critical Variables

| Variable | Environment | Notes |
|----------|-------------|-------|
| `NEXT_PUBLIC_SITE_URL` | Production | `https://railmate.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | All | From Supabase settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | From Supabase settings |
| `SUPABASE_SERVICE_ROLE_KEY` | All | ⚠️ Never expose to browser |
| `RESEND_API_KEY` | All | From Resend dashboard |
| `EMAIL_FROM` | All | Verified Resend sender |
| `ADMIN_EMAIL` | All | Notification inbox |
| `NEXT_PUBLIC_POSTHOG_KEY` | All | PostHog project key |
| `POSTHOG_API_KEY` | All | PostHog project key |
| `UPSTASH_REDIS_REST_URL` | Production | Optional but recommended |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Optional but recommended |

### Environment Scope

For each sensitive server-side variable (e.g. `SUPABASE_SERVICE_ROLE_KEY`):
- Uncheck "Preview" if you have a separate preview Supabase project
- Always include "Production"

---

## Step 2 – Configure Vercel Project Settings

### Build Settings
```
Framework Preset : Next.js
Build Command    : npm run build
Output Directory : .next
Install Command  : npm ci
```

### Node.js Version
Set to **20.x** (LTS) under Settings → General.

---

## Step 3 – Configure Supabase for Production

### Auth Redirect URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

```
Site URL:
  https://railmate.app

Redirect URLs (add all):
  https://railmate.app/api/auth/callback
  https://railmate.app/auth/callback
```

### CORS / Allowed Origins

In **Supabase Dashboard → API Settings**:
- Add `https://railmate.app` to allowed origins

---

## Step 4 – Deploy

### Option A – Push to main branch (recommended)

```bash
git add .
git commit -m "feat: add backend layer"
git push origin main
```

Vercel automatically builds and deploys on push to `main`.

### Option B – Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

---

## Step 5 – Verify Deployment

After deployment completes, run these checks:

```bash
PROD_URL=https://railmate.app

# 1. Contact form
curl -s -o /dev/null -w "%{http_code}" -X POST "$PROD_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Vercel Test","email":"test@railmate.app","subject":"Deployment check","message":"Testing production deployment of the backend layer."}'
# Expected: 201

# 2. Newsletter
curl -s -o /dev/null -w "%{http_code}" -X POST "$PROD_URL/api/newsletter" \
  -H "Content-Type: application/json" \
  -d '{"email":"deploy-test@railmate.app"}'
# Expected: 201

# 3. Analytics
curl -s -o /dev/null -w "%{http_code}" -X POST "$PROD_URL/api/analytics" \
  -H "Content-Type: application/json" \
  -d '{"event_name":"deployment_test","platform":"web"}'
# Expected: 202

# 4. Security headers
curl -sI "$PROD_URL" | grep -E "x-frame|x-content-type|strict-transport|content-security"
# Expected: all four headers present
```

---

## Step 6 – Set Up Upstash Redis (Production Rate Limiting)

In-memory rate limiting does not persist across Vercel function instances. For production:

1. Create a Redis database at [console.upstash.com](https://console.upstash.com)
2. Select region closest to your Supabase project (e.g. `ap-southeast-1` for Bangladesh)
3. Copy **REST URL** and **REST Token**
4. Add to Vercel environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## Step 7 – Configure Vercel Cron (Optional)

Add to `vercel.json` for scheduled cleanup tasks:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

## Monitoring & Alerting

### Vercel

- Enable **Speed Insights** under Analytics
- Set up **Function Logs** alerts for 5xx errors
- Configure **Usage Alerts** for bandwidth limits

### Supabase

- Enable **Database Health** alerts in Supabase Dashboard
- Monitor **Auth** tab for failed sign-in spikes

### Resend

- Set up **Webhook** for bounce and complaint events:
  - Endpoint: `https://railmate.app/api/email/webhook` (implement if needed)
  - Events: `email.bounced`, `email.complained`

### PostHog

- Create a dashboard for:
  - Download CTA conversions by platform
  - Waitlist signups over time
  - Newsletter subscription rate

---

## Rollback

To roll back a bad deployment:

```bash
# Via Vercel CLI
vercel rollback

# Via Vercel Dashboard
# Deployments → select previous deployment → Promote to Production
```

---

## Environment Checklist Before Going Live

- [ ] All `.env.example` variables filled in Vercel
- [ ] Supabase Auth redirect URLs updated
- [ ] Resend sender domain verified (`railmate.app`)
- [ ] Database migrations applied (all 3 files)
- [ ] RLS policies confirmed in Supabase SQL Editor
- [ ] Storage buckets created (`avatars`, `community-photos`)
- [ ] Upstash Redis configured
- [ ] PostHog project active and receiving events
- [ ] Google OAuth client ID + secret in Supabase
- [ ] Production smoke tests passing (Step 5 above)
- [ ] Security headers visible in curl output
- [ ] Admin notification email confirmed working
