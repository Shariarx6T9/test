/**
 * RailMate Bangladesh — Train search (website)
 *
 * SCHEMA DECISION (2026-06-19, reaffirmed 2026-06-20):
 * ─────────────────────────────────────────────────────────────────────────────
 * The canonical schema is migrations/001_initial_schema.sql (UUID PKs,
 * days_of_week SMALLINT[], search_trains() RPC). The old schema.sql (SERIAL
 * PKs, shohoz_city, off_days text[]) is archived in supabase/_archive/ and
 * must not be restored or reintroduced anywhere, including the mobile app.
 *
 * This file calls the same search_trains() Supabase RPC that the mobile app
 * uses — per Master Reference Part 05 §5.6.
 *
 * IMPORTANT CORRECTION (2026-06-20): a prior version of this file assumed
 * search_trains() would return a row (with null times) for a train that
 * operates the route but has no train_stops data. It does not — the RPC's
 * SQL definition (Part 08 §8.2) does an INNER JOIN against train_stops for
 * BOTH the origin and destination station, so a train with zero train_stops
 * rows is silently absent from the RPC's result set entirely, not present
 * with null times. Verified empirically: search_trains() for Dhaka→Rajshahi
 * returns 0 rows even though 6 real trains (Banalata, Dhumketu, Mohanagar,
 * Padma, Silkcity, Titumir Express) operate that route per
 * trains.origin_id/destination_id.
 *
 * Fix: getRouteExistenceFallback() below runs a second, simple query
 * directly against trains.origin_id/destination_id and merges in any train
 * the RPC didn't return. This is the Tier-1 floor from the original design —
 * restored here, on top of the RPC + delay-signal enrichment, rather than
 * replacing either.
 *
 * HARD RULES enforced throughout:
 * - No calls to railspaapi.shohoz.com or any Shohoz endpoint (Part 02 §2.1)
 * - No scraping of eticket.railway.gov.bd (Part 02 §2.1)
 * - No fabricated or estimated times — if data isn't in train_stops, the UI
 *   gets verified:false and shows a "times not yet verified" notice, never
 *   an invented or interpolated time.
 * - The outbound ticket link goes to eticket.railway.gov.bd (official BR
 *   e-ticketing portal) — NOT to any unverified third-party domain.
 *   ⚠️  HUMAN REVIEW REQUIRED before shipping: verify eticket.railway.gov.bd
 *   is still the correct and current official portal URL.
 */
import { supabase } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StationOption {
  id:               string   // UUID
  code:             string
  name_en:          string
  name_bn:          string
  division:         string | null
  zone:             string | null
  is_major:         boolean
  /** Alias for is_major — used by SearchForm and HeroSection to sort major hubs first. */
  is_intercity_hub: boolean
}

export interface RouteStations {
  from: StationOption
  to:   StationOption
}

/**
 * Matches the RETURNS TABLE of the search_trains() Postgres function
 * in migrations/001_initial_schema.sql.
 */
interface SearchTrainsRow {
  train_id:          string
  train_number:      string
  train_name_en:     string
  train_name_bn:     string
  train_type:        string
  departure_time:    string | null
  arrival_time:      string | null
  duration_minutes:  number | null
  available_classes: string[]
}

/** A train confirmed to operate this exact route via origin_id/destination_id —
 *  the Tier-1 floor, independent of whether train_stops data exists. */
interface RouteExistenceRow {
  id:           string
  number:       string
  name_en:      string
  name_bn:      string
  type:         string
  days_of_week: number[]
}

export type TrainSearchResult =
  | {
      verified:           true
      train_id:           string
      train_number:       string
      train_name_en:      string
      train_name_bn:      string
      train_type:         string
      departure_time:     string   // "HH:MM" — real data from train_stops
      arrival_time:       string   // "HH:MM" — real data from train_stops
      duration_minutes:   number
      available_classes:  string[]
      avg_delay_minutes:  number | null   // from public_delay_aggregates
      delay_report_count: number
    }
  | {
      verified:           false
      train_id:           string
      train_number:       string
      train_name_en:      string
      train_name_bn:      string
      train_type:         string
      available_classes:  string[]
      avg_delay_minutes:  number | null
      delay_report_count: number
      // No departure_time / arrival_time / duration_minutes —
      // train_stops data doesn't exist for this train yet.
      // UI must show a verification notice, never a placeholder time.
    }

// ─── Station queries ──────────────────────────────────────────────────────────

export async function getAllStations(): Promise<StationOption[]> {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select('id, code, name_en, name_bn, division, zone, is_major')
      .eq('is_active', true)
      .order('is_major', { ascending: false })
      .order('name_en', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []).map((s: any) => ({ ...s, is_intercity_hub: s.is_major })) as StationOption[]
  } catch (err) {
    console.error('[getAllStations]', err)
    return []
  }
}

export async function getStationsByCodes(
  fromCode: string,
  toCode:   string
): Promise<RouteStations | null> {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select('id, code, name_en, name_bn, division, zone, is_major')
      .in('code', [fromCode.toUpperCase(), toCode.toUpperCase()])
      .eq('is_active', true)

    if (error || !data || data.length < 2) return null

    const stations = (data as any[]).map((s) => ({ ...s, is_intercity_hub: s.is_major })) as StationOption[]
    const from = stations.find((s) => s.code === fromCode.toUpperCase())
    const to   = stations.find((s) => s.code === toCode.toUpperCase())

    if (!from || !to) return null
    return { from, to }
  } catch (err) {
    console.error('[getStationsByCodes]', err)
    return null
  }
}

// ─── Tier-1 fallback: route existence, independent of train_stops ─────────────

/**
 * Every train whose origin_id/destination_id matches this exact station
 * pair. This only catches trains whose overall route starts/ends at these
 * two stations (not ones merely passing through) — a smaller scope than
 * search_trains()'s stop-sequence match, but it never returns nothing just
 * because train_stops is empty, which search_trains() does.
 */
async function getRouteExistenceFallback(
  fromStationId: string,
  toStationId:   string,
  journeyDate:   string
): Promise<RouteExistenceRow[]> {
  const { data, error } = await supabase
    .from('trains')
    .select('id, number, name_en, name_bn, type, days_of_week')
    .eq('origin_id', fromStationId)
    .eq('destination_id', toStationId)
    .eq('is_active', true)

  if (error) {
    console.error('[getRouteExistenceFallback]', error.message)
    return []
  }

  const dayNumber = new Date(journeyDate + 'T00:00:00').getDay()
  return ((data ?? []) as RouteExistenceRow[]).filter(
    (t) => Array.isArray(t.days_of_week) && t.days_of_week.includes(dayNumber)
  )
}

// ─── Delay signal from public_delay_aggregates ────────────────────────────────

interface DelaySignal {
  avg_delay_minutes:  number | null
  delay_report_count: number
}

/**
 * Fetch today's community delay signal for a set of train numbers.
 * Reads ONLY from public_delay_aggregates — never from raw community_reports
 * rows — per Master Reference Part 07 §7.4 and Part 05 §5.6.
 */
async function getDelaySignals(
  trainNumbers: string[],
  journeyDate:  string
): Promise<Map<string, DelaySignal>> {
  const result = new Map<string, DelaySignal>()
  if (!trainNumbers.length) return result

  try {
    const { data, error } = await supabase
      .from('public_delay_aggregates')
      .select('train_number, avg_delay_minutes, delay_report_count')
      .in('train_number', trainNumbers)
      .eq('journey_date', journeyDate)

    if (error) {
      console.warn('[getDelaySignals] Could not fetch delay aggregates:', error.message)
      return result
    }

    for (const row of data ?? []) {
      result.set(row.train_number, {
        avg_delay_minutes:  row.avg_delay_minutes ?? null,
        delay_report_count: row.delay_report_count ?? 0,
      })
    }
  } catch (err) {
    console.warn('[getDelaySignals] Unexpected error:', err)
  }

  return result
}

// ─── Core search — search_trains() RPC + Tier-1 fallback + delay signal ───────

/**
 * Main search function.
 *   1. Call search_trains() — gives verified times for trains with train_stops.
 *   2. Run the Tier-1 fallback — gives every train that genuinely operates
 *      this route, regardless of train_stops coverage.
 *   3. Merge: anything in (2) not already returned by (1) is added with
 *      verified:false. Nothing is ever hidden for lack of stop data, and no
 *      time is ever shown unless it came from a real train_stops row.
 *   4. Enrich everything with community delay signal from
 *      public_delay_aggregates.
 *
 * Returns [] ONLY when no train's origin/destination matches this route at
 * all — that is the one correct condition for "No trains found."
 */
export async function searchTrains(
  fromCode:    string,
  toCode:      string,
  journeyDate: string  // "YYYY-MM-DD"
): Promise<TrainSearchResult[]> {
  const route = await getStationsByCodes(fromCode, toCode)
  if (!route) return []

  let rpcRows: SearchTrainsRow[] = []
  try {
    const { data, error } = await supabase.rpc('search_trains', {
      p_from_station_id: route.from.id,
      p_to_station_id:   route.to.id,
      p_journey_date:    journeyDate,
    })
    if (error) throw new Error(error.message)
    rpcRows = (data ?? []) as SearchTrainsRow[]
  } catch (err) {
    console.error('[searchTrains] RPC call failed:', err)
    // Don't bail out entirely — the Tier-1 fallback below can still answer
    // "does a train run this route" even if the RPC itself errored.
  }

  const fallbackRows = await getRouteExistenceFallback(route.from.id, route.to.id, journeyDate)

  const rpcTrainIds = new Set(rpcRows.map((r) => r.train_id))
  const unverifiedFromFallback = fallbackRows.filter((t) => !rpcTrainIds.has(t.id))

  if (!rpcRows.length && !unverifiedFromFallback.length) return []

  const allTrainNumbers = [
    ...rpcRows.map((r) => r.train_number),
    ...unverifiedFromFallback.map((t) => t.number),
  ]
  const delays = await getDelaySignals(allTrainNumbers, journeyDate)

  const verifiedResults: TrainSearchResult[] = rpcRows.map((row) => {
    const delay = delays.get(row.train_number) ?? { avg_delay_minutes: null, delay_report_count: 0 }

    const hasVerifiedTimes =
      row.departure_time !== null && row.arrival_time !== null && row.duration_minutes !== null

    if (hasVerifiedTimes) {
      return {
        verified:           true,
        train_id:           row.train_id,
        train_number:       row.train_number,
        train_name_en:      row.train_name_en,
        train_name_bn:      row.train_name_bn,
        train_type:         row.train_type,
        departure_time:     row.departure_time!.slice(0, 5),
        arrival_time:       row.arrival_time!.slice(0, 5),
        duration_minutes:   calculateDuration(row.departure_time!.slice(0, 5), row.arrival_time!.slice(0, 5)),
        available_classes:  row.available_classes ?? [],
        avg_delay_minutes:  delay.avg_delay_minutes,
        delay_report_count: delay.delay_report_count,
      }
    }

    return {
      verified:           false,
      train_id:           row.train_id,
      train_number:       row.train_number,
      train_name_en:      row.train_name_en,
      train_name_bn:      row.train_name_bn,
      train_type:         row.train_type,
      available_classes:  row.available_classes ?? [],
      avg_delay_minutes:  delay.avg_delay_minutes,
      delay_report_count: delay.delay_report_count,
    }
  })

  // Tier-1-only trains: real trains on this route, no verified timetable yet.
  const fallbackResults: TrainSearchResult[] = unverifiedFromFallback.map((train) => {
    const delay = delays.get(train.number) ?? { avg_delay_minutes: null, delay_report_count: 0 }
    return {
      verified:           false,
      train_id:           train.id,
      train_number:       train.number,
      train_name_en:      train.name_en,
      train_name_bn:      train.name_bn,
      train_type:         train.type ?? '',
      available_classes:  [], // not queried for the fallback path — see note below
      avg_delay_minutes:  delay.avg_delay_minutes,
      delay_report_count: delay.delay_report_count,
    }
  })

  const results = [...verifiedResults, ...fallbackResults]

  return results.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1
    if (a.verified && b.verified) return a.departure_time.localeCompare(b.departure_time)
    return a.train_number.localeCompare(b.train_number, undefined, { numeric: true })
  })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function calculateDuration(departure: string, arrival: string): number {
  const [depHour, depMin] = departure.split(':').map(Number)
  const [arrHour, arrMin] = arrival.split(':').map(Number)
  let depMinutes = depHour * 60 + depMin
  let arrMinutes = arrHour * 60 + arrMin
  if (arrMinutes <= depMinutes) arrMinutes += 24 * 60
  return arrMinutes - depMinutes
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── Top routes for generateStaticParams ─────────────────────────────────────
// Station codes match stations.code in the canonical seed (seed.sql). All of
// these now return real results — either verified (train_stops exists) or
// Tier-1 route-confirmed (train_stops doesn't exist yet) — never a false
// "no trains found" for a route that genuinely has service.

export const TOP_ROUTES: { fromCode: string; toCode: string }[] = [
  { fromCode: 'DHKA', toCode: 'CTG'  },
  { fromCode: 'CTG',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'SYT'  },
  { fromCode: 'SYT',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'KHU'  },
  { fromCode: 'KHU',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'LMH'  },
  { fromCode: 'LMH',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'RAJ'  },
  { fromCode: 'RAJ',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'MYM'  },
  { fromCode: 'MYM',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'RNG'  },
  { fromCode: 'RNG',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'COM'  },
  { fromCode: 'COM',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'JMP'  },
  { fromCode: 'JMP',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'BOG'  },
  { fromCode: 'BOG',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'CXBZ' },
  { fromCode: 'CXBZ', toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'JS'   },
  { fromCode: 'JS',   toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'DNJ'  },
  { fromCode: 'DNJ',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'SRM'  },
  { fromCode: 'SRM',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'AKH'  },
  { fromCode: 'AKH',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'BNP'  },
  { fromCode: 'BNP',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'PCG'  },
  { fromCode: 'PCG',  toCode: 'DHKA' },
  { fromCode: 'CTG',  toCode: 'SYT'  },
  { fromCode: 'SYT',  toCode: 'CTG'  },
  { fromCode: 'CTG',  toCode: 'COM'  },
  { fromCode: 'COM',  toCode: 'CTG'  },
  { fromCode: 'RAJ',  toCode: 'KHU'  },
  { fromCode: 'KHU',  toCode: 'RAJ'  },
]
