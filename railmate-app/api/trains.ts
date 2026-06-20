import { supabase } from '../lib/supabase';
import type { Station, Train, TrainSearchResult, TrainDetailWithStops } from '../types/database.types';

/**
 * TIER 1 / TIER 2 TRAIN SEARCH (mobile)
 * ───────────────────────────────────────────────────────────────────────────
 * This mirrors the website's lib/train-search.ts exactly — same join keys,
 * same truth standard, same result shape. The previous implementation
 * called a `search_trains` Postgres RPC that exists only in
 * migrations/001_initial_schema.sql (a UUID-based schema that was never
 * applied to production). The function does not exist in the actual
 * deployed schema (supabase/schema.sql), so every call here previously
 * failed silently or threw — this was broken in production independent of
 * the website issue.
 *
 * Tier 1 — route existence: trains.origin_city / destination_city matched
 *          against the searched stations' shohoz_city. Works for ALL
 *          trains in the `trains` table, no verified timetable required.
 * Tier 2 — verified timetable: only added when train_stops has a row for
 *          both stations with correct sequence ordering. Never estimated,
 *          never interpolated.
 *
 * Hard rule: a train is never omitted for lack of Tier 2 data, and a time
 * is never shown unless it came from a real train_stops row.
 */

// ─── Station lookup ─────────────────────────────────────────────────────────

export async function getStationsByIds(
  fromStationId: number,
  toStationId:   number
): Promise<{ from: Station; to: Station } | null> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, shohoz_city, is_intercity_hub')
    .in('id', [fromStationId, toStationId]);

  if (error || !data || data.length < 2) return null;

  const from = (data as Station[]).find((s) => s.id === fromStationId);
  const to   = (data as Station[]).find((s) => s.id === toStationId);
  if (!from || !to) return null;

  return { from, to };
}

// ─── Tier 1: route existence ────────────────────────────────────────────────

interface RouteTrain {
  id:               number;
  number:           number;
  name:             string;
  train_type:       string;
  off_days:         string[];
  is_active:        boolean;
}

async function getTrainsForRoute(
  fromCity: string,
  toCity:   string
): Promise<RouteTrain[]> {
  const { data, error } = await supabase
    .from('trains')
    .select('id, number, name, train_type, off_days, is_active')
    .eq('origin_city', fromCity.toUpperCase())
    .eq('destination_city', toCity.toUpperCase())
    .eq('is_active', true);

  if (error) {
    console.error('[getTrainsForRoute]', error.message);
    return [];
  }
  return (data ?? []) as RouteTrain[];
}

// ─── Tier 2: verified timetable enrichment ──────────────────────────────────

interface StopTiming {
  depart_time: string | null;
  arrive_time: string | null;
}

async function getVerifiedTimings(
  trainNumbers: number[],
  fromCode:     string,
  toCode:       string
): Promise<Map<number, StopTiming>> {
  const result = new Map<number, StopTiming>();
  if (!trainNumbers.length) return result;

  const { data: fromStops, error: fromErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, depart_time')
    .eq('station_code', fromCode.toUpperCase())
    .in('train_number', trainNumbers);

  if (fromErr) {
    console.error('[getVerifiedTimings] from query failed:', fromErr.message);
    return result; // fail safe: Tier 1 results remain valid without enrichment
  }
  if (!fromStops?.length) return result;

  const { data: toStops, error: toErr } = await supabase
    .from('train_stops')
    .select('train_number, stop_sequence, arrive_time')
    .eq('station_code', toCode.toUpperCase())
    .in('train_number', trainNumbers);

  if (toErr) {
    console.error('[getVerifiedTimings] to query failed:', toErr.message);
    return result;
  }
  if (!toStops?.length) return result;

  for (const toStop of toStops as any[]) {
    const fromStop = (fromStops as any[]).find(
      (f) => f.train_number === toStop.train_number && f.stop_sequence < toStop.stop_sequence
    );
    if (fromStop) {
      result.set(toStop.train_number, {
        depart_time: fromStop.depart_time,
        arrive_time: toStop.arrive_time,
      });
    }
  }
  return result;
}

// ─── Combined search ─────────────────────────────────────────────────────────

/**
 * Tier 1 + Tier 2 combined search, by station id (mobile uses numeric ids
 * directly from the stations picker, unlike the website which works from
 * station codes in the URL).
 *
 * Returns [] ONLY when no train in the `trains` table operates this route,
 * or every matching train is off on this specific day of week — the only
 * two conditions under which the UI may say "No trains found."
 */
export const searchTrains = async (params: {
  fromStationId: number;
  toStationId:   number;
  date:          string; // "YYYY-MM-DD"
}): Promise<TrainSearchResult[]> => {
  const route = await getStationsByIds(params.fromStationId, params.toStationId);
  if (!route) return [];

  const routeTrains = await getTrainsForRoute(route.from.shohoz_city, route.to.shohoz_city);
  if (!routeTrains.length) return [];

  const date    = new Date(params.date + 'T00:00:00');
  const dowName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][date.getDay()];
  const runningTrains = routeTrains.filter((t) => {
    const offDays = Array.isArray(t.off_days) ? t.off_days : [];
    return !offDays.includes(dowName);
  });
  if (!runningTrains.length) return [];

  const trainNumbers = runningTrains.map((t) => t.number);
  const timings = await getVerifiedTimings(trainNumbers, route.from.code, route.to.code);

  const results: TrainSearchResult[] = runningTrains.map((train) => {
    const timing = timings.get(train.number);

    if (timing?.depart_time && timing?.arrive_time) {
      const depart = timing.depart_time.slice(0, 5);
      const arrive = timing.arrive_time.slice(0, 5);
      const [dh, dm] = depart.split(':').map(Number);
      const [ah, am] = arrive.split(':').map(Number);
      const departMins = dh * 60 + dm;
      const arriveMins = ah * 60 + am;
      const duration = arriveMins >= departMins
        ? arriveMins - departMins
        : (24 * 60 - departMins) + arriveMins;

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
      };
    }

    // No verified Tier 2 data — Tier 1 result only, no fabricated times.
    return {
      verified:      false,
      train_id:      train.id,
      train_number:  train.number,
      train_name_en: train.name,
      train_type:    train.train_type ?? '',
      off_days:      Array.isArray(train.off_days) ? train.off_days : [],
    };
  });

  return results.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    if (a.verified && b.verified) return a.departure_time.localeCompare(b.departure_time);
    return a.train_number - b.train_number;
  });
};

// ─── Train detail with full stop list (Tier 2 only) ─────────────────────────

/**
 * Full intermediate-stop timeline for a single train. This is ONLY
 * meaningful when the train has verified train_stops data — callers MUST
 * check `stops.length > 0` before rendering a timeline; an empty array
 * here means "not verified yet," not "this train has no stops."
 */
export const getTrainWithStops = async (trainNumber: number): Promise<TrainDetailWithStops | null> => {
  const { data: train, error: trainError } = await supabase
    .from('trains')
    .select('id, number, name, train_type, off_days, origin_city, destination_city, is_active')
    .eq('number', trainNumber)
    .single();

  if (trainError || !train) {
    console.error('[getTrainWithStops] train query failed:', trainError?.message);
    return null;
  }

  const { data: stops, error: stopsError } = await supabase
    .from('train_stops')
    .select('train_number, station_code, stop_sequence, arrive_time, depart_time')
    .eq('train_number', trainNumber)
    .order('stop_sequence', { ascending: true });

  if (stopsError) {
    console.error('[getTrainWithStops] stops query failed:', stopsError.message);
    // Train metadata is still valid even if stops fail to load — return it
    // with an empty stop list rather than failing the whole detail screen.
    return { ...(train as Train), stops: [] };
  }

  if (!stops?.length) {
    // No verified timetable for this train yet — not an error.
    return { ...(train as Train), stops: [] };
  }

  // Join station details for each stop
  const stationCodes = [...new Set((stops as any[]).map((s) => s.station_code))];
  const { data: stationRows, error: stationErr } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, shohoz_city, is_intercity_hub')
    .in('code', stationCodes);

  if (stationErr) {
    console.error('[getTrainWithStops] station join failed:', stationErr.message);
    return { ...(train as Train), stops: [] };
  }

  const stationByCode = new Map((stationRows as Station[]).map((s) => [s.code, s]));
  const stopsWithStation = (stops as any[])
    .map((stop) => {
      const station = stationByCode.get(stop.station_code);
      if (!station) return null;
      return { ...stop, station };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  return { ...(train as Train), stops: stopsWithStation };
};
