// app/notifications.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';

type NotifFilter = 'All' | 'Alerts' | 'Community' | 'Updates' | 'System';

const FILTERS: { label: NotifFilter; color: string; bg: string }[] = [
  { label: 'All', color: C.green, bg: C.greenTint },
  { label: 'Alerts', color: C.red, bg: C.redTint },
  { label: 'Community', color: C.purple, bg: C.purpleTint },
  { label: 'Updates', color: C.blue, bg: C.blueTint },
  { label: 'System', color: C.orange, bg: C.orangeTint },
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
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('id, user_id, train_id, station_id, alert_type, is_active, created_at, read_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30);
        if (error) {
          const msg = (error as any)?.message ?? '';
          if (msg.includes('does not exist') || msg.includes('relation')) return [];
          throw error;
        }
        return data ?? [];
      } catch (err: any) {
        const msg = err?.message ?? '';
        if (msg.includes('does not exist') || msg.includes('relation')) return [];
        throw err;
      }
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
          <ActivityIndicator color={C.green} size="large" />
          <Text style={ns.stateText}>{t('common.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={ns.centerState}>
          <Text style={ns.stateText}>{t('common.error')}</Text>
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
      <View style={{ gap: S.sm }}>
        {alerts.map((alert) => {
          const isUnread = !alert.read_at;
          return (
            <TouchableOpacity
              key={alert.id}
              style={[ns.notifCard, isUnread && ns.notifCardUnread]}
              activeOpacity={0.8}
              onPress={() => markRead.mutate(alert.id)}
            >
              <View style={[ns.notifIcon, { backgroundColor: isUnread ? C.greenTint : C.surface2 }]} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={ns.notifTop}>
                  <Text style={ns.notifTitle}>{alert.alert_type ?? 'Alert'}</Text>
                  <View style={ns.notifMeta}>
                    <Text style={ns.notifTime}>{formatAlertDate(alert.created_at)}</Text>
                    <View style={[ns.readDot, { backgroundColor: isUnread ? C.green : C.text3 }]} />
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
        <TouchableOpacity style={ns.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
        <View>
          <Text style={ns.title}>Notifications</Text>
          <Text style={ns.subtitle}>Stay informed, travel better</Text>
        </View>
        <View style={ns.headerRight}>
          <TouchableOpacity style={ns.iconBtn} />
          <TouchableOpacity style={ns.iconBtn} />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ns.filterRow} contentContainerStyle={{ flexDirection: 'row', gap: S.sm, paddingHorizontal: S.xl }}>
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
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.sm, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, fontWeight: '600', color: C.green, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  filterRow: { marginBottom: S.md },
  chip: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, height: 36, borderWidth: 1, borderColor: C.border, justifyContent: 'center' },
  chipText: { fontSize: T.sm, color: C.text2 },
  group: { gap: S.sm },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: S.sm },
  groupLabel: { fontSize: T.base, fontWeight: '700', color: C.text2 },
  markAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  notifCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: S.lg, flexDirection: 'row', alignItems: 'flex-start', gap: S.md },
  notifCardUnread: { borderColor: C.green },
  notifIcon: { width: 44, height: 44, borderRadius: 22 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: T.base, fontWeight: '700', color: C.white },
  notifMeta: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  notifTime: { fontSize: T.xs, color: C.text3 },
  readDot: { width: 8, height: 8, borderRadius: 4 },
  notifDesc: { fontSize: T.sm, color: C.text2, lineHeight: 18 },
  notifSub: { fontSize: T.xs, color: C.text3 },
  chevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: S.md },
  stateText: { fontSize: T.base, color: C.text2, textAlign: 'center' },
  retryBtn: { backgroundColor: C.greenTint, borderRadius: R.md, paddingHorizontal: S.lg, paddingVertical: S.sm, borderWidth: 1, borderColor: C.green },
  retryText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
