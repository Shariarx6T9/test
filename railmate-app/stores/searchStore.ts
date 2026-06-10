import { create } from 'zustand';
import { Station } from '../types/database.types';

interface SearchStore {
  fromStation: Station | null;
  toStation: Station | null;
  date: string; // ISO date string YYYY-MM-DD
  setFromStation: (station: Station | null) => void;
  setToStation: (station: Station | null) => void;
  setDate: (date: string) => void;
  swapStations: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  fromStation: null,
  toStation: null,
  date: new Date().toISOString().split('T')[0],
  setFromStation: (station) => set({ fromStation: station }),
  setToStation: (station) => set({ toStation: station }),
  setDate: (date) => set({ date }),
  swapStations: () =>
    set((state) => ({
      fromStation: state.toStation,
      toStation: state.fromStation,
    })),
}));
