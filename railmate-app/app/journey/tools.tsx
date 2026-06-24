// app/journey-tools.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

const TRIPS = [
  { id: '1', from: 'Dhaka', to: 'Chattogram', train: 'Subarna Express #721', date: '21 June 2026', time: '06:40 AM' },
  { id: '2', from: 'Dhaka', to: 'Sylhet', train: 'Parabat Express #717', date: '28 June 2026', time: '07:15 AM' },
];
const SAVED_ROUTES = [
  { from: 'D', to: 'C', name: 'Dhaka → Chattogram', sub: 'Today, 7:45 PM', trains: '8 Trains' },
  { from: 'D', to: 'S', name: 'Dhaka → Sylhet', sub: '2 days ago', trains: '7 Trains' },
  { from: 'D', to: 'R', name: 'Dhaka → Rajshahi', sub: '5 days ago', trains: '6 Trains' },
];
const REMINDERS = [
  { train: 'Subarna Express #721', route: 'Dhaka → Chattogram  •  21 June 2026', when: '2 hours before departure', on: true },
  { train: 'Parabat Express #717', route: 'Dhaka → Sylhet  •  28 June 2026', when: '1 day before departure', on: true },
];
const STATS = [
  { icon: C.greenTint, val: '12', label: 'Total Trips', sub: 'This Year' },
  { icon: C.blueTint, val: '3,245 km', label: 'Distance', sub: 'This Year' },
  { icon: C.purpleTint, val: '48h 32m', label: 'Travel Time', sub: 'This Year' },
  { icon: C.orangeTint, val: '87', label: 'Reports', sub: 'This Year' },
];

export default function JourneyToolsScreen() {
  const router = useRouter();
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={jt.scroll}>
        {/* My Trips */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}><Text style={jt.sectionTitle}>My Trips</Text><TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity></View>
          {TRIPS.map(trip => (
            <View key={trip.id} style={jt.tripCard}>
              <View style={jt.tripImg} />
              <View style={{ flex: 1, padding: S.md, gap: 4 }}>
                <Text style={jt.tripRoute}>{trip.from} → {trip.to}</Text>
                <Text style={jt.tripTrain}>{trip.train}</Text>
                <View style={jt.tripMeta}><Text style={jt.tripMetaText}>{trip.date}</Text><Text style={jt.tripMetaText}>{trip.time}</Text></View>
              </View>
              <View style={jt.upcomingBadge}><Text style={jt.upcomingText}>Upcoming</Text></View>
            </View>
          ))}
          <TouchableOpacity style={jt.addTripRow}><Text style={jt.addTripText}>+ Add New Trip</Text></TouchableOpacity>
        </View>
        {/* Saved Routes */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}><Text style={jt.sectionTitle}>Saved Routes</Text><TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: S.sm }}>
              {SAVED_ROUTES.map(r => (
                <View key={r.name} style={jt.routeCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[jt.initCircle, { backgroundColor: C.green }]}><Text style={jt.initText}>{r.from}</Text></View>
                    <Text style={{ color: C.text2 }}>→</Text>
                    <View style={[jt.initCircle, { backgroundColor: C.purple }]}><Text style={jt.initText}>{r.to}</Text></View>
                  </View>
                  <Text style={jt.routeName}>{r.name}</Text>
                  <Text style={jt.routeSub}>{r.sub}</Text>
                  <Text style={jt.routeTrains}>{r.trains}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        {/* Reminders */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}><Text style={jt.sectionTitle}>Reminders</Text><TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity></View>
          {REMINDERS.map((rem, i) => (
            <View key={rem.train}>
              <View style={jt.remRow}>
                <View style={jt.remIcon} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={jt.remTrain}>{rem.train}</Text>
                  <Text style={jt.remRoute}>{rem.route}</Text>
                  <Text style={jt.remWhen}>{rem.when}</Text>
                </View>
                <Switch value={rem.on} trackColor={{ false: C.surface2, true: C.green }} thumbColor={C.white} />
              </View>
              {i < REMINDERS.length - 1 && <View style={jt.divider} />}
            </View>
          ))}
        </View>
        {/* Stats */}
        <View style={jt.card}>
          <View style={jt.sectionHeader}><Text style={jt.sectionTitle}>Travel Statistics</Text><TouchableOpacity><Text style={jt.viewAll}>View All</Text></TouchableOpacity></View>
          <View style={jt.statsRow}>
            {STATS.map(stat => (
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
