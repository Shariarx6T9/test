/**
 * RailMate Bangladesh — Train search (website)
 *
 * TIER 1 / TIER 2 ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────────────────
 * Problem this solves: of 133 trains in the `trains` table, only a handful
 * have verified stop-by-stop timetable data in `train_stops`. A search that
 * requires `train_stops` to return anything incorrectly reports "no trains
 * found" for routes that genuinely have service — RailMate just doesn't have
 * the verified minute-by-minute schedule for that train yet.
 *
 * Tier 1 — Route existence (ALL 133 trains, zero new data needed)
 *   Source: trains.origin_city / trains.destination_city (already populated)
 *   Join:   stations.shohoz_city = trains.origin_city (exact text match,
 *           confirmed against seed data — e.g. station DHKA has
 *           shohoz_city = 'DHAKA', train 735 has origin_city = 'DHAKA')
 *   Answers: "does a train operate between these cities" — always truthful,
 *   always available, never fabricated.
 *
 * Tier 2 — Verified timetable (only trains with train_stops rows)
 *   Source: train_stops (departure/arrival times, stop sequence)
 *   Enriches a Tier 1 result with exact times and duration — but ONLY when
 *   real data exists. A train with no train_stops rows is still shown (per
 *   Tier 1), just without invented times.
 *
 * Hard rule enforced throughout this file: a train is never hidden because
 * train_stops is missing, and a time is never shown unless it came from a
 * real train_stops row.
 */
import { supabase } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StationOption {
  id:               number
  code:             string
  name_en:          string
  name_bn:          string
  division:         string
  is_intercity_hub: boolean
  shohoz_city:      string  // join key into trains.origin_city / destination_city
}

export interface RouteStations {
  from: StationOption
  to:   StationOption
}

/** A train that genuinely operates this route, per trains.origin_city/destination_city. */
interface RouteTrain {
  id:         number
  number:     number
  name:       string
  train_type: string
  off_days:   string[]
  is_active:  boolean
}

export type TrainSearchResult =
  | {
      verified:         true
      train_id:         number
      train_number:     number
      train_name_en:    string
      train_type:       string
      departure_time:   string  // "HH:MM" — real data only
      arrival_time:     string  // "HH:MM" — real data only
      duration_minutes: number
      off_days:         string[]
    }
  | {
      verified:      false
      train_id:      number
      train_number:  number
      train_name_en: string
      train_type:    string
      off_days:      string[]
      // No departure_time / arrival_time / duration_minutes — Tier 2 data
      // does not exist for this train. The UI must show a verification
      // notice, never a placeholder or estimated time.
    }

// ─── Station queries ──────────────────────────────────────────────────────────

export async function getAllStations(): Promise<StationOption[]> {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select('id, code, name_en, name_bn, division, is_intercity_hub, shohoz_city')
      .order('name_en', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []) as StationOption[]
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
      .select('id, code, name_en, name_bn, division, is_intercity_hub, shohoz_city')
      .in('code', [fromCode.toUpperCase(), toCode.toUpperCase()])

    if (error || !data || data.length < 2) return null

    const stations = data as StationOption[]
    const from = stations.find((s) => s.code === fromCode.toUpperCase())
    const to   = stations.find((s) => s.code === toCode.toUpperCase())

    if (!from || !to) return null
    return { from, to }
  } catch (err) {
    console.error('[getStationsByCodes]', err)
    return null
  }
}

// ─── Tier 1: route existence ───────────────────────────────────────────────────

/**
 * Find every train whose origin_city/destination_city matches this station
 * pair's shohoz_city. This is the truthful floor: if a row comes back here,
 * a train genuinely operates this route — full stop, regardless of whether
 * Tier 2 timetable detail exists.
 */
async function getTrainsForRoute(
  fromCity: string,
  toCity:   string
): Promise<RouteTrain[]> {
  const { data, error } = await supabase
    .from('trains')
    .select('id, number, name, train_type, off_days, is_active')
    .eq('origin_city', fromCity.toUpperCase())
    .eq('destination_city', toCity.toUpperCase())
    .eq('is_active', true)

  if (error) {
    console.error('[getTrainsForRoute]', error.message)
    return []
  }
  return (data ?? []) as RouteTrain[]
}

// ─── Tier 2: verified timetable enrichment ─────────────────────────────────────

interface StopTiming {
  depart_time: string | null
  arrive_time: string | null
}

/**
 * For a set of train numbers, fetch verified depart/arrive times at the
 * given from/to station codes — ONLY for trains where both stops exist
 * with from.sequence < to.sequence (correct direction). Trains not in the
 * returned map have no verified Tier 2 data; callers must not invent times
 * for them.
 */
async function getVerifiedTimings(
  trainNumbers: number[],
  fromCode:     string,
  toCode:       string
): Promise<Map<number, StopTiming>> {
  const result = new Map<number, StopTiming>()
  if (!trainNumbers.length) return result

  const { data: fromStops, error: fromErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, depart_time')
    .eq('station_code', fromCode.toUpperCase())
    .in('train_number', trainNumbers)

  if (fromErr) {
    console.error('[getVerifiedTimings] from query failed:', fromErr.message)
    return result // fail safe: no Tier 2 enrichment, Tier 1 results still valid
  }
  if (!fromStops?.length) return result

  const { data: toStops, error: toErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, arrive_time')
    .eq('station_code', toCode.toUpperCase())
    .in('train_number', trainNumbers)

  if (toErr) {
    console.error('[getVerifiedTimings] to query failed:', toErr.message)
    return result
  }
  if (!toStops?.length) return result

  for (const toStop of toStops as any[]) {
    const fromStop = (fromStops as any[]).find(
      (f) => f.train_number === toStop.train_number && f.stop_sequence < toStop.stop_sequence
    )
    if (fromStop) {
      result.set(toStop.train_number, {
        depart_time: fromStop.depart_time,
        arrive_time: toStop.arrive_time,
      })
    }
  }
  return result
}

// ─── Combined search ────────────────────────────────────────────────────────────

/**
 * Tier 1 + Tier 2 combined search.
 *
 * Priority (per spec):
 *   1. Search trains by route (Tier 1 — origin_city/destination_city)
 *   2. If train_stops exists for a matched train, enrich with timetable (Tier 2)
 *   3. If train_stops does not exist, return the route-level result only
 *
 * Returns [] ONLY when no train in the `trains` table operates this route —
 * that is the one and only condition under which the UI may say
 * "No trains found."
 */
export async function searchTrains(
  fromCode:    string,
  toCode:      string,
  journeyDate: string  // "YYYY-MM-DD" — used only to filter off_days, never to fabricate times
): Promise<TrainSearchResult[]> {
  const route = await getStationsByCodes(fromCode, toCode)
  if (!route) return []

  // Tier 1 — does any train operate this route at all?
  const routeTrains = await getTrainsForRoute(route.from.shohoz_city, route.to.shohoz_city)
  if (!routeTrains.length) return []

  // Day-of-week filter — applies to ALL trains regardless of tier, since
  // off_days is a property of the train itself, not of the verified timetable.
  const date    = new Date(journeyDate + 'T00:00:00')
  const dowName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][date.getDay()]
  const runningTrains = routeTrains.filter((t) => {
    const offDays = Array.isArray(t.off_days) ? t.off_days : []
    return !offDays.includes(dowName)
  })
  if (!runningTrains.length) return []

  // Tier 2 — enrich with verified timetable where it exists.
  const trainNumbers = runningTrains.map((t) => t.number)
  const timings = await getVerifiedTimings(trainNumbers, fromCode, toCode)

  const results: TrainSearchResult[] = runningTrains.map((train) => {
    const timing = timings.get(train.number)

    if (timing?.depart_time && timing?.arrive_time) {
      const depart = timing.depart_time.slice(0, 5)
      const arrive = timing.arrive_time.slice(0, 5)
      const [dh, dm] = depart.split(':').map(Number)
      const [ah, am] = arrive.split(':').map(Number)
      const departMins = dh * 60 + dm
      const arriveMins = ah * 60 + am
      const duration = arriveMins >= departMins
        ? arriveMins - departMins
        : (24 * 60 - departMins) + arriveMins

      return {
        verified:         true,
        train_id:         train.id,
        train_number:     train.number,
        train_name_en:    train.name,
        train_type:       train.train_type ?? '',
        departure_time:   depart,
        arrival_time:     arrive,
        duration_minutes: duration,
        off_days:         Array.isArray(train.off_days) ? train.off_days : [],
      }
    }

    // No verified Tier 2 data — Tier 1 result only, no fabricated times.
    return {
      verified:      false,
      train_id:      train.id,
      train_number:  train.number,
      train_name_en: train.name,
      train_type:    train.train_type ?? '',
      off_days:      Array.isArray(train.off_days) ? train.off_days : [],
    }
  })

  // Verified results first (more useful), then by departure / train number.
  return results.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1
    if (a.verified && b.verified) return a.departure_time.localeCompare(b.departure_time)
    return a.train_number - b.train_number
  })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── Top routes for generateStaticParams ─────────────────────────────────────
// Codes match stations.code in Supabase seed data exactly.

export const TOP_ROUTES: { fromCode: string; toCode: string }[] = [
  { fromCode: 'DHKA', toCode: 'CTG'  },
  { fromCode: 'CTG',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'SYT'  },
  { fromCode: 'SYT',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'KHU'  },
  { fromCode: 'KHU',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'RAJ'  },
  { fromCode: 'RAJ',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'MYM'  },
  { fromCode: 'MYM',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'DNJ'  },
  { fromCode: 'DNJ',  toCode: 'DHKA' },
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
  { fromCode: 'CTG',  toCode: 'SYT'  },
  { fromCode: 'SYT',  toCode: 'CTG'  },
  { fromCode: 'CTG',  toCode: 'COM'  },
  { fromCode: 'COM',  toCode: 'CTG'  },
  { fromCode: 'RAJ',  toCode: 'KHU'  },
  { fromCode: 'KHU',  toCode: 'RAJ'  },
  { fromCode: 'RAJ',  toCode: 'MYM'  },
  { fromCode: 'MYM',  toCode: 'RAJ'  },
  { fromCode: 'DHKA', toCode: 'SRM'  },
  { fromCode: 'SRM',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'AKH'  },
  { fromCode: 'AKH',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'BNP'  },
  { fromCode: 'BNP',  toCode: 'DHKA' },
  { fromCode: 'DHKA', toCode: 'PCG'  },
  { fromCode: 'PCG',  toCode: 'DHKA' },
]
