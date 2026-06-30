# RailMate Bangladesh — Map Providers

**Last Updated:** 2026-06-10

---

## Comparison Table

| Provider | Cost | Attribution | Tile Limit | Quality | Recommended Use |
|----------|------|-------------|------------|---------|-----------------|
| OpenStreetMap (direct) | Free | Required (ODbL) | Policy-limited (~limited/day) | Good | Dev / very low traffic |
| Stadia Maps | Free tier: 200k tiles/month | Required | 200k/month free | Excellent | Portfolio / small production |
| MapTiler | Free tier: 100k tiles/month | Required | 100k/month free | Excellent | Portfolio / small production |
| Mapbox | Free tier: 50k loads/month | Required | 50k/month free | Premium | Higher traffic production |
| Google Maps | Paid ($7/1000 loads) | Required | Pay-per-use | Premium | Avoid for open-source project |

---

## 1. OpenStreetMap Direct Tiles

**URL pattern:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`  
**Usage policy:** https://operations.osmfoundation.org/policies/tiles/

**For production:** ❌ Do NOT use OSM tiles directly for a public app with significant traffic. OSM's tile servers are community-funded and the policy explicitly states "heavy use is not acceptable."

**For development/portfolio only:** ✅ Acceptable.

**Leaflet config:**
```javascript
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
```

---

## 2. Stadia Maps (Recommended for Portfolio)

**URL:** https://stadiamaps.com  
**Free tier:** 200,000 tile requests/month  
**License:** Tiles proprietary, data ODbL (attribution required)  
**Sign up:** Free account, no credit card for free tier

**Tile styles available:**
- `alidade_smooth` — Clean, minimal, good for transit maps
- `alidade_smooth_dark` — Dark mode
- `stamen_toner` — High contrast, B&W
- `osm_bright` — Standard OSM look

**Leaflet config:**
```javascript
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=YOUR_KEY', {
  attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
```

---

## 3. MapTiler (Alternative for Portfolio)

**URL:** https://www.maptiler.com/maps/  
**Free tier:** 100,000 tile requests/month  
**API Key:** Required (free sign-up)

**Leaflet config:**
```javascript
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=YOUR_KEY', {
  attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
```

---

## 4. Bangladesh Railways GeoJSON

**OSM Relation:** https://www.openstreetmap.org/relation/8800946  
**What it contains:** Rail lines of Bangladesh Railways as GeoJSON  
**How to export:** Go to relation page → Export → GeoJSON  
**License:** ODbL (attribution required)  
**Use case:** Draw actual railway route lines on your map (not just station markers)

**Example use in Leaflet:**
```javascript
fetch('/data/bd_railway_lines.geojson')
  .then(r => r.json())
  .then(data => L.geoJSON(data, {
    style: { color: '#e63946', weight: 2 }
  }).addTo(map));
```

---

## 5. Recommendation for RailMate

**Development:** OpenStreetMap direct tiles  
**Portfolio launch:** Stadia Maps free tier (alidade_smooth style)  
**Production (>200k requests/month):** MapTiler or Stadia Maps paid tier  

**Never use:** Google Maps (expensive, against open-source ethos, requires TOS compliance)
