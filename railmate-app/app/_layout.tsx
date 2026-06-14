import React, { useEffect, useState } from 'react';
import '../global.css';
import {
  View, Image, StyleSheet, Animated, useColorScheme as useNativeColorScheme,
} from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { usePrefsStore } from '../stores/prefsStore';

export default function RootLayout() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const { isGuest } = useAuthStore();
  const { theme } = usePrefsStore();
  const router = useRouter();
  const segments = useSegments();
  const [initialized, setInitialized] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

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
      <View style={{ flex: 1, backgroundColor: '#080D17' }}>
        <Slot />
        {/* Full-screen JS splash overlay — fades out after 2s */}
        {!splashDone && (
          <Animated.View style={[StyleSheet.absoluteFill, s.splash, { opacity: fadeAnim }]}>
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

const s = StyleSheet.create({
  splash: {
    backgroundColor: '#080D17',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  splashImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
