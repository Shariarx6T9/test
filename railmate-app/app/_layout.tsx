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

// Sentry: initialise only when a real DSN is configured to avoid a white
// screen caused by the SDK trying to contact an empty/placeholder endpoint.
let SentryWrap: <T extends React.ComponentType<any>>(c: T) => T = (c) => c;
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';
if (sentryDsn && !sentryDsn.includes('placeholder') && !sentryDsn.startsWith('https://your')) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require('@sentry/react-native');
    Sentry.init({
      dsn: sentryDsn,
      sendDefaultPii: false,
      enabled: !__DEV__,
    });
    SentryWrap = Sentry.wrap;
  } catch {
    // Sentry unavailable — continue without it
  }
}

function RootLayout() {
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

  // Safely compute NativeWind CSS vars — fall back to empty object on error
  let themeVars: object = {};
  try {
    themeVars = getThemeVars(resolvedTheme);
  } catch {
    // NativeWind vars() not available yet — skip on first render
  }

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
    if (!fontsLoaded && !fontError) return;

    (async () => {
      try {
        await initialize();
      } catch {
        // Auth init failed — continue; the navigation guard below will redirect
      }
      setInitialized(true);
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setSplashDone(true));
      }, 600);
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
      <View style={[{ flex: 1, backgroundColor: colors['bg-base'] }, themeVars as any]}>
        <Slot />
        {!splashDone && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              s.splash,
              { backgroundColor: '#080D17' },
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
}

export default SentryWrap(RootLayout);

const s = StyleSheet.create({
  splash:      { zIndex: 9999 },
  splashImage: { ...StyleSheet.absoluteFillObject },
});
