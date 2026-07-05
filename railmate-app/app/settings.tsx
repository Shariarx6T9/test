// app/settings.tsx
import React, { useState, useCallback } from 'react';
import {
  ArrowLeft, Bell, Globe, MapPin, Moon, ArrowsLeftRight, WarningCircle,
  Users, Train, ShieldCheck, HardDrive, CloudArrowUp, Question, Info, SignOut
} from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { usePrefsStore } from '../stores/prefsStore';
import { useAuthStore } from '../stores/authStore';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../i18n';

interface SettingRow { id: string; label: string; sub: string; toggle?: boolean; value?: string; icon: React.ReactElement; }
interface SettingSection { title: string; rows: SettingRow[]; }

type PickerModal = { type: 'lang' | 'theme' } | null;

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, theme, journeyPrefs, setLanguage, setTheme, setJourneyPref } = usePrefsStore();
  const { user } = useAuthStore();
  const { signOut } = useAuth();
  const [picker, setPicker] = useState<PickerModal>(null);
  const [locationLabel, setLocationLabel] = useState<string>('Dhaka, Bangladesh');
  const [locationLoading, setLocationLoading] = useState(false);

  const updateUserPref = useCallback(async (key: string, value: string) => {
    if (!user?.id) return;
    await supabase.from('users').update({ [key]: value }).eq('id', user.id);
  }, [user?.id]);

  const handleLocationDetect = useCallback(async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Permission denied — keep existing label, show friendly message
        Alert.alert('Location Access', 'Permission denied. Keeping current default location.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const city = place?.city || place?.district || place?.subregion || 'Current Location';
      const country = place?.country || 'Bangladesh';
      setLocationLabel(`${city}, ${country}`);
    } catch {
      // Silently fall back — don't crash or blank the field
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const langLabel = language === 'bn' ? 'বাংলা' : 'English';
  const themeLabel = theme === 'dark' ? 'Dark Theme' : theme === 'light' ? 'Light Theme' : 'System Default';

  const SECTIONS: SettingSection[] = [
    { title: 'PREFERENCES', rows: [
      { id: 'notif', label: t('settings.notifications'), sub: t('settings.notification_settings'), icon: <Bell size={22} color={C.green} weight="fill" /> },
      { id: 'lang', label: t('settings.language'), sub: langLabel, icon: <Globe size={22} color={C.green} weight="fill" /> },
      { id: 'location', label: 'Default Location', sub: locationLoading ? 'Detecting…' : locationLabel, icon: <MapPin size={22} color={C.green} weight="fill" /> },
      { id: 'appearance', label: t('settings.theme'), sub: themeLabel, icon: <Moon size={22} color={C.green} weight="fill" /> },
    ]},
    { title: 'JOURNEY PREFERENCES', rows: [
      { id: 'alt_routes', label: t('settings.show_alt_routes'), sub: t('settings.show_alt_routes_sub'), toggle: true, icon: <ArrowsLeftRight size={22} color={C.green} weight="fill" /> },
      { id: 'delay_alerts', label: t('settings.delay_alerts'), sub: t('settings.delay_alerts_sub'), toggle: true, icon: <WarningCircle size={22} color={C.green} weight="fill" /> },
      { id: 'crowding', label: t('settings.crowding_updates'), sub: t('settings.crowding_updates_sub'), toggle: true, icon: <Users size={22} color={C.green} weight="fill" /> },
      { id: 'platform', label: t('settings.platform_alerts'), sub: t('settings.platform_alerts_sub'), toggle: false, icon: <Train size={22} color={C.green} weight="fill" /> },
    ]},
    { title: 'ACCOUNT & DATA', rows: [
      { id: 'privacy', label: t('settings.privacy'), sub: t('settings.privacy_sub'), icon: <ShieldCheck size={22} color={C.green} weight="fill" /> },
      { id: 'data', label: t('settings.data_usage'), sub: t('settings.data_usage_sub'), icon: <HardDrive size={22} color={C.green} weight="fill" /> },
      { id: 'backup', label: 'Backup & Restore', sub: 'Backup your data to restore later', icon: <CloudArrowUp size={22} color={C.green} weight="fill" /> },
    ]},
    { title: 'SUPPORT & ABOUT', rows: [
      { id: 'help', label: t('settings.help'), sub: t('settings.help_sub'), icon: <Question size={22} color={C.green} weight="fill" /> },
      { id: 'about', label: t('settings.about'), sub: t('settings.about_sub'), icon: <Info size={22} color={C.green} weight="fill" /> },
    ]},
  ];

  const getToggleValue = (id: string): boolean => {
    switch (id) {
      case 'alt_routes': return journeyPrefs.showAlternativeRoutes;
      case 'delay_alerts': return journeyPrefs.delayAlerts;
      case 'crowding': return journeyPrefs.crowdingUpdates;
      case 'platform': return journeyPrefs.platformChangeAlerts;
      default: return false;
    }
  };

  const handleToggle = (id: string) => {
    switch (id) {
      case 'alt_routes':
        setJourneyPref('showAlternativeRoutes', !journeyPrefs.showAlternativeRoutes);
        break;
      case 'delay_alerts':
        setJourneyPref('delayAlerts', !journeyPrefs.delayAlerts);
        break;
      case 'crowding':
        setJourneyPref('crowdingUpdates', !journeyPrefs.crowdingUpdates);
        break;
      case 'platform':
        setJourneyPref('platformChangeAlerts', !journeyPrefs.platformChangeAlerts);
        break;
    }
  };

  const handleRowPress = (id: string) => {
    if (id === 'lang') {
      setPicker({ type: 'lang' });
    } else if (id === 'appearance') {
      setPicker({ type: 'theme' });
    } else if (id === 'notif') {
      router.push('/notifications' as any);
    } else if (id === 'privacy') {
      router.push('/privacy' as any);
    } else if (id === 'location') {
      handleLocationDetect();
    } else if (id === 'help') {
      router.push('/coming-soon?feature=Help+%26+Support' as any);
    } else if (id === 'about') {
      router.push('/coming-soon?feature=About+RailMate' as any);
    } else if (id === 'data') {
      router.push('/coming-soon?feature=Data+Usage' as any);
    } else if (id === 'backup') {
      router.push('/coming-soon?feature=Backup+%26+Restore' as any);
    }
  };

  return (
    <SafeAreaView style={ss.root} edges={['top']}>
      <View style={ss.header}>
        <TouchableOpacity style={ss.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
        <View>
          <Text style={ss.title}>{t('settings.title')}</Text>
          <Text style={ss.subtitle}>{t('settings.subtitle')}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ss.scroll}>
        {SECTIONS.map(section => (
          <View key={section.title} style={ss.section}>
            <Text style={ss.sectionLabel}>{section.title}</Text>
            <View style={ss.sectionCard}>
              {section.rows.map((row, i) => (
                <View key={row.id}>
                  <TouchableOpacity
                    style={ss.row}
                    onPress={() => handleRowPress(row.id)}
                    disabled={row.toggle !== undefined}
                    activeOpacity={row.toggle !== undefined ? 1 : 0.7}
                  >
                    <View style={ss.rowIcon}>{row.icon}</View>
                    <View style={{ flex: 1 }}>
                      <Text style={ss.rowLabel}>{row.label}</Text>
                      <Text style={ss.rowSub}>{row.sub}</Text>
                    </View>
                    {row.toggle !== undefined ? (
                      <Switch
                        value={getToggleValue(row.id)}
                        onValueChange={() => handleToggle(row.id)}
                        trackColor={{ false: C.surface2, true: C.green }}
                        thumbColor={C.white}
                      />
                    ) : (
                      <View style={ss.chevron} />
                    )}
                  </TouchableOpacity>
                  {i < section.rows.length - 1 && <View style={ss.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={ss.logoutBtn}
          onPress={() => Alert.alert(t('auth.sign_out'), t('profile.sign_out_confirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('profile.sign_out'),
              style: 'destructive',
              onPress: async () => {
                await signOut();
                router.replace('/auth/login' as any);
              },
            },
          ])}
        >
          <View style={{ width: 32, height: 32, backgroundColor: C.redTint, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <SignOut size={22} color={C.red} weight="fill" />
          </View>
          <Text style={ss.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* In-app picker modal (replaces native AlertDialog) */}
      <Modal visible={picker !== null} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable style={ss.modalBackdrop} onPress={() => setPicker(null)}>
          <Pressable style={ss.modalSheet} onPress={() => {}}>
            <Text style={ss.modalTitle}>
              {picker?.type === 'lang' ? 'Language' : 'Appearance'}
            </Text>
            {picker?.type === 'lang' ? (
              <>
                {[
                  { label: 'English', value: 'en' as const },
                  { label: 'বাংলা', value: 'bn' as const },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[ss.modalOption, language === opt.value && ss.modalOptionActive]}
                    onPress={() => { setLanguage(opt.value); updateUserPref('language_pref', opt.value); setPicker(null); }}
                  >
                    <Text style={[ss.modalOptionText, language === opt.value && ss.modalOptionTextActive]}>
                      {opt.label}
                    </Text>
                    {language === opt.value && <Text style={{ color: C.green, fontSize: 16 }}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: 'Dark Theme', value: 'dark' as const },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[ss.modalOption, theme === opt.value && ss.modalOptionActive]}
                    onPress={() => { setTheme(opt.value); updateUserPref('theme_pref', opt.value); setPicker(null); }}
                  >
                    <Text style={[ss.modalOptionText, theme === opt.value && ss.modalOptionTextActive]}>
                      {opt.label}
                    </Text>
                    {theme === opt.value && <Text style={{ color: C.green, fontSize: 16 }}>✓</Text>}
                  </TouchableOpacity>
                ))}
                <Text style={{ fontSize: T.sm, color: C.text3, textAlign: 'center', paddingVertical: S.sm }}>
                  (Light theme coming soon)
                </Text>
              </>
            )}
            <TouchableOpacity style={ss.modalCancel} onPress={() => setPicker(null)}>
              <Text style={ss.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
const ss = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  section: { gap: S.sm },
  sectionLabel: { fontSize: T.sm, fontWeight: '700', color: C.text3, letterSpacing: 0.5 },
  sectionCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.lg },
  rowIcon: { width: 32, height: 32, backgroundColor: C.greenTint, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 14, fontWeight: '600', color: C.white },
  rowSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  chevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: S.lg },
  logoutBtn: { backgroundColor: C.redTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.red, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md, justifyContent: 'center' },
  logoutText: { fontSize: T.md, fontWeight: '700', color: C.red },
  // In-app picker modal
  modalBackdrop:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet:          { backgroundColor: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: S.xl, paddingTop: S.xl, paddingBottom: 32 },
  modalTitle:          { fontSize: 16, fontWeight: '700', color: C.white, marginBottom: S.lg, textAlign: 'center' },
  modalOption:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: S.md, borderBottomWidth: 1, borderBottomColor: C.border },
  modalOptionActive:   { },
  modalOptionText:     { fontSize: 15, color: C.text2 },
  modalOptionTextActive:{ color: C.green, fontWeight: '600' },
  modalCancel:         { marginTop: S.lg, alignItems: 'center', paddingVertical: S.md },
  modalCancelText:     { fontSize: 15, color: C.text3 },
});
