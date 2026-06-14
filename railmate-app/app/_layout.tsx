import React, { useEffect, useState } from 'react';
import '../global.css';
import { View, ActivityIndicator, StyleSheet, useColorScheme as useNativeColorScheme } from 'react-native';
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
  const deviceScheme = useNativeColorScheme();

  useEffect(() => {
    (async () => {
      await initialize();
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (!initialized || isLoading) return;
    const inAuthGroup = (segments[0] as string) === 'auth';
    // Only redirect authenticated users away from auth screens
    // Unauthenticated/guest users can use the app freely
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [initialized, isLoading, isAuthenticated, segments]);

  if (!initialized || isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00A859" />
        </View>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#080D17',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
