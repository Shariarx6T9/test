import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  phone?: string | null;
  email?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  language_pref?: string;
  theme_pref?: string;
  is_premium?: boolean;
  created_at?: string;
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  setUser: (user: AppUser | null) => void;
  setSession: (session: Session | null) => void;
  setGuest: (val: boolean) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      isGuest: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) =>
        set({ session, isAuthenticated: !!session }),
      setGuest: (val) => set({ isGuest: val }),
      clearAuth: () =>
        set({ user: null, session: null, isAuthenticated: false, isGuest: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'railmate-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);

export type { SupabaseUser };