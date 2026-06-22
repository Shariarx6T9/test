// app/search/results.tsx
// Matches the Search_Results.png reference: header with From/To summary,
// Filter/Sort controls, train cards (rebuilt TrainCard), and a real
// "Community Verified" banner sourced from the live community report feed.

import React, { useMemo, useState } from 'react';
import {
  View, FlatList, ActivityIndicator, Pressable, StyleSheet, Text, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, Funnel, ArrowsDownUp, MapPin, ShieldCheck, CaretRight,
} from 'phosphor-react-native';

import { useSearchTrains, useFareClassesForRoute } from '../../hooks/useTrains';
import { useTrainDelayStatus, useCommunityReports } from '../../hooks/useCommunityReports';
import { useSearchStore } from '../../stores/searchStore';
import { TrainCard } from '../../components/features/TrainCard/TrainCard';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { Radius } from '../../constants/radius';
import { ALL_TRAIN_CLASSES, trainClassLabel } from '../../utils/trainClassLabel';
import { TrainClass } from '../../types/database.types';
import { TrainSearchResult } from '../../types/train.types';

type SortKey = 'departure' | 'train_number';

function ResultsContent() {
  const { fromId, toId, date } = useLocalSearchParams<{ fromId: string; toId: string; date: string }>();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { fromStation, toStation } = useSearchStore();

  const fromStationId = fromId as string | undefined;
  const toStationId   = toId   as string | undefined;

  const { data: trains, isLoading } = useSearchTrains({
    fromStationId, toStationId, date: date ?? '',
  });
  const { data: classesByTrain } = useFareClassesForRoute({
    fromStationId, toStationId,
  });
  const trainNumbers = useMemo(() => (trains ?? []).map((tr) => tr.train_number), [trains]);
  const { data: delayByTrain } = useTrainDelayStatus(trainNumbers, date ?? '');

  // Real "active reporters" count + avatars, sourced from the live community
  // feed (same hook the Home/Community screens use) — not a fabricated number.
  const { data: liveReports } = useCommunityReports(null);
  const activeReporters = useMemo(() => {
    if (!liveReports) return [];
    const seen = new Map<string, NonNullable<typeof liveReports[number]['user']>>();
    for (const r of liveReports) {
      if (r.user && !seen.has(r.user.id)) seen.set(r.user.id, r.user);
    }
    return Array.from(seen.values());
  }, [liveReports]);

  const [sortKey, setSortKey] = useState<SortKey>('departure');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<TrainClass | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const filteredSorted: TrainSearchResult[] = useMemo(() => {
    let list = trains ?? [];
    if (filterClass) {
      list = list.filter((tr) => (classesByTrain?.get(tr.train_number) ?? []).includes(filterClass));
    }
    return [...list].sort((a, b) => {
      if (sortKey === 'train_number') return a.train_number.localeCompare(b.train_number);
      // departure: verified trains with real times first (by time), then unverified by number
      if (a.verified && b.verified) return a.departure_time.localeCompare(b.departure_time);
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      return a.train_number.localeCompare(b.train_number);
    });
  }, [trains, filterClass, classesByTrain, sortKey]);

  const fromName = fromStation?.name_en ?? '';
  const toName = toStation?.name_en ?? '';
  const fromNameBn = fromStation?.name_bn ?? '';
  const toNameBn = toStation?.name_bn ?? '';

  const dateLabel = useMemo(() => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) return `Today, ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
    return d.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long' });
  }, [date, isBengali]);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + Spacing['space-3'] }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <View style={{ flex: 1, marginLeft: Spacing['space-3'] }}>
          <Text style={s.title}>{t('results.title')}</Text>
          <Text style={s.subtitle}>{t('results.found', { count: filteredSorted.length })}</Text>
        </View>
        <Pressable style={s.headerIconBtn} onPress={() => setFilterMenuOpen(true)}>
          <Funnel size={16} color={colors['text-primary']} />
          <Text style={s.headerIconBtnText}>{t('results.filter')}</Text>
        </Pressable>
        <Pressable style={s.headerIconBtn} onPress={() => setSortMenuOpen(true)}>
          <ArrowsDownUp size={16} color={colors['text-primary']} />
          <Text style={s.headerIconBtnText}>{t('results.sort')}</Text>
        </Pressable>
      </View>

      {/* From/To summary — tap to go back and edit */}
      <Pressable style={s.routeCard} onPress={() => router.push('/(tabs)/search' as any)}>
        <View style={{ flex: 1 }}>
          <Text style={s.routeLabel}>{t('search.from')}</Text>
          <View style={s.routeValueRow}>
            <MapPin size={14} color={colors.primary} weight="fill" />
            <Text style={s.routeValue} numberOfLines={1}>{fromName}</Text>
          </View>
          <Text style={s.routeSub} numberOfLines={1}>{fromNameBn}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.routeLabel}>{t('search.to')}</Text>
          <View style={s.routeValueRow}>
            <MapPin size={14} color={colors.primary} weight="fill" />
            <Text style={s.routeValue} numberOfLines={1}>{toName}</Text>
          </View>
          <Text style={s.routeSub} numberOfLines={1}>{toNameBn}</Text>
        </View>
        <CaretRight size={16} color={colors['text-tertiary']} />
      </Pressable>

      <View style={s.metaRow}>
        <Text style={s.metaText}>{t('search.date')}: {dateLabel}</Text>
        <Text style={s.metaText}>
          {filterClass ? trainClassLabel(filterClass) : t('results.today_all_classes').split('•')[1]?.trim() ?? 'All Classes'}
        </Text>
      </View>

      {/* Results */}
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: Spacing['space-10'] }} />
      ) : filteredSorted.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyTitle}>{t('results.none')}</Text>
          <Text style={s.emptyHint}>{t('results.none_hint')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSorted}
          keyExtractor={(item) => String(item.train_number)}
          contentContainerStyle={{ padding: Spacing['space-5'], paddingBottom: Spacing['space-10'] }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TrainCard
              train={item}
              fromId={fromId}
              toId={toId}
              availableClasses={classesByTrain?.get(item.train_number)}
              delayStatus={delayByTrain?.get(item.train_number)}
            />
          )}
          ListFooterComponent={
            activeReporters.length > 0 ? (
              <View style={s.communityBanner}>
                <View style={s.communityIconWrap}>
                  <ShieldCheck size={20} color={colors.primary} weight="fill" />
                </View>
                <View style={{ flex: 1, marginLeft: Spacing['space-3'] }}>
                  <Text style={s.communityTitle}>{t('results.community_verified')}</Text>
                  <Text style={s.communityBody}>{t('results.community_verified_body')}</Text>
                </View>
                <View style={s.avatarStack}>
                  {activeReporters.slice(0, 3).map((u, i) => (
                    <View key={u.id} style={[s.avatarWrap, { marginLeft: i === 0 ? 0 : -10 }]}>
                      <Avatar name={u.display_name ?? 'U'} uri={u.avatar_url ?? undefined} size={28} />
                    </View>
                  ))}
                  {activeReporters.length > 3 && (
                    <View style={[s.avatarWrap, s.avatarMore, { marginLeft: -10 }]}>
                      <Text style={s.avatarMoreText}>+{activeReporters.length - 3}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : null
          }
        />
      )}

      {/* Sort menu */}
      <Modal visible={sortMenuOpen} transparent animationType="fade" onRequestClose={() => setSortMenuOpen(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setSortMenuOpen(false)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>{t('results.sort')}</Text>
            {([
              { key: 'departure' as SortKey, label: t('train.depart') },
              { key: 'train_number' as SortKey, label: '#' + t('results.title') },
            ]).map(({ key, label }) => (
              <Pressable
                key={key}
                style={s.sheetRow}
                onPress={() => { setSortKey(key); setSortMenuOpen(false); }}
              >
                <Text style={[s.sheetRowText, sortKey === key && { color: colors.primary }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Filter menu — real class filter against the live fares data fetched above */}
      <Modal visible={filterMenuOpen} transparent animationType="fade" onRequestClose={() => setFilterMenuOpen(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setFilterMenuOpen(false)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>{t('results.filter')}</Text>
            <Pressable style={s.sheetRow} onPress={() => { setFilterClass(null); setFilterMenuOpen(false); }}>
              <Text style={[s.sheetRowText, !filterClass && { color: colors.primary }]}>All Classes</Text>
            </Pressable>
            {ALL_TRAIN_CLASSES.map((cls) => (
              <Pressable
                key={cls}
                style={s.sheetRow}
                onPress={() => { setFilterClass(cls); setFilterMenuOpen(false); }}
              >
                <Text style={[s.sheetRowText, filterClass === cls && { color: colors.primary }]}>
                  {trainClassLabel(cls)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function ResultsScreen() {
  return <ErrorBoundary name="Search Results"><ResultsContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:             { flex: 1, backgroundColor: colors['bg-base'] },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['space-5'], paddingBottom: Spacing['space-3'], gap: Spacing['space-2'] },
  backBtn:          { width: 40, height: 40, borderRadius: Radius['radius-full'], backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:            { ...Typography['h2'], color: colors['text-primary'] },
  subtitle:         { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },
  headerIconBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.border, borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-2'], paddingVertical: Spacing['space-2'] },
  headerIconBtnText:{ ...Typography['caption'], color: colors['text-primary'] },

  routeCard:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing['space-5'], backgroundColor: colors['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, padding: Spacing['space-4'], gap: Spacing['space-3'] },
  routeLabel:       { ...Typography['caption'], color: colors['text-tertiary'] },
  routeValueRow:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  routeValue:       { ...Typography['h4'], color: colors['text-primary'], flexShrink: 1 },
  routeSub:         { ...Typography['caption'], color: colors['text-tertiary'], marginTop: 1 },

  metaRow:          { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-3'], marginBottom: Spacing['space-2'] },
  metaText:         { ...Typography['caption'], color: colors['text-secondary'] },

  emptyState:       { alignItems: 'center', paddingTop: Spacing['space-12'], paddingHorizontal: Spacing['space-6'] },
  emptyTitle:       { ...Typography['h3'], color: colors['text-primary'], marginBottom: Spacing['space-2'] },
  emptyHint:        { ...Typography['body-sm'], color: colors['text-secondary'], textAlign: 'center' },

  communityBanner:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['primary-subtle'], borderWidth: 1, borderColor: colors.primary, borderRadius: Radius['radius-lg'], padding: Spacing['space-4'], marginTop: Spacing['space-2'] },
  communityIconWrap:{ width: 40, height: 40, borderRadius: Radius['radius-full'], backgroundColor: colors['bg-card'], alignItems: 'center', justifyContent: 'center' },
  communityTitle:   { ...Typography['label-lg'], color: colors.primary },
  communityBody:    { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },
  avatarStack:      { flexDirection: 'row', alignItems: 'center' },
  avatarWrap:       { borderWidth: 2, borderColor: colors['bg-base'], borderRadius: Radius['radius-full'] },
  avatarMore:       { width: 28, height: 28, borderRadius: 14, backgroundColor: colors['bg-elevated'], alignItems: 'center', justifyContent: 'center' },
  avatarMoreText:   { ...Typography['caption'], color: colors['text-secondary'] },

  modalBackdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:            { backgroundColor: colors['bg-card'], borderTopLeftRadius: Radius['radius-xl'], borderTopRightRadius: Radius['radius-xl'], padding: Spacing['space-5'], paddingBottom: Spacing['space-8'] },
  sheetTitle:       { ...Typography['h3'], color: colors['text-primary'], marginBottom: Spacing['space-4'] },
  sheetRow:         { paddingVertical: Spacing['space-3'], borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetRowText:     { ...Typography['body'], color: colors['text-primary'] },
});
