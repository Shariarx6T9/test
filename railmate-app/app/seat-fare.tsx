// app/seat-fare.tsx — Seat & Fare Screen

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';

type SeatStatus = 'available' | 'selected' | 'booked' | 'blocked';

interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
}

const CLASS_TABS = [
  { id: 'shovon', label: 'Shovon Chair', price: '৳590' },
  { id: 'snigdha', label: 'Snigdha', price: '৳690' },
  { id: 'ac_seat', label: 'AC Seat', price: '৳1,320' },
  { id: 'ac_berth', label: 'AC Berth', price: '৳1,870' },
];

const COACHES = ['Engine', 'SC1', 'SC2', 'SC3', 'SC4', 'SC5', 'SC6', 'S', 'LR'];

function buildSeatGrid(): { left: Seat[]; right: Seat[] } {
  const bookedIds = new Set(['2B', '4A', '6B', '8A']);
  const selectedId = '3C';
  const left: Seat[] = [];
  const right: Seat[] = [];
  for (let row = 1; row <= 8; row++) {
    ['A', 'B'].forEach((col) => {
      const id = `${row}${col}`;
      left.push({ id, label: id, status: bookedIds.has(id) ? 'booked' : 'available' });
    });
    ['C', 'D'].forEach((col) => {
      const id = `${row}${col}`;
      right.push({ id, label: id, status: id === selectedId ? 'selected' : bookedIds.has(id) ? 'booked' : 'available' });
    });
  }
  return { left, right };
}

const SEAT_STYLE: Record<SeatStatus, { bg: string; border: string; text: string }> = {
  available: { bg: C.greenTint, border: C.green, text: C.green },
  selected:  { bg: C.blue, border: C.blue, text: C.white },
  booked:    { bg: C.surface2, border: C.border, text: C.text3 },
  blocked:   { bg: C.surface2, border: C.border, text: C.text3 },
};

function SeatBox({ seat }: { seat: Seat }) {
  const style = SEAT_STYLE[seat.status];
  return (
    <View style={[seatS.seat, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[seatS.seatText, { color: style.text }]}>
        {seat.status === 'booked' || seat.status === 'blocked' ? '×' : seat.label}
      </Text>
    </View>
  );
}
const seatS = StyleSheet.create({
  seat: { width: 42, height: 38, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  seatText: { fontSize: T.xs, fontWeight: '700' },
});

export default function SeatFareScreen() {
  const router = useRouter();
  const [activeClass, setActiveClass] = useState('shovon');
  const [activeCoach, setActiveCoach] = useState('SC1');
  const { left, right } = buildSeatGrid();

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} />
        <View>
          <Text style={s.title}>Seat & Fare</Text>
          <Text style={s.subtitle}>Subarna Express #721</Text>
        </View>
        <View style={s.availBadge}><Text style={s.availText}>Available Seats 120+</Text></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Class tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.classTabs}>
          {CLASS_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[s.classTab, activeClass === tab.id && s.classTabActive]}
              onPress={() => setActiveClass(tab.id)}
            >
              <Text style={[s.classTabText, activeClass === tab.id && s.classTabTextActive]}>
                {tab.label}
              </Text>
              <Text style={[s.classTabPrice, activeClass === tab.id && s.classTabPriceActive]}>
                {tab.price}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Coach info */}
        <View style={s.coachInfo}>
          <View>
            <Text style={s.coachName}>Coach: Shovon Chair (SC)</Text>
            <Text style={s.coachMeta}>Total Seats: 78  •  <Text style={{ color: C.green }}>Available: 32</Text></Text>
          </View>
          <TouchableOpacity style={s.coachPosBtn}><Text style={s.coachPosBtnText}>Coach Position</Text></TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={s.legend}>
          {([['Available', C.green, C.greenTint],['Selected', C.blue, C.blue],['Booked', C.text3, C.surface2],['Blocked', C.text3, C.surface2]] as [string,string,string][]).map(([l, tc, bg]) => (
            <View key={l} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: bg, borderColor: tc }]} />
              <Text style={s.legendText}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Seat grid */}
        <View style={s.gridCard}>
          <View style={s.gridHeader}>
            <Text style={s.gridLabel}>← Window</Text>
            <Text style={s.gridLabel}>Aisle</Text>
            <Text style={s.gridLabel}>Window →</Text>
          </View>
          <View style={s.gridBody}>
            <View style={s.seatCol}>
              {Array.from({ length: 8 }, (_, i) => (
                <View key={i} style={s.seatRow}>
                  <SeatBox seat={left[i * 2]} />
                  <SeatBox seat={left[i * 2 + 1]} />
                </View>
              ))}
            </View>
            <View style={s.aisleNums}>
              {Array.from({ length: 8 }, (_, i) => (
                <Text key={i} style={s.aisleNum}>{i + 1}</Text>
              ))}
            </View>
            <View style={s.seatCol}>
              {Array.from({ length: 8 }, (_, i) => (
                <View key={i} style={s.seatRow}>
                  <SeatBox seat={right[i * 2]} />
                  <SeatBox seat={right[i * 2 + 1]} />
                </View>
              ))}
            </View>
          </View>

          {/* Coach selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.coachScroll}>
            {COACHES.map((coach) => (
              <TouchableOpacity
                key={coach}
                style={[s.coachChip, activeCoach === coach && s.coachChipActive]}
                onPress={() => setActiveCoach(coach)}
              >
                <Text style={[s.coachChipText, activeCoach === coach && s.coachChipTextActive]}>{coach}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected seat summary */}
        <View style={s.summaryCard}>
          <View style={s.summaryTop}>
            <View>
              <View style={s.selectedBadge}><Text style={s.selectedBadgeText}>Selected Seat</Text></View>
              <Text style={s.seatCode}>SC1 • 3C</Text>
              <Text style={s.windowLabel}>Window Seat</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: S.sm }}>
              <Text style={s.classInfo}>Class  Shovon Chair (SC)</Text>
              <Text style={s.classInfo}>Coach  SC1</Text>
              <Text style={s.fare}>৳590</Text>
              <Text style={s.farePassenger}>1 Passenger</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.fareSummary}>
            <Text style={s.fareSummaryTitle}>Fare Summary</Text>
            <View style={s.fareRow}><Text style={s.fareLabel}>Base Fare</Text><Text style={s.fareValue}>৳550</Text></View>
            <View style={s.fareRow}><Text style={s.fareLabel}>Service Charge</Text><Text style={s.fareValue}>৳40</Text></View>
            <View style={s.divider} />
            <View style={s.fareRow}>
              <Text style={s.fareTotalLabel}>Total Amount</Text>
              <Text style={s.fareTotalValue}>৳590</Text>
            </View>
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity style={s.continueBtn}>
          <Text style={s.continueBtnText}>Continue to Passenger Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 16, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  availBadge: { backgroundColor: C.greenTint, borderRadius: 10, paddingHorizontal: S.sm, paddingVertical: 6, borderWidth: 1, borderColor: C.green },
  availText: { fontSize: T.xs, fontWeight: '600', color: C.green },
  classTabs: { flexDirection: 'row' },
  classTab: { backgroundColor: C.surface, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.md, marginRight: S.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  classTabActive: { backgroundColor: C.green, borderColor: C.green },
  classTabText: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  classTabTextActive: { color: C.bg },
  classTabPrice: { fontSize: T.xs, color: C.text3, marginTop: 2 },
  classTabPriceActive: { color: C.bg },
  coachInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coachName: { fontSize: T.base, fontWeight: '600', color: C.white },
  coachMeta: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  coachPosBtn: { backgroundColor: C.greenTint, borderRadius: 8, paddingHorizontal: S.md, paddingVertical: S.sm },
  coachPosBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  legend: { flexDirection: 'row', gap: S.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  legendDot: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  legendText: { fontSize: T.xs, color: C.text2 },
  gridCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  gridLabel: { fontSize: T.xs, color: C.text2 },
  gridBody: { flexDirection: 'row', justifyContent: 'center', gap: S.md, alignItems: 'center' },
  seatCol: { gap: S.sm },
  seatRow: { flexDirection: 'row', gap: S.sm },
  aisleNums: { gap: S.sm, alignItems: 'center' },
  aisleNum: { fontSize: T.xs, color: C.text3, height: 38, textAlignVertical: 'center', lineHeight: 38 },
  coachScroll: { marginTop: S.sm },
  coachChip: { backgroundColor: C.surface2, borderRadius: 6, paddingHorizontal: S.sm, paddingVertical: 6, marginRight: S.sm },
  coachChipActive: { backgroundColor: C.green },
  coachChipText: { fontSize: T.xs, color: C.text2 },
  coachChipTextActive: { color: C.bg, fontWeight: '700' },
  summaryCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between' },
  selectedBadge: { backgroundColor: C.blue, borderRadius: 6, paddingHorizontal: S.sm, paddingVertical: 4, alignSelf: 'flex-start' },
  selectedBadgeText: { fontSize: T.xs, fontWeight: '700', color: C.white },
  seatCode: { fontSize: 18, fontWeight: '700', color: C.white, marginTop: S.sm },
  windowLabel: { fontSize: T.sm, fontWeight: '600', color: C.green, marginTop: 2 },
  classInfo: { fontSize: T.sm, color: C.text2 },
  fare: { fontSize: 20, fontWeight: '700', color: C.green },
  farePassenger: { fontSize: T.xs, color: C.text2 },
  divider: { height: 1, backgroundColor: C.border },
  fareSummary: { gap: S.sm },
  fareSummaryTitle: { fontSize: T.base, fontWeight: '700', color: C.white },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fareLabel: { fontSize: T.sm, color: C.text2 },
  fareValue: { fontSize: T.sm, color: C.text2 },
  fareTotalLabel: { fontSize: T.base, fontWeight: '700', color: C.white },
  fareTotalValue: { fontSize: T.md, fontWeight: '700', color: C.green },
  continueBtn: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
});
