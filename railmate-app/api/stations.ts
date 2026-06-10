import { supabase } from '../lib/supabase';
import { Station } from '../types/database.types';

export const getAllStations = async (): Promise<Station[]> => {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('is_active', true)
    .order('name_en', { ascending: true });

  if (error) throw error;
  return data as Station[];
};
