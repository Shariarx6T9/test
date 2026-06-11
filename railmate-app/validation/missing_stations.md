# Validation Report — Missing Stations

**Generated:** 2026-06-10  
**Status:** Action required before production launch

---

## Summary

| Issue | Count | Priority |
|-------|-------|----------|
| Stations referenced in trains.json but not in stations.json | 2 | 🔴 High |
| Stations in BR network not in stations.json | ~388 | 🟡 Medium (non-intercity) |
| Stations with missing lat/lng | 0 | ✅ None |
| Stations with unverified codes | ~15 | 🟡 Medium |

---

## 🔴 Critical: Stations Referenced But Not Defined

These shohoz_city values appear as train origins/destinations in trains.json but have NO matching entry in stations.json. This will cause a **foreign key constraint failure** in Supabase on import.

### DHALARCHAR
- **Referenced by trains:** 779 (Dhalarchar Express down), 780 (Dhalarchar Express up)
- **Note:** Dhalarchar is in Rajshahi Division. Small station on the Rajshahi–Chapai line.
- **Action:** Add station entry to stations.json before running seed.sql
- **Wikipedia search:** https://en.wikipedia.org/wiki/Dhalarchar_railway_station
- **Approximate coords:** 24.47°N, 88.37°E (verify with Nominatim)

### MOHONGANJ
- **Referenced by trains:** 777 (Hawr Express down), 778 (Hawr Express up), 789 (Mohonganj Express down), 790 (Mohonganj Express up)
- **Note:** Mohonganj is in Netrokona District, Mymensingh Division. Meter gauge line.
- **Action:** Add station entry to stations.json before running seed.sql
- **Wikipedia search:** https://en.wikipedia.org/wiki/Mohanganj_railway_station
- **Approximate coords:** 24.69°N, 90.99°E (verify with Nominatim)

**Fix template:**
```json
{
  "id": 53,
  "name_en": "Dhalarchar",
  "name_bn": "ধলারচর",
  "code": "DLC",
  "shohoz_city": "DHALARCHAR",
  "zone": "West",
  "division": "Rajshahi",
  "gauge": "broad",
  "lat": 24.47,
  "lng": 88.37,
  "is_intercity_hub": false,
  "type": "C"
},
{
  "id": 54,
  "name_en": "Mohonganj",
  "name_bn": "মোহনগঞ্জ",
  "code": "MHJ",
  "shohoz_city": "MOHONGANJ",
  "zone": "East",
  "division": "Mymensingh",
  "gauge": "meter",
  "lat": 24.69,
  "lng": 90.99,
  "is_intercity_hub": false,
  "type": "C"
}
```

---

## 🟡 Medium: BR Network Stations Not Included

stations.json covers 52 of 440 total Bangladesh Railway stations (11.8%). The remaining ~388 are local/halt stations not served by intercity Shohoz-bookable trains.

**These are intentionally excluded** for the following reasons:
- They cannot be booked via the Shohoz API
- They do not appear in search-trips-v2 results
- They are not relevant to the RailMate intercity use case

**If you want to add them later** (e.g. for a full network map):
1. Source: amartrain.com/railway-stations-bangladesh/ (lists all divisions)
2. Source: railway.gov.bd official station list
3. Use Nominatim to geocode each station (1 req/sec limit)
4. Add `"is_intercity_hub": false` and `"type": "D"` for halt stations

---

## 🟡 Medium: Station Codes with Low Confidence

These station codes were sourced from Wikipedia articles that may not have had a dedicated "station code" field and were inferred from context.

| Station | Code Used | Confidence | How to Verify |
|---------|-----------|------------|---------------|
| Cox's Bazar | CXBZ | Medium | New station (2023) — check Shohoz API response |
| Burimari | BMR | Medium | Border station — check Shohoz API |
| Gazipur | GZP | Medium | May not be a Shohoz bookable city |
| Gaibandha | GBD | Medium | Check Shohoz search-trips-v2 |
| Ullapara | ULP | Medium | Small junction — verify code |
| Faridpur | FRP | Medium | New Padma Bridge station — verify code |

**Verification method:**
```
POST /v1.0/web/train-routes
{ "model": "TRAIN_MODEL", "departure_date_time": "YYYY-MM-DD" }
→ Station names in response must match shohoz_city values exactly
```
