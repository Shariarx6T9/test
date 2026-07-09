// app/seat-fare.tsx — Seat & Fare Screen

import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { useTrainFares } from '../hooks/useTrainDetail';
import { useTranslation } from '../i18n';
import { TrainClass } from '../types/database.types';

type SeatStatus = 'available' | 'selected' | 'booked' | 'blocked';

interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
}

const CLASS_LABELS: Record<TrainClass, string> = {
  SHOVON: 'Shovon',
  SHOVON_CHAIR: 'Shovon Chair',
  SNIGDHA: 'Snigdha',
  AC_BERTH: 'AC Berth',
  AC_SEAT: 'AC Seat',
  FIRST_BERTH: 'First Berth',
  FIRST_SEAT: 'First Seat',
  AC_S_CHAIR: 'AC S Chair',
};

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
  available: { bg: Colors.dark['primary-subtle'], border: Colors.dark.primary, text: Colors.dark.primary },
  selected:  { bg: Colors.dark.info, border: Colors.dark.info, text: Colors.dark['text-primary'] },
  booked:    { bg: Colors.dark['bg-overlay'], border: Colors.dark.border, text: Colors.dark['text-tertiary'] },
  blocked:   { bg: Colors.dark['bg-overlay'], border: Colors.dark.border, text: Colors.dark['text-tertiary'] },
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
  seatText: { ...Typography.caption, fontWeight: '700' },
});

export default function SeatFareScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ trainId: string; trainNumber: string; trainName: string; from_station_id: string; to_station_id: string }>();

  const { data: fares, isLoading } = useTrainFares({
    trainId: params.trainId ?? '',
    fromStationId: params.from_station_id ?? '',
    toStationId: params.to_station_id ?? '',
  });

  const classTabs = fares
    ? [...new Set(fares.map(f => f.class))].map(cls => ({
        id: cls,
        label: CLASS_LABELS[cls] ?? cls,
        price: `৳${(fares.find(f => f.class === cls)?.price_bdt ?? 0).toLocaleString()}`,
      }))
    : [];

  const [activeClass, setActiveClass] = useState<TrainClass | string>('');
  const [activeCoach, setActiveCoach] = useState('SC1');
  const effectiveActiveClass = activeClass || (classTabs[0]?.id ?? '');
  const { left, right } = buildSeatGrid();

  const selectedFare = fares?.find(f => f.class === effectiveActiveClass);

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
        <View style={s.headerTitleWrap}>
          <Text style={s.title} numberOfLines={1}>Seat & Fare</Text>
          <Text style={s.subtitle} numberOfLines={1} ellipsizeMode="tail">{params.trainName ?? 'Train'} #{params.trainNumber ?? ''}</Text>
        </View>
        <View style={s.availBadge}><Text style={s.availText} numberOfLines={1}>120+ seats</Text></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Class tabs — dynamic from fares data */}
        {isLoading ? (
          <View style={{ height: 60, backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], opacity: 0.6 }} />
        ) : classTabs.length === 0 && !isLoading ? (
          <View style={{ padding: Spacing['space-4'], alignItems: 'center' }}>
            <Text style={{ color: Colors.dark['text-secondary'], ...Typography['body-sm'] }}>{t('train.no_fares')}</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.classTabs}>
            {classTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[s.classTab, effectiveActiveClass === tab.id && s.classTabActive]}
                onPress={() => setActiveClass(tab.id)}
              >
                <Text style={[s.classTabText, effectiveActiveClass === tab.id && s.classTabTextActive]}>
                  {tab.label}
                </Text>
                <Text style={[s.classTabPrice, effectiveActiveClass === tab.id && s.classTabPriceActive]}>
                  {tab.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Coach info */}
        <View style={s.coachInfo}>
          <View style={s.coachInfoText}>
            <Text style={s.coachName} numberOfLines={1}>Coach: {CLASS_LABELS[effectiveActiveClass as TrainClass] ?? effectiveActiveClass} (SC)</Text>
            <Text style={s.coachMeta} numberOfLines={1}>Total Seats: 78  •  <Text style={{ color: Colors.dark.primary }}>Available: 32</Text></Text>
          </View>
          <TouchableOpacity style={s.coachPosBtn}><Text style={s.coachPosBtnText}>Coach Position</Text></TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={s.legend}>
          {([['Available', Colors.dark.primary, Colors.dark['primary-subtle']],['Selected', Colors.dark.info, Colors.dark.info],['Booked', Colors.dark['text-tertiary'], Colors.dark['bg-overlay']],['Blocked', Colors.dark['text-tertiary'], Colors.dark['bg-overlay']]] as [string,string,string][]).map(([l, tc, bg]) => (
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

        {/* Disclaimer note below seat grid */}
        <View style={{ paddingHorizontal: Spacing['space-2'] }}>
          <Text style={{ ...Typography.caption, color: Colors.dark['text-secondary'], textAlign: 'center', lineHeight: 16 }}>
            Seat availability shown is for illustration only. Actual availability may differ. Book via Rail Sheba for real-time seat info.
          </Text>
        </View>

        {/* Selected seat summary */}
        <View style={s.summaryCard}>
          <View style={s.summaryTop}>
            <View>
              <View style={s.selectedBadge}><Text style={s.selectedBadgeText}>Selected Seat</Text></View>
              <Text style={s.seatCode}>SC1 • 3C</Text>
              <Text style={s.windowLabel}>Window Seat</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: Spacing['space-2'] }}>
              <Text style={s.classInfo}>Class  {CLASS_LABELS[effectiveActiveClass as TrainClass] ?? effectiveActiveClass}</Text>
              <Text style={s.classInfo}>Coach  SC1</Text>
              <Text style={s.fare}>৳{selectedFare?.price_bdt ?? '—'}</Text>
              <Text style={s.farePassenger}>1 Passenger</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.fareSummary}>
            <Text style={s.fareSummaryTitle}>Fare Summary</Text>
            <View style={s.fareRow}>
              <Text style={s.fareLabel}>Total Fare</Text>
              <Text style={s.fareValue}>৳{selectedFare?.price_bdt ?? '—'}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.fareRow}>
              <Text style={s.fareTotalLabel}>Total Amount</Text>
              <Text style={s.fareTotalValue}>৳{selectedFare?.price_bdt ?? '—'}</Text>
            </View>
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity style={s.continueBtn} onPress={() => Linking.openURL('https://railwayseba.com')}>
          <Text style={s.continueBtnText}>Continue to Passenger Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'], gap: Spacing['space-2'] },
  headerTitleWrap: { flex: 1 },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  availBadge: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: 10, paddingHorizontal: Spacing['space-2'], paddingVertical: 6, borderWidth: 1, borderColor: Colors.dark.primary },
  availText: { ...Typography.caption, fontWeight: '600', color: Colors.dark.primary },
  classTabs: { flexDirection: 'row' },
  classTab: { backgroundColor: Colors.dark['bg-card'], borderRadius: 10, paddingHorizontal: Spacing['space-3'], paddingVertical: Spacing['space-3'], marginRight: Spacing['space-2'], borderWidth: 1, borderColor: Colors.dark.border, alignItems: 'center' },
  classTabActive: { backgroundColor: Colors.dark.primary, borderColor: Colors.dark.primary },
  classTabText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  classTabTextActive: { color: Colors.dark['bg-base'] },
  classTabPrice: { ...Typography.caption, color: Colors.dark['text-tertiary'], marginTop: 2 },
  classTabPriceActive: { color: Colors.dark['bg-base'] },
  coachInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing['space-2'] },
  coachInfoText: { flex: 1 },
  coachName: { ...Typography.body, fontWeight: '600', color: Colors.dark['text-primary'] },
  coachMeta: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  coachPosBtn: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: 8, paddingHorizontal: Spacing['space-3'], paddingVertical: Spacing['space-2'] },
  coachPosBtnText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  legend: { flexDirection: 'row', gap: Spacing['space-5'] },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-1'] },
  legendDot: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  legendText: { ...Typography.caption, color: Colors.dark['text-secondary'] },
  gridCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-3'] },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  gridLabel: { ...Typography.caption, color: Colors.dark['text-secondary'] },
  gridBody: { flexDirection: 'row', justifyContent: 'center', gap: Spacing['space-3'], alignItems: 'center' },
  seatCol: { gap: Spacing['space-2'] },
  seatRow: { flexDirection: 'row', gap: Spacing['space-2'] },
  aisleNums: { gap: Spacing['space-2'], alignItems: 'center' },
  aisleNum: { ...Typography.caption, color: Colors.dark['text-tertiary'], height: 38, textAlignVertical: 'center', lineHeight: 38 },
  coachScroll: { marginTop: Spacing['space-2'] },
  coachChip: { backgroundColor: Colors.dark['bg-overlay'], borderRadius: 6, paddingHorizontal: Spacing['space-2'], paddingVertical: 6, marginRight: Spacing['space-2'] },
  coachChipActive: { backgroundColor: Colors.dark.primary },
  coachChipText: { ...Typography.caption, color: Colors.dark['text-secondary'] },
  coachChipTextActive: { color: Colors.dark['bg-base'], fontWeight: '700' },
  summaryCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-3'], overflow: 'hidden' },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between' },
  selectedBadge: { backgroundColor: Colors.dark.info, borderRadius: 6, paddingHorizontal: Spacing['space-2'], paddingVertical: 4, alignSelf: 'flex-start' },
  selectedBadgeText: { ...Typography.caption, fontWeight: '700', color: Colors.dark['text-primary'] },
  seatCode: { fontSize: 18, fontWeight: '700', color: Colors.dark['text-primary'], marginTop: Spacing['space-2'] },
  windowLabel: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary, marginTop: 2 },
  classInfo: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], flexShrink: 1 },
  fare: { fontSize: 20, fontWeight: '700', color: Colors.dark.primary, flexShrink: 1 },
  farePassenger: { ...Typography.caption, color: Colors.dark['text-secondary'] },
  divider: { height: 1, backgroundColor: Colors.dark.border },
  fareSummary: { gap: Spacing['space-2'] },
  fareSummaryTitle: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fareLabel: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  fareValue: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  fareTotalLabel: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  fareTotalValue: { ...Typography.h4, fontWeight: '700', color: Colors.dark.primary },
  continueBtn: { backgroundColor: Colors.dark.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { ...Typography.h4, fontWeight: '700', color: Colors.dark['bg-base'] },
});
