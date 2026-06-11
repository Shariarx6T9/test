import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { 
  User, 
  Trash, 
  Translate, 
  Palette, 
  Info,
  CaretRight,
  SignOut
} from 'phosphor-react-native';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/layout/Header';
import { Typography } from '../../components/ui/Typography/Typography';
import { Card } from '../../components/ui/Card/Card';
import { usePrefsStore } from '../../stores/prefsStore';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useTranslation } from '../../i18n';
import { Colors } from '../../constants/colors';

export default function ProfileScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const { language, theme, setLanguage, setTheme } = usePrefsStore();
  const { savedRoutes, deleteRoute } = useSavedRoutes();

  const activeColors = theme === 'dark' ? Colors.dark : Colors.light;

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <ScreenWrapper className="bg-bg-base">
      <Header title={t('profile.title')} showBack={false} isBengali={isBengali} />
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4">
        {/* Profile Card */}
        <Card className="p-5 mb-6 flex-row items-center border-primary/20">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mr-4 border border-primary/20">
            <User size={32} color={Colors.dark.primary} weight="duotone" />
          </View>
          <View className="flex-1">
            <Typography variant="h3" className="text-text-primary" isBengali={isBengali}>
              {t('profile.guest_user')}
            </Typography>
            <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
              {t('profile.guest_hint')}
            </Typography>
          </View>
          <Pressable className="bg-bg-elevated p-2 rounded-full border border-border">
            <CaretRight size={20} color={activeColors['text-tertiary']} />
          </Pressable>
        </Card>

        {/* Saved Routes Section */}
        <View className="mb-6">
          <Typography variant="label" className="text-text-tertiary mb-3 px-1 uppercase tracking-wider" isBengali={isBengali}>
            {t('profile.saved_routes')}
          </Typography>
          
          {savedRoutes.length > 0 ? (
            savedRoutes.map((route) => (
              <Card key={route.id} className="p-4 mb-3 flex-row items-center justify-between">
                <View className="flex-1">
                  <Typography variant="body" className="text-text-primary font-inter-semibold" isBengali={isBengali}>
                    {isBengali ? `${route.fromStation.name_bn} ↔ ${route.toStation.name_bn}` : `${route.fromStation.name_en} ↔ ${route.toStation.name_en}`}
                  </Typography>
                  <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
                    {isBengali ? 'দ্রুত অনুসন্ধানের জন্য সংরক্ষিত' : 'Saved for quick search'}
                  </Typography>
                </View>
                <Pressable onPress={() => deleteRoute(route.id)} className="p-2 bg-danger/10 rounded-full">
                  <Trash size={18} color={activeColors.danger} />
                </Pressable>
              </Card>
            ))
          ) : (
            <Card className="p-8 items-center border-dashed border-border-strong bg-transparent">
              <Typography variant="body" className="text-text-tertiary" isBengali={isBengali}>
                {t('home.no_saved_routes')}
              </Typography>
            </Card>
          )}
        </View>

        {/* Settings Section */}
        <View className="mb-6">
          <Typography variant="label" className="text-text-tertiary mb-3 px-1 uppercase tracking-wider" isBengali={isBengali}>
            {t('profile.settings')}
          </Typography>

          <Card className="p-0 overflow-hidden">
            {/* Language Selection */}
            <Pressable 
              onPress={toggleLanguage}
              className="p-4 flex-row items-center justify-between border-b border-border active:bg-bg-elevated"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-info/10 items-center justify-center mr-3">
                  <Translate size={20} color={activeColors.info} />
                </View>
                <Typography variant="body" className="text-text-primary" isBengali={isBengali}>
                  {t('profile.language')}
                </Typography>
              </View>
              <View className="flex-row items-center">
                <Typography variant="body" className="text-primary font-inter-semibold mr-2" isBengali={isBengali}>
                  {language === 'bn' ? 'বাংলা' : 'English'}
                </Typography>
                <CaretRight size={16} color={activeColors['text-tertiary']} />
              </View>
            </Pressable>

            {/* Theme Selector */}
            <View className="p-4">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-lg bg-accent/10 items-center justify-center mr-3">
                  <Palette size={20} color={activeColors.accent} />
                </View>
                <Typography variant="body" className="text-text-primary" isBengali={isBengali}>
                  {t('profile.theme')}
                </Typography>
              </View>
              
              <View className="flex-row bg-bg-elevated p-1 rounded-md border border-border">
                {(['dark', 'light', 'system'] as const).map((tValue) => (
                  <Pressable
                    key={tValue}
                    onPress={() => setTheme(tValue)}
                    className={`flex-1 py-2 items-center rounded-sm ${theme === tValue ? 'bg-bg-card border border-border-strong shadow-sm' : ''}`}
                  >
                    <Typography 
                      variant="label" 
                      className={theme === tValue ? 'text-primary font-inter-semibold' : 'text-text-secondary'}
                      isBengali={isBengali}
                    >
                      {t(`profile.theme_${tValue}` as any)}
                    </Typography>
                  </Pressable>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* About Section */}
        <View className="mb-8">
          <Typography variant="label" className="text-text-tertiary mb-3 px-1 uppercase tracking-wider" isBengali={isBengali}>
            {t('profile.about')}
          </Typography>
          <Card className="p-0 overflow-hidden">
            <View className="p-4 flex-row items-center border-b border-border">
              <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center mr-3">
                <Info size={20} color={activeColors.primary} />
              </View>
              <View className="flex-1">
                <Typography variant="body" className="text-text-primary" isBengali={isBengali}>
                  {t('app.name')}
                </Typography>
                <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
                  {t('profile.version')} 1.0.0
                </Typography>
              </View>
            </View>
            <Pressable className="p-4 flex-row items-center justify-between active:bg-bg-elevated">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-danger/10 items-center justify-center mr-3">
                  <SignOut size={20} color={activeColors.danger} />
                </View>
                <Typography variant="body" className="text-danger" isBengali={isBengali}>
                  Sign Out
                </Typography>
              </View>
              <CaretRight size={16} color={activeColors['text-tertiary']} />
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
