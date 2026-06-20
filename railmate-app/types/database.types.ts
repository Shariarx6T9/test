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
 * Matches the ACTUAL deployed schema (supabase/schema.sql) — NOT the UUID
 * based schema in migrations/001_initial_schema.sql, which was never applied
 * to production. id/code are the real PK/join keys; shohoz_city is the text
 * field that joins into Train.origin_city / destination_city.
 */
export interface Station {
  id:               number;
  code:             string;
  name_en:          string;
  name_bn:          string;
  division:         string | null;
  shohoz_city:      string;
  is_intercity_hub: boolean;
}

/**
 * trains.number is the real-world train number (e.g. 735) and is the join
 * key into train_stops.train_number — NOT a UUID id relationship.
 * origin_city/destination_city are free-text city names (e.g. 'DHAKA') that
 * match Station.shohoz_city exactly — confirmed against production seed data.
 */
export interface Train {
  id:               number;
  number:           number;
  name:             string;
  train_type:       string;
  off_days:         string[];      // lowercase day names, e.g. ['friday']
  origin_city:      string;
  destination_city: string;
  is_active:        boolean;
}

/**
 * Join key is train_number + station_code, both plain values — not FKs to
 * UUID ids. A train with zero train_stops rows is NOT a data error; it
 * means the verified timetable hasn't been entered yet (see Tier 1/Tier 2
 * search architecture below).
 */
export interface TrainStop {
  train_number:    number;
  station_code:    string;
  stop_sequence:   number;
  arrive_time:     string | null; // "HH:MM:SS"
  depart_time:     string | null; // "HH:MM:SS"
  station?:        Station;        // joined, when requested
}

export interface Fare {
  id:              number;
  train_number:    number | null;
  from_station_id: number;
  to_station_id:   number;
  class:           TrainClass;
  price_bdt:        number;
  last_verified:    string | null;
}

/**
 * TIER 1 / TIER 2 SEARCH RESULT
 * ───────────────────────────────────────────────────────────────────────────
 * Mirrors the website's lib/train-search.ts exactly, so both clients apply
 * the same truth standard: a train is never hidden for lack of verified
 * timetable data, and a time is never shown unless it came from a real
 * train_stops row.
 *
 * Tier 1 — route existence: trains.origin_city / destination_city matched
 *          against the searched stations' shohoz_city. Works for ALL trains.
 * Tier 2 — verified timetable: only present when train_stops has a row for
 *          both the from and to station with correct sequence ordering.
 */
export type TrainSearchResult =
  | {
      verified:         true;
      train_id:         number;
      train_number:     number;
      train_name_en:    string;
      train_type:       string;
      departure_time:   string;  // "HH:MM" — real train_stops data only
      arrival_time:     string;  // "HH:MM" — real train_stops data only
      duration_minutes: number;
      off_days:         string[];
    }
  | {
      verified:      false;
      train_id:      number;
      train_number:  number;
      train_name_en: string;
      train_type:    string;
      off_days:      string[];
      // No departure_time / arrival_time / duration_minutes — Tier 2 data
      // does not exist yet. UI must show a verification notice, never an
      // estimated or placeholder time.
    };

export interface TrainDetailWithStops extends Train {
  stops:       (TrainStop & { station: Station })[];
  origin_city: string;
  destination_city: string;
}
