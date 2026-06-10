import { supabase } from '../lib/supabase';
import { TrainSearchResult, TrainDetailWithStops } from '../types/database.types';

export const searchTrains = async (params: {
  fromStationId: string;
  toStationId: string;
  date: string;
}): Promise<TrainSearchResult[]> => {
  const { data, error } = await supabase.rpc('search_trains', {
    p_from_station_id: params.fromStationId,
    p_to_station_id: params.toStationId,
    p_journey_date: params.date,
  });

  if (error) throw error;
  return data as TrainSearchResult[];
};

export const getTrainWithStops = async (trainId: string): Promise<TrainDetailWithStops> => {
  const { data: train, error: trainError } = await supabase
    .from('trains')
    .select(`
      *,
      origin:stations!origin_id(*),
      destination:stations!destination_id(*)
    `)
    .eq('id', trainId)
    .single();

  if (trainError) throw trainError;

  const { data: stops, error: stopsError } = await supabase
    .from('train_stops')
    .select(`
      *,
      station:stations(*)
    `)
    .eq('train_id', trainId)
    .order('sequence', { ascending: true });

  if (stopsError) throw stopsError;

  return {
    ...train,
    stops,
  } as TrainDetailWithStops;
};
