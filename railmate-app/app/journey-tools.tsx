// app/journey-tools.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { useSavedRoutes } from '../hooks/useSavedRoutes';
import { useAuthStore } from '../stores/authStore';
import { useCommunityReports } from '../hooks/useCommunityReports';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '../i18n';

export default function JourneyToolsScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { savedRoutes, deleteRoute, refresh: refreshRoutes } = useSavedRoutes();
  const { data: myReports } = useCommunityReports(user?.id ? { userId: user.id } : null);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: reminders, refetch: refetchAlerts } = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.from('alerts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) return [];
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from('alerts').update({ is_active }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([refreshRoutes(), refetchAlerts()]);
    setRefreshing(false);
  }, [refreshRoutes, refetchAlerts]);

  const handleDeleteRoute = useCallback((id: string, routeName: string) => {
    Alert.alert(
      t('journey.remove_route'),
      `Remove "${routeName}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.remove'), style: 'destructive', onPress: () => deleteRoute(id) },
      ],
    );
  }, [t, deleteRoute]);

  const statsData = [
    { icon: Colors.dark['primary-subtle'], val: String(savedRoutes.length), label: t('journey.saved_routes'), sub: 'Total' },
    { icon: Colors.dark['info-subtle'], val: String(myReports?.length ?? 0), label: t('journey.stat_journeys'), sub: t('journey.stat_journeys') },
    { icon: Colors.dark['info-subtle'], val: '—', label: t('journey.stat_distance'), sub: 'N/A' },
    { icon: Colors.dark['accent-subtle'], val: '—', label: t('journey.stat_saved_time'), sub: 'N/A' },
  ];

  return (
    <SafeAreaView style={jt.root}>
      <View style={jt.header}>
        <View style={jt.headerLeft}>
          <View style={jt.headerIcon} />
          <View>
            <Text style={jt.title}>Journey Tools</Text>
            <Text style={jt.subtitle}>Plan, manage and track your journeys</Text>
          </View>
        </View>
        <TouchableOpacity style={jt.addBtn}><Text style={jt.addBtnText}>+ Add Trip</Text></TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={jt.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.dark.primary} />
        }
      >
        {/* My Trips — Coming Soon */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}>
            <Text style={jt.sectionTitle}>My Trips</Text>
            {/* BUG 3 FIX: Remove dead "View All" button since feature is coming soon */}
            {/* <TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity> */}
          </View>
          <View style={jt.tripCard}>
            <View style={{ padding: Spacing['space-5'], alignItems: 'center', gap: Spacing['space-2'] }}>
              <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body }}>{t('home.coming_soon_title')}</Text>
              <Text style={{ color: Colors.dark['text-tertiary'], ...Typography['body-sm'], textAlign: 'center' }}>{t('home.coming_soon_body')}</Text>
            </View>
          </View>
        </View>

        {/* Saved Routes */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}>
            <Text style={jt.sectionTitle}>Saved Routes</Text>
            <TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {savedRoutes.length === 0 ? (
            <View style={{ paddingVertical: Spacing['space-4'], alignItems: 'center', gap: Spacing['space-2'] }}>
              <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body }}>{t('journey.no_saved_routes')}</Text>
              <Text style={{ color: Colors.dark['text-tertiary'], ...Typography['body-sm'], textAlign: 'center' }}>{t('journey.no_saved_routes_sub')}</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: Spacing['space-2'] }}>
                {savedRoutes.map((route) => {
                  const fromInitial = (route.fromStation.name_en ?? '?')[0].toUpperCase();
                  const toInitial = (route.toStation.name_en ?? '?')[0].toUpperCase();
                  const routeName = `${route.fromStation.name_en} → ${route.toStation.name_en}`;
                  const savedDate = new Date(route.savedAt);
                  const now = new Date();
                  const diffDays = Math.floor((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
                  const savedLabel = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
                  return (
                    <TouchableOpacity
                      key={route.id}
                      style={jt.routeCard}
                      onLongPress={() => handleDeleteRoute(route.id, routeName)}
                      activeOpacity={0.8}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[jt.initCircle, { backgroundColor: Colors.dark.primary }]}>
                          <Text style={jt.initText}>{fromInitial}</Text>
                        </View>
                        <Text style={{ color: Colors.dark['text-secondary'] }}>→</Text>
                        <View style={[jt.initCircle, { backgroundColor: Colors.dark.info }]}>
                          <Text style={jt.initText}>{toInitial}</Text>
                        </View>
                      </View>
                      <Text style={jt.routeName}>{routeName}</Text>
                      <Text style={jt.routeSub}>{savedLabel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Reminders */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}>
            <Text style={jt.sectionTitle}>Reminders</Text>
            <TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {(reminders ?? []).length === 0 ? (
            <View style={{ paddingVertical: Spacing['space-4'], alignItems: 'center' }}>
              <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body }}>No reminders set</Text>
            </View>
          ) : (
            (reminders ?? []).map((rem, i) => (
              <View key={rem.id}>
                <View style={jt.remRow}>
                  <View style={jt.remIcon} />
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={jt.remTrain}>{rem.alert_type ?? 'Alert'}</Text>
                    {rem.train_id && <Text style={jt.remRoute}>Train: {rem.train_id}</Text>}
                    {rem.station_id && <Text style={jt.remWhen}>Station: {rem.station_id}</Text>}
                  </View>
                  <Switch
                    value={!!rem.is_active}
                    onValueChange={() => toggleAlert.mutate({ id: rem.id, is_active: !rem.is_active })}
                    trackColor={{ false: Colors.dark['bg-overlay'], true: Colors.dark.primary }}
                    thumbColor={Colors.dark['text-primary']}
                  />
                </View>
                {i < (reminders ?? []).length - 1 && <View style={jt.divider} />}
              </View>
            ))
          )}
        </View>

        {/* Stats */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}>
            <Text style={jt.sectionTitle}>Travel Statistics</Text>
            <TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <View style={jt.statsRow}>
            {statsData.map(stat => (
              <View key={stat.label} style={[jt.statCard, { backgroundColor: stat.icon }]}>
                <Text style={jt.statVal}>{stat.val}</Text>
                <Text style={jt.statLabel}>{stat.label}</Text>
                <Text style={jt.statSub}>{stat.sub}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const jt = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  headerIcon: { width: 36, height: 36, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 10 },
  title: { ...Typography.h3, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 1 },
  addBtn: { backgroundColor: Colors.dark['bg-overlay'], borderRadius: 20, padding: Spacing['space-2'], paddingHorizontal: Spacing['space-3'] },
  addBtnText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  card: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-3'] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.h4, fontWeight: '700', color: Colors.dark['text-primary'] },
  viewAll: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  tripCard: { flexDirection: 'row', backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, overflow: 'hidden', alignItems: 'center' },
  tripImg: { width: 80, height: 72, backgroundColor: Colors.dark['bg-base'] },
  tripRoute: { fontSize: 14, fontWeight: '700', color: Colors.dark['text-primary'] },
  tripTrain: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  tripMeta: { flexDirection: 'row', gap: Spacing['space-3'] },
  tripMetaText: { ...Typography.caption, color: Colors.dark['text-tertiary'] },
  upcomingBadge: { backgroundColor: Colors.dark['info-subtle'], borderRadius: 8, paddingHorizontal: Spacing['space-2'], paddingVertical: 4, margin: Spacing['space-3'] },
  upcomingText: { ...Typography.caption, fontWeight: '600', color: Colors.dark.info },
  addTripRow: { alignItems: 'center', paddingVertical: Spacing['space-2'] },
  addTripText: { ...Typography.body, fontWeight: '600', color: Colors.dark.primary },
  initCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  initText: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['bg-base'] },
  routeCard: { width: 120, backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-3'], gap: 6 },
  routeName: { ...Typography.caption, fontWeight: '600', color: Colors.dark['text-primary'] },
  routeSub: { fontSize: 8, color: Colors.dark['text-secondary'] },
  routeTrains: { ...Typography.caption, color: Colors.dark.primary },
  remRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], paddingVertical: Spacing['space-2'] },
  remIcon: { width: 36, height: 36, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 10 },
  remTrain: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  remRoute: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  remWhen: { ...Typography.caption, fontWeight: '600', color: Colors.dark.primary },
  divider: { height: 1, backgroundColor: Colors.dark.border },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing['space-2'] },
  statCard: { width: '47.5%', borderRadius: Radius['radius-md'], padding: Spacing['space-3'], gap: 4 },
  statVal: { fontSize: 14, fontWeight: '700', color: Colors.dark['text-primary'] },
  statLabel: { ...Typography.caption, color: Colors.dark['text-primary'] },
  statSub: { fontSize: 8, color: Colors.dark['text-secondary'] },
});
