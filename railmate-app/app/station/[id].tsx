// app/station-information.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

const FACILITIES = ['Waiting Room', 'Ticket Counter', 'Washroom', 'Food Court', 'Drinking Water', 'Parking'];
const TRAINS = [
  { num: 1, name: 'Subarna Express (701)', route: 'Comilla → Dhaka', time: '08:00 AM', freq: 'Daily' },
  { num: 2, name: 'Mohananagar Express (721)', route: 'Comilla → Dhaka', time: '10:30 AM', freq: 'Daily' },
  { num: 3, name: 'Turna Express (741)', route: 'Comilla → Dhaka', time: '04:20 PM', freq: 'Daily' },
];

export default function StationInformationScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={si.root}>
      <View style={si.header}>
        <TouchableOpacity style={si.backBtn} onPress={() => router.back()} />
        <View style={si.headerTitle}>
          <View style={si.headerIcon} />
          <Text style={si.title}>Station Information</Text>
        </View>
        <TouchableOpacity style={si.shareBtn} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={si.scroll}>
        {/* Station name */}
        <View style={si.nameRow}>
          <View>
            <Text style={si.stationName}>Comilla Railway Station</Text>
            <Text style={si.stationBn}>Comilla Railway Station</Text>
          </View>
          <View style={si.ratingBox}>
            <Text style={si.ratingStar}>⭐</Text>
            <Text style={si.ratingNum}>4.3</Text>
            <Text style={si.ratingCount}>(256 reviews)</Text>
          </View>
        </View>
        {/* Photo */}
        <View style={si.stationPhoto} />
        {/* Facilities */}
        <View style={si.card}>
          <View style={si.sectionHeader}>
            <Text style={si.sectionTitle}>Facilities</Text>
            <TouchableOpacity><Text style={si.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={si.facilitiesRow}>
              {FACILITIES.map(f => (
                <View key={f} style={si.facilityItem}>
                  <View style={si.facilityIcon} />
                  <Text style={si.facilityLabel}>{f}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        {/* Directions */}
        <View style={si.card}>
          <View style={si.dirRow}>
            <View style={{ flex: 1 }}>
              <View style={si.dirTitleRow}>
                <View style={si.dirIcon} />
                <Text style={si.dirTitle}>Directions</Text>
              </View>
              <Text style={si.dirAddress}>Railway Road, Comilla Sadar,{'\n'}Comilla 3500, Bangladesh</Text>
            </View>
            <View style={si.mapPreview} />
          </View>
          <TouchableOpacity style={si.openMapBtn}><Text style={si.openMapText}>Open in Maps ↗</Text></TouchableOpacity>
        </View>
        {/* Popular trains */}
        <View style={si.card}>
          <View style={si.sectionHeader}>
            <Text style={si.sectionTitle}>Popular Trains from Comilla</Text>
            <TouchableOpacity><Text style={si.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {TRAINS.map((train, i) => (
            <View key={train.num}>
              <View style={si.trainRow}>
                <View style={si.trainNumBadge}><Text style={si.trainNumText}>{train.num}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={si.trainName}>{train.name}</Text>
                  <Text style={si.trainRoute}>{train.route}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={si.trainTime}>{train.time}</Text>
                  <Text style={si.trainFreq}>{train.freq}</Text>
                </View>
                <View style={si.chevron} />
              </View>
              {i < TRAINS.length - 1 && <View style={si.divider} />}
            </View>
          ))}
        </View>
        {/* Contact */}
        <View style={si.card}>
          <Text style={si.sectionTitle}>Contact</Text>
          {[['Station Master Office', '081-67122'], ['comillarailway.gov.bd', '']].map(([l, v], i, arr) => (
            <View key={l}>
              <View style={si.contactRow}>
                <View style={si.contactIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={si.contactLabel}>{l}</Text>
                  {v ? <Text style={si.contactVal}>{v}</Text> : null}
                </View>
                <View style={si.extIcon} />
              </View>
              {i < arr.length - 1 && <View style={si.divider} />}
            </View>
          ))}
        </View>
        <View style={si.noteCard}>
          <Text style={si.noteText}>ℹ Information is community verified. Please help keep it up to date.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const si = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 32, height: 32, backgroundColor: C.greenTint, borderRadius: 8 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  shareBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stationName: { fontSize: 17, fontWeight: '700', color: C.white },
  stationBn: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  ratingBox: { alignItems: 'center' },
  ratingStar: { fontSize: 16 },
  ratingNum: { fontSize: 14, fontWeight: '700', color: C.white },
  ratingCount: { fontSize: T.xs, color: C.text2 },
  stationPhoto: { width: '100%', height: 180, backgroundColor: C.surface2, borderRadius: R.lg },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  facilitiesRow: { flexDirection: 'row', gap: S.sm },
  facilityItem: { alignItems: 'center', gap: S.xs, width: 70 },
  facilityIcon: { width: 48, height: 48, backgroundColor: C.surface2, borderRadius: R.md },
  facilityLabel: { fontSize: T.xs, color: C.text2, textAlign: 'center' },
  dirRow: { flexDirection: 'row', gap: S.md },
  dirTitleRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginBottom: S.sm },
  dirIcon: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  dirTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  dirAddress: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  mapPreview: { width: 80, height: 72, backgroundColor: C.blueTint, borderRadius: 10 },
  openMapBtn: { backgroundColor: C.surface2, borderRadius: 10, paddingVertical: S.md, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  openMapText: { fontSize: T.sm, fontWeight: '600', color: C.white },
  trainRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  trainNumBadge: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trainNumText: { fontSize: T.sm, fontWeight: '700', color: C.green },
  trainName: { fontSize: T.base, fontWeight: '600', color: C.white },
  trainRoute: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  trainTime: { fontSize: T.sm, fontWeight: '600', color: C.white },
  trainFreq: { fontSize: T.xs, color: C.text2, marginTop: 1 },
  chevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  divider: { height: 1, backgroundColor: C.border },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  contactIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  contactLabel: { fontSize: T.base, fontWeight: '600', color: C.white },
  contactVal: { fontSize: T.sm, fontWeight: '600', color: C.green, marginTop: 2 },
  extIcon: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  noteCard: { backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md },
  noteText: { fontSize: T.sm, color: C.text2, textAlign: 'center' },
});


// ─────────────────────────────────────────────────────────────────────────────
