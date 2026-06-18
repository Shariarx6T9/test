/**
 * RailMate Bangladesh — Train search queries (website)
 *
 * Actual deployed schema column names (from supabase/seed.sql):
 *   stations:    id, code, name_en, name_bn, ...
 *   trains:      id, number, name, train_type, off_days, is_active, ...
 *   train_stops: train_number, station_code, stop_sequence, arrive_time, depart_time, ...
 *
 * Join key: train_stops.station_code = stations.code (VARCHAR)
 * No fare data is returned anywhere in this file — website never exposes pricing.
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
}

export interface TrainSearchResult {
  train_id:         number
  train_number:     number
  train_name_en:    string
  train_type:       string
  departure_time:   string  // "HH:MM"
  arrival_time:     string  // "HH:MM"
  duration_minutes: number
  off_days:         string[]
  last_verified:    string | null
}

export interface RouteStations {
  from: StationOption
  to:   StationOption
}

// ─── Station queries ──────────────────────────────────────────────────────────

export async function getAllStations(): Promise<StationOption[]> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, is_intercity_hub')
    .order('name_en', { ascending: true })

  if (error) throw new Error(`getAllStations: ${error.message}`)
  return (data ?? []) as StationOption[]
}

export async function getStationsByCodes(
  fromCode: string,
  toCode:   string
): Promise<RouteStations | null> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, is_intercity_hub')
    .in('code', [fromCode.toUpperCase(), toCode.toUpperCase()])

  if (error || !data || data.length < 2) return null

  const stations = data as StationOption[]
  const from = stations.find((s) => s.code === fromCode.toUpperCase())
  const to   = stations.find((s) => s.code === toCode.toUpperCase())

  if (!from || !to) return null
  return { from, to }
}

// ─── Train search ─────────────────────────────────────────────────────────────

/**
 * Search trains between two stations by their station codes.
 * Uses the actual schema join: train_stops.station_code = stations.code
 */
export async function searchTrains(
  fromCode:    string,
  toCode:      string,
  journeyDate: string  // "YYYY-MM-DD"
): Promise<TrainSearchResult[]> {
  const date    = new Date(journeyDate + 'T00:00:00')
  const dowName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][date.getDay()]

  // Step 1: stops at the FROM station
  const { data: fromStops, error: fromErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, depart_time')
    .eq('station_code', fromCode.toUpperCase())

  if (fromErr) throw new Error(`searchTrains from: ${fromErr.message}`)
  if (!fromStops?.length) return []

  const trainNumbers = [...new Set(fromStops.map((s: any) => s.train_number))]

  // Step 2: stops at the TO station for the same trains
  const { data: toStops, error: toErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, arrive_time')
    .eq('station_code', toCode.toUpperCase())
    .in('train_number', trainNumbers)

  if (toErr) throw new Error(`searchTrains to: ${toErr.message}`)
  if (!toStops?.length) return []

  // Step 3: keep only trains where from.sequence < to.sequence (correct direction)
  const validPairs: { trainNum: number; depart: string; arrive: string }[] = []

  for (const toStop of toStops as any[]) {
    const fromStop = fromStops.find(
      (f: any) =>
        f.train_number === toStop.train_number &&
        f.stop_sequence < toStop.stop_sequence
    )
    if (fromStop) {
      validPairs.push({
        trainNum: toStop.train_number,
        depart:   fromStop.depart_time,
        arrive:   toStop.arrive_time,
      })
    }
  }

  if (!validPairs.length) return []

  // Step 4: fetch train details
  const validNums = validPairs.map((p) => p.trainNum)
  const { data: trains, error: trainErr } = await supabase
    .from('trains')
    .select('id, number, name, train_type, off_days, is_active')
    .in('number', validNums)
    .eq('is_active', true)

  if (trainErr) throw new Error(`searchTrains trains: ${trainErr.message}`)
  if (!trains?.length) return []

  // Step 5: build results, filter by day-of-week off_days
  const results: TrainSearchResult[] = []

  for (const train of trains as any[]) {
    const offDays: string[] = Array.isArray(train.off_days) ? train.off_days : []
    if (offDays.includes(dowName)) continue

    const pair = validPairs.find((p) => p.trainNum === train.number)!
    const depart = pair.depart?.slice(0, 5) ?? '—'
    const arrive = pair.arrive?.slice(0, 5) ?? '—'

    const [dh, dm] = depart.split(':').map(Number)
    const [ah, am] = arrive.split(':').map(Number)
    const departMins = dh * 60 + dm
    const arriveMins = ah * 60 + am
    const duration   = arriveMins >= departMins
      ? arriveMins - departMins
      : (24 * 60 - departMins) + arriveMins

    results.push({
      train_id:         train.id,
      train_number:     train.number,
      train_name_en:    train.name,
      train_type:       train.train_type ?? '',
      departure_time:   depart,
      arrival_time:     arrive,
      duration_minutes: duration,
      off_days:         offDays,
      last_verified:    null, // not in deployed schema
    })
  }

  return results.sort((a, b) => a.departure_time.localeCompare(b.departure_time))
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
