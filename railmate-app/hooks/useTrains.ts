import { useQuery } from '@tanstack/react-query';
import { searchTrains } from '../api/trains';

export const useSearchTrains = (params: {
  fromStationId: number | undefined;
  toStationId:   number | undefined;
  date:          string;
}) =>
  useQuery({
    queryKey: ['trains', 'search', params],
    queryFn: () => searchTrains({
      fromStationId: params.fromStationId!,
      toStationId:   params.toStationId!,
      date:          params.date,
    }),
    enabled: !!(params.fromStationId && params.toStationId && params.date),
    staleTime: 5 * 60 * 1000,  // 5 minutes
  });
