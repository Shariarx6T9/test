// app/journey-tools.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useSavedRoutes } from '../hooks/useSavedRoutes';
import { useAuthStore } from '../stores/authStore';
import { useCommunityReports } from '../hooks/useCommunityReports';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '../i18n';

export default function JourneyToolsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { savedRoutes, loading: routesLoading, deleteRoute, refresh: refreshRoutes } = useSavedRoutes();
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
    { icon: C.greenTint, val: String(savedRoutes.length), label: t('journey.saved_routes'), sub: 'Total' },
    { icon: C.blueTint, val: String(myReports?.length ?? 0), label: t('journey.stat_journeys'), sub: t('journey.stat_journeys') },
    { icon: C.purpleTint, val: '—', label: t('journey.stat_distance'), sub: 'N/A' },
    { icon: C.orangeTint, val: '—', label: t('journey.stat_saved_time'), sub: 'N/A' },
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green} />
        }
      >
        {/* My Trips — Coming Soon */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}>
            <Text style={jt.sectionTitle}>My Trips</Text>
            <TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <View style={jt.tripCard}>
            <View style={{ padding: S.xl, alignItems: 'center', gap: S.sm }}>
              <Text style={{ color: C.text2, fontSize: T.base }}>{t('home.coming_soon_title')}</Text>
              <Text style={{ color: C.text3, fontSize: T.sm, textAlign: 'center' }}>{t('home.coming_soon_body')}</Text>
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
            <View style={{ paddingVertical: S.lg, alignItems: 'center', gap: S.sm }}>
              <Text style={{ color: C.text2, fontSize: T.base }}>{t('journey.no_saved_routes')}</Text>
              <Text style={{ color: C.text3, fontSize: T.sm, textAlign: 'center' }}>{t('journey.no_saved_routes_sub')}</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: S.sm }}>
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
                        <View style={[jt.initCircle, { backgroundColor: C.green }]}>
                          <Text style={jt.initText}>{fromInitial}</Text>
                        </View>
                        <Text style={{ color: C.text2 }}>→</Text>
                        <View style={[jt.initCircle, { backgroundColor: C.purple }]}>
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
            <View style={{ paddingVertical: S.lg, alignItems: 'center' }}>
              <Text style={{ color: C.text2, fontSize: T.base }}>No reminders set</Text>
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
                    trackColor={{ false: C.surface2, true: C.green }}
                    thumbColor={C.white}
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
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.xl, paddingVertical: S.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 36, height: 36, backgroundColor: C.greenTint, borderRadius: 10 },
  title: { fontSize: T.lg, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  addBtn: { backgroundColor: C.surface2, borderRadius: 20, padding: S.sm, paddingHorizontal: S.md },
  addBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  tripCard: { flexDirection: 'row', backgroundColor: C.surface2, borderRadius: R.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', alignItems: 'center' },
  tripImg: { width: 80, height: 72, backgroundColor: C.bg },
  tripRoute: { fontSize: 14, fontWeight: '700', color: C.white },
  tripTrain: { fontSize: T.sm, color: C.text2 },
  tripMeta: { flexDirection: 'row', gap: S.md },
  tripMetaText: { fontSize: T.xs, color: C.text3 },
  upcomingBadge: { backgroundColor: C.blueTint, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4, margin: S.md },
  upcomingText: { fontSize: T.xs, fontWeight: '600', color: C.blue },
  addTripRow: { alignItems: 'center', paddingVertical: S.sm },
  addTripText: { fontSize: T.base, fontWeight: '600', color: C.green },
  initCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  initText: { fontSize: T.sm, fontWeight: '700', color: C.bg },
  routeCard: { width: 120, backgroundColor: C.surface2, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md, gap: 6 },
  routeName: { fontSize: T.xs, fontWeight: '600', color: C.white },
  routeSub: { fontSize: 8, color: C.text2 },
  routeTrains: { fontSize: T.xs, color: C.green },
  remRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  remIcon: { width: 36, height: 36, backgroundColor: C.greenTint, borderRadius: 10 },
  remTrain: { fontSize: T.base, fontWeight: '700', color: C.white },
  remRoute: { fontSize: T.sm, color: C.text2 },
  remWhen: { fontSize: T.xs, fontWeight: '600', color: C.green },
  divider: { height: 1, backgroundColor: C.border },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  statCard: { width: '47.5%', borderRadius: R.md, padding: S.md, gap: 4 },
  statVal: { fontSize: 14, fontWeight: '700', color: C.white },
  statLabel: { fontSize: T.xs, color: C.white },
  statSub: { fontSize: 8, color: C.text2 },
});
