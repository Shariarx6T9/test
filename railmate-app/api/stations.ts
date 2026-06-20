import { supabase } from '../lib/supabase';
import { Station } from '../types/database.types';

/**
 * stations table has NO is_active column (that's only on `trains`).
 * The previous .eq('is_active', true) filter caused PostgREST to 400 on
 * every call, silently caught upstream by useStations' try/catch and
 * masked by FALLBACK_STATIONS — meaning the picker never showed real
 * station data against production.
 */
export const getAllStations = async (): Promise<Station[]> => {
  const { data, error } = await supabase
    .from('stations')
    .select('id, code, name_en, name_bn, division, shohoz_city, is_intercity_hub')
    .order('name_en', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Station[];
};
