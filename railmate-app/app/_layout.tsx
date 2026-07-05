// app/_layout.tsx
import React, { useEffect, useState } from 'react';
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
import { AppSplash } from '../components/AppSplash';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { usePrefsStore } from '../stores/prefsStore';
import { useThemeColors, useResolvedTheme } from '../hooks/useThemeColors';
import { getThemeVars } from '../lib/themeVars';

// Native splash stays up only until fonts are ready. Android's native
// SplashScreen API is icon-only by OS design (see app.json comment) — it
// cannot show full-bleed art, so we hand off to our own AppSplash the
// moment fonts are loaded, and keep AppSplash up during auth init instead.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const { isGuest } = useAuthStore();
  const { theme: themePref, hasFinishedOnboarding } = usePrefsStore();
  const router = useRouter();
  const segments = useSegments();

  const resolvedTheme = useResolvedTheme();
  const colors = useThemeColors();

  let themeVars: object = {};
  try {
    themeVars = getThemeVars(resolvedTheme);
  } catch {
    themeVars = {};
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

  useEffect(() => {
    nativewindColorScheme.set(themePref === 'system' ? 'system' : resolvedTheme);
  }, [themePref, resolvedTheme]);

  // Hide native splash the instant fonts are ready — do NOT wait for auth.
  // AppSplash (full-bleed, your real art) takes over immediately below.
  const [authInitStarted, setAuthInitStarted] = useState(false);
  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    SplashScreen.hideAsync().catch(() => {});
    if (!authInitStarted) {
      setAuthInitStarted(true);
      initialize().catch(() => {
        // Auth init failed — proceed anyway; nav guard below will redirect
      });
    }
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

  // Still loading fonts — the OS-controlled native splash is still visible.
  if (!fontsLoaded && !fontError) return null;

  // Fonts ready, native splash just hid — bridge with our full-bleed splash
  // while auth initializes, instead of jumping straight to a bare screen.
  if (isLoading) return <AppSplash />;

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