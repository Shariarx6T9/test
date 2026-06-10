import React from 'react';
import { View, ScrollView, Pressable, Switch } from 'react-native';
import { 
  User, 
  Trash, 
  Translate, 
  Moon, 
  Info,
  ArrowRight
} from 'phosphor-react-native';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/layout/Header';
import { Typography } from '../../components/ui/Typography/Typography';
import { Card } from '../../components/ui/Card/Card';
import { usePrefsStore } from '../../stores/prefsStore';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useTranslation } from '../../i18n';

export default function ProfileScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const { language, theme, setLanguage, setTheme } = usePrefsStore();
  const { savedRoutes, deleteRoute } = useSavedRoutes();

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <ScreenWrapper>
      <Header title={t('profile.title')} showBack={false} isBengali={isBengali} />
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Guest Profile Card */}
        <Card className="p-6 mb-8 flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-bg-overlay items-center justify-center mr-4">
            <User size={32} color="#8FA3C0" />
          </View>
          <View>
            <Typography variant="h3" className="text-text-primary" isBengali={isBengali}>
              Guest User
            </Typography>
            <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
              Sign in to sync your data
            </Typography>
          </View>
        </Card>

        {/* Saved Routes Section */}
        <View className="mb-8">
          <Typography variant="label" className="text-text-tertiary mb-3 px-1 uppercase" isBengali={isBengali}>
            {t('profile.saved_routes')}
          </Typography>
          
          {savedRoutes.length > 0 ? (
            savedRoutes.map((route) => (
              <Card key={route.id} className="p-4 mb-2 flex-row items-center justify-between">
                <View className="flex-1">
                  <Typography variant="body" className="text-text-primary" isBengali={isBengali}>
                    {isBengali ? `${route.fromStation.name_bn} ↔ ${route.toStation.name_bn}` : `${route.fromStation.name_en} ↔ ${route.toStation.name_en}`}
                  </Typography>
                </View>
                <Pressable onPress={() => deleteRoute(route.id)} className="p-2">
                  <Trash size={20} color="#E8394B" />
                </Pressable>
              </Card>
            ))
          ) : (
            <Card className="p-4 items-center">
              <Typography variant="body" className="text-text-tertiary" isBengali={isBengali}>
                {t('home.no_saved_routes')}
              </Typography>
            </Card>
          )}
        </View>

        {/* Settings Section */}
        <View className="mb-8">
          <Typography variant="label" className="text-text-tertiary mb-3 px-1 uppercase" isBengali={isBengali}>
            Settings
          </Typography>

          {/* Language Toggle */}
          <Pressable 
            onPress={toggleLanguage}
            className="bg-bg-card border border-border rounded-md p-4 mb-2 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Translate size={20} color="#00A859" className="mr-3" />
              <Typography variant="body" className="text-text-primary ml-3" isBengali={isBengali}>
                {t('profile.language')}
              </Typography>
            </View>
            <View className="flex-row items-center">
              <Typography variant="body" className="text-primary mr-2" isBengali={isBengali}>
                {language === 'bn' ? 'বাংলা' : 'English'}
              </Typography>
              <ArrowRight size={16} color="#4E6480" />
            </View>
          </Pressable>

          {/* Theme Selector (Simplified for MVP as a list) */}
          <View className="bg-bg-card border border-border rounded-md overflow-hidden">
            <View className="p-4 flex-row items-center border-b border-border">
              <Moon size={20} color="#00A859" className="mr-3" />
              <Typography variant="body" className="text-text-primary ml-3" isBengali={isBengali}>
                {t('profile.theme')}
              </Typography>
            </View>
            
            <View className="flex-row p-2">
              {(['dark', 'light', 'system'] as const).map((tValue) => (
                <Pressable
                  key={tValue}
                  onPress={() => setTheme(tValue)}
                  className={`flex-1 py-2 items-center rounded-sm ${theme === tValue ? 'bg-primary-subtle' : ''}`}
                >
                  <Typography 
                    variant="label" 
                    className={theme === tValue ? 'text-primary' : 'text-text-secondary'}
                    isBengali={isBengali}
                  >
                    {t(`profile.theme_${tValue}` as any)}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="mb-10">
          <Typography variant="label" className="text-text-tertiary mb-3 px-1 uppercase" isBengali={isBengali}>
            About
          </Typography>
          <Card className="p-4 flex-row items-center">
            <Info size={20} color="#00A859" className="mr-3" />
            <View className="ml-3">
              <Typography variant="body" className="text-text-primary" isBengali={isBengali}>
                {t('app.name')}
              </Typography>
              <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
                Version 1.0.0
              </Typography>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
