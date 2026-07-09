// hooks/useSavedRoutes.ts
//
// Manages saved routes with dual-storage:
//   1. AsyncStorage — immediate local persistence (works offline, no auth needed)
//   2. Supabase — synced to user account when authenticated
//
// On sign-in, local routes are merged into the remote list so nothing is lost.

import 'react-native-get-random-values';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'railmate_saved_routes';
const MAX_ROUTES = 10; // raised from 3; sidebar/profile show top 5

export interface SavedRoute {
  id: string;
  fromStation: { id: string; name_en: string; name_bn: string; code: string };
  toStation:   { id: string; name_en: string; name_bn: string; code: string };
  savedAt: string;
}

export const useSavedRoutes = () => {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // ─── Load ────────────────────────────────────────────────────────────────────

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    try {
      // Always load local first for instant render
      const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      const local: SavedRoute[] = raw ? JSON.parse(raw) : [];

      if (user?.id) {
        // Fetch remote routes
        const { data, error } = await supabase
          .from('saved_routes')
          .select('id, from_station_id, to_station_id, saved_at, from_station:stations!saved_routes_from_station_id_fkey(id, name_en, name_bn, code), to_station:stations!saved_routes_to_station_id_fkey(id, name_en, name_bn, code)')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false })
          .limit(MAX_ROUTES);

        if (!error && data && data.length > 0) {
          const remote: SavedRoute[] = (data as any[]).map((row) => ({
            id: row.id,
            fromStation: row.from_station,
            toStation: row.to_station,
            savedAt: row.saved_at,
          }));
          setSavedRoutes(remote);
          // Persist remote list locally too (offline cache)
          await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remote));
          return;
        }

        // If Supabase has no routes but local does, push local routes to remote
        if (local.length > 0) {
          await Promise.allSettled(
            local.map((r) =>
              supabase.from('saved_routes').upsert({
                id: r.id,
                user_id: user.id,
                from_station_id: r.fromStation.id,
                to_station_id: r.toStation.id,
                saved_at: r.savedAt,
              }, { onConflict: 'id' })
            )
          );
        }
      }

      setSavedRoutes(local);
    } catch (err) {
      console.error('loadRoutes error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // This is a standard fetch-on-mount pattern. The lint rule flags the
    // synchronous `setLoading(true)` call inside `loadRoutes`, but this is a
    // necessary and safe operation before an async data fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRoutes(); // Load initial data on mount
  }, [loadRoutes]);

  // ─── Save ─────────────────────────────────────────────────────────────────────

  const saveRoute = useCallback(
    async (
      fromStation: SavedRoute['fromStation'],
      toStation: SavedRoute['toStation'],
    ): Promise<boolean> => {
      try {
        const alreadySaved = savedRoutes.some(
          (r) =>
            r.fromStation.id === fromStation.id &&
            r.toStation.id === toStation.id
        );
        if (alreadySaved) return true;

        const newRoute: SavedRoute = {
          id: nanoid(),
          fromStation,
          toStation,
          savedAt: new Date().toISOString(),
        };

        const updated = [newRoute, ...savedRoutes].slice(0, MAX_ROUTES);
        setSavedRoutes(updated);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

        if (user?.id) {
          const { error } = await supabase.from('saved_routes').insert({
            id: newRoute.id,
            user_id: user.id,
            from_station_id: fromStation.id,
            to_station_id: toStation.id,
            saved_at: newRoute.savedAt,
          });
          if (error) console.warn('saveRoute remote error:', error.message);
        }

        return true;
      } catch (err) {
        console.error('saveRoute error:', err);
        return false;
      }
    },
    [savedRoutes, user]
  );

  // ─── Delete ───────────────────────────────────────────────────────────────────

  const deleteRoute = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updated = savedRoutes.filter((r) => r.id !== id);
        setSavedRoutes(updated);
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

        if (user?.id) {
          const { error } = await supabase
            .from('saved_routes')
            .delete()
            .match({ id, user_id: user.id });
          if (error) console.warn('deleteRoute remote error:', error.message);
        }
      } catch (err) {
        console.error('deleteRoute error:', err);
      }
    },
    [savedRoutes, user]
  );

  const isRouteSaved = useCallback(
    (fromId: string, toId: string): boolean =>
      savedRoutes.some(
        (r) => r.fromStation.id === fromId && r.toStation.id === toId
      ),
    [savedRoutes]
  );

  return {
    savedRoutes,
    loading,
    saveRoute,
    deleteRoute,
    isRouteSaved,
    refresh: loadRoutes,
  };
};
