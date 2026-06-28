// app/delay-analytics.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '../i18n';

type Period = '7D' | '30D' | '90D';

const DISTRIBUTION = [
  { label: 'On Time (≤5 min)', pct: '42%', color: C.green },
  { label: '5 - 15 min', pct: '28%', color: C.gold },
  { label: '15 - 30 min', pct: '18%', color: C.orange },
  { label: '30 - 60 min', pct: '8%', color: C.red },
  { label: '> 60 min', pct: '4%', color: C.purple },
];

export default function DelayAnalyticsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState<Period>('7D');
  const { id } = useLocalSearchParams<{ id: string }>();
  const periods: Period[] = ['7D', '30D', '90D'];

  const { data: delayReports, isLoading, refetch } = useQuery({
    queryKey: ['delay_analytics', id, activePeriod],
    queryFn: async () => {
      if (!id) return [];
      const days = activePeriod === '7D' ? 7 : activePeriod === '30D' ? 30 : 90;
      const fromDate = new Date(); fromDate.setDate(fromDate.getDate() - days);

      // First find train by number
      const { data: trainData } = await supabase.from('trains').select('id').eq('number', id).maybeSingle();
      if (!trainData?.id) return [];

      const { data, error } = await supabase
        .from('community_reports')
        .select('id, delay_minutes, reported_at, journey_date, verification_count')
        .eq('train_id', trainData.id)
        .eq('report_type', 'DELAY')
        .not('delay_minutes', 'is', null)
        .gte('created_at', fromDate.toISOString())
        .order('reported_at', { ascending: true });

      if (error) return [];
      return (data ?? []) as { id: string; delay_minutes: number; reported_at: string; journey_date: string; verification_count: number }[];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const avgDelay = delayReports?.length
    ? Math.round(delayReports.reduce((sum, r) => sum + (r.delay_minutes ?? 0), 0) / delayReports.length)
    : 0;

  // For bar chart: group by day
  const barData = (() => {
    if (!delayReports?.length) return [];
    const days = activePeriod === '7D' ? 7 : activePeriod === '30D' ? 30 : 90;
    const grouped: Record<string, number[]> = {};
    delayReports.forEach(r => {
      const day = r.journey_date ?? r.reported_at?.slice(0, 10) ?? '';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(r.delay_minutes ?? 0);
    });
    return Object.entries(grouped).slice(-Math.min(days, 14)).map(([day, vals]) => ({
      day: day.slice(5), // MM-DD
      avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }));
  })();
  const maxBar = Math.max(...barData.map(b => b.avg), 1);

  return (
    <SafeAreaView style={da.root}>
      <View style={da.header}>
        <TouchableOpacity style={da.backBtn} onPress={() => router.back()} />
        <View style={da.headerCenter}>
          <View style={da.headerIcon} />
          <View>
            <Text style={da.title}>Delay Analytics</Text>
            {id ? <Text style={da.subtitle}>Train #{id}</Text> : null}
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
          <TouchableOpacity key={p} style={[da.periodTab, activePeriod === p && da.periodTabActive]} onPress={() => setActivePeriod(p)}>
            <Text style={[da.periodText, activePeriod === p && da.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={da.scroll}>
        {/* Stats row */}
        <View style={da.statsRow}>
          {[
            { label: 'Total Reports', val: String(delayReports?.length ?? 0), sub: `Last ${activePeriod}`, color: C.green, bg: C.greenTint },
            { label: 'Average Delay', val: `${avgDelay} min`, sub: 'Avg across period', color: C.blue, bg: C.blueTint },
            { label: 'Reliability Score', val: avgDelay <= 10 ? 'Good' : avgDelay <= 20 ? 'Fair' : 'Poor', sub: 'Based on delays', color: C.purple, bg: C.purpleTint },
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

          {isLoading ? (
            <View style={{ height: 120, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={C.green} />
            </View>
          ) : barData.length === 0 ? (
            <View style={{ height: 120, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: C.text2, fontSize: T.sm }}>No delay data for this period.</Text>
            </View>
          ) : (
            <>
              {/* Simple bar chart */}
              <View style={da.chart}>
                {barData.map(d => (
                  <View key={d.day} style={da.barCol}>
                    <Text style={da.barVal}>{d.avg}</Text>
                    <View style={[da.bar, { height: Math.max((d.avg / maxBar) * 120, 4), backgroundColor: C.purple }]} />
                    <Text style={da.barDay}>{d.day}</Text>
                  </View>
                ))}
              </View>
              <View style={da.legend}>
                <View style={da.legendItem}><View style={[da.legendLine, { backgroundColor: C.purple }]} /><Text style={da.legendText}>Average Delay (min)</Text></View>
                <View style={da.legendItem}><View style={[da.legendDash]} /><Text style={da.legendText}>Target (15 min)</Text></View>
              </View>
            </>
          )}
        </View>

        {/* Distribution + Insights */}
        <View style={da.rowCards}>
          <View style={[da.card, { flex: 1 }]}>
            <Text style={da.sectionTitle}>Delay Distribution</Text>
            <View style={da.donutPlaceholder}>
              <Text style={da.donutTotal}>{delayReports?.length ?? 0}</Text>
              <Text style={da.donutSub}>Reports</Text>
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
              { label: 'Total delays', val: String(delayReports?.length ?? 0), sub: `In last ${activePeriod}`, color: C.orange },
              { label: 'Average delay', val: `${avgDelay} min`, sub: 'Across period', color: C.red },
              { label: 'Max delay', val: delayReports?.length ? `${Math.max(...delayReports.map(r => r.delay_minutes ?? 0))} min` : 'N/A', sub: 'Single report', color: C.blue },
            ].map(ins => (
              <View key={ins.label} style={da.insightItem}>
                <Text style={da.insightLabel}>{ins.label}</Text>
                <Text style={[da.insightVal, { color: ins.color }]}>{ins.val}</Text>
                <Text style={da.insightSub}>{ins.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly overview using real barData */}
        {barData.length > 0 && (
          <View style={da.card}>
            <View style={da.sectionHeader}>
              <Text style={da.sectionTitle}>Period Performance Overview</Text>
              <TouchableOpacity onPress={() => refetch()}><Text style={da.viewAll}>Refresh  ›</Text></TouchableOpacity>
            </View>
            <View style={da.weekRow}>
              {barData.slice(-7).map(d => {
                const color = d.avg <= 10 ? C.green : d.avg <= 20 ? C.orange : C.red;
                const label = d.avg <= 10 ? 'Good' : d.avg <= 20 ? 'Average' : 'Poor';
                return (
                  <View key={d.day} style={da.weekItem}>
                    <Text style={da.weekDay}>{d.day}</Text>
                    <Text style={da.weekVal}>{d.avg} min</Text>
                    <View style={[da.weekBar, { backgroundColor: color }]} />
                    <View style={[da.weekIcon, { backgroundColor: color + '30' }]} />
                    <Text style={[da.weekLabel, { color }]}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Comparison banner */}
        <View style={[da.banner, { backgroundColor: C.purpleTint, borderColor: C.purple }]}>
          <View style={da.bannerIcon} />
          <View style={{ flex: 1 }}>
            <Text style={[da.bannerTitle, { color: C.purple }]}>
              {avgDelay > 0 ? `Average delay: ${avgDelay} min over ${activePeriod}` : 'No delay data available'}
            </Text>
            <Text style={da.bannerSub}>Based on community reports</Text>
          </View>
          <TouchableOpacity onPress={() => refetch()}><Text style={[da.bannerLink, { color: C.purple }]}>Refresh  ›</Text></TouchableOpacity>
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
