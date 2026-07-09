// app/search-results.tsx — Search Results Screen

import React, { useState, useCallback } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { useSearchTrains } from '../hooks/useTrains';
import { useTrainDelayStatus } from '../hooks/useCommunityReports';
import { TrainSearchResult } from '../types/database.types';
import { useTranslation } from '../i18n';
import { FALLBACK_STATIONS } from '../hooks/useStations';

const POPULAR_ROUTES = [
  { from: FALLBACK_STATIONS[0], to: FALLBACK_STATIONS[1] }, // Dhaka → Chattogram
  { from: FALLBACK_STATIONS[0], to: FALLBACK_STATIONS[2] }, // Dhaka → Sylhet
  { from: FALLBACK_STATIONS[0], to: FALLBACK_STATIONS[3] }, // Dhaka → Rajshahi
  { from: FALLBACK_STATIONS[0], to: FALLBACK_STATIONS[4] }, // Dhaka → Khulna
];

function SkeletonCard() {
  return (
    <View style={[s.trainCard, { height: 160, opacity: 0.6 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], marginBottom: Spacing['space-3'] }}>
        <View style={{ width: 56, height: 20, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 }} />
        <View style={{ width: 120, height: 16, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 }} />
      </View>
      <View style={{ width: '80%', height: 12, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4, marginBottom: Spacing['space-2'] }} />
      <View style={s.divider} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing['space-2'] }}>
        <View style={{ width: 60, height: 28, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 }} />
        <View style={{ width: 60, height: 8, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4, alignSelf: 'center' }} />
        <View style={{ width: 60, height: 28, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 }} />
      </View>
    </View>
  );
}

const TrainCard = React.memo(function TrainCard({ train, delayStatus, onPress }: {
  train: TrainSearchResult;
  delayStatus?: { delayMinutes: number; reportedAt: string };
  onPress: (trainNumber: string) => void;
}) {
  const { t } = useTranslation();
  const handlePress = useCallback(() => {
    onPress(train.train_number);
  }, [onPress, train.train_number]);
  const delayBadgeBg = delayStatus
    ? (delayStatus.delayMinutes >= 15 ? Colors.dark['danger-subtle'] : Colors.dark['accent-subtle'])
    : Colors.dark['primary-subtle'];
  const delayBadgeColor = delayStatus
    ? (delayStatus.delayMinutes >= 15 ? Colors.dark.danger : Colors.dark.accent)
    : Colors.dark.primary;
  const delayBadgeText = delayStatus
    ? `${delayStatus.delayMinutes} min delay`
    : t('results.on_time');

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <TouchableOpacity style={s.trainCard} onPress={handlePress} activeOpacity={0.8}>
      {/* Top row */}
      <View style={s.trainTop}>
        <View style={s.trainLeft}>
          <View style={s.numBadge}>
            <Text style={s.numBadgeText}>#{train.train_number}</Text>
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={s.trainName} numberOfLines={1} ellipsizeMode="tail">{train.train_name_en}</Text>
            <Text style={s.trainNameBn}>{train.train_type}</Text>
          </View>
        </View>
        <View style={[s.delayBadge, { backgroundColor: delayBadgeBg }]}>
          <Text style={[s.delayText, { color: delayBadgeColor }]}>{delayBadgeText}</Text>
        </View>
      </View>

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
          <Text style={[s.trainRoute, { color: Colors.dark['text-tertiary'] }]}>{t('results.schedule_being_verified')}</Text>
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
          <Text style={[s.seatsValue, { color: train.verified ? Colors.dark.primary : Colors.dark['text-tertiary'] }]}>
            {train.verified ? '✓' : '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

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

  const handleTrainPress = useCallback((trainNumber: string) => {
    router.push({ pathname: '/train/[id]', params: { id: trainNumber } });
  }, [router]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.dark.primary} />}
      >

        {/* Summary card */}
        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.summaryLabel}>From</Text>
              <Text style={s.summaryValue} numberOfLines={1} ellipsizeMode="tail">{params.from_name ?? 'Origin'}</Text>
            </View>
            <View style={s.swapIcon} />
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={s.summaryLabel}>To</Text>
              <Text style={s.summaryValue} numberOfLines={1} ellipsizeMode="tail">{params.to_name ?? 'Destination'}</Text>
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
          <View style={{ alignItems: 'center', paddingVertical: Spacing['space-5'], gap: Spacing['space-3'] }}>
            <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body }}>{t('common.error')}</Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={{ color: Colors.dark.primary, ...Typography.body }}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty state */}
        {!isLoading && !error && trains?.length === 0 && (
          <View style={{ gap: Spacing['space-3'], paddingVertical: Spacing['space-5'] }}>
            <View style={{ alignItems: 'center', gap: Spacing['space-3'] }}>
              <Text style={{ color: Colors.dark['text-primary'], ...Typography.h4, fontWeight: '600' }}>{t('results.none')}</Text>
              <Text style={{ color: Colors.dark['text-secondary'], ...Typography['body-sm'], textAlign: 'center' }}>{t('results.none_hint')}</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={{ color: Colors.dark.primary, ...Typography.body }}>{t('results.search_again')}</Text>
              </TouchableOpacity>
            </View>
            <View style={s.suggestedSection}>
              <Text style={s.suggestedTitle}>You might also try</Text>
              {POPULAR_ROUTES.map((route, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.suggestedRoute}
                  onPress={() => router.replace({
                    pathname: '/search-results',
                    params: {
                      from_station_id: route.from.id,
                      to_station_id: route.to.id,
                      date: params.date ?? new Date().toISOString().split('T')[0],
                      from_name: route.from.name_en,
                      to_name: route.to.name_en,
                    },
                  })}
                >
                  <Text style={s.suggestedRouteText}>{route.from.name_en}</Text>
                  <Text style={s.suggestedArrow}>→</Text>
                  <Text style={s.suggestedRouteText}>{route.to.name_en}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Train list */}
        {!isLoading && !error && (trains ?? []).map((train) => (
          <TrainCard
            key={train.train_id}
            train={train}
            delayStatus={delayMap?.get(train.train_number)}
            onPress={handleTrainPress}
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
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: Spacing['space-2'] },
  headerBtn: { backgroundColor: Colors.dark['bg-overlay'], borderRadius: 10, paddingHorizontal: Spacing['space-3'], paddingVertical: 8 },
  headerBtnText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-primary'] },
  summaryCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'] },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...Typography.caption, color: Colors.dark['text-secondary'] },
  summaryValue: { ...Typography.h4, fontWeight: '600', color: Colors.dark['text-primary'], marginTop: 2 },
  swapIcon: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16 },
  divider: { height: 1, backgroundColor: Colors.dark.border, marginVertical: Spacing['space-3'] },
  summaryMeta: { flexDirection: 'row', gap: Spacing['space-5'] },
  summaryMetaText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  trainCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-3'] },
  trainTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing['space-3'] },
  trainLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], flex: 1, minWidth: 0 },
  numBadge: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: 8, paddingHorizontal: Spacing['space-2'], paddingVertical: 4 },
  numBadgeText: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark.primary },
  trainName: { fontSize: 14, fontWeight: '700', color: Colors.dark['text-primary'] },
  trainNameBn: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 1 },
  delayBadge: { borderRadius: 8, paddingHorizontal: Spacing['space-2'], paddingVertical: 4 },
  delayText: { ...Typography.caption, fontWeight: '700' },
  trainRoute: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  timingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeMain: { fontSize: 20, fontWeight: '700', color: Colors.dark['text-primary'] },
  timeLabel: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 2 },
  timeStation: { ...Typography.caption, fontWeight: '600', color: Colors.dark.primary, marginTop: 1 },
  durationCol: { alignItems: 'center', gap: 4 },
  durationText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  durationLine: { width: 60, height: 2, backgroundColor: Colors.dark.primary, borderRadius: 1 },
  arrowText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  trainBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  classPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  classPill: { backgroundColor: Colors.dark['bg-overlay'], borderRadius: 6, paddingHorizontal: Spacing['space-2'], paddingVertical: 4 },
  classPillActive: { backgroundColor: Colors.dark['primary-subtle'], borderWidth: 1, borderColor: Colors.dark.primary },
  classPillText: { fontSize: 9, color: Colors.dark['text-secondary'] },
  classPillTextActive: { color: Colors.dark.primary },
  seatsLabel: { fontSize: 9, color: Colors.dark['text-secondary'], textAlign: 'right' },
  seatsValue: { fontSize: 14, fontWeight: '700', color: Colors.dark.primary, textAlign: 'right' },
  communityBadge: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark['primary-dim'], padding: Spacing['space-4'], flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'] },
  communityIcon: { width: 40, height: 40, backgroundColor: Colors.dark['primary-dim'], borderRadius: 20 },
  communityTitle: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  communitySub: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 2 },
  reportersStack: { width: 40, height: 28, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 14 },
  suggestedSection: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-2'] },
  suggestedTitle: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'], marginBottom: Spacing['space-1'] },
  suggestedRoute: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], paddingVertical: Spacing['space-2'], borderTopWidth: 1, borderTopColor: Colors.dark.border },
  suggestedRouteText: { ...Typography['body-sm'], color: Colors.dark['text-primary'], flex: 1 },
  suggestedArrow: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
});
