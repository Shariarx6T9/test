// app/(tabs)/community.tsx
//
// Community feed screen — live reports from fellow passengers.

import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Faders, Plus, UsersThree } from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/colors';
import { useTranslation } from '../../i18n';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import ReportCard from '../../components/features/ReportCard/ReportCard';
import ReportCardSkeleton from '../../components/features/ReportCard/ReportCardSkeleton';
import ReportSubmitSheet from '../../components/features/ReportSubmitSheet/ReportSubmitSheet';
import { useAuthStore } from '../../stores/authStore';
import {
  useCommunityReports,
  useVoteReport,
} from '../../hooks/useCommunityReports';
import type { CommunityReport, ReportFilter, VoteType } from '../../types/report.types';

// ─── Filter config ──────────────────────────────────────────────────────────

interface FilterChip {
  key: ReportFilter;
  labelKey: string;
}

const FILTER_CHIPS: FilterChip[] = [
  { key: null, labelKey: 'community.filter_all' },
  { key: 'DELAY', labelKey: 'community.filter_delay' },
  { key: 'CROWDING', labelKey: 'community.filter_crowding' },
  { key: 'COACH_CONDITION', labelKey: 'community.filter_condition' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const { colorScheme } = useColorScheme();
  const currentColors = Colors[colorScheme === 'light' ? 'light' : 'dark'];
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const { user } = useAuthStore();

  const [activeFilter, setActiveFilter] = useState<ReportFilter>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data: reports, isLoading, refetch } = useCommunityReports(activeFilter);
  const voteMutation = useVoteReport();

  // ── Pull to refresh ────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ── Vote handler ───────────────────────────────────────────────────────
  const handleVote = useCallback(
    (reportId: string, voteType: VoteType) => {
      if (!user) {
        setSheetVisible(true); // sheet will show auth gate
        return;
      }

      const report = reports?.find((r) => r.id === reportId);
      if (!report) return;

      voteMutation.mutate({
        reportId,
        voteType,
        existingVote: report.current_user_vote ?? null,
        activeFilter,
      });
    },
    [user, reports, voteMutation, activeFilter],
  );

  // ── List render ────────────────────────────────────────────────────────
  const renderReport = useCallback(
    ({ item }: { item: CommunityReport }) => (
      <ReportCard
        report={item}
        isBengali={isBengali}
        onVote={handleVote}
        currentUserId={user?.id}
      />
    ),
    [isBengali, handleVote, user?.id],
  );

  const keyExtractor = useCallback((item: CommunityReport) => item.id, []);

  // ── Loading state: 3 skeleton cards ───────────────────────────────────
  if (isLoading) {
    return (
      <ScreenWrapper className="bg-bg-base">
        <Header
          isBengali={isBengali}
          t={t}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <View className="px-4 pt-3">
          <ReportCardSkeleton />
          <ReportCardSkeleton />
          <ReportCardSkeleton />
        </View>
      </ScreenWrapper>
    );
  }

  const isEmpty = !reports || reports.length === 0;

  return (
    <ScreenWrapper className="bg-bg-base flex-1">
      {/* Header + filters */}
      <Header
        isBengali={isBengali}
        t={t}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isEmpty ? (
        <EmptyState
          t={t}
          isBengali={isBengali}
          onReport={() => setSheetVisible(true)}
        />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={currentColors.primary}
              colors={[currentColors.primary]}
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => setSheetVisible(true)}
        className="absolute bottom-8 right-5 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        activeOpacity={0.85}
        style={{
          shadowColor: currentColors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Plus size={24} color="#ffffff" weight="bold" />
      </TouchableOpacity>

      {/* Submit sheet */}
      <ReportSubmitSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        isBengali={isBengali}
      />
    </ScreenWrapper>
  );
}

// ─── Header sub-component ────────────────────────────────────────────────────

function Header({
  isBengali,
  t,
  activeFilter,
  onFilterChange,
}: {
  isBengali: boolean;
  t: (key: string) => string;
  activeFilter: ReportFilter;
  onFilterChange: (f: ReportFilter) => void;
}) {
  return (
    <View>
      {/* Title row */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Typography
          variant="h2"
          className="text-text-primary"
          isBengali={isBengali}
        >
          {t('community.title')}
        </Typography>
        <TouchableOpacity className="w-9 h-9 rounded-full bg-bg-card items-center justify-center border border-border">
          <Faders size={20} color={currentColors['text-secondary']} />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip.key;
          return (
            <TouchableOpacity
              key={chip.key ?? 'all'}
              onPress={() => onFilterChange(chip.key)}
              className={`px-4 py-2 rounded-full border ${
                isActive
                  ? 'bg-primary border-primary'
                  : 'bg-bg-card border-border'
              }`}
              activeOpacity={0.75}
            >
              <Typography
                variant="caption"
                className={isActive ? 'text-white' : 'text-text-secondary'}
                isBengali={isBengali}
              >
                {t(chip.labelKey)}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Empty state sub-component ───────────────────────────────────────────────

function EmptyState({
  t,
  isBengali,
  onReport,
}: {
  t: (key: string) => string;
  isBengali: boolean;
  onReport: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const currentColors = Colors[colorScheme === 'light' ? 'light' : 'dark'];

  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <UsersThree size={48} color={currentColors['text-secondary']} />
      <View className="items-center gap-1">
        <Typography
          variant="h3"
          className="text-text-primary text-center"
          isBengali={isBengali}
        >
          {t('community.empty_title')}
        </Typography>
        <Typography
          variant="body-sm"
          className="text-text-secondary text-center"
          isBengali={isBengali}
        >
          {t('community.empty_body')}
        </Typography>
      </View>
      <TouchableOpacity
        onPress={onReport}
        className="bg-primary px-6 py-3 rounded-xl flex-row items-center gap-2"
        activeOpacity={0.8}
      >
        <Plus size={16} color="#ffffff" weight="bold" />
        <Typography variant="body-sm" className="text-white font-semibold">
          {t('community.report_btn')}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
