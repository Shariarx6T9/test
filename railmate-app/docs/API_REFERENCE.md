# RailMate Bangladesh — API Reference

**Source:** Reverse-documented from community repositories (MIT License)  
**Primary repos:** shakiliitju/Bangladesh-Railway, nishatrhythm repos  
**Last verified:** 2026-06-10  
**Base URL:** `https://railspaapi.shohoz.com`

> ⚠️ **Legal Notice:** These endpoints are used by the official Bangladesh Railway e-ticket portal (eticket.railway.gov.bd). They are publicly accessible and used by multiple open-source community projects without reverse engineering. No authentication bypass is involved. However, no explicit public API ToS exists. See LEGAL_COMPLIANCE.md before commercial use.

---

## Endpoints

---

### 1. Search Trains

**`GET /v1.0/web/bookings/search-trips-v2`**

Search for available trains between two stations on a given date.

**Query Parameters:**

| Param | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| `from_city` | string | Yes | `DHAKA` | UPPERCASE Shohoz city name (see stations.json `shohoz_city` field) |
| `to_city` | string | Yes | `CHATTOGRAM` | UPPERCASE Shohoz city name |
| `date_of_journey` | string | Yes | `2026-06-15` | Format: YYYY-MM-DD |
| `seat_class` | string | Yes | `S_CHAIR` | See train_classes.json for valid values |

**Example Request:**
```
GET https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=DHAKA&to_city=CHATTOGRAM&date_of_journey=2026-06-15&seat_class=S_CHAIR
```

**Response Structure:**
```json
{
  "data": [
    {
      "trip_id": "string",
      "trip_route_id": "string",
      "train_model": "SONAR BANGLA EXPRESS (787)",
      "departure_date_time": "2026-06-15 07:00:00",
      "arrival_date_time": "2026-06-15 11:55:00",
      "from_station": "Dhaka",
      "to_station": "Chattogram",
      "seat_types": [
        {
          "type": "S_CHAIR",
          "fare": 350.0,
          "vat_amount": 0.0,
          "online_service_charge": 25,
          "available_seats": 42
        }
      ]
    }
  ]
}
```

**Notes:**
- Returns all trains running on that date between the two cities
- `available_seats` is live — can change between requests
- `fare` is base fare in BDT (Bangladeshi Taka)
- Geo-restricted: may require Bangladesh IP. Community projects host from Singapore to bypass.

---

### 2. Get Train Route

**`POST /v1.0/web/train-routes`**

Get the complete stop-by-stop route for a specific train on a specific date.

**Request Body (JSON):**
```json
{
  "model": "SONAR BANGLA EXPRESS (787)",
  "departure_date_time": "2026-06-15"
}
```

**Response Structure:**
```json
{
  "data": {
    "stations": [
      {
        "station_name": "Dhaka",
        "departure_time": "07:00",
        "arrival_time": null
      },
      {
        "station_name": "Dhaka Airport",
        "departure_time": "07:22",
        "arrival_time": "07:20"
      },
      {
        "station_name": "Chattogram",
        "departure_time": null,
        "arrival_time": "11:55"
      }
    ]
  }
}
```

**Notes:**
- Use the `model` string exactly as it appears in trains.json `model` field
- This endpoint populates your train_stops data dynamically — use it to seed your DB

---

### 3. Get Seat Layout

**`GET /v1.0/web/bookings/seat-layout`**

Get the coach layout showing individual seat availability.

**Query Parameters:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `trip_id` | string | Yes | From search-trips-v2 response |
| `trip_route_id` | string | Yes | From search-trips-v2 response |
| `seat_class` | string | Yes | e.g. `S_CHAIR` |

**Auth Required:** Bearer token from sign-in endpoint.

**Response Structure:**
```json
{
  "data": {
    "coaches": [
      {
        "coach_name": "KA-1",
        "seats": [
          {
            "seat_number": "A1",
            "is_available": true,
            "ticket_type": "online"
          }
        ]
      }
    ]
  }
}
```

---

### 4. User Authentication

**`POST /v1.0/app/auth/sign-in`**

Authenticate with a Bangladesh Railway user account.

**Request Body:**
```json
{
  "mobile_number": "01XXXXXXXXX",
  "password": "user_password"
}
```

**Response:** Returns `access_token` (JWT) for use in Authorization header.

**⚠️ Critical Warning:**
- NEVER embed your own credentials in a production app
- NEVER store user passwords
- Use this only to let users log in with THEIR OWN BR accounts
- Tokens expire — implement auto-refresh logic

---

## Error Handling

| HTTP Status | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Parse response |
| 404 | Route not found or endpoint deprecated | Check endpoint URL |
| 422 | No trains / no seat layout for criteria | Show "no trains found" message |
| 429 | Rate limited | Implement queue + backoff |
| 500 | Server error | Retry up to 3 times with exponential backoff |

---

## Rate Limiting & Best Practices

- **Max concurrent requests:** 1 (per community convention — do not hammer the API)
- **Cooldown between requests:** 3 seconds minimum
- **Cache search results:** Cache for 5 minutes for same route/date/class
- **Cache fares:** 24-hour TTL — fares rarely change intraday
- **Cache train routes:** 7-day TTL — stop sequences rarely change
- **Geo-restriction:** API may be restricted outside Bangladesh IP range. Host server in Bangladesh or Singapore.
- **Queue system:** Implement a request queue for multi-user scenarios (see matrixCalculator.py in shakiliitju/Bangladesh-Railway for reference implementation)

---

## Deprecated / Non-Working Endpoints

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /v1.0/web/bookings/cities` | ❌ 404 | Was the station list endpoint. Now returns 404. Use stations.json instead. |

---

## Request Headers

All requests should include:
```
Content-Type: application/json
Accept: application/json
```

Authenticated requests:
```
Authorization: Bearer {access_token}
```
