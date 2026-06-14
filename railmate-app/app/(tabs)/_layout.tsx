import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { House, MagnifyingGlass, UsersThree, BellSimple, User } from 'phosphor-react-native';

const C = { primary: '#00A859', tertiary: '#4E6480', bgElevated: '#0F1929', border: '#1E2E42' };

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.tertiary,
        tabBarStyle: {
          backgroundColor: C.bgElevated,
          borderTopWidth: 1,
          borderTopColor: C.border,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, focused }) => <House size={24} color={color} weight={focused ? 'fill' : 'regular'} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, focused }) => <MagnifyingGlass size={24} color={color} weight={focused ? 'bold' : 'regular'} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color, focused }) => <UsersThree size={24} color={color} weight={focused ? 'fill' : 'regular'} /> }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: ({ color, focused }) => <BellSimple size={24} color={color} weight={focused ? 'fill' : 'regular'} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, focused }) => <User size={24} color={color} weight={focused ? 'fill' : 'regular'} /> }} />
    </Tabs>
  );
}
