// app/delay-analytics.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

type Period = '7 Days' | '30 Days' | '90 Days' | '1 Year';

const WEEKLY_DATA = [
  { day: 'Mon', val: 12, label: 'Good', color: C.green },
  { day: 'Tue', val: 18, label: 'Average', color: C.orange },
  { day: 'Wed', val: 25, label: 'Poor', color: C.red },
  { day: 'Thu', val: 15, label: 'Good', color: C.green },
  { day: 'Fri', val: 12, label: 'Good', color: C.green },
  { day: 'Sat', val: 8, label: 'Excellent', color: C.green },
  { day: 'Sun', val: 15, label: 'Good', color: C.green },
];

const DISTRIBUTION = [
  { label: 'On Time (≤5 min)', pct: '42%', color: C.green },
  { label: '5 - 15 min', pct: '28%', color: C.gold },
  { label: '15 - 30 min', pct: '18%', color: C.orange },
  { label: '30 - 60 min', pct: '8%', color: C.red },
  { label: '> 60 min', pct: '4%', color: C.purple },
];

export default function DelayAnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('7 Days');
  const periods: Period[] = ['7 Days', '30 Days', '90 Days', '1 Year'];
  const maxVal = Math.max(...WEEKLY_DATA.map(d => d.val));

  return (
    <SafeAreaView style={da.root}>
      <View style={da.header}>
        <TouchableOpacity style={da.backBtn} onPress={() => router.back()} />
        <View style={da.headerCenter}>
          <View style={da.headerIcon} />
          <View>
            <Text style={da.title}>Delay Analytics</Text>
            <Text style={da.subtitle}>Subarna Express (701)</Text>
            <Text style={da.route}>Dhaka → Chattogram</Text>
          </View>
        </View>
        <View style={da.headerRight}>
          <TouchableOpacity style={da.iconBtn} />
          <TouchableOpacity style={da.iconBtn} />
        </View>
      </View>

      {/* Period tabs */}
      <View style={da.periodRow}>
        {periods.map(p => (
          <TouchableOpacity key={p} style={[da.periodTab, period === p && da.periodTabActive]} onPress={() => setPeriod(p)}>
            <Text style={[da.periodText, period === p && da.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={da.scroll}>
        {/* Stats row */}
        <View style={da.statsRow}>
          {[
            { label: 'Average Delay', val: '15 min', sub: 'This Week', color: C.green, bg: C.greenTint },
            { label: 'On-Time Performance', val: '62%', sub: '↑ 8% vs last 7 days', color: C.blue, bg: C.blueTint },
            { label: 'Reliability Score', val: '78/100', sub: 'Good', color: C.purple, bg: C.purpleTint },
          ].map(stat => (
            <View key={stat.label} style={[da.statCard, { backgroundColor: stat.bg, borderColor: stat.color }]}>
              <Text style={da.statLabel}>{stat.label}</Text>
              <Text style={[da.statVal, { color: stat.color }]}>{stat.val}</Text>
              <Text style={da.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={da.card}>
          <View style={da.chartHeader}>
            <Text style={da.sectionTitle}>Average Delay Trend</Text>
            <TouchableOpacity style={da.minutesBtn}><Text style={da.minutesBtnText}>Minutes ▾</Text></TouchableOpacity>
          </View>
          {/* Simple bar chart */}
          <View style={da.chart}>
            {WEEKLY_DATA.map(d => (
              <View key={d.day} style={da.barCol}>
                <Text style={da.barVal}>{d.val}</Text>
                <View style={[da.bar, { height: (d.val / maxVal) * 100, backgroundColor: C.purple }]} />
                <Text style={da.barDay}>{d.day}</Text>
              </View>
            ))}
          </View>
          <View style={da.legend}>
            <View style={da.legendItem}><View style={[da.legendLine, { backgroundColor: C.purple }]} /><Text style={da.legendText}>Average Delay (min)</Text></View>
            <View style={da.legendItem}><View style={[da.legendDash]} /><Text style={da.legendText}>Target (15 min)</Text></View>
          </View>
        </View>

        {/* Distribution + Insights */}
        <View style={da.rowCards}>
          <View style={[da.card, { flex: 1 }]}>
            <Text style={da.sectionTitle}>Delay Distribution</Text>
            <View style={da.donutPlaceholder}>
              <Text style={da.donutTotal}>128</Text>
              <Text style={da.donutSub}>Trains</Text>
            </View>
            {DISTRIBUTION.map(d => (
              <View key={d.label} style={da.distRow}>
                <View style={[da.distDot, { backgroundColor: d.color }]} />
                <Text style={da.distLabel}>{d.label}</Text>
                <Text style={[da.distPct, { color: d.color }]}>{d.pct}</Text>
              </View>
            ))}
          </View>
          <View style={[da.card, { flex: 1 }]}>
            <Text style={da.sectionTitle}>Delay Insights</Text>
            {[
              { label: 'Most delays occur', val: 'Wed & Tue', sub: 'Peak between 6PM - 9PM', color: C.orange },
              { label: 'Most delays reported', val: 'Cumilla, Feni', sub: 'Followed by Narayanganj', color: C.red },
              { label: 'Longest average delay', val: 'Wednesday', sub: '25 min average', color: C.blue },
            ].map(ins => (
              <View key={ins.label} style={da.insightItem}>
                <Text style={da.insightLabel}>{ins.label}</Text>
                <Text style={[da.insightVal, { color: ins.color }]}>{ins.val}</Text>
                <Text style={da.insightSub}>{ins.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly overview */}
        <View style={da.card}>
          <View style={da.sectionHeader}>
            <Text style={da.sectionTitle}>Weekly Performance Overview</Text>
            <TouchableOpacity><Text style={da.viewAll}>View Detailed Report  ›</Text></TouchableOpacity>
          </View>
          <View style={da.weekRow}>
            {WEEKLY_DATA.map(d => (
              <View key={d.day} style={da.weekItem}>
                <Text style={da.weekDay}>{d.day}</Text>
                <Text style={da.weekVal}>{d.val} min</Text>
                <View style={[da.weekBar, { backgroundColor: d.color }]} />
                <View style={[da.weekIcon, { backgroundColor: d.color + '30' }]} />
                <Text style={[da.weekLabel, { color: d.color }]}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Comparison banner */}
        <View style={[da.banner, { backgroundColor: C.purpleTint, borderColor: C.purple }]}>
          <View style={da.bannerIcon} />
          <View style={{ flex: 1 }}>
            <Text style={[da.bannerTitle, { color: C.purple }]}>Delays are 10% higher this week</Text>
            <Text style={da.bannerSub}>Compared to last 7 days (Avg: 13.6 min)</Text>
          </View>
          <TouchableOpacity><Text style={[da.bannerLink, { color: C.purple }]}>View Comparison  ›</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const da = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 36, height: 36, backgroundColor: C.greenTint, borderRadius: 10 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2 },
  route: { fontSize: T.xs, color: C.text3 },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  periodRow: { flexDirection: 'row', marginHorizontal: S.xl, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border },
  periodTab: { flex: 1, paddingVertical: S.md, alignItems: 'center', borderRadius: R.md },
  periodTabActive: { backgroundColor: C.green },
  periodText: { fontSize: T.sm, color: C.text2 },
  periodTextActive: { fontWeight: '700', color: C.bg },
  statsRow: { flexDirection: 'row', gap: S.sm },
  statCard: { flex: 1, borderRadius: R.md, borderWidth: 1, padding: S.md, gap: 4 },
  statLabel: { fontSize: T.xs, color: C.text2 },
  statVal: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  statSub: { fontSize: T.xs, color: C.text2 },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.sm },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  minutesBtn: { backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4 },
  minutesBtnText: { fontSize: T.sm, color: C.text2 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: S.lg },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barVal: { fontSize: T.xs, color: C.white },
  bar: { width: 20, borderRadius: 4, minHeight: 4 },
  barDay: { fontSize: T.xs, color: C.text2 },
  legend: { flexDirection: 'row', gap: S.xl },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  legendLine: { width: 20, height: 3, borderRadius: 2 },
  legendDash: { width: 20, height: 3, borderRadius: 2, backgroundColor: C.text3, borderStyle: 'dashed' },
  legendText: { fontSize: T.xs, color: C.text2 },
  rowCards: { flexDirection: 'row', gap: S.md },
  donutPlaceholder: { width: 80, height: 80, backgroundColor: C.surface2, borderRadius: 40, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  donutTotal: { fontSize: 16, fontWeight: '700', color: C.white },
  donutSub: { fontSize: T.xs, color: C.text2 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  distDot: { width: 10, height: 10, borderRadius: 5 },
  distLabel: { flex: 1, fontSize: T.xs, color: C.text2 },
  distPct: { fontSize: T.xs, fontWeight: '700' },
  insightItem: { gap: 2 },
  insightLabel: { fontSize: T.xs, color: C.text2 },
  insightVal: { fontSize: T.sm, fontWeight: '700' },
  insightSub: { fontSize: T.xs, color: C.text3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekItem: { alignItems: 'center', gap: 4, flex: 1 },
  weekDay: { fontSize: T.xs, color: C.text2 },
  weekVal: { fontSize: T.xs, fontWeight: '600', color: C.white },
  weekBar: { width: '80%', height: 4, borderRadius: 2 },
  weekIcon: { width: 24, height: 24, borderRadius: 12 },
  weekLabel: { fontSize: 8, fontWeight: '600', textAlign: 'center' },
  banner: { borderRadius: R.lg, borderWidth: 1, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  bannerIcon: { width: 36, height: 36, backgroundColor: C.purpleTint, borderRadius: 18 },
  bannerTitle: { fontSize: T.sm, fontWeight: '700' },
  bannerSub: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  bannerLink: { fontSize: T.sm, fontWeight: '600' },
});
