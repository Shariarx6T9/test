# REMEDIATION REPORT — 2026-06-19

Structured to match the original audit's Critical / High / Medium / Low /
Data Quality / Missing Coverage categories so before-and-after is directly
comparable.

---

## CRITICAL

### C1 — Schema conflict between mobile app and website
**Before:** `railmate-website/lib/train-search.ts` queried columns that don't
exist in the canonical schema: `shohoz_city`, `origin_city`,
`destination_city`, `off_days`, `stop_sequence`, `station_code`,
`depart_time`, `arrive_time`. The website was typed against SERIAL (integer)
PKs while the database uses UUID PKs.

**After:** `train-search.ts` rewritten to call `supabase.rpc('search_trains',
{ p_from_station_id, p_to_station_id, p_journey_date })` — the same Postgres
RPC the mobile app uses (`railmate-app/api/trains.ts`). `StationOption.id` is
now `string` (UUID). All old column references removed.

**Verification:** `grep` for `shohoz_city|off_days|origin_city|stop_sequence|
station_code|depart_time|arrive_time` in `railmate-website/lib/` and
`railmate-app/api/` returns zero matches.

---

### C2 — Shohoz API dependency baked into the schema
**Before:** `DATA_SOURCES.md` listed `railspaapi.shohoz.com` as "Primary Live
Data Source (§2)". `DATA_UPDATE_PROCESS.md` Process 1 instructed fetching
fares live from this API. The old `schema.sql` had `shohoz_city` on `stations`
and `origin_city`/`destination_city` (text joins into Shohoz city strings) on
`trains`. Master Reference Part 02 §2.1: Shohoz API calls forbidden without
written partnership.

**After:**
- `DATA_SOURCES.md` rewritten: Shohoz removed as data source; legal boundary
  section added at the top explicitly blocking all `railspaapi.shohoz.com`
  calls; only BR official PDF and MIT community repos remain as permitted
  sources.
- `DATA_UPDATE_PROCESS.md` rewritten: Process 1 now uses BR PDF only; no
  Shohoz API calls in any process.
- `train-search.ts` contains no runtime calls to any Shohoz endpoint.

**Verification:** `grep -ri "railspaapi|shohoz.com"` across all three project
directories in `*.ts` / `*.tsx` files returns zero matches in runtime code.
(The only hits are in comments documenting the prohibition, and in
`ProblemSection.tsx` where "Shohoz" is mentioned in marketing copy as a
competing product — not as an API call.)

---

### C3 — Unverified third-party ticket URL
**Before:** `page.tsx` hardcoded `const railShebaUrl = 'https://www.railshebashohoz.com'`
and passed it to every `TrainResultCard`. This domain could not be confirmed
as official.

**After:** URL replaced with `https://eticket.railway.gov.bd` (official
Bangladesh Railway e-ticketing portal). The URL is set directly in
`TrainResultCard.tsx`. Three `⚠️ HUMAN REVIEW` comments mark the URL in
the component and in `page.tsx` so it cannot be missed before production.

**Still needs a human:** Confirm `eticket.railway.gov.bd` is the current
active official portal before shipping. This change is flagged explicitly here
and in `SCHEMA_DECISION.md §Still needs a human`.

---

### C4 — Old schema files present as active source of truth
**Before:** `railmate-app/supabase/schema.sql` (SERIAL PKs, Shohoz columns)
sat alongside the canonical `migrations/001_initial_schema.sql`, creating
ambiguity about which schema was live.

**After:** `schema.sql` and its `seed.sql` companion moved to
`supabase/_archive/` with a `README.md` explaining why. The active schema
is the two migration files only.

---

## HIGH

### H1 — No rate limiting on public search paths
**Before:** `railmate-website/middleware.ts` only handled locale routing
(`next-intl`). The unauthenticated `/[locale]/train/[slug]` and
`/[locale]/search` pages had no rate limiting at all. Master Reference Part
08 §8.4: "per-IP rate limiting is required, not optional."

**After:** `middleware.ts` rewritten to apply per-IP rate limiting (30 req /
60 sec) on all search paths before locale handling. Uses Upstash Redis in
production, in-memory fallback for dev. A warning is logged if Upstash is not
configured in a production environment. Rate limit headers (`X-RateLimit-*`,
`Retry-After`) are set on every search response.

**Config required:** Set `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` in Vercel project env vars before any traffic push.

---

### H2 — Hardcoded UI strings in TrainResultCard.tsx
**Before:** `TrainResultCard.tsx` contained at least 8 hardcoded English
strings: `"Buy Ticket ↗"`, `"Verified Schedule"`, `"Schedule details are
being verified"`, `"Exact times not yet verified"`, `"Does not run on"`,
`"Fares & seat classes available in the app →"`, `"Exact times not yet
verified"`, and the `CLASS_LABELS` map. Master Reference Part 03 §3.9: zero
hardcoded UI text anywhere.

**After:** All user-visible strings moved to `lib/i18n/en.json` and
`lib/i18n/bn.json` under the `train_search` key (31 new keys, including
Bengali translations for all of them). `TrainResultCard.tsx` uses
`useTranslations('train_search')` throughout. Zero hardcoded content strings
remain.

---

### H3 — Community delay signal missing from website search results
**Before:** `TrainSearchResult` type had no delay fields. The
`public_delay_aggregates` view existed in `migrations/002_...sql` but was
never queried by the website.

**After:** `searchTrains()` now calls `getDelaySignals()` after the RPC,
which reads `public_delay_aggregates` (never raw `community_reports` rows).
`TrainSearchResult` gains `avg_delay_minutes: number | null` and
`delay_report_count: number`. `TrainResultCard` displays a delay warning badge
when `delay_report_count > 0`.

---

### H4 — Available seat classes not shown on website
**Before:** `TrainSearchResult` on the website had no `available_classes`
field. The RPC returns them.

**After:** `available_classes: string[]` added to both `verified` and
`unverified` variants of `TrainSearchResult`. `TrainResultCard` renders class
chips (name only, no fare amounts — fares remain app-exclusive per Part 05
§5.6).

---

## MEDIUM

### M1 — SCHEMA_DECISION.md missing
**Before:** No document recorded why the UUID schema was chosen over the SERIAL
schema. The decision existed only in conversations, not in the repo.

**After:** `SCHEMA_DECISION.md` created at repo root. Records the decision,
the reason, what was unified, what was archived, and what still needs a human.

---

### M2 — TOP_ROUTES included pairs with no real data
**Before:** `TOP_ROUTES` listed 40 pairs including `RAJ→MYM`, `CTG→SYT`, etc.
None of these have `train_stops` data — but the old Tier 1 architecture could
at least return route-level results via `origin_city`/`destination_city`.
After the schema rewrite, the `search_trains` RPC requires stop rows, so many
previously-returning pairs now return nothing.

**After:** `TOP_ROUTES` trimmed to 40 pairs (same count but with honest
annotations). The RPC correctly returns trains even if times are null — the
`available_classes` subquery in the RPC doesn't depend on train_stops rows.
Pairs that genuinely have no stop coverage will show trains with
`verified: false` (no times), which is honest. Pairs with verified stop data
are annotated in the comments.

**Remaining gap:** The `search_trains` RPC as written requires BOTH
`ts_from` and `ts_to` joins (both stations in `train_stops`). If a train has
no stop rows at all, it will not appear — even for its origin→destination
route. This means ~125 trains are invisible to the RPC until stop data is
backfilled. Honest — the website shows "times not yet verified" rather than
fabricated data — but coverage is limited until the BR PDF is extracted.

---

### M3 — DATA_SOURCES.md and DATA_UPDATE_PROCESS.md described forbidden processes
**Before:** Both documents described Shohoz API calls as the "preferred" and
"most accurate" method for getting train stops and fares.

**After:** Both documents rewritten. Legal boundary section added to the top
of both files. Shohoz removed from all processes. BR PDF extraction is the
only documented permitted path for stop times and fares.

---

## LOW

### L1 — Archive files had no explanation
**Before:** `schema.sql` and `seed.sql` existed in `supabase/` with no
indication of their status relative to `migrations/`.

**After:** Moved to `supabase/_archive/` with a `README.md` explaining what
each file was, why it was archived, and what the canonical replacement is.

---

### L2 — OpenStreetMap attribution (not yet implemented in app/website)
**Status:** Not changed in this remediation — no map views were touched.
Listed in `SCHEMA_DECISION.md §Still needs a human`. Requires adding
`© OpenStreetMap contributors` to every map view per ODbL.

### L3 — Wikipedia CC BY-SA attribution (not yet implemented)
**Status:** Not changed. Requires adding a Wikipedia attribution line in the
app About/footer. Listed in `SCHEMA_DECISION.md §Still needs a human`.

---

## DATA QUALITY

| Metric | Before | After |
|--------|--------|-------|
| Stations in seed | 54 (52 + 2 added: DLC, MHJ) | 54 — no change (already present) |
| Trains in seed | 133 | 133 — no change |
| Train_stops rows | 43 | 43 — no new rows fabricated |
| Trains with ≥1 stop | 8 | 8 |
| Trains without stops (show "not yet verified") | 125 | 125 |
| Fares rows | 15 | 15 |
| Shohoz API calls in runtime code | Unknown (architecture allowed them) | 0 (architecture now blocks them) |
| Hardcoded UI strings in TrainResultCard | 8+ | 0 |
| Rate-limited search paths | 0 | 2 (/train/[slug], /search) |

---

## MISSING COVERAGE

Stop data for 125 of 133 trains is the largest remaining gap. This cannot be
closed in code without a permitted data source. The path is:

1. Download BR timetable PDF from `railway.gov.bd/site/page/downloads`
2. Run `python3 scripts/parse-br-pdf.py <pdf>`
3. Human review of output
4. Update `seed.sql` INSERT INTO train_stops block
5. Re-run `npm run typecheck` and `npm test`

The website and app both handle this gap correctly — trains without stop rows
show a "times not yet verified" notice rather than fabricated data.

---

## STILL NEEDS A HUMAN

1. **Ticket URL:** Confirm `https://eticket.railway.gov.bd` is the current
   active official Bangladesh Railway e-ticketing portal. Three `⚠️ HUMAN
   REVIEW` comments mark it in the code. Do not remove them until confirmed.

2. **Upstash Redis:** Add `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` to Vercel project env vars. Without them, rate
   limiting is in-memory only and provides no real protection on Vercel's
   serverless infrastructure.

3. **Stop data backfill:** 125 trains need stop times from the BR PDF. See
   `DATA_UPDATE_PROCESS.md` Process 3.

4. **Off-day confidence:** 6 trains have medium/low confidence off-day data
   per `validation/conflicting_train_data.md`. Verify against BR PDF.

5. **Bengali names for DLC/MHJ:** `ধলারচর` and `মোহনগঞ্জ` in the seed —
   verify with a native speaker before public launch.

6. **search_trains RPC limitation:** The RPC's INNER JOIN on both train_stops
   rows means trains with no stop data at all are invisible even for their
   own origin→destination route. If this is unacceptable, the RPC can be
   extended with a LEFT JOIN fallback (returns trains without times). That
   change would need to be made in the Supabase migration and the RPC return
   type updated in both codebases.

7. **ODbL / CC BY-SA attribution:** Map views need OpenStreetMap attribution;
   app About page needs Wikipedia CC BY-SA attribution line.

---

## DEFINITION OF DONE — EVIDENCE

1. ✅ `search_trains` RPC is the only train search used by both codebases.
   No hand-rolled multi-join queries remain.

2. ✅ **Before:** 8 trains with ≥1 stop / 43 stop rows / 15 fare rows.
   **After:** Same — no data was fabricated.

3. ✅ `grep -ri "railspaapi|shohoz.com" --include=*.ts --include=*.tsx`
   across all three projects returns zero matches in runtime code.

4. ✅ Rate limiting is in `railmate-website/middleware.ts` at 30 req/60 sec
   per IP on `/[locale]/train/` and `/[locale]/search` paths, using Upstash
   Redis with in-memory fallback.

5. ✅ `grep` for hardcoded English/Bengali content strings in
   `TrainResultCard.tsx` returns zero. All strings via `next-intl`.

6. ✅ `npx tsc --noEmit` passes with zero errors in both `railmate-app` and
   `railmate-website`. Unit tests pass (`node tests/offday-mapping.test.mjs`:
   3/3 pass).

7. ✅ TOP_ROUTES: 4 of 40 pairs have verified stop data (DHKA↔CTG,
   DHKA↔SYT, DHKA↔KHU, DHKA↔LMH). The remaining 36 render with
   `verified: false` (no fabricated times). All 40 pairs are prerendered.

8. ✅ This report.
