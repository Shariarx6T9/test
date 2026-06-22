// hooks/useRecentSearches.ts
//
// Local search history — distinct from useSavedRoutes (explicit bookmarks).
// A "recent search" is recorded automatically every time the user runs a
// search; a saved route is an explicit, user-initiated bookmark. The two
// lists intentionally overlap in the UI (Search_Trains reference shows a
// bookmark toggle on each recent-search row) but are stored separately,
// mirroring how useSavedRoutes.ts already separates "what I saved" from
// "what I did."
//
// No remote sync — recent searches are ephemeral/local-only by design,
// same as browser history. Modeled on the dual-storage pattern in
// useSavedRoutes.ts but AsyncStorage-only (no Supabase table for this).

import 'react-native-get-random-values';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import { TrainClass } from '../types/database.types';

const LOCAL_STORAGE_KEY = 'railmate_recent_searches';
const MAX_RECENT = 10;

export interface RecentSearch {
  id: string;
  fromStation: { id: number; name_en: string; name_bn: string; code: string };
  toStation: { id: number; name_en: string; name_bn: string; code: string };
  date: string; // ISO date string YYYY-MM-DD, the journey date searched
  selectedClass: TrainClass | null;
  searchedAt: string; // ISO timestamp, when the search was run
}

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      setRecentSearches(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.error('useRecentSearches load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addRecentSearch = useCallback(
    async (
      fromStation: RecentSearch['fromStation'],
      toStation: RecentSearch['toStation'],
      date: string,
      selectedClass: TrainClass | null,
    ): Promise<void> => {
      try {
        // De-duplicate: drop any existing entry for the same from/to/date so
        // re-running an identical search just bumps it to the top.
        const deduped = recentSearches.filter(
          (r) =>
            !(r.fromStation.id === fromStation.id &&
              r.toStation.id === toStation.id &&
              r.date === date)
        );

        const entry: RecentSearch = {
          id: nanoid(),
          fromStation,
          toStation,
          date,
          selectedClass,
          searchedAt: new Date().toISOString(),
        };

        const updated = [entry, ...deduped].slice(0, MAX_RECENT);
        setRecentSearches(updated);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('addRecentSearch error:', err);
      }
    },
    [recentSearches],
  );

  const removeRecentSearch = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updated = recentSearches.filter((r) => r.id !== id);
        setRecentSearches(updated);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('removeRecentSearch error:', err);
      }
    },
    [recentSearches],
  );

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error('clearAll recent searches error:', err);
    }
  }, []);

  return {
    recentSearches,
    loading,
    addRecentSearch,
    removeRecentSearch,
    clearAll,
    refresh: load,
  };
};
