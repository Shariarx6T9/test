import React, { useMemo } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User as UserIcon, BookmarkSimple, CreditCard, BellSimple,
  Question, CaretRight, SignOut, Globe, Moon, Sun, DeviceMobile,
  Shield, Star, Trophy, CheckCircle,
} from 'phosphor-react-native';
import { useAuth } from '../../hooks/useAuth';
import { usePrefsStore } from '../../stores/prefsStore';
import { useTranslation, TranslationKey } from '../../i18n';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const BADGES_PREVIEW = ['🟢', '🔵', '🟡'];

const THEME_OPTIONS = [
  { key: 'light' as const, icon: Sun, labelKey: 'profile.theme_light' as const },
  { key: 'dark' as const, icon: Moon, labelKey: 'profile.theme_dark' as const },
  { key: 'system' as const, icon: DeviceMobile, labelKey: 'profile.theme_system' as const },
];

function ProfileContent() {
  const router = useRouter();
  const { signOut, user, isAuthenticated } = useAuth();
  const { theme, setTheme, language, setLanguage } = usePrefsStore();
  const locale = language;
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const toggleLanguage = () => setLanguage(language === 'bn' ? 'en' : 'bn');

  const STATS = [
    { key: 'reports', label: t('profile.reports'), val: '15' },
    { key: 'helpful', label: t('profile.helpful_votes'), val: '48' },
    { key: 'journeys', label: t('profile.journeys'), val: '23' },
  ];

  const MENU_ITEMS = [
    { icon: BookmarkSimple, label: t('profile.saved_routes'), color: colors.accent, route: '/journey/tools' },
    { icon: Trophy, label: t('leaderboard.title'), color: colors.accent, route: '/leaderboard' },
    { icon: Shield, label: t('badges.title'), color: '#A855F7', route: '/badges' },
    { icon: CreditCard, label: t('profile.payment'), color: colors.info, route: null },
    { icon: BellSimple, label: t('profile.notifications'), color: colors.primary, route: '/notifications' },
    { icon: Question, label: t('profile.help'), color: colors['text-secondary'], route: null },
  ];

  const renderThemeRow = () => (
    <View style={s.themeRow}>
      {THEME_OPTIONS.map(({ key, icon: Icon, labelKey }) => {
        const active = theme === key;
        return (
          <Pressable key={key} style={[s.themeOption, active && s.themeOptionActive]} onPress={() => setTheme(key)}>
            <Icon size={16} color={active ? colors['text-inverse'] : colors['text-secondary']} />
            <Text style={[s.themeText, active && s.themeTextActive]}>{t(labelKey)}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderLanguageRow = () => (
    <Pressable style={s.menuRow} onPress={toggleLanguage}>
      <View style={[s.menuIcon, { backgroundColor: colors.primary + '18' }]}><Globe size={18} color={colors.primary} /></View>
      <Text style={s.menuLabel}>{t('profile.language')}</Text>
      <Text style={s.menuValue}>{locale === 'bn' ? 'বাংলা' : 'English'}</Text>
      <CaretRight size={16} color={colors['text-tertiary']} />
    </Pressable>
  );

  if (!isAuthenticated) {
    return (
      <View style={s.root}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: insets.top + 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <View style={s.guestHero}>
            <View style={s.guestAvatarWrap}>
              <UserIcon size={40} color={colors['text-tertiary']} />
            </View>
            <Text style={s.guestTitle}>{t('profile.guest_user')}</Text>
            <Text style={s.guestSub}>{t('auth.guest_subtitle')}</Text>
            <Pressable style={s.signInBtn} onPress={() => router.push('/auth/login' as any)}>
              <Text style={s.signInBtnText}>{t('auth.sign_in')} / {t('auth.create_account')}</Text>
            </Pressable>
          </View>

          {/* Theme */}
          <View style={s.settingsCard}>
            <Text style={s.settingsCardTitle}>{t('profile.theme')}</Text>
            {renderThemeRow()}
            <View style={s.divider} />
            {renderLanguageRow()}
          </View>
        </ScrollView>
      </View>
    );
  }

  const displayName = user?.display_name ?? t('profile.traveler');

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          <View style={s.heroOverlay} />
          <View style={s.heroContent}>
            <Avatar name={displayName} uri={user?.avatar_url} size={72} />
            <View style={{ marginTop: 14 }}>
              <Text style={s.userName}>{displayName}</Text>
              <View style={s.trustedRow}>
                <CheckCircle size={14} color={colors.primary} weight="fill" />
                <Text style={s.trustedText}>{t('profile.trusted_reporter')}</Text>
              </View>
            </View>
            {/* Trust score */}
            <View style={s.trustRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} color={i <= 4 ? colors.accent : colors.border} weight={i <= 4 ? 'fill' : 'regular'} />
              ))}
              <Text style={s.trustScore}>4.8 / 5</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {STATS.map(({ key, label, val }) => (
            <View key={key} style={s.stat}>
              <Text style={s.statVal}>{val}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Badges preview */}
        <Pressable style={s.badgesRow} onPress={() => router.push('/badges' as any)}>
          <Text style={s.badgesTitle}>{t('profile.badges')}</Text>
          <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>
            {BADGES_PREVIEW.map((b, i) => <Text key={i} style={{ fontSize: 22 }}>{b}</Text>)}
          </View>
          <CaretRight size={16} color={colors['text-tertiary']} />
        </Pressable>

        {/* Menu */}
        <View style={s.section}>
          {MENU_ITEMS.map(({ icon: Icon, label, color, route }) => (
            <Pressable key={label} style={s.menuRow} onPress={() => route && router.push(route as any)}>
              <View style={[s.menuIcon, { backgroundColor: color + '18' }]}>
                <Icon size={18} color={color} weight="duotone" />
              </View>
              <Text style={s.menuLabel}>{label}</Text>
              <CaretRight size={16} color={colors['text-tertiary']} />
            </Pressable>
          ))}
        </View>

        {/* Settings */}
        <View style={s.section}>
          <Text style={s.settingsCardTitle}>{t('profile.theme')}</Text>
          {renderThemeRow()}
          <View style={s.divider} />
          {renderLanguageRow()}
        </View>

        <Pressable style={s.signOutBtn} onPress={async () => { await signOut(); }}>
          <SignOut size={18} color={colors.danger} />
          <Text style={s.signOutText}>{t('profile.sign_out')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function ProfileScreen() {
  return <ErrorBoundary name="Profile"><ProfileContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:           { flex: 1, backgroundColor: colors['bg-base'] },
  hero:           { backgroundColor: colors['bg-card'], borderBottomWidth: 1, borderBottomColor: colors.border },
  heroOverlay:    { ...StyleSheet.absoluteFillObject, backgroundColor: colors['primary-subtle'] },
  heroContent:    { alignItems: 'center', paddingTop: 32, paddingBottom: 28, paddingHorizontal: 20 },
  userName:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: colors['text-primary'], marginBottom: 6 },
  trustedRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  trustedText:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primary },
  trustRow:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trustScore:     { fontFamily: 'JetBrainsMono_500Medium', fontSize: 14, color: colors.accent, marginLeft: 8 },
  statsRow:       { flexDirection: 'row', backgroundColor: colors['bg-card'], borderBottomWidth: 1, borderBottomColor: colors.border },
  stat:           { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statVal:        { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: colors.primary },
  statLabel:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-secondary'], marginTop: 3 },
  badgesRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, paddingHorizontal: 20, paddingVertical: 16, marginTop: 20, gap: 12 },
  badgesTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'], marginRight: 4 },
  section:        { backgroundColor: colors['bg-card'], borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, marginTop: 12, paddingHorizontal: 20, paddingVertical: 8 },
  settingsCard:   { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 20, marginBottom: 16 },
  settingsCardTitle:{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-primary'], marginBottom: 14 },
  themeRow:       { flexDirection: 'row', gap: 8, marginBottom: 4 },
  themeOption:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: colors.border, borderRadius: 20, paddingVertical: 10 },
  themeOptionActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  themeText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  themeTextActive:{ color: colors['text-inverse'] },
  divider:        { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  menuRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  menuIcon:       { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel:      { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: colors['text-primary'] },
  menuValue:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginRight: 4 },
  guestHero:      { alignItems: 'center', paddingVertical: 32, marginBottom: 24 },
  guestAvatarWrap:{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors['bg-card'], borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  guestTitle:     { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: colors['text-primary'], marginBottom: 8 },
  guestSub:       { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  signInBtn:      { backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 15 },
  signInBtnText:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
  signOutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, margin: 20, borderWidth: 1.5, borderColor: colors.danger + '40', borderRadius: 14, paddingVertical: 15 },
  signOutText:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.danger },
});
