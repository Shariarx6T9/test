# RailMate Bangladesh — Data Sources

**Last Updated:** 2026-06-19 (revised — Shohoz API removed as primary source)
**Project:** RailMate Bangladesh Railway Companion Platform

---

## Legal boundary — read before changing anything

**The Shohoz/Rail Sheba API (`railspaapi.shohoz.com`) is NOT a permitted
data source for this project.** Master Reference Part 02 §2.1 lists automated
queries to this endpoint as strictly forbidden without a formal written
partnership. That partnership is still Pending (Part 02 §2.5).

Do not add any fetch/axios/http call to `railspaapi.shohoz.com` or
`eticket.railway.gov.bd` in any file in this repository — not for a one-time
import, not for caching, not for "just testing". If the Shohoz partnership
completes, update the Master Reference first, then this file.

---

## 1. Official Government Sources (Permitted)

### 1.1 Bangladesh Railway Official Website
- **URL:** https://railway.gov.bd
- **Used for:** Timetable PDFs, official train list, route information
- **Status:** Accessible. Downloads section at `/site/page/downloads`
- **License:** Government of Bangladesh public information
- **Reliability:** High — primary authoritative source
- **Limitation:** PDFs not machine-readable; requires Tabula extraction

### 1.2 Bangladesh Railway E-Ticket Portal (Reference Only)
- **URL:** https://eticket.railway.gov.bd
- **Used for:** Outbound "Buy Ticket" link only. Never scraped.
- **Status:** Accessible
- **⚠️ Legal Warning:** Do NOT scrape or automate requests to this portal.
  It is the official booking system. Screen-scraping may violate terms of
  service and the Bangladesh ICT Act 2006.

### 1.3 Official BR Timetable PDF
- **URL:** https://railway.gov.bd/site/page/downloads
- **Used for:** Populating `train_stops` (departure/arrival times per station)
- **Status:** PDF available for download
- **License:** Government publication — public domain for informational use
- **Action required:** Download PDF → extract with Tabula → run parse-br-pdf.py

---

## 2. MIT-Licensed Community Sources (Permitted)

### 2.1 nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application
- **URL:** https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application
- **Used for:** Cross-reference for train names (trains_en.json), model strings
- **License:** MIT — confirmed, free for commercial use with attribution
- **Reliability:** Medium — community-maintained, spot-check against BR PDF

### 2.2 Wikipedia Bangladesh Railway articles
- **Used for:** Station coordinates, zone assignments, off-day data
- **License:** CC BY-SA 4.0 — attribution required (see Part 22, Appendix F
  in the Master Reference for the required attribution line)
- **Reliability:** Medium — verify against BR PDF for critical trains

---

## 3. User Community Reports (Internal)

- **Source:** community_reports table in Supabase
- **Used for:** Live delay reports, crowding reports, coach condition ratings
- **Aggregation:** Exposed only via public_delay_aggregates view (Part 07 §7.4)
  — never row-level or user-identifiable data
- **Real-time via:** Supabase Realtime subscription (app) and
  public_delay_aggregates polling (website)

---

## 4. NOT Permitted (Legal Boundary)

| Source | Why Not |
|--------|---------|
| `railspaapi.shohoz.com` | Requires written partnership (Part 02 §2.1/2.5) |
| `eticket.railway.gov.bd` automated queries | Government portal, no API ToS |
| TTMS server-side queries | Explicitly forbidden (Part 02 §2.1) |
| Shohoz fare data | Requires formal written partnership |
| BR Explorer compiled database | Requires license (Part 02 §2.1) |

---

## 5. Data Confidence Levels

All train records carry a `confidence` field (high / medium / low) in source
files and a `last_verified` date in the DB. The app shows a data-age
disclaimer when schedule data is >6 months old (Part 09 §9.3).

---

## 6. Attribution Requirements

When publishing, the app and website must include:
- "Data sourced from Bangladesh Railway (railway.gov.bd)" on any page
  showing schedule or fare data
- Wikipedia CC BY-SA attribution in the app About/footer for data partially
  sourced from Wikipedia articles
- OpenStreetMap attribution (`© OpenStreetMap contributors`) on every map view
