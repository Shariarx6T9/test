import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Gear, SignOut, BookmarkSimple, ChartBar, Shield,
  BellSimple, Globe, Moon, Sun, CaretRight, Star, Confetti,
} from 'phosphor-react-native';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import { usePrefsStore } from '../../stores/prefsStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';

// BLOCKER 5 FIX: Trust score is stored as DECIMAL(4,2) in range 0.00–5.00
// (Master Reference Part 07). TRUST_BANDS now use the 0–5 scale.
// The old code used a 0–100 scale which made every user permanently sit in
// the "Explorer" band with a ≤5% progress bar.
const TRUST_BANDS = [
  { min: 0,    max: 1.0, label: 'Explorer',            color: '#8FA3C0' },
  { min: 1.0,  max: 2.0, label: 'Contributor',          color: '#4EA8E0' },
  { min: 2.0,  max: 3.0, label: 'Verified Traveler',    color: '#00A859' },
  { min: 3.0,  max: 4.0, label: 'Station Expert',       color: '#F5A623' },
  { min: 4.0,  max: 5.1, label: 'RailMate Ambassador',  color: '#A855F7' },
];

function getTrustBand(score: number) {
  return (
    TRUST_BANDS.find((b) => score >= b.min && score < b.max) ?? TRUST_BANDS[0]
  );
}

function ProfileContent() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { user, isAuthenticated } = useAuthStore();
  const { signOut } = useAuth();
  const { theme, setTheme, language, setLanguage } = usePrefsStore();
  const { savedRoutes } = useSavedRoutes();
  const trustScore = user?.trust_score ?? 0;    // DB range: 0.00–5.00
  const trustBand = getTrustBand(trustScore);
  // Convert 0–5 score to 0–100% for the progress bar
  const trustPct = Math.min(100, Math.round((trustScore / 5) * 100));

  const handleSignOut = () => {
    Alert.alert(t('profile.sign_out'), t('profile.sign_out_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.sign_out'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login' as any);
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Star size={56} color={colors['text-tertiary']} weight="thin" />
        <Text style={s.guestTitle}>{t('profile.guest_title')}</Text>
        <Text style={s.guestSub}>{t('profile.guest_sub')}</Text>
        <Pressable style={s.signInBtn} onPress={() => router.push('/auth/login' as any)}>
          <Text style={s.signInBtnText}>{t('auth.sign_in')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={s.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Profile header */}
      <View style={[s.heroSection, { paddingTop: insets.top + 20 }]}>
        <Avatar
          name={user?.display_name ?? 'User'}
          uri={user?.avatar_url ?? undefined}
          size={76}
        />
        <Text style={s.displayName}>{user?.display_name ?? t('auth.guest_user')}</Text>
        <Text style={s.contactLine}>
          {user?.phone ?? user?.email ?? ''}
        </Text>

        {/* Trust band pill */}
        <View style={[s.bandPill, { backgroundColor: trustBand.color + '20', borderColor: trustBand.color + '50' }]}>
          <View style={[s.bandDot, { backgroundColor: trustBand.color }]} />
          <Text style={[s.bandLabel, { color: trustBand.color }]}>{trustBand.label}</Text>
        </View>
      </View>

        <View style={s.trustCard}>
        <View style={s.trustHeader}>
          <Shield size={16} color={trustBand.color} weight="fill" />
          <Text style={s.trustTitle}>{t('profile.trust_score')}</Text>
          {/* FIXED: was trustScore/100 — DB stores 0.00–5.00 (Part 07) */}
          <Text style={[s.trustScore, { color: trustBand.color }]}>{trustScore.toFixed(1)}/5.0</Text>
        </View>
        <View style={s.trustBar}>
          {/* FIXED: was width:`${trustScore}%` which showed ≤5% for all users */}
          <View style={[s.trustFill, { width: `${trustPct}%`, backgroundColor: trustBand.color }]} />
        </View>
        <Text style={s.trustHint}>
          {trustScore < 5
            ? `${(5 - trustScore).toFixed(1)} pts to ${getTrustBand(Math.min(5, trustScore + 1.01))?.label ?? 'max'}`
            : '🎉 Maximum trust achieved!'}
        </Text>
      </View>

      {/* Stats row — live from user profile */}
      <View style={s.statsRow}>
        {[
          { label: t('profile.reports'), val: user?.report_count ?? 0 },
          { label: t('profile.helpful'), val: user?.helpful_vote_count ?? 0 },
          { label: t('profile.saved'),   val: savedRoutes.length },
        ].map(({ label, val }) => (
          <View key={label} style={s.statBox}>
            <Text style={s.statVal}>{val}</Text>
            <Text style={s.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Menu sections */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('profile.account')}</Text>
        <View style={s.menuCard}>
          {[
            { icon: BookmarkSimple, label: t('profile.saved_routes'), onPress: () => router.push('/journey' as any) },
            { icon: ChartBar, label: t('profile.leaderboard'),        onPress: () => router.push('/leaderboard' as any) },
            { icon: Confetti, label: t('profile.badges'),             onPress: () => router.push('/badges' as any) },
          ].map(({ icon: Icon, label, onPress }) => (
            <Pressable key={label} style={s.menuRow} onPress={onPress}>
              <View style={s.menuIconWrap}><Icon size={18} color={colors.primary} /></View>
              <Text style={s.menuLabel}>{label}</Text>
              <CaretRight size={14} color={colors['text-tertiary']} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('profile.preferences')}</Text>
        <View style={s.menuCard}>
          <Pressable style={s.menuRow} onPress={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}>
            <View style={s.menuIconWrap}>
              {theme === 'dark' ? <Moon size={18} color={colors.primary} /> : <Sun size={18} color={colors.primary} />}
            </View>
            <Text style={s.menuLabel}>{t('profile.theme')}</Text>
            <Text style={s.menuValue}>{theme === 'dark' ? t('profile.dark') : t('profile.light')}</Text>
          </Pressable>
          {/* BLOCKER 4 FIX: was a plain <View> with no onPress — users had no
              way to change language post-onboarding. Now a Pressable that
              toggles bn ↔ en and navigates to Settings for full control. */}
          <Pressable style={[s.menuRow, s.menuRowBorder]} onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}>
            <View style={s.menuIconWrap}><Globe size={18} color={colors.primary} /></View>
            <Text style={s.menuLabel}>{t('profile.language')}</Text>
            <Text style={s.menuValue}>{language === 'bn' ? 'বাংলা' : 'English'}</Text>
          </Pressable>
          <Pressable style={[s.menuRow, s.menuRowBorder]} onPress={() => router.push('/notifications' as any)}>
            <View style={s.menuIconWrap}><BellSimple size={18} color={colors.primary} /></View>
            <Text style={s.menuLabel}>{t('profile.notifications')}</Text>
            <CaretRight size={14} color={colors['text-tertiary']} />
          </Pressable>
          <Pressable style={[s.menuRow, s.menuRowBorder]} onPress={() => router.push('/settings' as any)}>
            <View style={s.menuIconWrap}><Gear size={18} color={colors.primary} /></View>
            <Text style={s.menuLabel}>{t('profile.settings')}</Text>
            <CaretRight size={14} color={colors['text-tertiary']} />
          </Pressable>
        </View>
      </View>

      <Pressable style={s.signOutBtn} onPress={handleSignOut}>
        <SignOut size={18} color={colors.danger} />
        <Text style={s.signOutText}>{t('profile.sign_out')}</Text>
      </Pressable>

      <Text style={s.versionText}>RailMate Bangladesh</Text>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  return <ErrorBoundary name="Profile"><ProfileContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:          { flex: 1, backgroundColor: colors['bg-base'] },
    heroSection:   { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
    displayName:   { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 24, color: colors['text-primary'], marginTop: 14 },
    contactLine:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], marginTop: 4 },
    bandPill:      { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10 },
    bandDot:       { width: 7, height: 7, borderRadius: 3.5 },
    bandLabel:     { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
    trustCard:     { marginHorizontal: 20, marginBottom: 16, backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16 },
    trustHeader:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    trustTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'], flex: 1 },
    trustScore:    { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16 },
    trustBar:      { height: 6, backgroundColor: colors['bg-elevated'], borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
    trustFill:     { height: '100%', borderRadius: 3 },
    trustHint:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
    statsRow:      { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border },
    statBox:       { flex: 1, alignItems: 'center', paddingVertical: 16 },
    statVal:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: colors['text-primary'] },
    statLabel:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'], marginTop: 3 },
    section:       { paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors['text-tertiary'], letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' },
    menuCard:      { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    menuRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
    menuRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    menuIconWrap:  { width: 32, height: 32, borderRadius: 10, backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
    menuLabel:     { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors['text-primary'], flex: 1 },
    menuValue:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'] },
    signOutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderColor: colors.danger + '50', borderRadius: 14, paddingVertical: 14 },
    signOutText:   { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.danger },
    versionText:   { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginBottom: 20 },
    guestTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors['text-primary'], marginTop: 16, marginBottom: 8 },
    guestSub:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
    signInBtn:     { backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
    signInBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
  });
