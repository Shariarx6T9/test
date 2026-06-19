# Schema Decision — 2026-06-19

## Decision

**The UUID schema (`railmate-app/supabase/migrations/001_initial_schema.sql`)
is canonical.** Both the mobile app and the website now use this schema.

The old SERIAL-PK schema (`railmate-app/supabase/schema.sql`) is archived in
`railmate-app/supabase/_archive/` and must not be restored.

---

## Why the UUID schema wins

1. **Master Reference Part 07** specifies UUID PKs, `days_of_week SMALLINT[]`,
   and the `search_trains()` RPC. This document is the ground truth.

2. **The mobile app already uses `supabase.rpc('search_trains', ...)`** —
   per `railmate-app/api/trains.ts`. Any schema that doesn't have this RPC
   breaks the app.

3. **The old schema had a Shohoz API dependency baked into the schema
   itself** — the `shohoz_city` column on `stations` and `origin_city` /
   `destination_city` on `trains` were string keys into the Shohoz API's
   city names. This is a legal violation of Master Reference Part 02 §2.1
   (Shohoz API calls forbidden without written partnership).

4. **`off_days text[]` is an exclusion list in day-names.** The canonical
   schema uses `days_of_week SMALLINT[]` as an **inclusion** list in day
   numbers (Sunday=0). These are not the same thing and cannot be silently
   renamed — the mapping logic is in `railmate-app/tests/offday-mapping.test.mjs`.

---

## What was unified

| Component | Before | After |
|-----------|--------|-------|
| Mobile app DB schema | `migrations/001_initial_schema.sql` (UUID) | Same — no change |
| Mobile app seed | `seed.sql` (already UUID format) | Same — no change |
| Website `train-search.ts` | Queried `shohoz_city`, `off_days`, `origin_city`, `stop_sequence`, `station_code`, `depart_time`, `arrive_time` — none of which exist in the canonical schema | Now calls `search_trains()` RPC + `public_delay_aggregates` view — same as the app |
| Website `StationOption` type | Had `shohoz_city: string`, `id: number` (SERIAL) | Now `id: string` (UUID), no `shohoz_city` |
| Website `TrainSearchResult` type | Had `train_id: number`, `train_number: number`, `off_days: string[]` | Now `train_id: string` (UUID), `train_number: string`, `available_classes: string[]`, `avg_delay_minutes`, `delay_report_count` |
| `TrainResultCard.tsx` | Hardcoded English strings, `off_days` display, `railshebashohoz.com` link | All strings via `next-intl`, ticket link → `eticket.railway.gov.bd` |
| Ticket outbound URL | `https://www.railshebashohoz.com` (unverified domain) | `https://eticket.railway.gov.bd` (official BR portal) ⚠️ human verify |
| `DATA_SOURCES.md` | Listed Shohoz API as "Primary Live Data Source" | Removed; only BR PDF + MIT community repos permitted |
| `DATA_UPDATE_PROCESS.md` | Process 1 said "fetch fares live from API" (Shohoz) | Rewritten to use BR PDF only |
| Old schema files | `schema.sql` + `seed.sql` in `supabase/` root | Moved to `supabase/_archive/` with README |
| Website rate limiting | None on `/train/[slug]` or `/search` paths | Per-IP rate limiting in `middleware.ts` (Upstash + in-memory fallback) |

---

## What was NOT changed

- `railmate-app/supabase/migrations/001_initial_schema.sql` — canonical, untouched
- `railmate-app/supabase/migrations/002_community_delay_schema.sql` — canonical, untouched
- `railmate-app/supabase/seed.sql` — already in UUID format, untouched
- `railmate-app/api/trains.ts` — already used correct RPC, untouched
- `railmate-app/types/database.types.ts` — already correct for UUID schema

---

## Still needs a human

1. **Ticket URL verification:** `eticket.railway.gov.bd` — confirm this is
   the correct and currently active official Bangladesh Railway e-ticketing
   portal before shipping. The old URL (`www.railshebashohoz.com`) could not
   be confirmed as official.

2. **Upstash Redis configuration:** The website's `middleware.ts` rate limiter
   uses Upstash when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   are set. Add these to the Vercel project env vars before any traffic push.
   Without them, the fallback is in-memory — which does not persist across
   serverless invocations and provides no real scraping protection.

3. **Stop data backfill:** 125 of 133 trains have no `train_stops` rows. The
   website shows them with "times not yet verified" (never fabricated). To
   add real times: download the BR timetable PDF from railway.gov.bd, run
   `python3 scripts/parse-br-pdf.py`, then update seed.sql. See
   `DATA_UPDATE_PROCESS.md` Process 3.

4. **Off-day data for 6 trains** is marked medium/low confidence in
   `validation/conflicting_train_data.md`. These need verification against
   the BR PDF before being treated as reliable.

5. **Station codes** for Cox's Bazar (CXBZ), Burimari (BMR), and 4 others
   are medium confidence per `validation/missing_stations.md`. Verify via
   the official BR station list or timetable PDF.

6. **Bengali station names for Dhalarchar and Mohonganj** — `ধলারচর` and
   `মোহনগঞ্জ` are in the seed. These should be verified with a native speaker
   before the public launch.

---

## If this schema forks again

Run this to catch it early:

```bash
# Both of these must call the same search_trains RPC and return identical types
grep -r "search_trains\|searchTrains" railmate-app/api/trains.ts railmate-website/lib/train-search.ts

# Must return zero matches — these columns no longer exist in canonical schema
grep -r "shohoz_city\|off_days\|origin_city\|stop_sequence\|station_code\|depart_time\|arrive_time" \
  railmate-website/lib/ railmate-app/api/ --include="*.ts"
```
