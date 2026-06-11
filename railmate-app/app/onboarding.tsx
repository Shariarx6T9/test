import React from 'react';
import { View, Image, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretRight, Train, ShieldCheck, BellRinging } from 'phosphor-react-native';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Typography } from '../components/ui/Typography/Typography';
import { Button } from '../components/ui/Button/Button';
import { usePrefsStore } from '../stores/prefsStore';
import { useTranslation } from '../i18n';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { finishOnboarding, theme } = usePrefsStore();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const activeColors = theme === 'dark' ? Colors.dark : Colors.light;

  const handleFinish = () => {
    finishOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <ScreenWrapper withPadding={false} className="bg-bg-base">
      <View className="flex-1 px-6 justify-center">
        {/* Logo/Icon Area */}
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-3xl bg-primary items-center justify-center shadow-lg shadow-primary/40">
            <Train size={64} color="#FFFFFF" weight="duotone" />
          </View>
        </View>

        {/* Text Content */}
        <View className="mb-12">
          <Typography variant="display-lg" className="text-text-primary text-center mb-4" isBengali={isBengali}>
            {t('app.name')}
          </Typography>
          <Typography variant="body-lg" className="text-text-secondary text-center px-4" isBengali={isBengali}>
            {t('app.tagline')}
          </Typography>
        </View>

        {/* Feature Highlights */}
        <View className="space-y-6 mb-12">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mr-4">
              <Train size={24} color={activeColors.primary} weight="duotone" />
            </View>
            <View className="flex-1">
              <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
                {t('onboarding.feature_1_title')}
              </Typography>
              <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
                {t('onboarding.feature_1_desc')}
              </Typography>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-info/10 items-center justify-center mr-4">
              <ShieldCheck size={24} color={activeColors.info} weight="duotone" />
            </View>
            <View className="flex-1">
              <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
                {t('onboarding.feature_2_title')}
              </Typography>
              <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
                {t('onboarding.feature_2_desc')}
              </Typography>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-accent/10 items-center justify-center mr-4">
              <BellRinging size={24} color={activeColors.accent} weight="duotone" />
            </View>
            <View className="flex-1">
              <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
                {t('onboarding.feature_3_title')}
              </Typography>
              <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
                {t('onboarding.feature_3_desc')}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View className="px-6 pb-12">
        <Button 
          label={t('onboarding.get_started')} 
          onPress={handleFinish}
          className="h-16 rounded-2xl"
          isBengali={isBengali}
          icon={CaretRight}
          iconPosition="right"
        />
        <Typography variant="caption" className="text-text-tertiary text-center mt-6" isBengali={isBengali}>
          Travel Smarter. Travel RailMate.
        </Typography>
      </View>
    </ScreenWrapper>
  );
}
