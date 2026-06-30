import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { useRealtimeReports } from '../../hooks/useRealtimeReports';
import { AppText } from '../../components/ui/AppText';
import { Chip } from '../../components/ui/Chip/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { LiveUpdateCard } from '../../components/features/LiveUpdateCard';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

type FilterType = null | { type: 'DELAY' } | { type: 'CROWDING' };

export default function LiveUpdatesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>(null);

  // Subscribe to real-time updates (ONLY in this tab)
  useRealtimeReports();

  // Fetch live updates with current filter
  const { data: updates = [], isLoading, error, refetch } = useCommunityReports(filter);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="h1" style={styles.title}>Live Updates</AppText>
        <AppText variant="body" color={Colors.dark['text-secondary']}>
          Real-time train status from the community
        </AppText>
      </View>

      {/* Filter Chips */}
      <View style={styles.filters}>
        <Chip
          label="All"
          isActive={filter === null}
          onPress={() => setFilter(null)}
        />
        <Chip
          label="Delays"
          isActive={filter?.type === 'DELAY'}
          onPress={() => setFilter({ type: 'DELAY' })}
        />
        <Chip
          label="Crowding"
          isActive={filter?.type === 'CROWDING'}
          onPress={() => setFilter({ type: 'CROWDING' })}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={Colors.dark.primary}
          />
        }
      >
        {isLoading ? (
          <>
            <Skeleton width="100%" height={100} style={styles.skeleton} />
            <Skeleton width="100%" height={100} style={styles.skeleton} />
            <Skeleton width="100%" height={100} style={styles.skeleton} />
            <Skeleton width="100%" height={100} style={styles.skeleton} />
            <Skeleton width="100%" height={100} style={styles.skeleton} />
          </>
        ) : error ? (
          <EmptyState
            iconName="Warning"
            title="Failed to load updates"
            description="Please check your connection and try again"
            ctaLabel="Retry"
            onCta={handleRefresh}
          />
        ) : updates.length === 0 ? (
          <EmptyState
            iconName="Activity"
            title="No live updates"
            description={
              filter
                ? `No ${filter.type.toLowerCase()} reports at the moment`
                : 'Check back soon for real-time train updates'
            }
          />
        ) : (
          updates.map((update) => (
            <LiveUpdateCard
              key={update.id}
              update={{
                train_name: update.train_name ?? 'Unknown Train',
                train_number: update.train_number ?? 'N/A',
                route_from: 'Station A', // TODO: Get from joined data when available
                route_to: 'Station B',
                status_type: update.report_type === 'DELAY' ? 'delay' :
                             update.report_type === 'CROWDING' ? 'crowding' :
                             update.report_type === 'ON_TIME' ? 'on_time' :
                             update.report_type === 'PLATFORM_CHANGE' ? 'platform' : 'halted',
                status_label: update.report_type === 'DELAY'
                  ? `${update.delay_minutes || 0} min delay`
                  : update.report_type,
                description: update.description || undefined,
                delay_minutes: update.delay_minutes || undefined,
                reported_at: new Date(update.reported_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                }),
                reporter_count: update.confirmed_count,
              }}
              onPress={() => {
                if (update.train_id) {
                  router.push(`/train/${update.train_id}` as any);
                }
              }}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark['bg-base'],
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  skeleton: {
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
});
