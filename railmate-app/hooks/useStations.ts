import { useQuery } from '@tanstack/react-query';
import { getAllStations } from '../api/stations';

export const useStations = () =>
  useQuery({
    queryKey: ['stations'],
    queryFn: getAllStations,
    staleTime: 60 * 60 * 1000,  // 1 hour
  });
