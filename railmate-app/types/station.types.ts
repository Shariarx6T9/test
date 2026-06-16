// types/station.types.ts
// Superset Station type that satisfies both the Supabase DB response and the
// offline fallback data in hooks/useStations.ts.  All extra fields are optional
// so existing callers continue to work without changes.
export interface Station {
  id: string;
  code: string;
  name_en: string;
  name_bn: string;
  // Supabase DB columns
  division?: string | null;
  zone?: string | null;
  is_major?: boolean;
  is_active?: boolean;
  // Offline fallback / extended columns
  is_junction?: boolean;
  latitude?: number;
  longitude?: number;
}
