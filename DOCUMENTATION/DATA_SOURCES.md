# RailMate Bangladesh — Data Sources

**Last Updated:** 2026-06-10  
**Project:** RailMate Bangladesh Railway Companion Platform

---

## 1. Official Government Sources

### 1.1 Bangladesh Railway Official Website
- **URL:** https://railway.gov.bd
- **Used for:** Timetable PDFs, official train list, route information
- **Status:** Accessible. Downloads section at `/site/page/downloads`
- **License:** Government of Bangladesh public information
- **Reliability:** High — primary authoritative source
- **Limitation:** PDFs not machine-readable; requires Tabula extraction

### 1.2 Bangladesh Railway E-Ticket Portal
- **URL:** https://eticket.railway.gov.bd
- **Used for:** Reference only (not scraped). Confirms available stations and trains
- **Status:** Accessible
- **⚠️ Legal Warning:** Do NOT scrape this portal. It is the official booking system. Screen-scraping may violate terms of service and the Bangladesh ICT Act 2006.

### 1.3 Official BR Timetable PDF
- **URL:** https://railway.gov.bd/site/page/downloads
- **Used for:** train_stops.json (MANUAL WORK REQUIRED — not yet extracted)
- **Status:** PDF available for download
- **License:** Government publication — public domain for informational use
- **Action required:** Download PDF → extract with Tabula → populate train_stops.json

---

## 2. Shohoz / Bangladesh Railway API (Primary Live Data Source)

### 2.1 Search Trips Endpoint
- **URL:** `GET https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2`
- **Params:** `from_city`, `to_city`, `date_of_journey`, `seat_class`
- **Returns:** Available trains, fares, seat availability, trip IDs
- **Status:** Working (confirmed by multiple community projects, June 2025)
- **Auth required:** No auth for basic search. Account required for seat layout.
- **⚠️ Legal Status:** FLAGGED — No public ToS URL found (shohoz.com/terms returns 404). See LEGAL_COMPLIANCE.md. Use with caution for commercial apps.

### 2.2 Train Routes Endpoint
- **URL:** `POST https://railspaapi.shohoz.com/v1.0/web/train-routes`
- **Body:** `{ "model": "TRAIN_MODEL_STRING", "departure_date_time": "YYYY-MM-DD" }`
- **Returns:** Complete station stop list with times for a specific train
- **Status:** Working (confirmed in matrixCalculator.py)

### 2.3 Seat Layout Endpoint
- **URL:** `GET https://railspaapi.shohoz.com/v1.0/web/bookings/seat-layout`
- **Returns:** Coach layout, seat numbers, availability per seat
- **Auth required:** Bearer token (requires BR account login)
- **⚠️ Note:** Token obtained via POST /v1.0/app/auth/sign-in with mobile + password

### 2.4 Cities Endpoint (CURRENTLY DOWN)
- **URL:** `GET https://railspaapi.shohoz.com/v1.0/web/bookings/cities`
- **Status:** ❌ Returned 404 as of 2026-06-10
- **Action:** Use the station list in stations.json (manually compiled) instead

### 2.5 Authentication Endpoint
- **URL:** `POST https://railspaapi.shohoz.com/v1.0/app/auth/sign-in`
- **Body:** `{ "mobile_number": "", "password": "" }`
- **⚠️ Warning:** Do NOT embed user credentials in your app code. If using this endpoint, require users to log in with their own BR account.

---

## 3. Community GitHub Repositories

### 3.1 nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application
- **URL:** https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application
- **Files used:** `trains_en.json` (120+ train names and numbers)
- **License:** MIT
- **Confidence:** High — trains cross-verified with Shohoz API responses
- **Stars:** 64 (as of June 2025)

### 3.2 shakiliitju/Bangladesh-Railway
- **URL:** https://github.com/shakiliitju/Bangladesh-Railway
- **Files used:** `trains_en.json`, README API documentation, fare matrix structure
- **License:** MIT (forked from mehdiakram/Bangladesh-Railway-Train-Seat-Matrix-Web-Application)
- **Confidence:** High

### 3.3 nishatrhythm/Bangladesh-Railway-Train-and-Fare-List-with-Route-Map
- **URL:** https://github.com/nishatrhythm/Bangladesh-Railway-Train-and-Fare-List-with-Route-Map
- **Live app:** https://bdrailway.vercel.app
- **Files used:** Schedule and fare data (reference — not directly imported)
- **License:** Not explicitly stated — treat as MIT based on author's other repos
- **Confidence:** Medium — community-maintained, may lag BR schedule changes

### 3.4 AhmedTrooper/RailwayMatrixBD
- **URL:** https://github.com/AhmedTrooper/RailwayMatrixBD
- **Used for:** Seat matrix display reference, station naming conventions
- **License:** Check repo

### 3.5 mahmud-araf/bd-train-ticket-online-booking
- **URL:** https://github.com/mahmud-araf/bd-train-ticket-online-booking
- **Used for:** FastAPI backend architecture reference
- **License:** Check repo

### 3.6 wjalal/2-2_term-project_railbuddy
- **URL:** https://github.com/wjalal/2-2_term-project_railbuddy
- **Used for:** Route planning logic reference
- **License:** Academic project — check repo

---

## 4. Wikipedia

### 4.1 Bangladesh Railway (main article)
- **URL:** https://en.wikipedia.org/wiki/Bangladesh_Railway
- **Used for:** Zone information, gauge data, total network length
- **License:** CC BY-SA 4.0 — attribution required

### 4.2 Individual Train Articles
- **Trains verified:** Shonar Bangla Express, Mahanagar Godhuli/Provati, Suborno Express, Tista Express, Sundarban Express, Ekota Express, Upaban Express, plus station articles for coordinates/codes
- **License:** CC BY-SA 4.0 — attribution required
- **Confidence:** Medium — Wikipedia can be outdated for operational data

### 4.3 Individual Station Articles
- **Used for:** Station codes, coordinates, gauge type, classification
- **Stations verified:** Dhaka Cantonment (DHCA), Dhaka Airport (DABB), Banani (BNNI), Sylhet (SYT), Rajshahi (RAJ), Jessore (JS), Nimtala (NMTL)

---

## 5. Maps and Geospatial

### 5.1 OpenStreetMap
- **URL:** https://www.openstreetmap.org
- **Used for:** Map tiles, station lat/lng verification
- **License:** ODbL — attribution REQUIRED. Must display "© OpenStreetMap contributors"
- **Bangladesh Railways relation:** https://www.openstreetmap.org/relation/8800946

### 5.2 Nominatim (OSM Geocoding)
- **URL:** https://nominatim.openstreetmap.org
- **Used for:** Station lat/lng coordinates
- **License:** ODbL (attribution required)
- **Usage Policy:** https://operations.osmfoundation.org/policies/nominatim/ — max 1 req/sec, no bulk geocoding
- **⚠️ Warning:** Do NOT use Nominatim for bulk geocoding in production. Use it once to seed your database, then store coordinates locally.

### 5.3 Community Station List
- **URL:** https://amartrain.com/railway-stations-bangladesh/
- **Used for:** Division-wise station name list (440 total stations confirmed)
- **License:** Community website — informational use only

---

## 6. Source Confidence Summary

| File | Primary Source | Confidence |
|------|---------------|------------|
| stations.json | Wikipedia station articles + Shohoz API | High (major stations) / Low (rural) |
| trains.json | trains_en.json (MIT) + Wikipedia | High |
| train_stops.json | Wikipedia + community | Medium (8 trains) / Incomplete |
| fares.json | Community + API structure | Low (sample only) — fetch live |
| train_classes.json | Shohoz API + community repos | High |
