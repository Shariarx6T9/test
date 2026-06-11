# Validation Report — Unresolved Data Issues

**Generated:** 2026-06-10  
**This is the master action list for completing the RailMate dataset.**

---

## Priority Matrix

| ID | Issue | Priority | Effort | Blocks Production? |
|----|-------|----------|--------|-------------------|
| U1 | train_stops.json only 6% complete | 🔴 P1 | High | Yes — schedule feature |
| U2 | 2 stations missing (DHALARCHAR, MOHONGANJ) | 🔴 P1 | Low | Yes — FK constraint |
| U3 | Shohoz API ToS not confirmed | 🔴 P1 | Low | Yes — legal |
| U4 | fares.json is sample data only | 🟡 P2 | Low | No — fetch live |
| U5 | Off days for new trains unverified | 🟡 P2 | Medium | No — can show "verify at eticket.railway.gov.bd" |
| U6 | 15 station codes with medium confidence | 🟡 P2 | Medium | No |
| U7 | No Bengali names for 2 stations | 🟢 P3 | Low | No |
| U8 | Wikipedia attribution not implemented in UI | 🟢 P3 | Low | No |
| U9 | Shohoz cities endpoint returning 404 | 🟡 P2 | Low | No — workaround in place |
| U10 | OSM attribution not in UI | 🔴 P1 | Low | Yes — ODbL legal requirement |

---

## U1 — train_stops.json Only 6% Complete

**Status:** 🔴 Blocking for schedule/route feature  
**Current state:** 8 of 133 trains have stop data (43 stops total)  
**Trains missing stops:** 125 trains

**Complete list of trains with NO stop data:**

Aghnibina 735/736, Banalata 791/792, Banglabandha 803/804, Barendra 731/732,
Benapole 795/796, Bijoy 785/786, Brahmaputra 743/744, Burimari 809/810,
Chandpur Eid 1, Chapainawabganj Shuttle 109/110, Chattala 801/802,
Chilahati 805/806, Chitra 763/764, Cox's Bazar 813/814, Dhumketu 769/770,
Dhalarchar 779/780, Dolonchapa 767/768, Drutojan 757/758,
Egarosindhur Godhuli 749/750, Egarosindhur Provati 737/738, Ekota 705/706,
Hawr 777/778, Jahanabad 825/826, Jamalpur 799/800, Jamuna 745/746,
Jayantika 717/718, Kalni 773/774, Kanchon Commuter 41/42, Kapotaksha 715/716,
Kishoreganj 781/782, Korotoa 713/714, Kurigram 797/798, Lalmoni 751/752,
Madhumati 755/756, Mahanagar 703/704 *(partial — has stops but not seeded)*,
Meghna 729/730, Mohanagar 721/722, Mohonganj 789/790, Nilsagar 765/766,
Padma 759/760, Paharika 719/720, Panchagarh 793/794, Parabat 709/710,
Parbatipur Eid 9/10, Parjotak 815/816, Probal 822/823, Rajshahi Commuter 57/58/77/78,
Rangpur 771/772, Ruposhi Bangla 827/828, Rupsha 727/728, Sagardari 761/762,
Shaikat 821/824, Silkcity 753/754, Simanta 747/748, Sirajganj 775/776,
Sonar Bangla 787/788 *(has stops — seeded)*, Suborno 701/702 *(seeded)*,
Tista Eid 3/4, Tista 707/708 *(seeded)*, Titumir 733/734,
Tungipara 783/784, Turna 741/742, Udayan 723/724, Upakul 711/712

**Fix:** Run the API seeding script from DATA_UPDATE_PROCESS.md.  
**Estimated time:** 2–3 hours (125 API calls at 3-second intervals = ~6 minutes of API time + data processing)

---

## U2 — Two Stations Missing from stations.json

**Status:** 🔴 Blocking — seed.sql FK constraint will fail  
**Stations:** DHALARCHAR, MOHONGANJ  
**Fix:** See missing_stations.md for exact JSON entries to add (IDs 53 and 54)  
**Time to fix:** 15 minutes

---

## U3 — Shohoz API Terms of Service Not Confirmed

**Status:** 🔴 Must resolve before public/commercial launch  
**Issue:** `shohoz.com/terms-and-conditions` returns HTTP 404.  
No explicit public API permission has been documented.

**Action:**
1. Email Shohoz: support@shohoz.com (contact form at shohoz.com/contact)
2. Email Bangladesh Railway IT: contact via railway.gov.bd
3. State your use case: "I am building a non-commercial train information app using the public API"
4. Get written confirmation before monetizing

**For portfolio only (no monetization):** Risk is low. Community precedent is strong.

---

## U4 — Fares Are Sample Data Only

**Status:** 🟡 Not blocking — handled in app logic  
**Issue:** fares.json and fares.csv contain community estimates, not live prices.  
**Fix:** Always call `GET /v1.0/web/bookings/search-trips-v2` for live fares.  
**Implementation:** Cache results in fare_cache table with 24h TTL.  
**Time to fix:** Handled by app architecture — no manual data work needed.

---

## U5 — Off Days for New Trains Unverified

**Status:** 🟡 Medium priority  
**Trains affected:** Jahanabad 825/826, Ruposhi Bangla 827/828, Cox's Bazar 813/814  
**Fix:**
```javascript
// For each suspect train, call API on suspected off day:
GET /v1.0/web/bookings/search-trips-v2
  ?from_city=DHAKA&to_city=KHULNA
  &date_of_journey=2026-06-16  // Monday
  &seat_class=S_CHAIR
// If train appears in response → NOT an off day
```

---

## U6 — 15 Station Codes Medium Confidence

**Status:** 🟡 Medium priority  
**Stations:** CXBZ, BMR, GZP, GBD, ULP, FRP, RBR, TGL, PCG, KRG, CLH, LMH, JPH, CPN, PBN  
**Fix:** Call train-routes API for trains serving these stations and extract exact station name strings from response. Match back to stations.json.

---

## U7 — Missing Bengali Names

**Status:** 🟢 Low priority  
**Stations missing `name_bn`:** Dhalarchar and Mohonganj (the two missing stations)  
**Fix:** Add Bengali names when adding these stations. Use Google Translate as starting point, verify with a native speaker.

---

## U8 — Wikipedia Attribution Not in UI

**Status:** 🟢 Low priority but legally required  
**Requirement:** CC BY-SA 4.0 requires attribution for data sourced from Wikipedia  
**Fix:** Add to app footer: "Train and station data partially sourced from Wikipedia (CC BY-SA 4.0)"

---

## U9 — Shohoz Cities Endpoint Returns 404

**Status:** 🟡 Medium — workaround in place  
**Endpoint:** `GET /v1.0/web/bookings/cities`  
**Issue:** Returns 404 as of June 2026. This was the primary source for station city names.  
**Current workaround:** stations.json manually compiled from Wikipedia + community sources.  
**Action:** Monitor — endpoint may return. Check monthly. If restored, re-verify shohoz_city values.

---

## U10 — OSM Attribution Not Implemented

**Status:** 🔴 Required by ODbL license  
**Fix:** Add to every map view:
```jsx
// In your Leaflet map component
attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
```
**Time to fix:** 5 minutes per map view.

---

## Estimated Total Time to Production-Ready

| Task | Time |
|------|------|
| Fix U2 (2 missing stations) | 15 min |
| Fix U10 (OSM attribution) | 15 min |
| Run stop seeding script (U1) | 3 hours |
| Contact Shohoz re: ToS (U3) | 30 min (then wait for reply) |
| Verify off days for new trains (U5) | 1 hour |
| Verify medium-confidence station codes (U6) | 2 hours |
| **Total** | **~7 hours of work** |
