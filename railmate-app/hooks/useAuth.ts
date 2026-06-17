import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore, AppUser } from '../stores/authStore';

const BD_PHONE_REGEX = /^\+880\d{10}$/;

function normalizeBDPhone(phone: string): string {
  let cleaned = phone.trim().replace(/\s+/g, '');
  if (cleaned.startsWith('+880')) return cleaned;
  if (cleaned.startsWith('880')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+880${cleaned.slice(1)}`;
  return `+880${cleaned}`;
}

export function useAuth() {
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    setUser,
    setSession,
    clearAuth,
    setLoading,
  } = useAuthStore();

  // Keep a stable ref to the active subscription so we can unsubscribe on
  // cleanup and never register more than one listener at a time.
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const fetchProfile = useCallback(
    async (userId: string): Promise<AppUser | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('fetchProfile error:', error.message);
        return null;
      }
      return data as AppUser | null;
    },
    []
  );

  const initialize = useCallback(async () => {
    setLoading(true);

    // Tear down any previous auth-state listener before creating a new one.
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession?.user) {
        const profile = await fetchProfile(currentSession.user.id);
        setUser(
          profile ?? {
            id: currentSession.user.id,
            phone: currentSession.user.phone,
            email: currentSession.user.email,
          }
        );
      } else {
        setUser(null);
      }

      // Register exactly one auth-state listener and store the handle.
      const { data: listenerData } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            setUser(
              profile ?? {
                id: session.user.id,
                phone: session.user.phone,
                email: session.user.email,
              }
            );
          } else {
            setUser(null);
          }
        }
      );
      subscriptionRef.current = listenerData.subscription;
    } catch (err) {
      console.error('initialize error:', err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSession, setUser, clearAuth, fetchProfile]);

  // Clean up the listener when the hook unmounts (e.g. root layout unmount).
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, []);

  const signInWithPhone = useCallback(async (phone: string) => {
    const formatted = normalizeBDPhone(phone);
    if (!BD_PHONE_REGEX.test(formatted)) {
      return { error: 'invalid_phone', data: null };
    }
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formatted,
    });
    if (error) return { error: error.message, data: null };
    return { error: null, data: { ...data, contact: formatted } };
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: trimmed,
    });
    if (error) return { error: error.message, data: null };
    return { error: null, data: { ...data, contact: trimmed } };
  }, []);

  const verifyOTP = useCallback(
    async (contact: string, token: string, type: 'phone' | 'email') => {
      const payload =
        type === 'phone'
          ? { phone: contact, token, type: 'sms' as const }
          : { email: contact, token, type: 'email' as const };

      const { data, error } = await supabase.auth.verifyOtp(payload);

      if (error) return { error: error.message, data: null, isNewUser: false };

      const authedUser = data.session?.user ?? data.user;
      setSession(data.session);

      let isNewUser = false;

      if (authedUser) {
        const profile = await fetchProfile(authedUser.id);
        if (!profile) {
          isNewUser = true;
          setUser({
            id: authedUser.id,
            phone: authedUser.phone,
            email: authedUser.email,
          });
        } else {
          setUser(profile);
        }
      }

      return { error: null, data, isNewUser };
    },
    [setSession, setUser, fetchProfile]
  );

  const register = useCallback(
    async (displayName: string, avatarUrl?: string) => {
      const currentSession = useAuthStore.getState().session;
      const authUser = currentSession?.user;

      if (!authUser) return { error: 'no_session', data: null };

      const payload: Partial<AppUser> & { id: string } = {
        id: authUser.id,
        display_name: displayName.trim(),
        phone: authUser.phone ?? null,
        email: authUser.email ?? null,
      };

      if (avatarUrl) payload.avatar_url = avatarUrl;

      const { data, error } = await supabase
        .from('users')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) return { error: error.message, data: null };

      setUser(data as AppUser);
      return { error: null, data };
    },
    [setUser]
  );

  const signOut = useCallback(async () => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    const { error } = await supabase.auth.signOut();
    useAuthStore.getState().setGuest(false);
    clearAuth();
    if (error) return { error: error.message };
    return { error: null };
  }, [clearAuth]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    initialize,
    signInWithPhone,
    signInWithEmail,
    verifyOTP,
    register,
    signOut,
  };
}
