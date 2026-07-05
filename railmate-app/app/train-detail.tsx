// app/train-detail.tsx — Train Detail Screen

import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Share, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShareNetwork, Bell } from 'phosphor-react-native';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useTrainDetail } from '../hooks/useTrainDetail';
import { useCommunityReports } from '../hooks/useCommunityReports';
import { useTrainStopProgress } from '../hooks/useTrainStopProgress';
import { useTranslation } from '../i18n';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function calcDuration(depTime: string, arrTime: string): string {
  const [dh, dm] = depTime.split(':').map(Number);
  const [ah, am] = arrTime.split(':').map(Number);
  let depMins = dh * 60 + dm;
  let arrMins = ah * 60 + am;
  if (arrMins < depMins) arrMins += 24 * 60; // overnight
  const diff = arrMins - depMins;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m}m`;
}

export default function TrainDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: train, isLoading, error, refetch } = useTrainDetail(id ?? '');
  const { data: reports } = useCommunityReports({ type: 'DELAY' });
  const todayReports = (reports ?? []).filter(
    r => r.train_id === train?.id && r.journey_date === new Date().toISOString().split('T')[0],
  );

  const journeyDate = new Date().toISOString().split('T')[0];
  const { data: liveStops } = useTrainStopProgress(train?.id ?? null, journeyDate);

  const handleShare = useCallback(async () => {
    if (!train) return;
    try {
      await Share.share({ message: t('train.journey'), title: train.name_en });
    } catch {
      // Share dismissed — no-op
    }
  }, [train, t]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={s.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: S.lg, padding: S.xl }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ width: '100%', height: 120, backgroundColor: C.surface, borderRadius: R.lg, opacity: 0.6 }} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={s.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: S.lg }}>
          <Text style={{ color: C.text2, fontSize: T.base }}>{t('common.error')}</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ backgroundColor: C.green, borderRadius: R.md, paddingHorizontal: S.xl, paddingVertical: S.md }}>
            <Text style={{ color: C.bg, fontWeight: '700', fontSize: T.base }}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Not found state
  if (!train && !isLoading) {
    return (
      <SafeAreaView style={s.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: C.text2, fontSize: T.base }}>{t('train.not_found')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Derive values from real data
  const firstStop = train!.stops[0];
  const lastStop = train!.stops[train!.stops.length - 1];
  const depTime = firstStop?.departure_time?.slice(0, 5) ?? '-';
  const arrTime = lastStop?.arrival_time?.slice(0, 5) ?? '-';
  const duration = depTime !== '-' && arrTime !== '-' ? calcDuration(depTime, arrTime) : '-';

  const latestDelay = todayReports.find(r => r.delay_minutes != null);

  const daysOfWeek = train!.days_of_week ?? [];
  const runDays = daysOfWeek.map(d => DAY_NAMES[d]).join(', ') || 'Daily';
  const offDays = DAY_NAMES.filter((_, i) => !daysOfWeek.includes(i)).join(', ') || 'None';

  const confirmedNum = todayReports.reduce((sum, r) => sum + r.verification_count, 0);

  return (
    <SafeAreaView style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image placeholder */}
        <View style={s.heroImg} />

        {/* Header overlay */}
        <View style={s.headerOverlay}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.iconBtn}><ShareNetwork size={18} color={C.white} /></TouchableOpacity>
            <TouchableOpacity style={s.iconBtn}><Bell size={18} color={C.white} /></TouchableOpacity>
          </View>
        </View>

        <View style={s.body}>
          {/* Train info */}
          <View style={s.card}>
            <View style={s.trainTop}>
              <View style={s.trainLeft}>
                <View style={s.numBadge}><Text style={s.numBadgeText}>#{train!.number}</Text></View>
                <View>
                  <Text style={s.trainName}>{train!.name_en}</Text>
                  <Text style={s.trainNameBn}>{train!.name_bn}</Text>
                </View>
              </View>
              {latestDelay ? (
                <View style={s.delayBadge}>
                  <Text style={s.delayBadgeTitle}>{latestDelay.delay_minutes} min delay</Text>
                  <Text style={s.delayBadgeSub}>Community report</Text>
                </View>
              ) : null}
            </View>
            <Text style={s.routeText}>{train!.origin?.name_en ?? '?'} → {train!.destination?.name_en ?? '?'}</Text>
            <View style={s.divider} />
            <View style={s.timingRow}>
              <View>
                <Text style={s.timeMain}>{depTime}</Text>
                <Text style={s.timeLabel}>Depart</Text>
                <Text style={s.timeStation}>{train!.origin?.name_en ?? '-'}</Text>
                <Text style={s.timeStationBn}>{train!.origin?.name_bn ?? ''}</Text>
              </View>
              <View style={s.durationCol}>
                <Text style={s.durationText}>{duration}</Text>
                <View style={s.durationLine} />
                <Text style={s.distanceText}>{train!.stops.length} stops</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.timeMain}>{arrTime}</Text>
                <Text style={s.timeLabel}>Arrive</Text>
                <Text style={s.timeStation}>{train!.destination?.name_en ?? '-'}</Text>
                <Text style={s.timeStationBn}>{train!.destination?.name_bn ?? ''}</Text>
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.metaRow}>
              {([
                ['Runs', runDays.length > 12 ? 'Daily' : runDays],
                ['Classes', String(train!.stops.length > 0 ? 4 : 0)],
                ['Off Day', offDays.length > 10 ? 'None' : offDays],
              ] as [string, string][]).map(([l, v]) => (
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={s.sectionTitle}>Journey Timeline</Text>
                {liveStops && liveStops.length > 0 && (
                  <View style={{ backgroundColor: 'rgba(0,168,89,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Text style={{ color: '#00A859', fontSize: 10, fontWeight: '700' }}>LIVE</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => router.push({ pathname: '/route-map' as any, params: { id: train!.number } })}>
                <Text style={s.linkText}>View full route</Text>
              </TouchableOpacity>
            </View>
            {train!.stops.length === 0 ? (
              <View>
                <Text style={{ color: C.text2, fontSize: T.sm }}>{t('train.timetable_not_verified_hint')}</Text>
              </View>
            ) : (
              train!.stops.map((stop, i) => {
                const isFirst = i === 0;
                const isLast = i === train!.stops.length - 1;
                const stopTime = stop.departure_time?.slice(0, 5) ?? stop.arrival_time?.slice(0, 5) ?? '-';
                const haltText = stop.halt_minutes > 0
                  ? t('train.halt', { minutes: stop.halt_minutes })
                  : undefined;
                const tag = isFirst ? 'Start' : isLast ? 'End' : undefined;
                const active = isFirst || isLast;
                const liveStop = liveStops?.find(ls => ls.station_name_en === stop.station.name_en);
                const hasPassed = liveStop ? liveStop.has_passed : false;
                return (
                  <View key={stop.id}>
                    <View style={s.stopRow}>
                      <View style={[s.stopDot, { backgroundColor: active ? C.green : hasPassed ? C.green : C.text3 }]} />
                      <View style={{ flex: 1 }}>
                        <View style={s.stopTop}>
                          <Text style={s.stopTime}>{stopTime}</Text>
                          <Text style={s.stopStation}>{stop.station.name_en}</Text>
                          {tag && <View style={s.stopTag}><Text style={s.stopTagText}>{tag}</Text></View>}
                        </View>
                        <View style={s.stopBottom}>
                          <Text style={s.stopBn}>{stop.station.name_bn}</Text>
                          {haltText && <Text style={s.stopDuration}>{haltText}</Text>}
                        </View>
                      </View>
                      <View style={s.mapIcon} />
                    </View>
                    {i < train!.stops.length - 1 && <View style={s.stopLine} />}
                  </View>
                );
              })
            )}
          </View>

          {/* Community Report Summary */}
          <View style={s.card}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Community Report Summary</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/comments-discussion' as any, params: { train_id: train!.id } })}>
                <Text style={s.linkText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={s.communityRow}>
              <View style={s.communityConfirmed}>
                <Text style={s.confirmedNum}>{confirmedNum}</Text>
                <Text style={s.confirmedLabel}>Travelers confirmed</Text>
                <Text style={s.confirmedSub}>today</Text>
              </View>
              {([['Reports', String(todayReports.length), C.orange],['Punctuality', latestDelay ? 'Delay' : 'On Time', latestDelay ? C.red : C.green],['Today', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), C.text2]] as [string,string,string][]).map(([label,val,color]) => (
                <View key={label} style={s.communityMetric}>
                  <Text style={s.metricLabel}>{label}</Text>
                  <Text style={[s.metricVal, { color: color }]}>{val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={s.actionBar}>
        <TouchableOpacity style={s.actionSecondary} onPress={() => router.push({ pathname: '/notifications' })}>
          <Text style={s.actionSecondaryText}>Set Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionPrimary} onPress={() => Linking.openURL('https://railwayseba.com')}>
          <Text style={s.actionPrimaryText}>Buy Ticket via Rail Sheba</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionSecondary} onPress={handleShare}>
          <Text style={s.actionSecondaryText}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  heroImg: { width: '100%', height: 220, backgroundColor: C.surface2 },
  headerOverlay: { position: 'absolute', top: 48, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: S.xl },
  backBtn: { width: 36, height: 36, backgroundColor: C.surface, borderRadius: 18, opacity: 0.9, alignItems: 'center', justifyContent: 'center' },
  headerActions: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface, borderRadius: 18, opacity: 0.9, alignItems: 'center', justifyContent: 'center' },
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
