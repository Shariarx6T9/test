// app/settings.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';

interface SettingRow { id: string; label: string; sub: string; toggle?: boolean; value?: string; }
interface SettingSection { title: string; rows: SettingRow[]; }

const SECTIONS: SettingSection[] = [
  { title: 'PREFERENCES', rows: [
    { id: 'notif', label: 'Notifications', sub: 'Manage notification preferences' },
    { id: 'lang', label: 'Language', sub: 'English (English)', value: 'English' },
    { id: 'location', label: 'Default Location', sub: 'Dhaka, Bangladesh' },
    { id: 'appearance', label: 'Appearance', sub: 'Dark Theme' },
    { id: 'distance', label: 'Distance Unit', sub: 'Kilometer (km)' },
  ]},
  { title: 'JOURNEY PREFERENCES', rows: [
    { id: 'alt_routes', label: 'Show Alternative Routes', sub: 'Display alternative routes in search', toggle: true },
    { id: 'delay_alerts', label: 'Delay Alerts', sub: 'Get notified about train delays', toggle: true },
    { id: 'crowding', label: 'Crowding Updates', sub: 'Show crowding level information', toggle: true },
    { id: 'platform', label: 'Platform Change Alerts', sub: 'Notify about platform changes', toggle: false },
  ]},
  { title: 'ACCOUNT & DATA', rows: [
    { id: 'privacy', label: 'Privacy & Security', sub: 'Manage your privacy and security' },
    { id: 'data', label: 'Data Usage', sub: 'Manage offline data and storage' },
    { id: 'backup', label: 'Backup & Restore', sub: 'Backup your data to restore later' },
  ]},
  { title: 'SUPPORT & ABOUT', rows: [
    { id: 'help', label: 'Help & Support', sub: 'FAQs, guides and contact support' },
    { id: 'about', label: 'About RailMate', sub: 'Version 1.0.0 (Build 120)' },
  ]},
];

export default function SettingsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    alt_routes: true, delay_alerts: true, crowding: true, platform: false,
  });

  const toggle = (id: string) => setToggles(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <SafeAreaView style={ss.root}>
      <View style={ss.header}>
        <TouchableOpacity style={ss.backBtn} onPress={() => router.back()} />
        <View>
          <Text style={ss.title}>Settings</Text>
          <Text style={ss.subtitle}>Manage your preferences and app settings</Text>
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
                  <View style={ss.row}>
                    <View style={ss.rowIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={ss.rowLabel}>{row.label}</Text>
                      <Text style={ss.rowSub}>{row.sub}</Text>
                    </View>
                    {row.toggle !== undefined ? (
                      <Switch
                        value={toggles[row.id]}
                        onValueChange={() => toggle(row.id)}
                        trackColor={{ false: C.surface2, true: C.green }}
                        thumbColor={C.white}
                      />
                    ) : (
                      <View style={ss.chevron} />
                    )}
                  </View>
                  {i < section.rows.length - 1 && <View style={ss.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity style={ss.logoutBtn} onPress={() => Alert.alert('Log Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Log Out', style: 'destructive' }])}>
          <Text style={ss.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const ss = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  section: { gap: S.sm },
  sectionLabel: { fontSize: T.sm, fontWeight: '700', color: C.text3, letterSpacing: 0.5 },
  sectionCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.lg },
  rowIcon: { width: 32, height: 32, backgroundColor: C.greenTint, borderRadius: 10 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: C.white },
  rowSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  chevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: S.lg },
  logoutBtn: { backgroundColor: C.redTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.red, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  logoutText: { fontSize: T.md, fontWeight: '700', color: C.red },
});
