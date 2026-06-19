/**
 * RailMate Bangladesh — Train search (website)
 *
 * SCHEMA DECISION (2026-06-19):
 * ─────────────────────────────────────────────────────────────────────────────
 * The canonical schema is migrations/001_initial_schema.sql (UUID PKs,
 * days_of_week SMALLINT[], search_trains() RPC). The old schema.sql (SERIAL
 * PKs, shohoz_city, off_days text[]) is archived in supabase/_archive/.
 *
 * This file was rewritten to call the same search_trains() Supabase RPC
 * that the mobile app uses — per Master Reference Part 05 §5.6:
 * "reuses the existing search_trains Supabase RPC already built for the app"
 *
 * HARD RULES enforced throughout:
 * - No calls to railspaapi.shohoz.com or any Shohoz endpoint (Part 02 §2.1)
 * - No scraping of eticket.railway.gov.bd (Part 02 §2.1)
 * - No fabricated or estimated times — if data isn't in train_stops, the
 *   UI receives available_classes only, and shows a "times not yet verified"
 *   notice rather than invented data.
 * - The outbound ticket link goes to eticket.railway.gov.bd (official BR
 *   e-ticketing portal) — NOT to any unverified third-party domain.
 *   ⚠️  HUMAN REVIEW REQUIRED before shipping: verify eticket.railway.gov.bd
 *   is the correct and current official portal URL.
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
  departure_time:    string | null  // TIME as "HH:MM:SS" | null when no stop data
  arrival_time:      string | null  // TIME as "HH:MM:SS" | null when no stop data
  duration_minutes:  number | null
  available_classes: string[]
}

export type TrainSearchResult =
  | {
      verified:         true
      train_id:         string
      train_number:     string
      train_name_en:    string
      train_name_bn:    string
      train_type:       string
      departure_time:   string   // "HH:MM" — real data from train_stops
      arrival_time:     string   // "HH:MM" — real data from train_stops
      duration_minutes: number
      available_classes: string[]
      avg_delay_minutes: number | null   // from public_delay_aggregates
      delay_report_count: number        // from public_delay_aggregates
    }
  | {
      verified:         false
      train_id:         string
      train_number:     string
      train_name_en:    string
      train_name_bn:    string
      train_type:       string
      available_classes: string[]
      avg_delay_minutes: number | null
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
      .order('name_en', { ascending: true })
    if (error) throw new Error(error.message)
    // Expose is_major as is_intercity_hub so existing components (SearchForm,
    // HeroSection) that sort major hubs first continue to work without change.
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
  journeyDate:  string  // YYYY-MM-DD
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
      // Non-fatal: community delay data is enrichment, not core schedule data.
      // Log and return empty map — search results still render without it.
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

// ─── Core search — calls the canonical search_trains() RPC ────────────────────

/**
 * Main search function. Calls the search_trains() Postgres RPC (the same
 * function the mobile app uses, per Part 05 §5.6). Enriches results with
 * community delay signal from public_delay_aggregates.
 *
 * Returns [] when no train operates this route on this date.
 * Never returns fabricated times — trains without train_stops rows come back
 * with verified:false and no time fields.
 */
export async function searchTrains(
  fromCode:    string,
  toCode:      string,
  journeyDate: string  // "YYYY-MM-DD"
): Promise<TrainSearchResult[]> {
  // Resolve station IDs — the RPC takes UUIDs, not codes.
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
    return []
  }

  if (!rpcRows.length) return []

  // Enrich with community delay signal.
  const trainNumbers = rpcRows.map((r) => r.train_number)
  const delays = await getDelaySignals(trainNumbers, journeyDate)

  const results: TrainSearchResult[] = rpcRows.map((row) => {
    const delay = delays.get(row.train_number) ?? {
      avg_delay_minutes:  null,
      delay_report_count: 0,
    }

    const hasVerifiedTimes =
      row.departure_time !== null &&
      row.arrival_time   !== null &&
      row.duration_minutes !== null

    if (hasVerifiedTimes) {
      return {
        verified:           true,
        train_id:           row.train_id,
        train_number:       row.train_number,
        train_name_en:      row.train_name_en,
        train_name_bn:      row.train_name_bn,
        train_type:         row.train_type,
        departure_time:     row.departure_time!.slice(0, 5),   // "HH:MM"
        arrival_time:       row.arrival_time!.slice(0, 5),     // "HH:MM"
        duration_minutes:   row.duration_minutes!,
        available_classes:  row.available_classes ?? [],
        avg_delay_minutes:  delay.avg_delay_minutes,
        delay_report_count: delay.delay_report_count,
      }
    }

    // Train operates this route (search_trains confirmed it via train_stops
    // sequence check) but the specific from/to stop times are missing.
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

  // Verified results (with real times) first; within each tier, sort by time / number.
  return results.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1
    if (a.verified && b.verified) return a.departure_time.localeCompare(b.departure_time)
    return a.train_number.localeCompare(b.train_number)
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
// Station codes match stations.code in the canonical seed (seed.sql).
// Only include pairs that have at least one train with verified stop data
// (i.e. trains that appear in train_stops). Other pairs render on-demand
// via ISR and still show Tier-1-equivalent results via the RPC.

export const TOP_ROUTES: { fromCode: string; toCode: string }[] = [
  // Dhaka–Chittagong: 5 trains with verified stops (701, 703, 704, 787, 788)
  { fromCode: 'DHKA', toCode: 'CTG'  },
  { fromCode: 'CTG',  toCode: 'DHKA' },
  // Dhaka–Sylhet: 1 train with verified stops (739)
  { fromCode: 'DHKA', toCode: 'SYT'  },
  { fromCode: 'SYT',  toCode: 'DHKA' },
  // Dhaka–Khulna: 1 train with verified stops (725)
  { fromCode: 'DHKA', toCode: 'KHU'  },
  { fromCode: 'KHU',  toCode: 'DHKA' },
  // Dhaka–Lalmonirhat: 1 train with verified stops (707)
  { fromCode: 'DHKA', toCode: 'LMH'  },
  { fromCode: 'LMH',  toCode: 'DHKA' },
  // The routes below have trains in the DB but NO verified stop times yet.
  // They are prerendered because they are high-traffic search terms, but the
  // RPC will return available_classes only (no departure/arrival times) until
  // stop data is backfilled from the official BR timetable PDF.
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
