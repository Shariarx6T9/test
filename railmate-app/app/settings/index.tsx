// app/settings/index.tsx
// Matches Settings.png exactly:
// PREFERENCES: Notifications, Language, Default Location, Appearance,
//              Distance Unit
// JOURNEY PREFERENCES: 4 toggles with real prefsStore state
// ACCOUNT & DATA: Privacy, Data Usage, Backup
// SUPPORT & ABOUT: Help, About RailMate (version from expo-constants)
// Log Out — red, with confirmation

import React, { useMemo } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import {
  ArrowLeft, BellSimple, Globe, MapPin, PaintBrush, Ruler,
  ArrowsClockwise, Clock, Users, Train, ShieldCheck, CloudArrowDown,
  CloudArrowUp, Question, Info, SignOut, CaretRight,
} from 'phosphor-react-native';

import { useAuth } from '../../hooks/useAuth';
import { usePrefsStore } from '../../stores/prefsStore';
import { useAuthStore } from '../../stores/authStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { Radius } from '../../constants/radius';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber =
  Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber ?? '1';

function SettingsContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { signOut } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const {
    language, theme, distanceUnit,
    journeyPrefs, defaultLocation,
    setLanguage, setTheme, setDistanceUnit, setJourneyPref,
  } = usePrefsStore();

  const languageDisplay = language === 'bn' ? 'বাংলা (Bengali)' : 'English (English)';
  const themeDisplay = theme === 'dark' ? 'Dark Theme' : theme === 'light' ? 'Light Theme' : 'System Default';
  const distanceDisplay = distanceUnit === 'km' ? 'Kilometer (km)' : 'Mile (mi)';
  const locationDisplay = defaultLocation?.name_en ?? 'Dhaka, Bangladesh';

  const handleSignOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login' as any);
        },
      },
    ]);
  };

  const comingSoon = (feature: string) =>
    Alert.alert(t('home.coming_soon_title'), `${feature} — ${t('home.coming_soon_body')}`);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <View style={{ flex: 1, marginLeft: Spacing['space-3'] }}>
          <Text style={s.title}>Settings</Text>
          <Text style={s.subtitle}>Manage your preferences and app settings</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* ── PREFERENCES ── */}
        <Text style={s.sectionLabel}>PREFERENCES</Text>
        <View style={s.section}>
          <SettingsRow
            Icon={BellSimple}
            label="Notifications"
            sub="Manage notification preferences"
            onPress={() => router.push('/notifications' as any)}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={Globe}
            label="Language"
            sub={languageDisplay}
            onPress={() => {
              setLanguage(language === 'bn' ? 'en' : 'bn');
            }}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={MapPin}
            label="Default Location"
            sub={locationDisplay}
            onPress={() => comingSoon('Default Location')}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={PaintBrush}
            label="Appearance"
            sub={themeDisplay}
            onPress={() => {
              const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
              setTheme(next);
            }}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={Ruler}
            label="Distance Unit"
            sub={distanceDisplay}
            onPress={() => setDistanceUnit(distanceUnit === 'km' ? 'mi' : 'km')}
            colors={colors} s={s}
            isLast
          />
        </View>

        {/* ── JOURNEY PREFERENCES ── */}
        <Text style={s.sectionLabel}>JOURNEY PREFERENCES</Text>
        <View style={s.section}>
          <ToggleRow
            Icon={ArrowsClockwise}
            label="Show Alternative Routes"
            sub="Display alternative routes in search"
            value={journeyPrefs.showAlternativeRoutes}
            onToggle={(v) => setJourneyPref('showAlternativeRoutes', v)}
            colors={colors} s={s}
          />
          <ToggleRow
            Icon={Clock}
            label="Delay Alerts"
            sub="Get notified about train delays"
            value={journeyPrefs.delayAlerts}
            onToggle={(v) => setJourneyPref('delayAlerts', v)}
            colors={colors} s={s}
          />
          <ToggleRow
            Icon={Users}
            label="Crowding Updates"
            sub="Show crowding level information"
            value={journeyPrefs.crowdingUpdates}
            onToggle={(v) => setJourneyPref('crowdingUpdates', v)}
            colors={colors} s={s}
          />
          <ToggleRow
            Icon={Train}
            label="Platform Change Alerts"
            sub="Notify about platform changes"
            value={journeyPrefs.platformChangeAlerts}
            onToggle={(v) => setJourneyPref('platformChangeAlerts', v)}
            colors={colors} s={s}
            isLast
          />
        </View>

        {/* ── ACCOUNT & DATA ── */}
        <Text style={s.sectionLabel}>ACCOUNT & DATA</Text>
        <View style={s.section}>
          <SettingsRow
            Icon={ShieldCheck}
            label="Privacy & Security"
            sub="Manage your privacy and security"
            onPress={() => comingSoon('Privacy & Security')}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={CloudArrowDown}
            label="Data Usage"
            sub="Manage offline data and storage"
            onPress={() => comingSoon('Data Usage')}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={CloudArrowUp}
            label="Backup & Restore"
            sub="Backup your data to restore later"
            onPress={() => comingSoon('Backup & Restore')}
            colors={colors} s={s}
            isLast
          />
        </View>

        {/* ── SUPPORT & ABOUT ── */}
        <Text style={s.sectionLabel}>SUPPORT & ABOUT</Text>
        <View style={s.section}>
          <SettingsRow
            Icon={Question}
            label="Help & Support"
            sub="FAQs, guides and contact support"
            onPress={() => comingSoon('Help & Support')}
            colors={colors} s={s}
          />
          <SettingsRow
            Icon={Info}
            label="About RailMate"
            sub={`Version ${appVersion} (Build ${buildNumber})`}
            onPress={() => comingSoon('About RailMate')}
            colors={colors} s={s}
            isLast
          />
        </View>

        {/* Log Out */}
        {isAuthenticated && (
          <Pressable style={s.logOutRow} onPress={handleSignOut}>
            <SignOut size={20} color={colors.danger} />
            <Text style={s.logOutText}>Log Out</Text>
            <CaretRight size={16} color={colors.danger} style={{ marginLeft: 'auto' }} />
          </Pressable>
        )}

        {/* Attribution — placed discreetly at bottom per branding spec */}
        <Text style={s.attribution}>Designed and Developed by Najmul Hasan</Text>
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface RowCommon {
  Icon: typeof BellSimple;
  label: string;
  sub: string;
  isLast?: boolean;
  colors: ThemeColors;
  s: ReturnType<typeof createStyles>;
}

function SettingsRow({ Icon, label, sub, onPress, isLast, colors, s }: RowCommon & { onPress: () => void }) {
  return (
    <Pressable style={[s.row, !isLast && s.rowBorder]} onPress={onPress}>
      <View style={s.rowIconWrap}><Icon size={18} color={colors.primary} /></View>
      <View style={s.rowText}>
        <Text style={s.rowLabel}>{label}</Text>
        <Text style={s.rowSub}>{sub}</Text>
      </View>
      <CaretRight size={16} color={colors['text-tertiary']} />
    </Pressable>
  );
}

function ToggleRow({ Icon, label, sub, value, onToggle, isLast, colors, s }: RowCommon & { value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={[s.row, !isLast && s.rowBorder]}>
      <View style={s.rowIconWrap}><Icon size={18} color={colors.primary} /></View>
      <View style={s.rowText}>
        <Text style={s.rowLabel}>{label}</Text>
        <Text style={s.rowSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  return <ErrorBoundary name="Settings"><SettingsContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors['bg-base'] },
  header:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['space-5'], paddingBottom: 16 },
  backBtn:     { width: 40, height: 40, borderRadius: Radius['radius-full'], backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:       { ...Typography['h2'], color: colors['text-primary'] },
  subtitle:    { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },

  sectionLabel:{ ...Typography['caption'], color: colors['text-tertiary'], letterSpacing: 1, marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-5'], marginBottom: Spacing['space-2'] },
  section:     { marginHorizontal: Spacing['space-5'], backgroundColor: colors['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },

  row:         { flexDirection: 'row', alignItems: 'center', padding: Spacing['space-4'], gap: Spacing['space-4'] },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIconWrap: { width: 36, height: 36, borderRadius: Radius['radius-lg'], backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
  rowText:     { flex: 1 },
  rowLabel:    { ...Typography['body'], color: colors['text-primary'] },
  rowSub:      { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },

  logOutRow:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-5'], backgroundColor: colors['danger-subtle'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.danger + '40', padding: Spacing['space-4'], gap: Spacing['space-3'] },
  logOutText:  { ...Typography['body'], color: colors.danger },

  attribution: { ...Typography['caption'], color: colors['text-tertiary'], textAlign: 'center', marginTop: Spacing['space-6'], marginBottom: Spacing['space-4'] },
});
