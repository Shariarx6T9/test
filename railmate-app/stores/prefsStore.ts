import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrefsStore {
  language: 'bn' | 'en';
  theme: 'dark' | 'light' | 'system';
  setLanguage: (lang: 'bn' | 'en') => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set) => ({
      language: 'bn',
      theme: 'dark',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'railmate-prefs',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
