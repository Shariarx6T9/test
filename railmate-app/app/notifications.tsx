// app/notifications.tsx — full file, only queryFn + error render changed
import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';

type NotifFilter = 'All' | 'Alerts' | 'Community' | 'Updates' | 'System';

const FILTERS: { label: NotifFilter; color: string; bg: string }[] = [
  { label: 'All', color: Colors.dark.primary, bg: Colors.dark['primary-subtle'] },
  { label: 'Alerts', color: Colors.dark.danger, bg: Colors.dark['danger-subtle'] },
  { label: 'Community', color: Colors.dark.info, bg: Colors.dark['info-subtle'] },
  { label: 'Updates', color: Colors.dark.info, bg: Colors.dark['info-subtle'] },
  { label: 'System', color: Colors.dark.accent, bg: Colors.dark['accent-subtle'] },
];

function formatAlertDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  } catch {
    return '';
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [active, setActive] = useState<NotifFilter>('All');

  const { data: alerts, isLoading, error, refetch } = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('alerts')
        .select('id, user_id, train_id, station_id, alert_type, is_active, created_at, read_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        // 42P01 = Postgres "undefined_table" — the alerts table genuinely
        // doesn't exist yet. That specific case is fine, show empty state.
        // Everything else (RLS denial, bad column, network, JWT) is a real
        // problem and must surface — never swallow by guessing from message text.
        if ((error as any).code === '42P01') return [];
        console.error('[Notifications] alerts query failed:', (error as any).code, error.message, (error as any).details, (error as any).hint);
        throw error;
      }
      return data ?? [];
    },
    enabled: !!user?.id,
    staleTime: 30_000,
  });

  const markRead = useMutation({
    mutationFn: async (alertId: string) => {
      await supabase.from('alerts').update({ read_at: new Date().toISOString() }).eq('id', alertId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={ns.centerState}>
          <ActivityIndicator color={Colors.dark.primary} size="large" />
          <Text style={ns.stateText}>{t('common.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={ns.centerState}>
          <Text style={ns.stateText}>{t('common.error')}</Text>
          {/* Dev-only: shows the actual Postgres/PostgREST error on-device.
              This is temporary debugging visibility — strip this block (or
              gate it more strictly) before a real production release. */}
          {__DEV__ && (
            <Text style={ns.debugText}>
              {(error as any)?.code ? `[${(error as any).code}] ` : ''}
              {(error as any)?.message ?? String(error)}
            </Text>
          )}
          <TouchableOpacity style={ns.retryBtn} onPress={() => refetch()}>
            <Text style={ns.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!alerts || alerts.length === 0) {
      return (
        <View style={ns.centerState}>
          <Text style={ns.stateText}>{t('notifications.empty')}</Text>
        </View>
      );
    }

    return (
      <View style={{ gap: Spacing['space-2'] }}>
        {alerts.map((alert) => {
          const isUnread = !alert.read_at;
          return (
            <TouchableOpacity
              key={alert.id}
              style={[ns.notifCard, isUnread && ns.notifCardUnread]}
              activeOpacity={0.8}
              onPress={() => markRead.mutate(alert.id)}
            >
              <View style={[ns.notifIcon, { backgroundColor: isUnread ? Colors.dark['primary-subtle'] : Colors.dark['bg-overlay'] }]} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={ns.notifTop}>
                  <Text style={ns.notifTitle}>{alert.alert_type ?? 'Alert'}</Text>
                  <View style={ns.notifMeta}>
                    <Text style={ns.notifTime}>{formatAlertDate(alert.created_at)}</Text>
                    <View style={[ns.readDot, { backgroundColor: isUnread ? Colors.dark.primary : Colors.dark['text-tertiary'] }]} />
                  </View>
                </View>
                {alert.train_id && (
                  <Text style={ns.notifDesc}>Train ID: {alert.train_id}</Text>
                )}
                {alert.station_id && (
                  <Text style={ns.notifSub}>Station: {alert.station_id}</Text>
                )}
              </View>
              <View style={ns.chevron} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={ns.root}>
      <View style={ns.header}>
        <TouchableOpacity style={ns.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
        <View>
          <Text style={ns.title}>Notifications</Text>
          <Text style={ns.subtitle}>Stay informed, travel better</Text>
        </View>
        <View style={ns.headerRight}>
          <TouchableOpacity style={ns.iconBtn} />
          <TouchableOpacity style={ns.iconBtn} />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ns.filterRow} contentContainerStyle={{ flexDirection: 'row', gap: Spacing['space-2'], paddingHorizontal: Spacing['space-5'] }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f.label} style={[ns.chip, active === f.label && { backgroundColor: f.bg, borderColor: f.color }]} onPress={() => setActive(f.label)}>
            <Text style={[ns.chipText, active === f.label && { color: f.color, fontWeight: '700' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ns.scroll}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
const ns = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-2'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: Spacing['space-2'] },
  iconBtn: { width: 36, height: 36, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 18 },
  filterRow: { marginBottom: Spacing['space-3'] },
  chip: { backgroundColor: Colors.dark['bg-card'], borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, height: 36, borderWidth: 1, borderColor: Colors.dark.border, justifyContent: 'center' },
  chipText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  group: { gap: Spacing['space-2'] },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing['space-2'] },
  groupLabel: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-secondary'] },
  markAll: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  notifCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], flexDirection: 'row', alignItems: 'flex-start', gap: Spacing['space-3'] },
  notifCardUnread: { borderColor: Colors.dark.primary },
  notifIcon: { width: 44, height: 44, borderRadius: 22 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  notifMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-1'] },
  notifTime: { ...Typography.caption, color: Colors.dark['text-tertiary'] },
  readDot: { width: 8, height: 8, borderRadius: 4 },
  notifDesc: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], lineHeight: 18 },
  notifSub: { ...Typography.caption, color: Colors.dark['text-tertiary'] },
  chevron: { width: 16, height: 16, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: Spacing['space-3'] },
  stateText: { ...Typography.body, color: Colors.dark['text-secondary'], textAlign: 'center' },
  debugText: { ...Typography.caption, color: Colors.dark['text-tertiary'], textAlign: 'center', fontFamily: 'monospace', paddingHorizontal: Spacing['space-5'] },
  retryBtn: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-4'], paddingVertical: Spacing['space-2'], borderWidth: 1, borderColor: Colors.dark.primary },
  retryText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
});