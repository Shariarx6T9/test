// app/train-detail.tsx — Train Detail Screen

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';

const STOPS = [
  { time: '06:40', station: 'Kamlapur Railway Station', stationBn: 'Dhaka (Kamlapur)', tag: 'Start', active: true },
  { time: '07:15', station: 'Narayanganj', stationBn: 'Narayanganj', stop: '15 min stop', active: false },
  { time: '08:30', station: 'Brahmanbaria', stationBn: 'Brahmanbaria', stop: '5 min stop', active: false },
  { time: '09:45', station: 'Cumilla', stationBn: 'Cumilla', stop: '10 min stop', active: false },
  { time: '11:15', station: 'Chattogram Railway Station', stationBn: 'Chattogram', tag: 'End', active: true },
];

export default function TrainDetailScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image placeholder */}
        <View style={s.heroImg} />

        {/* Header overlay */}
        <View style={s.headerOverlay}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} />
          <View style={s.headerActions}>
            <TouchableOpacity style={s.iconBtn} />
            <TouchableOpacity style={s.iconBtn} />
          </View>
        </View>

        <View style={s.body}>
          {/* Train info */}
          <View style={s.card}>
            <View style={s.trainTop}>
              <View style={s.trainLeft}>
                <View style={s.numBadge}><Text style={s.numBadgeText}>#721</Text></View>
                <View>
                  <Text style={s.trainName}>Subarna Express</Text>
                  <Text style={s.trainNameBn}>সুবর্ণ এক্সপ্রেস</Text>
                </View>
              </View>
              <View style={s.delayBadge}>
                <Text style={s.delayBadgeTitle}>15 min delay</Text>
                <Text style={s.delayBadgeSub}>Updated 10 min ago</Text>
              </View>
            </View>
            <Text style={s.routeText}>Dhaka (Kamlapur) → Chattogram</Text>
            <View style={s.divider} />
            <View style={s.timingRow}>
              <View>
                <Text style={s.timeMain}>06:40</Text>
                <Text style={s.timeLabel}>Depart</Text>
                <Text style={s.timeStation}>Kamlapur</Text>
                <Text style={s.timeStationBn}>Dhaka (Kamlapur)</Text>
              </View>
              <View style={s.durationCol}>
                <Text style={s.durationText}>4h 35m</Text>
                <View style={s.durationLine} />
                <Text style={s.distanceText}>Distance: 267 km</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.timeMain}>11:15</Text>
                <Text style={s.timeLabel}>Arrive</Text>
                <Text style={s.timeStation}>Chattogram</Text>
                <Text style={s.timeStationBn}>Chattogram</Text>
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.metaRow}>
              {[['Runs','Daily'],['Classes','4'],['Avg Speed','60 km/h'],['Off Day','None']].map(([l,v]) => (
                <View key={l} style={s.metaItem}>
                  <Text style={s.metaLabel}>{l}</Text>
                  <Text style={s.metaValue}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Journey Timeline */}
          <View style={s.card}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Journey Timeline</Text>
              <TouchableOpacity><Text style={s.linkText}>View full route</Text></TouchableOpacity>
            </View>
            {STOPS.map((stop, i) => (
              <View key={i}>
                <View style={s.stopRow}>
                  <View style={[s.stopDot, { backgroundColor: stop.active ? C.green : C.text3 }]} />
                  <View style={{ flex: 1 }}>
                    <View style={s.stopTop}>
                      <Text style={s.stopTime}>{stop.time}</Text>
                      <Text style={s.stopStation}>{stop.station}</Text>
                      {stop.tag && <View style={s.stopTag}><Text style={s.stopTagText}>{stop.tag}</Text></View>}
                    </View>
                    <View style={s.stopBottom}>
                      <Text style={s.stopBn}>{stop.stationBn}</Text>
                      {stop.stop && <Text style={s.stopDuration}>{stop.stop}</Text>}
                    </View>
                  </View>
                  <View style={s.mapIcon} />
                </View>
                {i < STOPS.length - 1 && <View style={s.stopLine} />}
              </View>
            ))}
          </View>

          {/* Community Report Summary */}
          <View style={s.card}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Community Report Summary</Text>
              <TouchableOpacity><Text style={s.linkText}>See all</Text></TouchableOpacity>
            </View>
            <View style={s.communityRow}>
              <View style={s.communityConfirmed}>
                <Text style={s.confirmedNum}>8</Text>
                <Text style={s.confirmedLabel}>Travelers confirmed</Text>
                <Text style={s.confirmedSub}>in last 30 minutes</Text>
              </View>
              {[['Crowding','Medium',C.orange],['Cleanliness','Good',C.green],['Punctuality','Good',C.green]].map(([label,val,color]) => (
                <View key={label} style={s.communityMetric}>
                  <Text style={s.metricLabel}>{label}</Text>
                  <Text style={[s.metricVal, { color: color as string }]}>{val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={s.actionBar}>
        <TouchableOpacity style={s.actionSecondary}><Text style={s.actionSecondaryText}>Set Alert</Text></TouchableOpacity>
        <TouchableOpacity style={s.actionPrimary} onPress={() => router.push({ pathname: '/seat-fare', params: { trainId: '721' } })}>
          <Text style={s.actionPrimaryText}>Buy Ticket via Rail Sheba</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionSecondary}><Text style={s.actionSecondaryText}>Share</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  heroImg: { width: '100%', height: 220, backgroundColor: C.surface2 },
  headerOverlay: { position: 'absolute', top: 48, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: S.xl },
  backBtn: { width: 36, height: 36, backgroundColor: C.surface, borderRadius: 18, opacity: 0.9 },
  headerActions: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface, borderRadius: 18, opacity: 0.9 },
  body: { padding: S.xl, gap: S.lg },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  trainTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  trainLeft: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  numBadge: { backgroundColor: C.greenTint, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4 },
  numBadgeText: { fontSize: T.sm, fontWeight: '700', color: C.green },
  trainName: { fontSize: 16, fontWeight: '700', color: C.white },
  trainNameBn: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  delayBadge: { backgroundColor: C.redTint, borderRadius: 10, padding: S.sm, alignItems: 'flex-end' },
  delayBadgeTitle: { fontSize: T.sm, fontWeight: '700', color: C.red },
  delayBadgeSub: { fontSize: 9, color: C.text2, marginTop: 2 },
  routeText: { fontSize: T.sm, color: C.text2 },
  divider: { height: 1, backgroundColor: C.border },
  timingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeMain: { fontSize: 24, fontWeight: '800', color: C.white },
  timeLabel: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  timeStation: { fontSize: T.sm, fontWeight: '600', color: C.green, marginTop: 2 },
  timeStationBn: { fontSize: T.xs, color: C.text3 },
  durationCol: { alignItems: 'center', gap: 4 },
  durationText: { fontSize: T.sm, color: C.text2 },
  durationLine: { width: 80, height: 2, backgroundColor: C.green, borderRadius: 1 },
  distanceText: { fontSize: T.xs, color: C.text3 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaItem: { alignItems: 'center', gap: 4 },
  metaLabel: { fontSize: 9, color: C.text2 },
  metaValue: { fontSize: T.sm, fontWeight: '600', color: C.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  linkText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  stopDot: { width: 12, height: 12, borderRadius: 6 },
  stopTop: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  stopTime: { fontSize: T.base, fontWeight: '700', color: C.white },
  stopStation: { fontSize: T.base, fontWeight: '600', color: C.white },
  stopTag: { backgroundColor: C.greenTint, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  stopTagText: { fontSize: 9, fontWeight: '700', color: C.green },
  stopBottom: { flexDirection: 'row', gap: S.md, marginTop: 2 },
  stopBn: { fontSize: T.sm, color: C.text2 },
  stopDuration: { fontSize: T.sm, color: C.text3 },
  stopLine: { width: 2, height: 20, backgroundColor: C.border, marginLeft: 5, marginVertical: 2 },
  mapIcon: { width: 16, height: 16, backgroundColor: C.blueTint, borderRadius: 8 },
  communityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  communityConfirmed: { alignItems: 'center' },
  confirmedNum: { fontSize: 28, fontWeight: '800', color: C.white },
  confirmedLabel: { fontSize: 9, color: C.text2, textAlign: 'center' },
  confirmedSub: { fontSize: 8, color: C.text3, textAlign: 'center' },
  communityMetric: { alignItems: 'center', gap: 4 },
  metricLabel: { fontSize: T.xs, color: C.text2 },
  metricVal: { fontSize: T.sm, fontWeight: '700' },
  actionBar: { flexDirection: 'row', gap: S.sm, padding: S.lg, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border },
  actionSecondary: { flex: 0.4, backgroundColor: C.surface, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  actionSecondaryText: { fontSize: T.sm, fontWeight: '600', color: C.white },
  actionPrimary: { flex: 1, backgroundColor: C.green, borderRadius: R.md, paddingVertical: 14, alignItems: 'center' },
  actionPrimaryText: { fontSize: T.sm, fontWeight: '700', color: C.bg },
});
