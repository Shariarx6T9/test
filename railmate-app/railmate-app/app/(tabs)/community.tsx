import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { AppText } from '../../components/ui/AppText';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { ReportCard, SignInPrompt } from '../../components/features';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export default function CommunityScreen() {
  const { user, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<'recent' | 'my'>('recent');

  // Filter for my reports if user is logged in
  const filter = activeTab === 'my' && user?.id ? { userId: user.id } : null;
  const { data: reports = [], isLoading } = useCommunityReports(filter);

  // Guest users see sign-in prompt
  if (isGuest) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <SignInPrompt message="Sign in to join the community and report train status" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="h1" style={styles.title}>Community</AppText>
        <AppText variant="body" color={Colors.dark['text-secondary']}>
          Share and view real-time train updates
        </AppText>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'recent' && styles.tabActive]}
          onPress={() => setActiveTab('recent')}
        >
          <AppText
            variant="labelLg"
            color={activeTab === 'recent' ? Colors.dark.primary : Colors.dark['text-secondary']}
          >
            Recent Reports
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <AppText
            variant="labelLg"
            color={activeTab === 'my' ? Colors.dark.primary : Colors.dark['text-secondary']}
          >
            My Reports
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <>
            <Skeleton width="100%" height={120} style={styles.skeleton} />
            <Skeleton width="100%" height={120} style={styles.skeleton} />
            <Skeleton width="100%" height={120} style={styles.skeleton} />
          </>
        ) : reports.length === 0 ? (
          <EmptyState
            iconName="Users"
            title={activeTab === 'my' ? 'No reports yet' : 'No community reports'}
            description={
              activeTab === 'my'
                ? 'Report train status to help fellow travelers'
                : 'Be the first to report train status'
            }
          />
        ) : (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isBengali={false}
              onVote={(id, type) => {
                // TODO: Implement voting
              }}
              currentUserId={user?.id}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginRight: Spacing.lg,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  skeleton: {
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
});
