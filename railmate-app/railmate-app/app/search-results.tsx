// app/search-results.tsx — Search Results Screen

import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useSearchTrains } from '../hooks/useTrains';
import { useTrainDelayStatus } from '../hooks/useCommunityReports';
import { TrainSearchResult } from '../types/database.types';
import { useTranslation } from '../i18n';

function SkeletonCard() {
  return (
    <View style={[s.trainCard, { height: 160, opacity: 0.6 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm, marginBottom: S.md }}>
        <View style={{ width: 56, height: 20, backgroundColor: C.surface2, borderRadius: 4 }} />
        <View style={{ width: 120, height: 16, backgroundColor: C.surface2, borderRadius: 4 }} />
      </View>
      <View style={{ width: '80%', height: 12, backgroundColor: C.surface2, borderRadius: 4, marginBottom: S.sm }} />
      <View style={s.divider} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: S.sm }}>
        <View style={{ width: 60, height: 28, backgroundColor: C.surface2, borderRadius: 4 }} />
        <View style={{ width: 60, height: 8, backgroundColor: C.surface2, borderRadius: 4, alignSelf: 'center' }} />
        <View style={{ width: 60, height: 28, backgroundColor: C.surface2, borderRadius: 4 }} />
      </View>
    </View>
  );
}

function TrainCard({ train, delayStatus, onPress }: {
  train: TrainSearchResult;
  delayStatus?: { delayMinutes: number; reportedAt: string };
  onPress: () => void;
}) {
  const { t } = useTranslation();

  const delayBadgeBg = delayStatus
    ? (delayStatus.delayMinutes >= 15 ? C.redTint : C.orangeTint)
    : C.greenTint;
  const delayBadgeColor = delayStatus
    ? (delayStatus.delayMinutes >= 15 ? C.red : C.orange)
    : C.green;
  const delayBadgeText = delayStatus
    ? `${delayStatus.delayMinutes} min delay`
    : t('results.on_time');

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <TouchableOpacity style={s.trainCard} onPress={onPress} activeOpacity={0.8}>
      {/* Top row */}
      <View style={s.trainTop}>
        <View style={s.trainLeft}>
          <View style={s.numBadge}>
            <Text style={s.numBadgeText}>#{train.train_number}</Text>
          </View>
          <View>
            <Text style={s.trainName}>{train.train_name_en}</Text>
            <Text style={s.trainNameBn}>{train.train_type}</Text>
          </View>
        </View>
        <View style={[s.delayBadge, { backgroundColor: delayBadgeBg }]}>
          <Text style={[s.delayText, { color: delayBadgeColor }]}>{delayBadgeText}</Text>
        </View>
      </View>

      <Text style={s.trainRoute}>{train.train_name_en}</Text>
      <View style={s.divider} />

      {/* Timing */}
      {train.verified ? (
        <View style={s.timingRow}>
          <View>
            <Text style={s.timeMain}>{train.departure_time}</Text>
            <Text style={s.timeLabel}>{t('train.depart')}</Text>
          </View>
          <View style={s.durationCol}>
            <Text style={s.durationText}>{formatDuration(train.duration_minutes)}</Text>
            <View style={s.durationLine} />
            <Text style={s.arrowText}>→</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.timeMain}>{train.arrival_time}</Text>
            <Text style={s.timeLabel}>{t('train.arrive')}</Text>
          </View>
        </View>
      ) : (
        <View style={s.timingRow}>
          <Text style={[s.trainRoute, { color: C.text3 }]}>{t('results.schedule_being_verified')}</Text>
        </View>
      )}

      <View style={s.divider} />

      {/* Bottom */}
      <View style={s.trainBottom}>
        <View style={s.classPills}>
          {/* Classes not available per-train without fares table join — skip pills */}
        </View>
        <View>
          <Text style={s.seatsLabel}>{t('results.verified_schedule')}</Text>
          <Text style={[s.seatsValue, { color: train.verified ? C.green : C.text3 }]}>
            {train.verified ? '✓' : '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from_station_id: string; to_station_id: string; date: string; from_name: string; to_name: string }>();
  const { t } = useTranslation();

  const { data: trains, isLoading, error, refetch } = useSearchTrains({
    fromStationId: params.from_station_id,
    toStationId: params.to_station_id,
    date: params.date ?? new Date().toISOString().split('T')[0],
  });

  const trainNumbers = (trains ?? []).filter((tr) => tr.verified).map((tr) => tr.train_number);
  const { data: delayMap } = useTrainDelayStatus(trainNumbers, params.date ?? '');

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
        <View>
          <Text style={s.title}>{t('results.title')}</Text>
          <Text style={s.subtitle}>
            {isLoading ? t('common.loading') : t('results.found', { count: trains?.length ?? 0 })}
          </Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.headerBtn}><Text style={s.headerBtnText}>{t('results.filter')}</Text></TouchableOpacity>
          <TouchableOpacity style={s.headerBtn}><Text style={s.headerBtnText}>{t('results.sort')}</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green} />}
      >

        {/* Summary card */}
        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <View>
              <Text style={s.summaryLabel}>From</Text>
              <Text style={s.summaryValue}>{params.from_name ?? 'Origin'}</Text>
            </View>
            <View style={s.swapIcon} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.summaryLabel}>To</Text>
              <Text style={s.summaryValue}>{params.to_name ?? 'Destination'}</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.summaryMeta}>
            <Text style={s.summaryMetaText}>{params.date ?? t('results.today_all_classes')}</Text>
            <Text style={s.summaryMetaText}>All Classes</Text>
          </View>
        </View>

        {/* Loading skeletons */}
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Error state */}
        {!isLoading && !!error && (
          <View style={{ alignItems: 'center', paddingVertical: S.xl, gap: S.md }}>
            <Text style={{ color: C.text2, fontSize: T.base }}>{t('common.error')}</Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={{ color: C.green, fontSize: T.base }}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty state */}
        {!isLoading && !error && trains?.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: S.xl, gap: S.md }}>
            <Text style={{ color: C.white, fontSize: T.md, fontWeight: '600' }}>{t('results.none')}</Text>
            <Text style={{ color: C.text2, fontSize: T.sm }}>{t('results.none_hint')}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: C.green, fontSize: T.base }}>{t('results.search_again')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Train list */}
        {!isLoading && !error && (trains ?? []).map((train) => (
          <TrainCard
            key={train.train_id}
            train={train}
            delayStatus={delayMap?.get(train.train_number)}
            onPress={() => router.push({ pathname: '/train/[id]', params: { id: train.train_number } })}
          />
        ))}

        {/* Community verified */}
        <View style={s.communityBadge}>
          <View style={s.communityIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.communityTitle}>{t('results.community_verified')}</Text>
            <Text style={s.communitySub}>
              {t('results.community_verified_body')}
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
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
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
