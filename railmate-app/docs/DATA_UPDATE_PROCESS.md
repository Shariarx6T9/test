# RailMate Bangladesh — Data Update Process

**Last Updated:** 2026-06-10

---

## Update Frequency by Data Type

| Data | How Often It Changes | Recommended Update Frequency |
|------|---------------------|------------------------------|
| Fares | Unpredictably (BR sets new schedules) | Daily — always fetch live from API |
| Seat availability | Real-time | Per request — never cache longer than 5 min |
| Off days | Seasonally (especially Eid) | Weekly check during Ramadan/Eid season |
| Train stops (times) | Rarely (new timetable season) | Monthly check against official PDF |
| Train list | Rarely (new trains added ~1-2/year) | Quarterly — check trains_en.json source repo |
| Station list | Very rarely (new stations opening) | Annually |
| Lat/lng coordinates | Never (stations don't move) | No update needed |

---

## Process 1: Updating Fares

**Never hardcode fares.** Fares come from the live API.

```
1. User searches a route
2. Call GET /v1.0/web/bookings/search-trips-v2 with their params
3. Return fare from API response
4. Cache response for 5 minutes (same user, same params)
5. For static fare display pages: re-fetch once per day
```

---

## Process 2: Updating Train List (trains.json)

```
1. Check https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application
   → Look at trains_en.json for new additions
2. Cross-reference with https://railway.gov.bd (check for announcements)
3. Add new trains to trains.json with confidence: "medium" until verified
4. Verify new trains via POST /v1.0/web/train-routes
5. Update pair_number, origin, destination, off_days
```

---

## Process 3: Updating Train Stops (train_stops.json)

**Preferred: API method (most accurate)**
```
1. For each train in trains.json (direction: "down" only):
   POST https://railspaapi.shohoz.com/v1.0/web/train-routes
   Body: { "model": train.model, "departure_date_time": "YYYY-MM-DD" }
2. Parse response → extract station sequence + arrival/departure times
3. Match station names to station codes in stations.json
4. Store in train_stops.json
```

**Alternative: PDF method (for offline/archival)**
```
1. Download timetable PDF from https://railway.gov.bd/site/page/downloads
2. Open in Tabula (https://tabula.technology)
3. Select timetable tables → export as CSV
4. Process CSV with a script → generate train_stops.json entries
5. Verify 5 random trains against live API
```

---

## Process 4: Adding New Stations

```
1. Check amartrain.com and official BR announcements
2. Find station Wikipedia article for code + coordinates
3. If no Wikipedia article, geocode with Nominatim:
   GET https://nominatim.openstreetmap.org/search
     ?q=STATION_NAME+Railway+Station+Bangladesh
     &format=json
   (Rate limit: 1 req/sec, include User-Agent header)
4. Add to stations.json
5. Add to stations.csv (regenerate from JSON)
6. Run schema.sql station import
```

---

## Process 5: Verifying Off Days

Off days change most during:
- **Eid-ul-Fitr season** (2 weeks before/after)
- **Eid-ul-Adha season** (2 weeks before/after)
- **New timetable announcement** (BR issues via newspaper + railway.gov.bd)

```
1. Subscribe to BR's Facebook page: facebook.com/bangladeshrailway
2. Check railway.gov.bd notices section monthly
3. During Eid months: check off_days weekly
4. Update trains.json off_days field
```

---

## Automated Seeding Script (Pseudocode)

```javascript
// seed_train_stops.js — run once to populate train_stops.json
// Respect rate limits: 1 request per 3 seconds

const trains = require('./data/trains.json').trains
  .filter(t => t.direction === 'down'); // one direction only

const stops = [];

for (const train of trains) {
  await sleep(3000); // rate limit
  
  const response = await fetch('https://railspaapi.shohoz.com/v1.0/web/train-routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: train.model,
      departure_date_time: getTomorrowDate()
    })
  });
  
  const data = await response.json();
  
  stops.push({
    train_number: train.number,
    stops: data.data.stations.map((s, i) => ({
      stop_sequence: i + 1,
      station_name: s.station_name,
      arrive: s.arrival_time,
      depart: s.departure_time
    }))
  });
  
  console.log(`✓ ${train.name} (${train.number})`);
}

fs.writeFileSync('./data/train_stops.json', JSON.stringify(stops, null, 2));
```

---

## Quality Checks After Any Update

```
□ Run JSON validator on modified files (jsonlint.com)
□ Confirm no train_number duplicates in trains.json
□ Confirm no station_code duplicates in stations.json  
□ Test 3 random API calls with updated data
□ Check that all train origins/destinations exist in stations.json
□ Update _meta.last_verified date in modified files
```
