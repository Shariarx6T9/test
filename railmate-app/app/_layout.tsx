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
  dsn: 'https://c786957ff4cbc536501121e941a7888c@o4511573011726336.ingest.us.sentry.io/4511573013364736',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const { isGuest } = useAuthStore();
  const { theme: themePref } = usePrefsStore();
  const router = useRouter();
  const segments = useSegments();
  const [initialized, setInitialized] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const resolvedTheme = useResolvedTheme();
  const colors = useThemeColors();
  const themeVars = getThemeVars(resolvedTheme);

  // Keep NativeWind's `dark:` variant resolution and any direct
  // `useColorScheme()` (from 'nativewind') consumers in sync with the
  // user's theme preference from prefsStore.
  useEffect(() => {
    nativewindColorScheme.set(themePref === 'system' ? 'system' : resolvedTheme);
  }, [themePref, resolvedTheme]);

  useEffect(() => {
    (async () => {
      await initialize();
      setInitialized(true);
      // Keep splash visible for 2 seconds then fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setSplashDone(true));
      }, 2000);
    })();
  }, []);

  useEffect(() => {
    if (!initialized || isLoading) return;
    const inAuthGroup = (segments[0] as string) === 'auth';
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [initialized, isLoading, isAuthenticated, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={[{ flex: 1, backgroundColor: colors['bg-base'] }, themeVars]}>
        <Slot />
        {/* Full-screen JS splash overlay — fades out after 2s */}
        {!splashDone && (
          <Animated.View style={[StyleSheet.absoluteFill, s.splash, { backgroundColor: colors['bg-base'] }, { opacity: fadeAnim }]}>
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
  splash: {
    zIndex: 9999,
  },
  splashImage: {
    ...StyleSheet.absoluteFillObject,
  },
});
