import React, { useEffect, useState } from 'react';
import '../global.css';
import {
  View, Image, StyleSheet, Animated,
} from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { usePrefsStore } from '../stores/prefsStore';
import { useThemeColors, useResolvedTheme } from '../hooks/useThemeColors';
import { getThemeVars } from '../lib/themeVars';
import * as Sentry from '@sentry/react-native';

// Hold the native splash screen (the one configured in app.json under the
// expo-splash-screen plugin) on screen until we explicitly hide it below.
// Without this call the native splash auto-hides the instant the JS bundle
// finishes loading — before initialize() resolves — leaving a blank gap
// before the JS splash overlay mounts.
//
// NOTE: the native splash config intentionally has NO image — Android has
// a known bug (expo/expo#37915, #33138) where resizeMode: cover is ignored
// and the image renders tiny and centered instead of full-screen. The native
// splash is now just the solid backgroundColor (#080D17); the actual
// splash.png artwork only ever renders via the JS overlay below, which is
// not subject to that native rendering bug.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Safe to ignore — only fails if called multiple times (e.g. Fast Refresh).
});

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
      // Hide the native splash (solid color, no image — see note above) and
      // reveal the JS overlay below, which renders the actual splash.png
      // artwork full-bleed via resizeMode="cover". Since native has no image
      // to swap out, there's no flash/jump here, just background color to
      // background color underneath the already-mounted JS Image.
      await SplashScreen.hideAsync();
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setSplashDone(true));
      }, 600);
    })();
  }, []);

  useEffect(() => {
    if (!initialized || isLoading) return;

    const seg0 = segments[0] as string | undefined;
    const inAuthGroup       = seg0 === 'auth';
    const inOnboardingGroup = seg0 === 'onboarding';

    // 1. New user who hasn't completed onboarding → show onboarding
    if (!hasFinishedOnboarding && !inOnboardingGroup && seg0 !== 'onboarding') {
      router.replace('/onboarding/welcome' as any);
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
            {/* Same splash.png + same resizeMode='cover' as the native splash
                configured in app.json (expo-splash-screen plugin) — this
                must visually match exactly, or the native→JS handoff in
                the effect above will look like a jump/flash. */}
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
