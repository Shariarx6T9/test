import React, { useEffect, useState } from 'react';
import '../global.css';
import { View, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from 'nativewind';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';
// Keep any existing providers/imports you already have below

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const currentColors = Colors[colorScheme === 'light' ? 'light' : 'dark'];
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const { isGuest } = useAuthStore();
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

    const inAuthGroup = (segments[0] as string) === 'auth';

    // Guest users and authenticated users both go to tabs
    if (!isAuthenticated && !isGuest && !inAuthGroup) {
      router.replace('/auth/login' as any);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [initialized, isLoading, isAuthenticated, isGuest, segments]);

  if (!initialized || isLoading) {
    return (
      <View className="flex-1 bg-bg-base items-center justify-center">
        <ActivityIndicator size="large" color={currentColors['primary']} />
      </View>
    );
  }

  return <Slot />;
}