import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useAuth } from '../../hooks/useAuth';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button/Button';
import { StationInput } from '../../components/ui/StationInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { QuickActionsGrid, LiveUpdateCard, SavedRouteCard, SignInPrompt } from '../../components/features';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { useSearchStore } from '../../stores/searchStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isGuest, displayName } = useAuth();
  const { fromStation, toStation, date, setFromStation, setToStation, setDate } = useSearchStore();
  const { savedRoutes, loading: routesLoading } = useSavedRoutes();
  const { data: liveUpdates = [], isLoading: updatesLoading } = useCommunityReports(null);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Today's date
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleSearch = () => {
    if (fromStation && toStation) {
      router.push('/search/results' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View>
              <AppText variant="h1" style={styles.greeting}>
                {greeting} {!isGuest && '👋'}
              </AppText>
              <AppText variant="body" color={Colors.dark['text-secondary']}>
                {displayName}
              </AppText>
            </View>
            {/* Dev-only Showcase button */}
            {__DEV__ && (
              <Pressable
                onPress={() => router.push('/showcase' as any)}
                style={styles.showcaseButton}
              >
                <AppText variant="label" color={Colors.dark.primary}>🎨 Showcase</AppText>
              </Pressable>
            )}
          </View>
          <AppText variant="caption" color={Colors.dark['text-tertiary']} style={styles.date}>
            {today}
          </AppText>
        </View>

        {/* Search Card */}
        <View style={styles.section}>
          <View style={styles.searchCard}>
            <AppText variant="h3" style={styles.sectionTitle}>Search Trains</AppText>

            <View style={styles.stationInputs}>
              <StationInput
                type="from"
                station={fromStation ? {
                  name_en: fromStation.name_en,
                  name_bn: fromStation.name_bn,
                  subtitle: fromStation.division || undefined,
                } : null}
                onPress={() => router.push('/(tabs)/search' as any)}
                onClear={() => setFromStation(null)}
              />

              <View style={styles.stationDivider} />

              <StationInput
                type="to"
                station={toStation ? {
                  name_en: toStation.name_en,
                  name_bn: toStation.name_bn,
                  subtitle: toStation.division || undefined,
                } : null}
                onPress={() => router.push('/(tabs)/search' as any)}
                onClear={() => setToStation(null)}
              />
            </View>

            <Button
              variant="primary"
              size="lg"
              label="Search Trains"
              iconLeft={<MagnifyingGlass size={20} color={Colors.dark['text-inverse']} weight="bold" />}
              onPress={handleSearch}
              disabled={!fromStation || !toStation}
              fullWidth
              style={styles.searchButton}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>Quick Actions</AppText>
          <QuickActionsGrid />
        </View>

        {/* Saved Routes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3">Your Saved Routes</AppText>
            {savedRoutes.length > 0 && (
              <Pressable onPress={() => router.push('/(tabs)/profile' as any)}>
                <AppText variant="label" color={Colors.dark.primary}>View All</AppText>
              </Pressable>
            )}
          </View>

          {routesLoading ? (
            <View style={styles.horizontalList}>
              <Skeleton width={180} height={120} style={styles.routeCardSkeleton} />
              <Skeleton width={180} height={120} style={styles.routeCardSkeleton} />
            </View>
          ) : savedRoutes.length === 0 && isGuest ? (
            <SignInPrompt message="Sign in to save your favorite routes" compact />
          ) : savedRoutes.length === 0 ? (
            <EmptyState
              iconName="BookmarkSimple"
              title="No saved routes yet"
              description="Save routes for quick access"
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {savedRoutes.slice(0, 5).map((route) => (
                <SavedRouteCard
                  key={route.id}
                  from_en={route.fromStation.name_en}
                  from_bn={route.fromStation.name_bn}
                  to_en={route.toStation.name_en}
                  to_bn={route.toStation.name_bn}
                  last_viewed={route.savedAt}
                  onPress={() => {
                    setFromStation(route.fromStation);
                    setToStation(route.toStation);
                    router.push('/(tabs)/search' as any);
                  }}
                  onUnsave={() => {
                    // TODO: Implement unsave
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Live Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3">Live Updates</AppText>
            {liveUpdates.length > 0 && (
              <Pressable onPress={() => router.push('/(tabs)/live-updates' as any)}>
                <AppText variant="label" color={Colors.dark.primary}>See All</AppText>
              </Pressable>
            )}
          </View>

          {updatesLoading ? (
            <>
              <Skeleton width="100%" height={100} style={styles.updateSkeleton} />
              <Skeleton width="100%" height={100} style={styles.updateSkeleton} />
            </>
          ) : liveUpdates.length === 0 ? (
            <EmptyState
              iconName="Activity"
              title="No live updates"
              description="Check back soon for real-time train updates"
            />
          ) : (
            liveUpdates.slice(0, 3).map((update) => (
              <LiveUpdateCard
                key={update.id}
                update={{
                  train_name: update.train_name ?? 'Unknown Train',
                  train_number: update.train_number ?? 'N/A',
                  route_from: 'Station A', // TODO: Get from joined data
                  route_to: 'Station B',
                  status_type: update.report_type === 'DELAY' ? 'delay' :
                               update.report_type === 'CROWDING' ? 'crowding' : 'on_time',
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
        </View>

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
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  hero: {
    paddingVertical: Spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  greeting: {
    marginBottom: Spacing.xs,
  },
  showcaseButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.dark['primary-subtle'],
    borderRadius: 8,
  },
  date: {
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  searchCard: {
    backgroundColor: Colors.dark['bg-card'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: Spacing.base,
  },
  stationInputs: {
    marginBottom: Spacing.base,
  },
  stationDivider: {
    height: Spacing.md,
  },
  searchButton: {
    marginTop: Spacing.sm,
  },
  horizontalList: {
    gap: Spacing.md,
    paddingRight: Spacing.base,
  },
  routeCardSkeleton: {
    borderRadius: 12,
  },
  updateSkeleton: {
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
});
