// app/(tabs)/live-updates.tsx — Live Updates Screen

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { communityKeys } from '../../hooks/useCommunityReports';
import { useTranslation } from '../../i18n';
import type { ReportFilter, ReportType } from '../../types/report.types';

const DEPARTURES = [
  { time: '10:00 PM', name: 'Turag Express #748', route: 'Dhaka → Tongi' },
  { time: '10:20 PM', name: 'Parabat Express #717', route: 'Dhaka → Sylhet' },
  { time: '10:40 PM', name: 'Subarna Express #721', route: 'Dhaka → Chattogram' },
  { time: '11:00 PM', name: 'Mahanagar Express #236', route: 'Dhaka → Chattogram' },
];

export default function LiveUpdatesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Delays' | 'Crowding' | 'Condition'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const filter: ReportFilter = activeFilter === 'Delays' ? { type: 'DELAY' }
    : activeFilter === 'Crowding' ? { type: 'CROWD' }
    : activeFilter === 'Condition' ? { type: 'GENERAL' }
    : null;

  const { data: reports, isLoading, refetch } = useCommunityReports(filter);

  const filters = ['All', 'Delays', 'Crowding', 'Condition'] as const;

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('live-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'community_reports',
      }, () => {
        queryClient.invalidateQueries({ queryKey: communityKeys.all });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  // Stats computed from real data
  const todayISO = new Date().toISOString().split('T')[0];
  const todayReports = (reports ?? []).filter(r => r.journey_date === todayISO || r.reported_at?.startsWith(todayISO));
  const delayCount = todayReports.filter(r => r.report_type === 'DELAY').length;
  const crowdCount = todayReports.filter(r => r.report_type === 'CROWD').length;
  const verifiedCount = todayReports.filter(r => r.status === 'VERIFIED').length;
  const generalCount = todayReports.filter(r => r.report_type !== 'DELAY' && r.report_type !== 'CROWD').length;

  const STATS = [
    { val: String(delayCount), label: t('notifications.delay'), sub: 'Active Now', bg: C.redTint },
    { val: String(crowdCount), label: t('notifications.crowding'), sub: 'Active Now', bg: C.orangeTint },
    { val: String(verifiedCount), label: t('notifications.verified'), sub: 'Verified', bg: C.greenTint },
    { val: String(generalCount), label: 'Other Reports', sub: 'Today', bg: C.blueTint },
  ];

  const liveUpdates = (reports ?? []).slice(0, 10).map(report => {
    let statusText: string;
    let statusColor: string;
    let statusBg: string;

    if (report.report_type === 'DELAY') {
      statusText = `${report.delay_minutes ?? '?'} min delay`;
      statusColor = C.red;
      statusBg = C.redTint;
    } else if (report.report_type === 'CROWD') {
      statusText = `Crowding ${report.crowd_level ?? 'High'}`;
      statusColor = C.orange;
      statusBg = C.orangeTint;
    } else {
      statusText = report.report_type;
      statusColor = C.blue;
      statusBg = C.blueTint;
    }

    const reportedTime = report.reported_at
      ? new Date(report.reported_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
      : '';

    return {
      id: report.id,
      trainName: report.train?.name_en ?? 'Unknown Train',
      trainNumber: report.train ? '#' + report.train.number : '',
      route: report.station?.name_en ?? 'Unknown',
      time: reportedTime,
      statusText,
      statusColor,
      statusBg,
      travelers: report.verification_count,
    };
  });

  const lastUpdated = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon} />
          <View>
            <Text style={s.title}>Live Updates</Text>
            <Text style={s.subtitle}>Real-time train status & alerts</Text>
          </View>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} />
          <TouchableOpacity style={s.iconBtn} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refetch();
              setRefreshing(false);
            }}
            tintColor={C.green}
          />
        }
      >

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.filterTab, activeFilter === f && s.filterTabActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[s.filterText, activeFilter === f && s.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats grid */}
        <View style={s.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={[s.statCard, { backgroundColor: stat.bg }]}>
              <Text style={s.statVal}>{stat.val}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
              <Text style={s.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* Live updates section */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Live Train Updates</Text>
            <Text style={s.lastUpdated}>Last updated: {lastUpdated}</Text>
          </View>

          {isLoading ? (
            // Loading skeleton
            [0, 1, 2].map(i => (
              <View key={i} style={[s.updateCard, { opacity: 0.4 }]}>
                <View style={s.updateTop}>
                  <View style={[s.updateImg, { borderColor: C.border }]} />
                  <View style={{ flex: 1, gap: S.sm }}>
                    <View style={{ height: 14, backgroundColor: C.surface2, borderRadius: 4, width: '60%' }} />
                    <View style={{ height: 10, backgroundColor: C.surface2, borderRadius: 4, width: '40%' }} />
                  </View>
                </View>
              </View>
            ))
          ) : liveUpdates.length === 0 ? (
            <View style={[s.updateCard, { alignItems: 'center', paddingVertical: S.xl }]}>
              <Text style={{ color: C.text2, fontSize: T.sm }}>No reports right now. Check back soon.</Text>
            </View>
          ) : (
            liveUpdates.map((update) => (
              <TouchableOpacity
                key={update.id}
                style={s.updateCard}
                onPress={() => router.push({ pathname: '/report-detail', params: { id: update.id } })}
                activeOpacity={0.8}
              >
                <View style={s.updateTop}>
                  <View style={[s.updateImg, { borderColor: update.statusColor }]} />
                  <View style={{ flex: 1 }}>
                    <View style={s.updateTitleRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.updateName}>{update.trainName} {update.trainNumber}</Text>
                        <Text style={s.updateRoute}>{update.route}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={s.updateTime}>{update.time}</Text>
                      </View>
                    </View>
                    <View style={[s.statusBadge, { backgroundColor: update.statusBg }]}>
                      <Text style={[s.statusText, { color: update.statusColor }]}>{update.statusText}</Text>
                    </View>
                    {update.travelers > 0 && (
                      <Text style={s.travelersText}>{update.travelers} travelers confirmed</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Upcoming departures */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Upcoming Departures</Text>
            <TouchableOpacity><Text style={s.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.departureRow}>
              {DEPARTURES.map((dep) => (
                <View key={dep.name} style={s.departureCard}>
                  <Text style={s.depTime}>{dep.time}</Text>
                  <View style={s.depImg} />
                  <Text style={s.depName}>{dep.name}</Text>
                  <Text style={s.depRoute}>{dep.route}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Alerts CTA */}
        <View style={s.alertsBanner}>
          <View style={s.alertsIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.alertsTitle}>Stay Informed, Travel Smart</Text>
            <Text style={s.alertsSub}>Enable live alerts for your favorite routes</Text>
          </View>
          <TouchableOpacity style={s.alertsBtn} onPress={() => router.push('/notifications')}>
            <Text style={s.alertsBtnText}>Manage Alerts</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.xl, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.xl, paddingVertical: S.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  title: { fontSize: T.lg, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  filterScroll: { marginBottom: -S.sm },
  filterTab: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: S.sm },
  filterTabActive: { backgroundColor: C.green },
  filterText: { fontSize: T.sm, fontWeight: '500', color: C.text2 },
  filterTextActive: { fontWeight: '700', color: C.bg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  statCard: { width: '47.5%', borderRadius: R.md, padding: S.md, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 20, fontWeight: '700', color: C.white },
  statLabel: { fontSize: T.sm, fontWeight: '600', color: C.white, textAlign: 'center' },
  statSub: { fontSize: 8, color: C.text2, textAlign: 'center' },
  section: { gap: S.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  lastUpdated: { fontSize: T.sm, color: C.text2 },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  updateCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg },
  updateTop: { flexDirection: 'row', gap: S.md },
  updateImg: { width: 56, height: 56, backgroundColor: C.surface2, borderRadius: R.md, borderWidth: 2 },
  updateTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: S.sm },
  updateName: { fontSize: T.base, fontWeight: '700', color: C.white },
  updateRoute: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  updateTime: { fontSize: T.sm, fontWeight: '600', color: C.white, textAlign: 'right' },
  updateReported: { fontSize: 9, color: C.text3, textAlign: 'right', marginTop: 1 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4, marginBottom: S.sm },
  statusText: { fontSize: T.sm, fontWeight: '700' },
  updateNote: { fontSize: T.sm, color: C.text2 },
  travelersText: { fontSize: T.xs, color: C.green, marginTop: 4 },
  departureRow: { flexDirection: 'row', gap: S.sm },
  departureCard: { width: 100, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md, gap: S.sm },
  depTime: { fontSize: T.sm, fontWeight: '700', color: C.white },
  depImg: { width: '100%', height: 56, backgroundColor: C.surface2, borderRadius: 8 },
  depName: { fontSize: T.xs, fontWeight: '600', color: C.white },
  depRoute: { fontSize: 8, color: C.text2 },
  alertsBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  alertsIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  alertsTitle: { fontSize: T.base, fontWeight: '700', color: C.white },
  alertsSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  alertsBtn: { backgroundColor: C.green, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  alertsBtnText: { fontSize: T.sm, fontWeight: '700', color: C.bg },
});
