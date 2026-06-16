import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretRight, Train, ShieldCheck, BellRinging } from 'phosphor-react-native';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Button } from '../components/ui/Button/Button';
import { usePrefsStore } from '../stores/prefsStore';
import { useTranslation } from '../i18n';
import { useThemeColors, ThemeColors } from '../hooks/useThemeColors';

// Feature-row icon colors are intentionally theme-independent feature
// accents (green/blue/amber) that work on both dark and light cards.
const FEATURE_COLORS = { train: '#00A859', shield: '#4EA8E0', bell: '#F5A623' } as const;

const FEATURES = [
  { Icon: Train,       color: FEATURE_COLORS.train,  titleKey: 'onboarding.feature_1_title', descKey: 'onboarding.feature_1_desc' },
  { Icon: ShieldCheck, color: FEATURE_COLORS.shield, titleKey: 'onboarding.feature_2_title', descKey: 'onboarding.feature_2_desc' },
  { Icon: BellRinging, color: FEATURE_COLORS.bell,   titleKey: 'onboarding.feature_3_title', descKey: 'onboarding.feature_3_desc' },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { finishOnboarding } = usePrefsStore();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const fontFamily = isBengali
    ? { r: 'NotoSansBengali_400Regular', s: 'NotoSansBengali_600SemiBold', b: 'NotoSansBengali_600SemiBold' }
    : { r: 'Inter_400Regular', s: 'Inter_600SemiBold', b: 'PlusJakartaSans_700Bold' };

  const handleFinish = () => { finishOnboarding(); router.replace('/(tabs)'); };

  return (
    <ScreenWrapper withPadding={false}>
      <View style={[s.page, { paddingTop: insets.top + 24 }]}>
        <View style={s.logoWrap}>
          <View style={s.logoBox}><Train size={56} color={colors['text-inverse']} weight="fill" /></View>
        </View>
        <View style={s.headline}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={[s.appName, { fontFamily: fontFamily.b, color: colors['text-primary'] }]}>Rail</Text>
            <Text style={[s.appName, { fontFamily: fontFamily.b, color: colors.primary }]}>Mate</Text>
          </View>
          <Text style={[s.tagline, { fontFamily: fontFamily.r, color: colors['text-secondary'] }]}>{t('app.tagline')}</Text>
        </View>
        <View style={s.features}>
          {FEATURES.map(({ Icon, color, titleKey, descKey }, i) => (
            <View key={i} style={s.featureRow}>
              <View style={s.featureIcon}><Icon size={24} color={color} weight="duotone" /></View>
              <View style={{ flex: 1 }}>
                <Text style={[s.featureTitle, { fontFamily: fontFamily.s, color: colors['text-primary'] }]}>{t(titleKey)}</Text>
                <Text style={[s.featureDesc, { fontFamily: fontFamily.r, color: colors['text-secondary'] }]}>{t(descKey)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={[s.cta, { paddingBottom: insets.bottom + 32 }]}>
        <View style={{ width: '100%' }}>
          <Button label={t('onboarding.get_started')} onPress={handleFinish} size="lg" isBengali={isBengali} icon={CaretRight} iconPosition="right" style={{ width: '100%' }} />
        </View>
        <Text style={[s.byline, { fontFamily: fontFamily.r, color: colors['text-tertiary'] }]}>Travel Smarter. Travel RailMate.</Text>
      </View>
    </ScreenWrapper>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  page:        { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoWrap:    { alignItems: 'center', marginBottom: 24 },
  logoBox:     { width: 96, height: 96, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  headline:    { alignItems: 'center', marginBottom: 48 },
  appName:     { fontSize: 36, lineHeight: 44 },
  tagline:     { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8, paddingHorizontal: 16 },
  features:    { gap: 24 },
  featureRow:  { flexDirection: 'row', alignItems: 'center', gap: 16 },
  featureIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  featureTitle:{ fontSize: 16, lineHeight: 22, marginBottom: 2 },
  featureDesc: { fontSize: 13, lineHeight: 19 },
  cta:         { paddingHorizontal: 24, alignItems: 'center' },
  byline:      { fontSize: 12, marginTop: 20, textAlign: 'center' },
});
