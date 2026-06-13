import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { activeColors } from '../theme/colors';
// Keep any existing providers/imports you already have below
// e.g. fonts, GestureHandlerRootView, SafeAreaProvider, etc.

export default function RootLayout() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await initialize();
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (!initialized || isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // No session and not already on an auth screen -> send to login
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Has session but stuck on auth screen -> send to tabs
      router.replace('/(tabs)');
    }
  }, [initialized, isLoading, isAuthenticated, segments]);

  if (!initialized || isLoading) {
    return (
      <View className="flex-1 bg-bg-base items-center justify-center">
        <ActivityIndicator size="large" color={currentColors['primary']} />
      </View>
    );
  }

  return <Slot />;
}