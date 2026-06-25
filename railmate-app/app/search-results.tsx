// app/search-results.tsx — Search Results Screen

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';

type DelayStatus = 'delayed' | 'slight' | 'ontime';

interface TrainResult {
  id: string;
  number: string;
  name: string;
  nameBn: string;
  type: string;
  delayStatus: DelayStatus;
  delayText: string;
  depart: string;
  duration: string;
  arrive: string;
  departStation: string;
  arriveStation: string;
  classes: string[];
  selectedClass?: string;
  seatsAvailable: string;
}

const STATUS_MAP: Record<DelayStatus, { bg: string; color: string }> = {
  delayed: { bg: C.redTint, color: C.red },
  slight:  { bg: C.orangeTint, color: C.orange },
  ontime:  { bg: C.greenTint, color: C.green },
};

const TRAINS: TrainResult[] = [
  {
    id: '721',
    number: '#721',
    name: 'Subarna Express',
    nameBn: 'সুবর্ণ এক্সপ্রেস',
    type: 'Intercity',
    delayStatus: 'delayed',
    delayText: '15 min delay',
    depart: '06:40',
    duration: '4h 35m',
    arrive: '11:15',
    departStation: 'Kamlapur',
    arriveStation: 'Chattogram',
    classes: ['Shovon Chair', 'Snigdha', 'AC Seat', 'AC Berth'],
    seatsAvailable: '120+',
  },
  {
    id: '787',
    number: '#787',
    name: 'Sonar Bangla Express',
    nameBn: 'সোনার বাংলা এক্সপ্রেস',
    type: 'Intercity',
    delayStatus: 'slight',
    delayText: '5 min delay',
    depart: '07:00',
    duration: '4h 30m',
    arrive: '11:30',
    departStation: 'Kamlapur',
    arriveStation: 'Chattogram',
    classes: ['Shovon Chair', 'Snigdha', 'AC Seat', 'AC Berth'],
    seatsAvailable: '85+',
  },
  {
    id: '236',
    number: '#236',
    name: 'Mahanagar Express',
    nameBn: 'মহানগর এক্সপ্রেস',
    type: 'Intercity',
    delayStatus: 'ontime',
    delayText: 'On Time',
    depart: '08:10',
    duration: '4h 20m',
    arrive: '12:30',
    departStation: 'Kamlapur',
    arriveStation: 'Chattogram',
    classes: ['Shovon Chair', 'Snigdha', 'AC Seat', 'AC Berth'],
    selectedClass: 'AC Seat',
    seatsAvailable: '60+',
  },
];

function TrainCard({ train, onPress }: { train: TrainResult; onPress: () => void }) {
  const status = STATUS_MAP[train.delayStatus];
  return (
    <TouchableOpacity style={s.trainCard} onPress={onPress} activeOpacity={0.8}>
      {/* Top row */}
      <View style={s.trainTop}>
        <View style={s.trainLeft}>
          <View style={s.numBadge}><Text style={s.numBadgeText}>{train.number}</Text></View>
          <View>
            <Text style={s.trainName}>{train.name}</Text>
            <Text style={s.trainNameBn}>{train.nameBn}</Text>
          </View>
        </View>
        <View style={[s.delayBadge, { backgroundColor: status.bg }]}>
          <Text style={[s.delayText, { color: status.color }]}>{train.delayText}</Text>
        </View>
      </View>

      <Text style={s.trainRoute}>Dhaka (Kamlapur) → Chattogram</Text>
      <View style={s.divider} />

      {/* Timing */}
      <View style={s.timingRow}>
        <View>
          <Text style={s.timeMain}>{train.depart}</Text>
          <Text style={s.timeLabel}>Depart</Text>
          <Text style={s.timeStation}>{train.departStation}</Text>
        </View>
        <View style={s.durationCol}>
          <Text style={s.durationText}>{train.duration}</Text>
          <View style={s.durationLine} />
          <Text style={s.arrowText}>→</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.timeMain}>{train.arrive}</Text>
          <Text style={s.timeLabel}>Arrive</Text>
          <Text style={s.timeStation}>{train.arriveStation}</Text>
        </View>
      </View>

      <View style={s.divider} />

      {/* Bottom */}
      <View style={s.trainBottom}>
        <View style={s.classPills}>
          {train.classes.map((cl) => (
            <View
              key={cl}
              style={[s.classPill, cl === train.selectedClass && s.classPillActive]}
            >
              <Text style={[s.classPillText, cl === train.selectedClass && s.classPillTextActive]}>
                {cl}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text style={s.seatsLabel}>Seats Available</Text>
          <Text style={s.seatsValue}>{train.seatsAvailable}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from: string; to: string; date: string }>();

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} />
        <View>
          <Text style={s.title}>Search Results</Text>
          <Text style={s.subtitle}>{TRAINS.length} Trains Found</Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.headerBtn}><Text style={s.headerBtnText}>Filter</Text></TouchableOpacity>
          <TouchableOpacity style={s.headerBtn}><Text style={s.headerBtnText}>Sort</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Summary card */}
        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <View>
              <Text style={s.summaryLabel}>From</Text>
              <Text style={s.summaryValue}>{params.from ?? 'Dhaka'}</Text>
            </View>
            <View style={s.swapIcon} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.summaryLabel}>To</Text>
              <Text style={s.summaryValue}>{params.to ?? 'Chattogram'}</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.summaryMeta}>
            <Text style={s.summaryMetaText}>{params.date ?? 'Today, 18 June'}</Text>
            <Text style={s.summaryMetaText}>All Classes</Text>
          </View>
        </View>

        {/* Train list */}
        {TRAINS.map((train) => (
          <TrainCard
            key={train.id}
            train={train}
            onPress={() => router.push({ pathname: '/train-detail', params: { id: train.id } })}
          />
        ))}

        {/* Community verified */}
        <View style={s.communityBadge}>
          <View style={s.communityIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.communityTitle}>Community Verified</Text>
            <Text style={s.communitySub}>
              Delay and status updates are based on real-time reports from fellow travelers.
            </Text>
          </View>
          <View style={s.reportersStack} />
        </View>

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
  headerRight: { flexDirection: 'row', gap: S.sm },
  headerBtn: { backgroundColor: C.surface2, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: 8 },
  headerBtnText: { fontSize: T.sm, fontWeight: '600', color: C.white },
  summaryCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: T.xs, color: C.text2 },
  summaryValue: { fontSize: T.md, fontWeight: '600', color: C.white, marginTop: 2 },
  swapIcon: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: S.md },
  summaryMeta: { flexDirection: 'row', gap: S.xl },
  summaryMetaText: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  trainCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  trainTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trainLeft: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  numBadge: { backgroundColor: C.greenTint, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4 },
  numBadgeText: { fontSize: T.sm, fontWeight: '700', color: C.green },
  trainName: { fontSize: 14, fontWeight: '700', color: C.white },
  trainNameBn: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  delayBadge: { borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4 },
  delayText: { fontSize: T.xs, fontWeight: '700' },
  trainRoute: { fontSize: T.sm, color: C.text2 },
  timingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeMain: { fontSize: 20, fontWeight: '700', color: C.white },
  timeLabel: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  timeStation: { fontSize: T.xs, fontWeight: '600', color: C.green, marginTop: 1 },
  durationCol: { alignItems: 'center', gap: 4 },
  durationText: { fontSize: T.sm, color: C.text2 },
  durationLine: { width: 60, height: 2, backgroundColor: C.green, borderRadius: 1 },
  arrowText: { fontSize: T.sm, color: C.text2 },
  trainBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  classPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  classPill: { backgroundColor: C.surface2, borderRadius: 6, paddingHorizontal: S.sm, paddingVertical: 4 },
  classPillActive: { backgroundColor: C.greenTint, borderWidth: 1, borderColor: C.green },
  classPillText: { fontSize: 9, color: C.text2 },
  classPillTextActive: { color: C.green },
  seatsLabel: { fontSize: 9, color: C.text2, textAlign: 'right' },
  seatsValue: { fontSize: 14, fontWeight: '700', color: C.green, textAlign: 'right' },
  communityBadge: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  communityIcon: { width: 40, height: 40, backgroundColor: C.greenDark, borderRadius: 20 },
  communityTitle: { fontSize: T.sm, fontWeight: '600', color: C.green },
  communitySub: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  reportersStack: { width: 40, height: 28, backgroundColor: C.surface2, borderRadius: 14 },
});
