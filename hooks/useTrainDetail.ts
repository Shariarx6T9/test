import { useQuery } from '@tanstack/react-query';
import { getTrainWithStops } from '../api/trains';
import { getFares } from '../api/fares';

export const useTrainDetail = (trainId: string) =>
  useQuery({
    queryKey: ['train', trainId],
    queryFn: () => getTrainWithStops(trainId),
    enabled: !!trainId,
    staleTime: 10 * 60 * 1000,
  });

export const useTrainFares = (params: {
  trainId: string;
  fromStationId: string;
  toStationId: string;
}) =>
  useQuery({
    queryKey: ['fares', params],
    queryFn: () => getFares(params),
    enabled: !!(params.trainId && params.fromStationId && params.toStationId),
    staleTime: 30 * 60 * 1000,
  });
