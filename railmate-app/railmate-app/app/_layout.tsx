import React, { useEffect } from 'react';
import '../global.css';
import { View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
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
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { usePrefsStore } from '../stores/prefsStore';
import { useThemeColors, useResolvedTheme } from '../hooks/useThemeColors';
import { getThemeVars } from '../lib/themeVars';

// Keep the native splash visible until fonts + auth are ready.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const { isGuest } = useAuthStore();
  const { theme: themePref, hasFinishedOnboarding } = usePrefsStore();
  const router = useRouter();
  const segments = useSegments();

  const resolvedTheme = useResolvedTheme();
  const colors = useThemeColors();

  // Safely compute NativeWind CSS vars — fall back to empty object on error
  let themeVars: object = {};
  try {
    themeVars = getThemeVars(resolvedTheme);
  } catch {
    // vars() not yet available — safe fallback
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

  // Sync NativeWind color scheme with user preference.
  useEffect(() => {
    nativewindColorScheme.set(themePref === 'system' ? 'system' : resolvedTheme);
  }, [themePref, resolvedTheme]);

  // Init auth then hide the native splash.
  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    (async () => {
      try {
        await initialize();
      } catch {
        // Auth init failed — proceed anyway; nav guard will redirect
      }
      // Hide native splash now that fonts + auth are ready
      await SplashScreen.hideAsync().catch(() => {});
    })();
  }, [fontsLoaded, fontError]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigation guard — runs after auth is settled.
  useEffect(() => {
    if (isLoading) return;

    const seg0 = segments[0] as string | undefined;
    const inAuthGroup       = seg0 === 'auth';
    const inOnboardingGroup = seg0 === 'onboarding';

    if (!hasFinishedOnboarding && !inOnboardingGroup) {
      router.replace('/onboarding/welcome' as any);
      return;
    }
    if ((isAuthenticated || isGuest) && inAuthGroup) {
      router.replace('/(tabs)');
      return;
    }
    if (!isAuthenticated && !isGuest && !inAuthGroup && !inOnboardingGroup && hasFinishedOnboarding) {
      router.replace('/auth/login' as any);
      return;
    }
  }, [isLoading, isAuthenticated, isGuest, hasFinishedOnboarding, segments, router]);

  // Don't render anything until fonts are ready — native splash is still showing
  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <View style={[{ flex: 1, backgroundColor: colors['bg-base'] }, themeVars as any]}>
        <Slot />
      </View>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
