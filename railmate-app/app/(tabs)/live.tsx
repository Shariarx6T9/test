// app/(tabs)/live.tsx — Live Updates Screen

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

type FilterTab = 'All' | 'Active' | 'Delays' | 'Alerts' | 'Past';

interface LiveUpdate {
  id: string;
  trainName: string;
  trainNumber: string;
  route: string;
  time: string;
  reportedAgo: string;
  travelers: number;
  type: 'delay' | 'crowding' | 'ontime' | 'announcement';
  statusText: string;
  statusColor: string;
  statusBg: string;
  note?: string;
  announcement?: boolean;
}

const UPDATES: LiveUpdate[] = [
  { id: '1', trainName: 'Subarna Express', trainNumber: '#721', route: 'Dhaka (Kamlapur) → Chattogram', time: '9:35 PM', reportedAgo: 'Reported 8 min ago', travelers: 8, type: 'delay', statusText: '15 min delay', statusColor: C.red, statusBg: C.redTint, note: undefined },
  { id: '2', trainName: 'Mahanagar Express', trainNumber: '#236', route: 'Dhaka → Chattogram', time: '9:28 PM', reportedAgo: 'Reported 12 min ago', travelers: 12, type: 'crowding', statusText: 'Crowding High', statusColor: C.orange, statusBg: C.orangeTint, note: 'High passenger load in Coach 3-5' },
  { id: '3', trainName: 'Sonar Bangla Express', trainNumber: '#787', route: 'Dhaka → Rajshahi', time: '9:25 PM', reportedAgo: 'Updated 5 min ago', travelers: 6, type: 'ontime', statusText: 'Running On Time', statusColor: C.green, statusBg: C.greenTint, note: 'On schedule. Next stop: Ishwardi Bypass' },
  { id: '4', trainName: 'Platform Change', trainNumber: '#131', route: 'Kanchanjungha Express - Chattogram Railway Station', time: '9:15 PM', reportedAgo: 'Official Announcement', travelers: 0, type: 'announcement', statusText: 'Platform 3', statusColor: C.blue, statusBg: C.blueTint, announcement: true },
  { id: '5', trainName: 'Temporary Service Halt', trainNumber: '#707', route: 'Tista Express - Joydebpur to Bangabandhu Bridge', time: '8:58 PM', reportedAgo: 'Official Announcement', travelers: 0, type: 'announcement', statusText: 'Service Halted', statusColor: C.orange, statusBg: C.orangeTint, announcement: true },
];

const STATS = [
  { val: '12', label: 'Delay Reports', sub: 'Active Now', bg: C.redTint },
  { val: '7', label: 'Crowding Alerts', sub: 'Active Now', bg: C.orangeTint },
  { val: '5', label: 'Trains On Time', sub: 'Running Smooth', bg: C.greenTint },
  { val: '3', label: 'Service Alerts', sub: 'Announcements', bg: C.blueTint },
];

const DEPARTURES = [
  { time: '10:00 PM', name: 'Turag Express #748', route: 'Dhaka → Tongi' },
  { time: '10:20 PM', name: 'Parabat Express #717', route: 'Dhaka → Sylhet' },
  { time: '10:40 PM', name: 'Subarna Express #721', route: 'Dhaka → Chattogram' },
  { time: '11:00 PM', name: 'Mahanagar Express #236', route: 'Dhaka → Chattogram' },
];

export default function LiveUpdatesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const filters: FilterTab[] = ['All', 'Active', 'Delays', 'Alerts', 'Past'];

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

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
            <Text style={s.lastUpdated}>Last updated: 9:41 PM</Text>
          </View>

          {UPDATES.map((update) => (
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
                      <Text style={s.updateReported}>{update.reportedAgo}</Text>
                    </View>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: update.statusBg }]}>
                    <Text style={[s.statusText, { color: update.statusColor }]}>{update.statusText}</Text>
                  </View>
                  {update.note && <Text style={s.updateNote}>{update.note}</Text>}
                  {update.travelers > 0 && (
                    <Text style={s.travelersText}>{update.travelers} travelers confirmed</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
          <TouchableOpacity style={s.alertsBtn}>
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
