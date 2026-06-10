import { Tabs } from 'expo-router';
import { 
  House, 
  MagnifyingGlass, 
  UsersThree, 
  BellSimple, 
  User 
} from 'phosphor-react-native';
import { usePrefsStore } from '../../stores/prefsStore';
import { Colors } from '../../constants/colors';
import { useTranslation } from '../../i18n';

export default function TabLayout() {
  const { theme } = usePrefsStore();
  const { t } = useTranslation();
  
  const activeColors = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColors.primary,
        tabBarInactiveTintColor: activeColors['text-tertiary'],
        tabBarStyle: {
          backgroundColor: activeColors['bg-elevated'],
          borderTopColor: activeColors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
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
            <MagnifyingGlass size={24} color={color} weight={focused ? 'fill' : 'regular'} />
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
