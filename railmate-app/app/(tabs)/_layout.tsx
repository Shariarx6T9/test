import { Tabs } from 'expo-router';
import { View } from 'react-native';
import {
  House,
  MagnifyingGlass,
  UsersThree,
  BellSimple,
  User,
} from 'phosphor-react-native';
import { usePrefsStore } from '../../stores/prefsStore';
import { Colors } from '../../constants/colors';
import { useTranslation } from '../../i18n';

export default function TabLayout() {
  const { theme } = usePrefsStore();
  const { t } = useTranslation();
  const c = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c['text-tertiary'],
        tabBarStyle: {
          backgroundColor: c['bg-elevated'],
          borderTopWidth: 1,
          borderTopColor: c['border'],
          height: 76,
          paddingBottom: 14,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ color, focused }) => (
            <House size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('search.title'),
          tabBarIcon: ({ color, focused }) => (
            <View
              style={
                focused
                  ? {
                      backgroundColor: c.primary,
                      borderRadius: 20,
                      width: 48,
                      height: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 4,
                    }
                  : {}
              }
            >
              <MagnifyingGlass size={24} color={focused ? '#fff' : color} weight={focused ? 'bold' : 'regular'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t('community.title'),
          tabBarIcon: ({ color, focused }) => (
            <UsersThree size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t('alerts.title'),
          tabBarIcon: ({ color, focused }) => (
            <BellSimple size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
    </Tabs>
  );
}
