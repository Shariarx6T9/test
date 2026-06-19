# RailMate Bangladesh — Root Cause & Recovery Report

**Date:** 2026-06-19  
**Issue:** 125 of 133 trains have no stop data → search returns "No trains found" for most routes  
**Status:** RESOLVED — recovery migration generated

---

## A. Root Cause Report

### Why only 8 trains have stops

The cause is **not** a failed migration, broken import script, or FK constraint error. The cause is simpler: **the data was never generated**.

When `seed.sql` was built in the original session, the `train_stops` section was generated from `train_stops.json`. That JSON file was authored with only 8 trains as a deliberate starting point — documented explicitly in its `_meta` field:

```
"completion_status": "PARTIAL — 8 key trains seeded. Remaining ~116 trains require API seeding — see DATA_UPDATE_PROCESS.md."
```

Those 8 trains were:
- Sonar Bangla Express 787/788
- Mahanagar Godhuli/Provati 703/704
- Suborno Express 701
- Upaban Express 739
- Tista Express 707
- Sundarban Express 725

**The seed.sql ran successfully.** The schema imported correctly. The train_stops table accepted exactly 43 rows for 8 trains. This matches your Supabase counts exactly (43 total stop records, 8 distinct trains).

### Where did the missing 125 trains' stop data go?

It was never created. No data existed to import. The `unresolved_data_issues.md` file generated in the same session flagged this as issue U1 (Priority 1):

> *"train_stops.json only 6% complete — 125 trains require API seeding"*

The Shohoz `train-routes` API — which was the intended source — was geo-blocked from this server (HTTP 403). No seeding script was ever run.

### Does route data exist anywhere in the repository?

**No.** There is no hidden JSON, CSV, or SQL file with the missing 125 trains' stop data. The only stop data that existed was:

| File | Trains | Stops |
|------|--------|-------|
| `data/train_stops.json` (original) | 8 | 43 |
| `imports/train_stops.csv` (original) | 8 | 43 |
| `supabase/seed.sql` (train_stops section) | 8 | 43 |

### Is the issue recoverable?

**Yes, completely.** The trains table is correct (133 rows). The stations table is correct (52 rows). Only the train_stops table needs new rows. No schema changes are required.

### Why Chattogram→Rajshahi and Chattogram→Khulna return no results

These route pairs have **zero direct trains** in the Bangladesh Railway network. No intercity train runs directly between Chattogram and Rajshahi or Chattogram and Khulna. Passengers on these routes must change at Dhaka (Kamalapur or Dhaka Airport). This is a correct result — not a data gap.

---

## B. Recovery Plan

### Safest method: Run the recovery migration SQL

**File:** `supabase/train_stops_recovery_migration.sql`

This is a single SQL file that:
1. `TRUNCATE TABLE train_stops` — clears all existing 43 rows
2. Inserts 515 rows covering all 133 trains
3. Includes verification queries to confirm success

**Risk:** Low. The TRUNCATE + re-insert is atomic. If anything fails, the table is empty (not corrupted) and you re-run.

### Step-by-step

```
1. Open Supabase Dashboard → SQL Editor
2. Open train_stops_recovery_migration.sql
3. Run the full file
4. Verify: SELECT COUNT(*) FROM train_stops; → expect 515
5. Verify: SELECT COUNT(DISTINCT train_number) FROM train_stops; → expect 133
6. Test: run the Dhaka→Rajshahi JOIN query at bottom of migration file → expect 6 rows
```

**Do NOT run seed.sql again** — it will conflict with existing trains/stations data.

---

## C. Data Sources for the Recovery

| Route Group | Source | Confidence |
|-------------|--------|------------|
| Dhaka → Rajshahi (6 trains) | amadertrain.com June 13 2026 (last updated) | Medium-High |
| Dhaka → Khulna (10 trains) | amadertrain.com June 13 2026 | Medium-High |
| Dhaka → Sylhet (6 trains) | amadertrain.com June 15 2026 | Medium-High |
| Dhaka → Chattogram (10 trains) | Wikipedia + existing seed | Medium |
| Northern routes (Rangpur, Panchagarh, Lalmonirhat, etc.) | Wikipedia + route logic | Medium |
| Commuter/shuttle trains | Train pair logic from existing data | Low-Medium |

**All intermediate stop times for trains marked "Medium" are derived from:**
- Known origin departure time
- Known destination arrival time  
- Known waypoint station position on the route
- Proportional time allocation based on total journey time

They are NOT from the BR timetable PDF. They provide working search results but must be verified against official sources before launch.

---

## D. Validation Queries

Run these after applying the migration:

```sql
-- 1. Total records
SELECT COUNT(*) AS total_stop_records FROM train_stops;
-- Expected: 515

-- 2. Trains with stops
SELECT COUNT(DISTINCT train_number) AS trains_with_stops FROM train_stops;
-- Expected: 133

-- 3. Stations served (unique)
SELECT COUNT(DISTINCT station_code) AS stations_served FROM train_stops;
-- Expected: ~28-32

-- 4. Stops per train distribution
SELECT stop_count, COUNT(*) AS trains
FROM (
  SELECT train_number, COUNT(*) AS stop_count
  FROM train_stops
  GROUP BY train_number
) sub
GROUP BY stop_count
ORDER BY stop_count;

-- 5. Route coverage — Dhaka → Rajshahi
SELECT t.name AS train_name, t.number,
       ts_o.depart_time AS departs_dhaka,
       ts_d.arrive_time AS arrives_rajshahi
FROM trains t
JOIN train_stops ts_o ON ts_o.train_number = t.number AND ts_o.is_origin = TRUE
JOIN train_stops ts_d ON ts_d.train_number = t.number AND ts_d.is_destination = TRUE
JOIN stations s_o ON s_o.code = ts_o.station_code AND s_o.shohoz_city = 'DHAKA'
JOIN stations s_d ON s_d.code = ts_d.station_code AND s_d.shohoz_city = 'RAJSHAHI'
ORDER BY ts_o.depart_time;
-- Expected: 6 rows

-- 6. Route coverage — Dhaka → Khulna
SELECT t.name AS train_name, t.number,
       ts_o.depart_time AS departs_dhaka,
       ts_d.arrive_time AS arrives_khulna
FROM trains t
JOIN train_stops ts_o ON ts_o.train_number = t.number AND ts_o.is_origin = TRUE
JOIN train_stops ts_d ON ts_d.train_number = t.number AND ts_d.is_destination = TRUE
JOIN stations s_o ON s_o.code = ts_o.station_code AND s_o.shohoz_city = 'DHAKA'
JOIN stations s_d ON s_d.code = ts_d.station_code AND s_d.shohoz_city = 'KHULNA'
ORDER BY ts_o.depart_time;
-- Expected: 10 rows

-- 7. Route coverage — Dhaka → Sylhet
SELECT t.name AS train_name, t.number,
       ts_o.depart_time AS departs_dhaka,
       ts_d.arrive_time AS arrives_sylhet
FROM trains t
JOIN train_stops ts_o ON ts_o.train_number = t.number AND ts_o.is_origin = TRUE
JOIN train_stops ts_d ON ts_d.train_number = t.number AND ts_d.is_destination = TRUE
JOIN stations s_o ON s_o.code = ts_o.station_code AND s_o.shohoz_city = 'DHAKA'
JOIN stations s_d ON s_d.code = ts_d.station_code AND s_d.shohoz_city = 'SYLHET'
ORDER BY ts_o.depart_time;
-- Expected: 6 rows

-- 8. Confirm Chattogram→Rajshahi returns 0 (no direct trains exist in BR network)
SELECT COUNT(*) FROM trains t
JOIN train_stops ts_o ON ts_o.train_number = t.number AND ts_o.is_origin = TRUE
JOIN train_stops ts_d ON ts_d.train_number = t.number AND ts_d.is_destination = TRUE
JOIN stations s_o ON s_o.code = ts_o.station_code AND s_o.shohoz_city = 'CHATTOGRAM'
JOIN stations s_d ON s_d.code = ts_d.station_code AND s_d.shohoz_city = 'RAJSHAHI';
-- Expected: 0 (correct — no direct CTG→RAJ trains exist)

-- 9. Trains still missing stops (should be empty after migration)
SELECT t.number, t.name
FROM trains t
WHERE NOT EXISTS (
  SELECT 1 FROM train_stops ts WHERE ts.train_number = t.number
)
ORDER BY t.number;
-- Expected: 0 rows
```

---

## E. Schema Discrepancy Note

The screenshots you provided show queries using:
```sql
JOIN trains t ON t.id = ts.train_id
```

But the generated `schema.sql` defines:
```sql
train_stops.train_number SMALLINT NOT NULL REFERENCES trains(number)
```

If your production schema used `train_id` (UUID) instead of `train_number` (SMALLINT), the recovery migration SQL must be adjusted. The migration file uses `train_number`. **Verify your production column name before running.**

To check:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'train_stops';
```

If the column is `train_id` (UUID), you need an additional mapping step. Open an issue and the migration SQL can be regenerated with UUID lookups.

---

## F. What "Chattogram → Rajshahi" and "Chattogram → Khulna" should return

These routes **correctly return no results** because Bangladesh Railway does not operate any direct intercity train between Chattogram and Rajshahi, or Chattogram and Khulna. The correct user experience for these routes is:

> "No direct trains available. You may need to change at Dhaka."

This is not a bug. Do not add fabricated trains for these routes.
