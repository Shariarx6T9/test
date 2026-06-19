# RailMate Bangladesh — Data Update Process

**Last Updated:** 2026-06-19 (revised — Process 1 no longer fetches from Shohoz API)

---

## Legal boundary — read first

**Never add a call to `railspaapi.shohoz.com` or any Shohoz endpoint to any
update process.** This includes one-time imports, scripts, and "temporary"
workarounds. Master Reference Part 02 §2.1 forbids it until a formal written
partnership exists. See DATA_SOURCES.md §4.

---

## Update Frequency by Data Type

| Data | How Often It Changes | Recommended Update Frequency |
|------|---------------------|------------------------------|
| Fares | Unpredictably (BR sets new schedules) | Update from official BR PDF; add `last_verified` date |
| Off days | Seasonally (especially Eid) | Weekly check during Ramadan/Eid season |
| Train stops (times) | Rarely (new timetable season) | Monthly check against official PDF |
| Train list | Rarely (new trains added ~1-2/year) | Quarterly — check community repos + BR announcements |
| Station list | Very rarely (new stations opening) | Annually |
| Lat/lng coordinates | Never (stations don't move) | No update needed |

---

## Process 1: Updating Fares

Fares are stored in the `fares` table with a `last_verified` date.
**Never fetch fares live from any third-party API without a written partnership.**

```
1. Download latest BR timetable PDF from railway.gov.bd/site/page/downloads
2. Extract fare tables using Tabula (https://tabula.technology)
3. Update rows in the fares table with new price_bdt values
4. Set last_verified = today's date on updated rows
5. The app shows "Fare data last verified: [date]" disclaimer when data
   is >6 months old (Part 09 §9.3)
```

If the Shohoz partnership (Part 02 §2.5) is ever confirmed in writing,
live fare fetching can be added. Update the Master Reference and this
document at that time.

---

## Process 2: Updating Train List

```
1. Check https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application
   → Look at trains_en.json for new additions
2. Cross-reference with railway.gov.bd (check for announcements)
3. Add new trains to the canonical seed (seed.sql) with:
   - confidence: 'medium' or 'low' until independently verified
   - days_of_week: based on BR PDF or Wikipedia — NOT Shohoz API
   - last_verified: date of verification
4. Run npm run typecheck and npm test after any seed change
```

---

## Process 3: Updating Train Stops (times)

**Only permitted source: official BR timetable PDF.**

```
1. Download timetable PDF from railway.gov.bd/site/page/downloads
2. Open in Tabula (https://tabula.technology)
3. Select timetable tables → export as CSV
4. Run: python3 scripts/parse-br-pdf.py <path-to-pdf>
   Output: data/trains_parsed.json
5. Run: npx ts-node scripts/sync-stations.ts
6. Run: npx ts-node scripts/validate-schedule.ts
7. Human review pass — verify 5+ critical trains manually
8. Update seed.sql INSERT INTO train_stops with new rows
9. Set last_verified on the parent train record
```

If a train cannot be found in a permitted source, leave its train_stops
rows empty. The website and app handle trains without stop data gracefully
(shows "times not yet verified" notice). Never invent or estimate times.

---

## Process 4: Adding New Stations

```
1. Check official BR announcements at railway.gov.bd
2. Find station Wikipedia article for code + coordinates
3. If no Wikipedia article, geocode with Nominatim:
   GET https://nominatim.openstreetmap.org/search
     ?q=STATION_NAME+Railway+Station+Bangladesh
     &format=json
   (Rate limit: 1 req/sec, include a User-Agent header)
4. Add to seed.sql INSERT INTO stations block
5. Bengali name: verify with a native speaker — do not ship raw
   machine translation
6. Run npm run typecheck
```

---

## Process 5: Updating Off Days

Off days in `trains.days_of_week` are stored as SMALLINT[] (Sunday=0 through
Saturday=6). This is an **inclusion** list — trains run on the days listed.

```
days_of_week conversion table:
  0 = Sunday
  1 = Monday
  2 = Tuesday
  3 = Wednesday
  4 = Thursday
  5 = Friday
  6 = Saturday

Example: runs Mon–Sat except Tuesday:
  days_of_week = ARRAY[1, 3, 4, 5, 6]::SMALLINT[]
```

To verify off days:
1. Check the BR timetable PDF for the affected train
2. Check the Wikipedia article for that train (if one exists)
3. Cross-reference with community repos (§2.1 in DATA_SOURCES.md)
4. Mark as `confidence: 'low'` if only one source confirms it

---

## Process 6: After Any Data Change

```
□ npm run typecheck (railmate-app and railmate-website)
□ npm test (railmate-app — runs offday-mapping.test.mjs)
□ npm run lint
□ Manually verify 1–2 affected trains via the website search
□ Update last_verified dates on changed train/fare records
□ If a new train or station was added: rerun generateStaticParams
  coverage check for TOP_ROUTES in railmate-website/lib/train-search.ts
```
