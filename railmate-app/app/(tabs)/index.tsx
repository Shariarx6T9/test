// app/(tabs)/index.tsx — Home Screen

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import { usePrefsStore } from '../../stores/prefsStore';
import { useSearchStore } from '../../stores/searchStore';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { useTranslation } from '../../i18n';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  route: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Auth
  const { user } = useAuthStore();
  const displayName = user?.display_name ?? t('profile.traveler');

  // Greeting based on hour
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t('home.greeting_morning')
    : hour < 17
      ? t('home.greeting_afternoon')
      : hour < 21
        ? t('home.greeting_evening')
        : t('home.greeting_night');

  // Today's date label
  const todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Search store
  const { fromStation, toStation, date, swapStations } = useSearchStore();

  // Saved routes
  const { savedRoutes, loading: routesLoading } = useSavedRoutes();

  // Community reports — all (for community stats) and DELAY (for live updates)
  const { data: allReports } = useCommunityReports(null);
  const { data: delayReports, isLoading: delayLoading } = useCommunityReports({ type: 'DELAY' });

  // Community stats — today's reports
  const today = new Date().toISOString().split('T')[0];
  const todayReports = (allReports ?? []).filter(
    (r) => r.reported_at.startsWith(today),
  );
  const todayCount = todayReports.length;
  const verifiedCount = todayReports.filter((r) => r.status === 'VERIFIED').length;

  // Top 3 delay reports for live updates section
  const topDelayReports = (delayReports ?? []).slice(0, 3);

  // Helper: minutes ago from ISO timestamp
  const minutesAgo = (isoStr: string): number => {
    const diff = Date.now() - new Date(isoStr).getTime();
    return Math.max(0, Math.floor(diff / 60000));
  };

  // Helper: relative time for saved route
  const relativeTime = (isoStr: string): string => {
    const mins = minutesAgo(isoStr);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return t('home.last_viewed_yesterday');
    return t('home.last_viewed_days_ago', { days: String(days) });
  };

  // Quick actions
  const QUICK_ACTIONS: QuickAction[] = [
    { id: 'live', label: t('home.action_live'), route: '/(tabs)/live-updates' },
    { id: 'trips', label: t('home.action_trips'), route: '/journey-tools' },
    { id: 'alert', label: t('home.action_alerts'), route: '/notifications' },
    { id: 'station', label: t('home.action_station'), route: '/station-information' },
    { id: 'coach', label: t('home.action_coach'), route: '/journey-tools' },
    { id: 'fare', label: t('home.action_fare'), route: '/journey-tools' },
  ];

  // Format ISO date to human-readable for search card
  const formatDate = (isoDate: string): string => {
    try {
      return new Date(isoDate).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.heroTop}>
            <View style={s.brand}>
              <View style={s.brandIcon} />
              <View>
                <View style={s.brandRow}>
                  <Text style={s.brandRail}>Rail</Text>
                  <Text style={s.brandMate}>Mate</Text>
                </View>
                <Text style={s.brandSub}>Bangladesh</Text>
              </View>
            </View>
            <TouchableOpacity style={s.bell} onPress={() => router.push('/notifications')} />
          </View>
          <Text style={s.greeting}>{greeting},</Text>
          <Text style={s.userName}>{displayName} 👋</Text>
          <Text style={s.date}>{todayLabel}</Text>
        </View>

        <View style={s.body}>

          {/* ── Search Card ── */}
          <View style={s.card}>
            <View style={s.routeRow}>
              <TouchableOpacity onPress={() => router.push('/search-trains' as any)}>
                <Text style={s.label}>{t('search.from')}</Text>
                <Text style={s.stationName}>
                  {fromStation?.name_en ?? t('search.placeholder_from')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.swapBtn} onPress={swapStations} />
              <TouchableOpacity
                style={{ alignItems: 'flex-end' }}
                onPress={() => router.push('/search-trains' as any)}
              >
                <Text style={s.label}>{t('search.to')}</Text>
                <Text style={s.stationName}>
                  {toStation?.name_en ?? t('search.placeholder_to')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={s.divider} />
            <View style={s.dateRow}>
              <Text style={s.dateText}>{formatDate(date)}</Text>
            </View>
            <TouchableOpacity style={s.searchBtn} onPress={() => router.push('/search-trains' as any)}>
              <Text style={s.searchBtnText}>{t('search.button')}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Quick Actions ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('home.quick_actions')}</Text>
              <TouchableOpacity><Text style={s.viewAll}>{t('home.see_all')}</Text></TouchableOpacity>
            </View>
            <View style={s.qaGrid}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={s.qaItem}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={s.qaIcon} />
                  <Text style={s.qaLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Saved Routes ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('home.saved_routes')}</Text>
              <TouchableOpacity onPress={() => router.push('/journey-tools' as any)}>
                <Text style={s.viewAll}>{t('home.see_all')}</Text>
              </TouchableOpacity>
            </View>
            {routesLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={s.routeCards}>
                  {[1, 2, 3].map((i) => (
                    <View key={i} style={[s.routeCard, { backgroundColor: C.surface2 }]} />
                  ))}
                </View>
              </ScrollView>
            ) : savedRoutes.length === 0 ? (
              <View style={[s.card, { alignItems: 'center', paddingVertical: S.xxl }]}>
                <Text style={s.stationName}>{t('home.no_saved_routes')}</Text>
                <Text style={[s.label, { marginTop: S.sm, textAlign: 'center' }]}>
                  {t('home.no_saved_routes_hint')}
                </Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={s.routeCards}>
                  {savedRoutes.map((route) => (
                    <TouchableOpacity key={route.id} style={s.routeCard}>
                      <Text style={s.routeCardTitle}>
                        {route.fromStation.name_en} → {route.toStation.name_en}
                      </Text>
                      <Text style={s.routeCardSub}>{relativeTime(route.savedAt)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* ── Live Updates ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('home.live_updates')}</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/live-updates' as any)}>
                <Text style={s.viewAll}>{t('home.see_all')}</Text>
              </TouchableOpacity>
            </View>
            <View style={s.card}>
              {delayLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <View key={i}>
                      <View style={[s.liveItem, { opacity: 0.4 }]}>
                        <View style={[s.liveIcon, { backgroundColor: C.surface2 }]} />
                        <View style={[s.liveInfo, { backgroundColor: C.surface2, height: 32, borderRadius: 6 }]} />
                      </View>
                      {i < 3 && <View style={s.divider} />}
                    </View>
                  ))}
                </>
              ) : topDelayReports.length === 0 ? (
                <View style={{ paddingVertical: S.lg, alignItems: 'center' }}>
                  <Text style={s.dateText}>{t('home.no_live_updates')}</Text>
                </View>
              ) : (
                topDelayReports.map((report, i) => {
                  const trainName = report.train?.name_en ?? 'Unknown Train';
                  const statusText = report.report_type === 'DELAY'
                    ? `${report.delay_minutes ?? '?'} min delay`
                    : report.report_type;
                  const statusColor = C.red;
                  const statusBg = C.redTint;
                  const travelers = report.verification_count;
                  const minsAgo = minutesAgo(report.reported_at);

                  return (
                    <View key={report.id}>
                      <View style={s.liveItem}>
                        <View style={[s.liveIcon, { backgroundColor: statusBg }]} />
                        <View style={s.liveInfo}>
                          <Text style={s.liveTrain}>{trainName}</Text>
                          <Text style={[s.liveStatus, { color: statusColor }]}>{statusText}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={s.liveMeta}>{travelers} travelers</Text>
                          <Text style={s.liveTime}>{minsAgo} min ago</Text>
                        </View>
                      </View>
                      {i < topDelayReports.length - 1 && <View style={s.divider} />}
                    </View>
                  );
                })
              )}
            </View>
          </View>

          {/* ── Community Banner ── */}
          <TouchableOpacity style={s.communityBanner} onPress={() => router.push('/(tabs)/community')}>
            <View style={s.communityIcon} />
            <View style={{ flex: 1 }}>
              <Text style={s.communityLabel}>{t('home.today_activity')}</Text>
              <View style={s.communityStats}>
                <View>
                  <Text style={s.communityStat}>{todayCount}</Text>
                  <Text style={s.communityStatSub}>{t('home.reports_today')}</Text>
                </View>
                <View>
                  <Text style={s.communityStat}>{verifiedCount}</Text>
                  <Text style={s.communityStatSub}>{t('home.verified_reports')}</Text>
                </View>
              </View>
            </View>
            <View style={s.viewCommunityBtn}>
              <Text style={s.viewCommunityText}>{t('home.view_community')}</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 24 },
  hero: { backgroundColor: '#070B12', paddingHorizontal: S.xxl, paddingTop: S.md, paddingBottom: S.xxl },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  brandIcon: { width: 32, height: 32, backgroundColor: C.green, borderRadius: 8 },
  brandRow: { flexDirection: 'row' },
  brandRail: { fontSize: T.lg, fontWeight: '800', color: C.white },
  brandMate: { fontSize: T.lg, fontWeight: '800', color: C.green },
  brandSub: { fontSize: T.xs, color: C.text2, marginTop: 1 },
  bell: { width: 36, height: 36, backgroundColor: C.surface, borderRadius: 18 },
  greeting: { fontSize: T.base, color: C.text2 },
  userName: { fontSize: 26, fontWeight: '800', color: C.white, marginTop: 2 },
  date: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  body: { paddingHorizontal: S.xl, paddingTop: S.xl, gap: S.xxl },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  swapBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  label: { fontSize: T.xs, color: C.text2 },
  stationName: { fontSize: T.md, fontWeight: '600', color: C.white, marginTop: 2 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: S.md },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  dateText: { fontSize: T.base, color: C.text2 },
  searchBtn: { backgroundColor: C.green, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginTop: S.md },
  searchBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
  section: { gap: S.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.lg - 1, fontWeight: '700', color: C.white },
  viewAll: { fontSize: T.base, fontWeight: '600', color: C.green },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  qaItem: { width: '31%', backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, alignItems: 'center', gap: S.sm },
  qaIcon: { width: 32, height: 32, backgroundColor: C.greenTint, borderRadius: 10 },
  qaLabel: { fontSize: T.xs, color: C.white, textAlign: 'center' },
  routeCards: { flexDirection: 'row', gap: S.sm },
  routeCard: { width: 130, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: 14 },
  routeCardTitle: { fontSize: T.sm, fontWeight: '600', color: C.white },
  routeCardSub: { fontSize: 9, color: C.text2, marginTop: 4 },
  liveItem: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  liveIcon: { width: 40, height: 40, borderRadius: 12 },
  liveInfo: { flex: 1, gap: 3 },
  liveTrain: { fontSize: T.base, fontWeight: '600', color: C.white },
  liveStatus: { fontSize: T.sm, fontWeight: '500' },
  liveMeta: { fontSize: 9, color: C.text2, textAlign: 'right' },
  liveTime: { fontSize: 9, color: C.text3, textAlign: 'right', marginTop: 2 },
  communityBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  communityIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  communityLabel: { fontSize: T.sm, fontWeight: '600', color: C.green },
  communityStats: { flexDirection: 'row', gap: S.xl, marginTop: 4 },
  communityStat: { fontSize: 18, fontWeight: '700', color: C.white },
  communityStatSub: { fontSize: 9, color: C.text2 },
  viewCommunityBtn: { backgroundColor: C.green, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  viewCommunityText: { fontSize: 9, fontWeight: '700', color: C.bg },
});
