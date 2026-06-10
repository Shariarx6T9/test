import 'react-native-get-random-values';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'railmate_saved_routes';

export interface SavedRoute {
  id: string;
  fromStation: { id: string; name_en: string; name_bn: string; code: string };
  toStation: { id: string; name_en: string; name_bn: string; code: string };
  savedAt: string;
}

export const useSavedRoutes = () => {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedRoutes(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading saved routes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const saveRoute = async (fromStation: SavedRoute['fromStation'], toStation: SavedRoute['toStation']) => {
    try {
      // Check if already saved
      if (savedRoutes.some(r => r.fromStation.id === fromStation.id && r.toStation.id === toStation.id)) {
        return true;
      }

      const newRoute: SavedRoute = {
        id: nanoid(),
        fromStation,
        toStation,
        savedAt: new Date().toISOString(),
      };

      const updatedRoutes = [newRoute, ...savedRoutes].slice(0, 3);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
      return true;
    } catch (error) {
      console.error('Error saving route:', error);
      return false;
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      const updatedRoutes = savedRoutes.filter(route => route.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const isRouteSaved = (fromId: string, toId: string) => {
    return savedRoutes.some(
      route => route.fromStation.id === fromId && route.toStation.id === toId
    );
  };

  return {
    savedRoutes,
    loading,
    saveRoute,
    deleteRoute,
    isRouteSaved,
    refresh: loadRoutes,
  };
};
