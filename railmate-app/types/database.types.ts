export type TrainClass =
  | 'SHOVON'
  | 'SHOVON_CHAIR'
  | 'SNIGDHA'
  | 'AC_BERTH'
  | 'AC_SEAT'
  | 'FIRST_BERTH'
  | 'FIRST_SEAT'
  | 'AC_S_CHAIR';

/**
 * SCHEMA DECISION (2026-06-19, reaffirmed 2026-06-20): the canonical schema
 * is migrations/001_initial_schema.sql — UUID PKs, days_of_week SMALLINT[],
 * the search_trains() Postgres RPC. This matches the Master Reference
 * (Part 07) exactly and matches what railmate-website/lib/train-search.ts
 * queries. The old schema.sql (SERIAL PKs, shohoz_city, off_days text[]) is
 * archived in supabase/_archive/ and must not be restored anywhere,
 * including here. If you believe production is actually running the old
 * schema, verify with one query against the real Supabase project —
 * `SELECT column_name, data_type FROM information_schema.columns WHERE
 * table_name='trains'` — before changing this file again. Two prior
 * remediation passes each changed this assertion in opposite directions
 * without running that query; don't make it three.
 */
export interface Station {
  id:          string;   // UUID
  code:        string;
  name_en:     string;
  name_bn:     string;
  division:    string | null;
  zone:        string | null;
  is_major:    boolean;
}

export interface Train {
  id:              string;   // UUID
  number:          string;   // e.g. "735" — display/join key for train_stops, NOT the row PK
  name_en:         string;
  name_bn:         string;
  type:            string;
  origin_id:       string;   // UUID FK -> stations.id
  destination_id:  string;   // UUID FK -> stations.id
  days_of_week:    number[]; // INCLUSION list, Sunday=0 — Part 07 §7.2. Opposite
                              // semantics of the old off_days exclusion list;
                              // do not reintroduce that shape.
  is_active:       boolean;
}

export interface TrainStop {
  id:             string;  // UUID
  train_id:       string;  // UUID FK -> trains.id
  station_id:     string;  // UUID FK -> stations.id
  sequence:       number;
  arrival_time:   string | null; // "HH:MM:SS"
  departure_time: string | null; // "HH:MM:SS"
  halt_minutes:   number;
  station?:       Station; // joined, when requested
}

export interface Fare {
  id:              string;          // UUID
  train_id:        string | null;   // UUID FK -> trains.id, null = applies to any train on this route
  from_station_id: string;          // UUID FK -> stations.id
  to_station_id:   string;          // UUID FK -> stations.id
  class:           TrainClass;
  price_bdt:       number;
  last_verified:   string | null;
}

/**
 * TIER 1 / TIER 2 SEARCH RESULT
 * ───────────────────────────────────────────────────────────────────────────
 * Mirrors the website's lib/train-search.ts: a train is never hidden for
 * lack of verified timetable data, and a time is never shown unless it came
 * from a real train_stops row.
 *
 * Tier 1 — route existence: trains.origin_id / destination_id matched
 *          against the searched stations' UUIDs. Works for ALL trains.
 * Tier 2 — verified timetable: only present when train_stops has a row for
 *          both the from and to station with correct sequence ordering.
 */
export type TrainSearchResult =
  | {
      verified:         true;
      train_id:         string;  // UUID
      train_number:     string;
      train_name_en:    string;
      train_type:       string;
      departure_time:   string;  // "HH:MM" — real train_stops data only
      arrival_time:     string;  // "HH:MM" — real train_stops data only
      duration_minutes: number;
      days_of_week:     number[];
    }
  | {
      verified:      false;
      train_id:      string;
      train_number:  string;
      train_name_en: string;
      train_type:    string;
      days_of_week:  number[];
      // No departure_time / arrival_time / duration_minutes — Tier 2 data
      // does not exist yet. UI must show a verification notice, never an
      // estimated or placeholder time.
    };

export interface TrainDetailWithStops extends Train {
  stops:           (TrainStop & { station: Station })[];
  origin:          Station | null;
  destination:     Station | null;
}
