import React, { useEffect, useState } from 'react';
import '../global.css';
import {
  View, Image, StyleSheet, Animated,
} from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { usePrefsStore } from '../stores/prefsStore';
import { useThemeColors, useResolvedTheme } from '../hooks/useThemeColors';
import { getThemeVars } from '../lib/themeVars';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  // DSN sourced from environment — never hardcode secrets in source.
  // Set EXPO_PUBLIC_SENTRY_DSN in your .env file.
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  sendDefaultPii: false,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
  // Enable Spotlight in dev for local error inspection
  spotlight: __DEV__,
  // Don't send events during development — reduces noise
  enabled: !__DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const { isGuest } = useAuthStore();
  const { theme: themePref, hasFinishedOnboarding } = usePrefsStore();
  const router = useRouter();
  const segments = useSegments();
  const [initialized, setInitialized] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const resolvedTheme = useResolvedTheme();
  const colors = useThemeColors();
  const themeVars = getThemeVars(resolvedTheme);

  // Keep NativeWind `dark:` variant resolution in sync with user preference.
  useEffect(() => {
    nativewindColorScheme.set(themePref === 'system' ? 'system' : resolvedTheme);
  }, [themePref, resolvedTheme]);

  useEffect(() => {
    (async () => {
      await initialize();
      setInitialized(true);
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setSplashDone(true));
      }, 1800);
    })();
  }, []);

  useEffect(() => {
    if (!initialized || isLoading) return;

    const seg0 = segments[0] as string | undefined;
    const inAuthGroup       = seg0 === 'auth';
    const inOnboardingGroup = seg0 === 'onboarding';
    const inOnboardingRoot  = seg0 === 'onboarding' || segments.join('/') === 'onboarding';

    // 1. New user who hasn't completed onboarding → show onboarding
    if (!hasFinishedOnboarding && !inOnboardingGroup && seg0 !== 'onboarding') {
      router.replace('/onboarding' as any);
      return;
    }

    // 2. Authenticated user landing on auth screens → go home
    if ((isAuthenticated || isGuest) && inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }

    // 3. Unauthenticated, not guest, onboarding done → send to login
    if (!isAuthenticated && !isGuest && !inAuthGroup && !inOnboardingGroup && hasFinishedOnboarding) {
      router.replace('/auth/login' as any);
      return;
    }
  }, [initialized, isLoading, isAuthenticated, isGuest, hasFinishedOnboarding, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={[{ flex: 1, backgroundColor: colors['bg-base'] }, themeVars]}>
        <Slot />
        {!splashDone && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              s.splash,
              { backgroundColor: colors['bg-base'] },
              { opacity: fadeAnim },
            ]}
          >
            <Image
              source={require('../assets/images/splash.png')}
              style={s.splashImage}
              resizeMode="cover"
            />
          </Animated.View>
        )}
      </View>
    </QueryClientProvider>
  );
});

const s = StyleSheet.create({
  splash:      { zIndex: 9999 },
  splashImage: { ...StyleSheet.absoluteFillObject },
});
