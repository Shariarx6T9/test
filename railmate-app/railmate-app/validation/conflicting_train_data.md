# Validation Report — Conflicting Train Data

**Generated:** 2026-06-10  
**Status:** Low severity — documented conflicts are resolvable

---

## Summary

| Conflict Type | Count | Severity |
|--------------|-------|----------|
| Train name spelling variants across sources | 4 | 🟡 Medium |
| Off-day discrepancies between sources | 6 | 🟡 Medium |
| Numbered model strings with typos (community source) | 3 | 🟢 Low |
| Trains without confirmed pair numbers | 3 | 🟡 Medium |

---

## 1. Train Name Spelling Variants

These trains have different spellings across community sources. The spelling in trains.json follows the **Shohoz API model string** as the canonical version.

| Train | trains.json (canonical) | Alternative spellings seen | Source of variant |
|-------|------------------------|---------------------------|-------------------|
| Brahmaputra Express | `BHRAMMAPUTRA EXPRESS` | `BRAHMAPUTRA EXPRESS` | Wikipedia, community repos |
| Jayantika Express | `JAYENTIKA EXPRESS` | `JAYANTIKA EXPRESS`, `JAYANTIKA` | Wikipedia |
| Egarosindhur Provati | `EGAROSINDHUR PROVATI` | `EGARASHINDHUR PROVATI` | Some community sources |
| Tista Express | `TISTA EXPRESS` | `TEESTA EXPRESS` | Wikipedia (river name variant) |

**Resolution:** The `model` field in trains.json uses the **exact Shohoz API string**. Use this field — not `name` — when making API calls. The `name` field is for display only and can be normalized.

---

## 2. Off-Day Discrepancies

Off days are the most volatile data in this dataset. Confirmed discrepancies between sources:

| Train Number | Name | trains.json off_days | Wikipedia off_days | Resolution |
|-------------|------|---------------------|-------------------|------------|
| 703/704 | Mahanagar Godhuli/Provati | `[]` (no off days) | Mentions "runs daily" | Likely correct — high-frequency route |
| 737/738 | Egarosindhur Provati | `["sunday"]` | Not specified | Use trains.json — sourced from API |
| 749/750 | Egarosindhur Godhuli | `["sunday"]` | Not specified | Same as above |
| 787/788 | Sonar Bangla Express | `["tuesday"]`/`["wednesday"]` | Wikipedia says "except Tuesday" | ✅ Match |
| 825/826 | Jahanabad Express | `["tuesday"]`/`["wednesday"]` | No Wikipedia article | Community estimate — LOW CONFIDENCE |
| 827/828 | Ruposhi Bangla Express | `["tuesday"]`/`["wednesday"]` | No Wikipedia article | Community estimate — LOW CONFIDENCE |

**Resolution:** Off days marked `confidence: "medium"` in trains.json should be verified by:
1. Calling the Shohoz search-trips-v2 endpoint on the suspected off day
2. If no trips returned, off day is confirmed
3. Checking bangladesh-railways.com community documentation

---

## 3. Model String Typos (Community Source)

The trains_en.json community source contains these model string inconsistencies. They are preserved in trains.json as-is because they must match the Shohoz API exactly.

| Train | Model String in trains.json | Note |
|-------|----------------------------|------|
| Brahmaputra Express 743/744 | `BHRAMMAPUTRA EXPRESS` | Misspelling preserved — this is what the API returns |
| Jayantika Express 717/718 | `JAYENTIKA EXPRESS` | Misspelling preserved |
| Kishoreganj Express 781/782 | `KISHORGANJ EXPRESS` | Missing 'e' — preserved as-is |

**⚠️ Do NOT correct these spellings.** The model string must match the API exactly or POST /v1.0/web/train-routes will return no data.

---

## 4. Trains Without Confirmed Pair Numbers

| Train | Number | Issue |
|-------|--------|-------|
| Chandpur Eid Special | 1 | No confirmed pair — Eid special trains have irregular pairing |
| Parbatipur Eid Special | 9/10 | Seasonal — pair confirmed as 9↔10 but verify each Eid season |
| Tista Eid Special | 3/4 | Same as above |

**Resolution:** Eid specials run only 2–4 times per year. Do not rely on pair_number for these. Always use search-trips-v2 with the actual journey date to get live train availability.

---

## 5. Trains with Low Confidence (Verify Before Launch)

These trains were added based on partial community data and should be verified via the Shohoz API before the app goes live:

| Train | Numbers | Reason for Low Confidence |
|-------|---------|--------------------------|
| Jahanabad Express | 825/826 | Newly added — limited community documentation |
| Ruposhi Bangla Express | 827/828 | Newly added — limited community documentation |
| Cox's Bazar Express | 813/814 | New station (2023) — stop times unverified |

**Verification:**
```
POST https://railspaapi.shohoz.com/v1.0/web/train-routes
{ "model": "JAHANABAD EXPRESS (825)", "departure_date_time": "2026-06-16" }
```
If this returns a valid stop list, the train is confirmed operational.
