import { supabase } from '../lib/supabase';
import { Fare } from '../types/database.types';

export const getFares = async (params: {
  trainId: string;
  fromStationId: string;
  toStationId: string;
}): Promise<Fare[]> => {
  // Try to find fares specific to this train first, then fallback to general fares (train_id IS NULL)
  const { data, error } = await supabase
    .from('fares')
    .select('*')
    .eq('from_station_id', params.fromStationId)
    .eq('to_station_id', params.toStationId)
    .or(`train_id.eq.${params.trainId},train_id.is.null`);

  if (error) throw error;
  
  // If there are both train-specific and general fares, prioritize train-specific ones
  // In practice, for a specific route and class, we'd want the most specific one.
  // The search_trains RPC does a simpler logic. 
  // Here we return all matching and let the UI handle it or we can filter here.
  
  return data as Fare[];
};
