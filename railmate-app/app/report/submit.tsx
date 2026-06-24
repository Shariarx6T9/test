// app/submit-report.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

const STEPS = ['Train', 'Report Type', 'Details', 'Review', 'Submit'];
const POPULAR_TRAINS = [
  { num: '701', name: 'Subarna Express', active: true },
  { num: '721', name: 'Mohanagar Express', active: false },
  { num: '741', name: 'Turna Express', active: false },
  { num: '...', name: 'More', active: false },
];

export default function SubmitReportScreen() {
  const router = useRouter();
  const [step] = useState(0);
  const [selectedTrain, setSelectedTrain] = useState('701');

  return (
    <SafeAreaView style={sr.root}>
      <View style={sr.header}>
        <TouchableOpacity style={sr.backBtn} onPress={() => router.back()} />
        <View>
          <Text style={sr.title}>Submit Report</Text>
          <Text style={sr.subtitle}>Help fellow travelers by sharing real-time updates</Text>
        </View>
      </View>
      {/* Stepper */}
      <View style={sr.stepper}>
        {STEPS.map((s, i) => (
          <View key={s} style={sr.stepItem}>
            {i > 0 && <View style={[sr.stepLine, i <= step && { backgroundColor: C.green }]} />}
            <View style={[sr.stepCircle, i === step ? sr.stepCircleActive : i < step ? sr.stepCircleDone : {}]}>
              <Text style={[sr.stepNum, i <= step && { color: i === step ? C.bg : C.green }]}>{i + 1}</Text>
            </View>
            <Text style={[sr.stepLabel, i === step && { color: C.green }]}>{s}</Text>
          </View>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sr.scroll}>
        {/* Tip */}
        <View style={sr.tipCard}>
          <View style={sr.tipIcon} />
          <View style={{ flex: 1 }}>
            <Text style={sr.tipTitle}>Your report makes a difference!</Text>
            <Text style={sr.tipSub}>Verified reports help thousands of travelers every day.</Text>
          </View>
          <TouchableOpacity><Text style={{ color: C.text3, fontSize: 18 }}>×</Text></TouchableOpacity>
        </View>
        {/* Step 1 */}
        <View style={sr.card}>
          <View style={sr.stepHeader}>
            <View style={sr.stepIcon} />
            <View>
              <Text style={sr.stepTitle}>Step 1: Select Train</Text>
              <Text style={sr.stepDesc}>Choose the train you want to report on</Text>
            </View>
          </View>
          <View style={sr.searchField}>
            <View style={sr.searchDot} />
            <Text style={sr.searchPlaceholder}>Search by train name or number</Text>
          </View>
          <Text style={sr.popularLabel}>Popular Trains</Text>
          <View style={sr.popularRow}>
            {POPULAR_TRAINS.map(train => (
              <TouchableOpacity
                key={train.num}
                style={[sr.trainChip, selectedTrain === train.num && sr.trainChipActive]}
                onPress={() => setSelectedTrain(train.num)}
              >
                <View style={sr.trainChipIcon} />
                <Text style={[sr.trainChipNum, selectedTrain === train.num && { color: C.green }]}>{train.num}</Text>
                <Text style={sr.trainChipName}>{train.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={sr.orText}>OR</Text>
          <View style={sr.numberField}>
            <Text style={sr.numHash}>#</Text>
            <Text style={sr.numPlaceholder}>e.g., 701</Text>
          </View>
        </View>
        {/* Selected */}
        <View style={sr.selectedCard}>
          <View style={sr.selectedIcon} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={sr.selectedName}>Subarna Express (701)</Text>
            <Text style={sr.selectedRoute}>Dhaka → Chattogram</Text>
            <View style={sr.selectedMeta}>
              <Text style={sr.selectedMetaText}>Departs 08:00 AM</Text>
              <Text style={sr.selectedMetaText}>Duration 5h 45m</Text>
              <Text style={sr.selectedMetaText}>Runs Daily</Text>
            </View>
          </View>
          <Text style={sr.typeText}>Intercity</Text>
        </View>
        {/* Tip box */}
        <View style={sr.reportingTip}>
          <View style={sr.tipIconSmall} />
          <View style={{ flex: 1 }}>
            <Text style={sr.reportingTipTitle}>Reporting Tips</Text>
            <Text style={sr.reportingTipSub}>Be accurate and specific. Include delay time, station name and other details in next steps.</Text>
          </View>
        </View>
        <TouchableOpacity style={sr.continueBtn}>
          <Text style={sr.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const sr = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: S.xl, paddingVertical: S.md, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  stepItem: { alignItems: 'center', gap: 4 },
  stepLine: { width: 24, height: 2, backgroundColor: C.border, position: 'absolute', right: '100%', top: 12 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: C.green, borderColor: C.green },
  stepCircleDone: { borderColor: C.green },
  stepNum: { fontSize: T.base, fontWeight: '700', color: C.text2 },
  stepLabel: { fontSize: T.xs, color: C.text2, textAlign: 'center' },
  tipCard: { backgroundColor: C.greenTint, borderRadius: R.md, borderWidth: 1, borderColor: C.greenDark, padding: S.md, flexDirection: 'row', alignItems: 'center', gap: S.sm },
  tipIcon: { width: 32, height: 32, backgroundColor: C.greenDark, borderRadius: 16 },
  tipTitle: { fontSize: T.sm, fontWeight: '700', color: C.green },
  tipSub: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.xl, gap: S.md },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  stepIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  stepTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  stepDesc: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  searchField: { flexDirection: 'row', alignItems: 'center', gap: S.sm, backgroundColor: C.surface2, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.border },
  searchDot: { width: 20, height: 20, backgroundColor: C.border, borderRadius: 10 },
  searchPlaceholder: { fontSize: T.base, color: C.text3 },
  popularLabel: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  popularRow: { flexDirection: 'row', gap: S.sm },
  trainChip: { flex: 1, backgroundColor: C.surface2, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.sm, alignItems: 'center', gap: 6 },
  trainChipActive: { backgroundColor: C.greenTint, borderColor: C.green },
  trainChipIcon: { width: 28, height: 28, backgroundColor: C.bg, borderRadius: 14 },
  trainChipNum: { fontSize: T.sm, fontWeight: '700', color: C.white },
  trainChipName: { fontSize: 8, color: C.text2, textAlign: 'center' },
  orText: { textAlign: 'center', fontSize: T.sm, color: C.text3 },
  numberField: { flexDirection: 'row', alignItems: 'center', gap: S.sm, backgroundColor: C.surface2, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.border },
  numHash: { fontSize: 14, fontWeight: '700', color: C.text2 },
  numPlaceholder: { fontSize: T.base, color: C.text3 },
  selectedCard: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.green, padding: S.lg },
  selectedIcon: { width: 48, height: 48, backgroundColor: C.greenTint, borderRadius: 24 },
  selectedName: { fontSize: 14, fontWeight: '700', color: C.white },
  selectedRoute: { fontSize: T.sm, color: C.text2 },
  selectedMeta: { flexDirection: 'row', gap: S.md },
  selectedMetaText: { fontSize: T.xs, color: C.text3 },
  typeText: { fontSize: T.sm, fontWeight: '600', color: C.blue },
  reportingTip: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md },
  tipIconSmall: { width: 28, height: 28, backgroundColor: C.blueTint, borderRadius: 14 },
  reportingTipTitle: { fontSize: T.sm, fontWeight: '700', color: C.blue },
  reportingTipSub: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  continueBtn: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
});
