// types/station.types.ts
// Single source of truth for Station type — re-exports from database.types.
// All callers should import Station from here; the underlying type is database.types.Station.
export type { Station } from './database.types';
