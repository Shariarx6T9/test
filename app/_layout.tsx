import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts,
  PlusJakartaSans_700Bold, 
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold 
} from '@expo-google-fonts/inter';
import { 
  NotoSansBengali_400Regular, 
  NotoSansBengali_600SemiBold 
} from '@expo-google-fonts/noto-sans-bengali';
import { 
  JetBrainsMono_400Regular, 
  JetBrainsMono_500Medium 
} from '@expo-google-fonts/jetbrains-mono';

import { queryClient } from '../lib/queryClient';
import { usePrefsStore } from '../stores/prefsStore';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = usePrefsStore();
  
  const [loaded, error] = useFonts({
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    NotoSansBengali_400Regular,
    NotoSansBengali_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme === 'dark' ? '#080D17' : '#F5F7FA',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </QueryClientProvider>
  );
}
