/**
 * RailMate Bangladesh — Train search queries (website)
 *
 * These functions hit the same Supabase instance as the mobile app.
 * Key constraints enforced here (not in the UI layer):
 *   - No fare amounts returned — website never exposes pricing.
 *   - Only class names returned (available_classes chip display).
 *   - `last_verified` date always included for transparency.
 *
 * The deployed schema uses station.code (VARCHAR) as the join key and
 * station.id as SERIAL integer — NOT UUIDs. The search_trains RPC in
 * migrations/001 is an older artefact; we query directly here.
 */
import { supabase } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StationOption {
  id:      number
  code:    string
  name_en: string
  name_bn: string
  division: string
  is_intercity_hub: boolean
}

export interface TrainSearchResult {
  train_id:         number
  train_number:     number
  train_name_en:    string
  train_name_bn:    string
  train_type:       string
  departure_time:   string // "HH:MM:SS"
  arrival_time:     string // "HH:MM:SS"
  duration_minutes: number
  available_classes: string[] // class names only, never prices
  last_verified:    string | null
  off_days:         string[]
}

export interface RouteStations {
  from: StationOption
  to:   StationOption
}

// ─── Station helpers ──────────────────────────────────────────────────────────

/** All stations for autocomplete. Cached at build time via Next.js fetch cache. */
export async function getAllStations(): Promise<StationOption[]> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, is_intercity_hub')
    .order('name_en', { ascending: true })

  if (error) throw new Error(`getAllStations: ${error.message}`)
  return (data ?? []) as StationOption[]
}

/** Lookup a single station by its slug (lowercased name_en, spaces → hyphens) */
export async function getStationBySlug(
  slug: string
): Promise<StationOption | null> {
  // "dhaka-kamalapur" → "Dhaka (Kamalapur)" style search
  // We store the slug → code mapping at generateStaticParams time,
  // but for ISR on-demand routes we query by normalised name.
  const readable = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, is_intercity_hub')
    .ilike('name_en', `%${readable}%`)
    .limit(1)
    .single()

  if (error) return null
  return data as StationOption
}

/** Lookup stations by their station codes (e.g. "DHKA", "CTG") */
export async function getStationsByCodes(
  fromCode: string,
  toCode: string
): Promise<RouteStations | null> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, is_intercity_hub')
    .in('code', [fromCode, toCode])

  if (error || !data || data.length < 2) return null

  const from = (data as StationOption[]).find((s) => s.code === fromCode)
  const to   = (data as StationOption[]).find((s) => s.code === toCode)

  if (!from || !to) return null
  return { from, to }
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Search trains between two stations on a given date.
 *
 * This replicates the logic of the mobile app's search_trains RPC but
 * uses the actual deployed schema column names (station.code, train.number,
 * train_stops.station_code, train_stops.stop_sequence).
 *
 * Intentionally does NOT return any fare data.
 */
export async function searchTrains(
  fromStationId: number,
  toStationId:   number,
  journeyDate:   string // "YYYY-MM-DD"
): Promise<TrainSearchResult[]> {
  // DOW: JS getDay() returns 0=Sun … 6=Sat, but our off_days are text strings
  // like 'friday', 'saturday' — so we filter on the client side after fetch.
  const date    = new Date(journeyDate)
  const dowName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][date.getDay()]

  // Step 1: find trains that stop at from-station
  const { data: fromStops, error: fromErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, depart_time')
    .eq('station_id', fromStationId)

  if (fromErr) throw new Error(`searchTrains (from): ${fromErr.message}`)
  if (!fromStops?.length) return []

  const trainNums = fromStops.map((s: any) => s.train_number)

  // Step 2: find those trains that also stop at to-station, with higher sequence
  const { data: toStops, error: toErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, arrive_time')
    .eq('station_id', toStationId)
    .in('train_number', trainNums)

  if (toErr) throw new Error(`searchTrains (to): ${toErr.message}`)
  if (!toStops?.length) return []

  // Step 3: filter to trains where from.sequence < to.sequence
  const validPairs = toStops
    .map((to: any) => {
      const from = fromStops.find(
        (f: any) =>
          f.train_number === to.train_number && f.stop_sequence < to.stop_sequence
      )
      return from ? { trainNum: to.train_number, depart: from.depart_time, arrive: to.arrive_time } : null
    })
    .filter(Boolean) as { trainNum: number; depart: string; arrive: string }[]

  if (!validPairs.length) return []

  // Step 4: fetch train details for valid trains
  const validTrainNums = validPairs.map((p) => p.trainNum)

  const { data: trains, error: trainErr } = await supabase
    .from('trains')
    .select('id, number, name, train_type, off_days, last_verified, is_active')
    .in('number', validTrainNums)
    .eq('is_active', true)

  if (trainErr) throw new Error(`searchTrains (trains): ${trainErr.message}`)
  if (!trains?.length) return []

  // Step 5: build results, filter by day-of-week
  const results: TrainSearchResult[] = []

  for (const train of trains as any[]) {
    // off_days is TEXT[] — filter trains not running today
    if (Array.isArray(train.off_days) && train.off_days.includes(dowName)) continue

    const pair = validPairs.find((p) => p.trainNum === train.number)!

    const departParts = pair.depart?.split(':').map(Number) ?? [0, 0]
    const arriveParts = pair.arrive?.split(':').map(Number) ?? [0, 0]
    const departMins  = departParts[0] * 60 + departParts[1]
    const arriveMins  = arriveParts[0] * 60 + arriveParts[1]
    const duration    = arriveMins >= departMins
      ? arriveMins - departMins
      : (24 * 60 - departMins) + arriveMins // overnight

    results.push({
      train_id:         train.id,
      train_number:     train.number,
      train_name_en:    train.name,
      train_name_bn:    train.name,   // name_bn not in schema — falls back
      train_type:       train.train_type,
      departure_time:   pair.depart,
      arrival_time:     pair.arrive,
      duration_minutes: duration,
      available_classes: [],           // never expose class list on website
      last_verified:    train.last_verified,
      off_days:         train.off_days ?? [],
    })
  }

  // Sort by departure time
  return results.sort((a, b) => a.departure_time.localeCompare(b.departure_time))
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

/** Convert a station name to a URL-safe slug */
export function stationToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')       // remove parentheses
    .replace(/[^\w\s-]/g, '')   // remove non-word chars
    .replace(/\s+/g, '-')       // spaces to hyphens
    .replace(/-+/g, '-')        // collapse multiple hyphens
    .trim()
}

/** Format HH:MM:SS to HH:MM */
export function formatTime(time: string | null): string {
  if (!time) return '—'
  return time.slice(0, 5)
}

/** Format duration in minutes to "Xh Ym" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── Top routes for prerendering ──────────────────────────────────────────────

/**
 * The top 40 station-pair routes to prerender at build time.
 * Sourced from actual hub stations in seed data (is_intercity_hub = true).
 * Codes match stations.code in Supabase.
 */
export const TOP_ROUTES: Array<{ fromCode: string; toCode: string }> = [
  // Dhaka ↔ major hubs
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
  // Dhaka ↔ secondary
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
  // Cross routes
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
