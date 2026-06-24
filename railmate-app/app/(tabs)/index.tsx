// app/(tabs)/index.tsx — Home Screen

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LiveUpdateItem {
  id: string;
  trainName: string;
  statusText: string;
  statusColor: string;
  statusBg: string;
  travelers: number;
  minutesAgo: number;
}

interface SavedRoute {
  id: string;
  from: string;
  to: string;
  lastViewed: string;
}

interface QuickAction {
  id: string;
  label: string;
  route: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'live', label: 'Live Status', route: '/(tabs)/live' },
  { id: 'trips', label: 'My Trips', route: '/journey-tools' },
  { id: 'alert', label: 'Set Alert', route: '/set-alert' },
  { id: 'station', label: 'Station Info', route: '/station-information' },
  { id: 'coach', label: 'Coach Position', route: '/coach-position' },
  { id: 'fare', label: 'Fare Calculator', route: '/fare-calculator' },
];

const SAVED_ROUTES: SavedRoute[] = [
  { id: '1', from: 'Dhaka', to: 'Chattogram', lastViewed: 'Today, 7:45 PM' },
  { id: '2', from: 'Dhaka', to: 'Sylhet', lastViewed: 'Yesterday' },
  { id: '3', from: 'Dhaka', to: 'Rajshahi', lastViewed: '2 days ago' },
];

const LIVE_UPDATES: LiveUpdateItem[] = [
  { id: '1', trainName: 'Subarna Express', statusText: '15 min delay reported', statusColor: C.red, statusBg: C.redTint, travelers: 8, minutesAgo: 10 },
  { id: '2', trainName: 'Mahanagar Express', statusText: 'Crowding High (Coach 3-5)', statusColor: C.orange, statusBg: C.orangeTint, travelers: 12, minutesAgo: 18 },
  { id: '3', trainName: 'Sonar Bangla Express', statusText: 'Running On Time', statusColor: C.green, statusBg: C.greenTint, travelers: 6, minutesAgo: 25 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

  const handleSearch = () => router.push('/search-trains');
  const handleLiveAll = () => router.push('/(tabs)/live');
  const handleCommunity = () => router.push('/(tabs)/community');

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
            <TouchableOpacity style={s.bell} />
          </View>
          <Text style={s.greeting}>Good Evening,</Text>
          <Text style={s.userName}>Najmul 👋</Text>
          <Text style={s.date}>Thursday, 18 June</Text>
        </View>

        <View style={s.body}>

          {/* ── Search Card ── */}
          <View style={s.card}>
            <View style={s.routeRow}>
              <View>
                <Text style={s.label}>From</Text>
                <Text style={s.stationName}>Dhaka</Text>
              </View>
              <TouchableOpacity style={s.swapBtn} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.label}>To</Text>
                <Text style={s.stationName}>Chattogram</Text>
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.dateRow}>
              <Text style={s.dateText}>Today, 18 June</Text>
            </View>
            <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
              <Text style={s.searchBtnText}>Search Trains</Text>
            </TouchableOpacity>
          </View>

          {/* ── Quick Actions ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity><Text style={s.viewAll}>View All</Text></TouchableOpacity>
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
              <Text style={s.sectionTitle}>Saved Routes</Text>
              <TouchableOpacity><Text style={s.viewAll}>View All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={s.routeCards}>
                {SAVED_ROUTES.map((route) => (
                  <TouchableOpacity key={route.id} style={s.routeCard}>
                    <Text style={s.routeCardTitle}>{route.from} → {route.to}</Text>
                    <Text style={s.routeCardSub}>{route.lastViewed}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* ── Live Updates ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Live Updates</Text>
              <TouchableOpacity onPress={handleLiveAll}>
                <Text style={s.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={s.card}>
              {LIVE_UPDATES.map((item, i) => (
                <View key={item.id}>
                  <View style={s.liveItem}>
                    <View style={[s.liveIcon, { backgroundColor: item.statusBg }]} />
                    <View style={s.liveInfo}>
                      <Text style={s.liveTrain}>{item.trainName}</Text>
                      <Text style={[s.liveStatus, { color: item.statusColor }]}>{item.statusText}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={s.liveMeta}>{item.travelers} travelers</Text>
                      <Text style={s.liveTime}>{item.minutesAgo} min ago</Text>
                    </View>
                  </View>
                  {i < LIVE_UPDATES.length - 1 && <View style={s.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* ── Community Banner ── */}
          <TouchableOpacity style={s.communityBanner} onPress={handleCommunity}>
            <View style={s.communityIcon} />
            <View style={{ flex: 1 }}>
              <Text style={s.communityLabel}>Today's Community Activity</Text>
              <View style={s.communityStats}>
                <View>
                  <Text style={s.communityStat}>127</Text>
                  <Text style={s.communityStatSub}>reports today</Text>
                </View>
                <View>
                  <Text style={s.communityStat}>42</Text>
                  <Text style={s.communityStatSub}>verified</Text>
                </View>
              </View>
            </View>
            <View style={s.viewCommunityBtn}>
              <Text style={s.viewCommunityText}>View Community</Text>
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
