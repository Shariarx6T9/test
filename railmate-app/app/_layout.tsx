import React, { useEffect, useState } from 'react';
import '../global.css';
import {
  View, Image, StyleSheet, Animated,
} from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  NotoSansBengali_400Regular,
  NotoSansBengali_600SemiBold,
} from '@expo-google-fonts/noto-sans-bengali';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';
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

  // BLOCKER 1 FIX: Load all four font families required by the design system.
  // @expo-google-fonts packages require an explicit useFonts() call — the
  // expo-font plugin alone only handles locally-bundled assets, not npm packages.
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    NotoSansBengali_400Regular,
    NotoSansBengali_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  // Keep NativeWind `dark:` variant resolution in sync with user preference.
  useEffect(() => {
    nativewindColorScheme.set(themePref === 'system' ? 'system' : resolvedTheme);
  }, [themePref, resolvedTheme]);

  useEffect(() => {
    // Wait for fonts before initializing auth so the first rendered frame uses
    // the correct typefaces. fontError is treated as loaded (font failed but
    // the app should still work with system font fallback rather than hang).
    if (!fontsLoaded && !fontError) return;

    (async () => {
      await initialize();
      setInitialized(true);
      // Reduce splash delay: fonts are already loaded by this point so 800ms
      // is enough to avoid a flash-of-unstyled-content without over-blocking.
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setSplashDone(true));
      }, 800);
    })();
  }, [fontsLoaded, fontError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialized || isLoading) return;

    const seg0 = segments[0] as string | undefined;
    const inAuthGroup       = seg0 === 'auth';
    const inOnboardingGroup = seg0 === 'onboarding';

    // 1. New user who hasn't completed onboarding → show onboarding
    if (!hasFinishedOnboarding && !inOnboardingGroup) {
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
  }, [initialized, isLoading, isAuthenticated, isGuest, hasFinishedOnboarding, segments, router]);

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
