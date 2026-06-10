export type TrainClass =
  | 'SHOVON'
  | 'SHOVON_CHAIR'
  | 'SNIGDHA'
  | 'AC_BERTH'
  | 'AC_SEAT'
  | 'FIRST_BERTH'
  | 'FIRST_SEAT'
  | 'AC_S_CHAIR';

export interface Station {
  id: string;
  code: string;
  name_en: string;
  name_bn: string;
  division: string | null;
  zone: 'East' | 'West' | null;
  is_major: boolean;
  is_active: boolean;
}

export interface Train {
  id: string;
  number: string;
  name_en: string;
  name_bn: string;
  type: 'Intercity' | 'Mail' | 'Local' | 'Express';
  origin_id: string;
  destination_id: string;
  days_of_week: number[];
  is_active: boolean;
  last_verified: string | null;
}

export interface TrainStop {
  id: string;
  train_id: string;
  station_id: string;
  sequence: number;
  arrival_time: string | null;   // "HH:MM:SS"
  departure_time: string | null; // "HH:MM:SS"
  halt_minutes: number;
  is_major_stop: boolean;
  station?: Station;             // joined
}

export interface Fare {
  id: string;
  train_id: string | null;
  from_station_id: string;
  to_station_id: string;
  class: TrainClass;
  price_bdt: number;
  last_verified: string | null;
}

export interface TrainSearchResult {
  train_id: string;
  train_number: string;
  train_name_en: string;
  train_name_bn: string;
  train_type: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  available_classes: TrainClass[];
}

export interface TrainDetailWithStops extends Train {
  stops: (TrainStop & { station: Station })[];
  origin: Station;
  destination: Station;
}
