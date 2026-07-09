// app/leaderboard.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';

type Period = 'Weekly' | 'Monthly' | 'All Time';

const SCORE_COLORS: Record<string, string> = {
  Excellent: Colors.dark.primary, 'Very Good': Colors.dark.info, Good: Colors.dark.primary, Fair: Colors.dark.accent,
};

function getScoreLabel(score: number): string {
  if (score >= 900) return 'Excellent';
  if (score >= 750) return 'Very Good';
  if (score >= 600) return 'Good';
  return 'Fair';
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<Period>('Weekly');
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const periods: Period[] = ['Weekly', 'Monthly', 'All Time'];

  const { data: leaderboard, isLoading, refetch, error } = useQuery({
    queryKey: ['leaderboard', activePeriod],
    queryFn: async () => {
      const now = new Date();
      let fromDate: string | null = null;
      if (activePeriod === 'Weekly') {
        const d = new Date(now); d.setDate(d.getDate() - 7);
        fromDate = d.toISOString();
      } else if (activePeriod === 'Monthly') {
        const d = new Date(now); d.setMonth(d.getMonth() - 1);
        fromDate = d.toISOString();
      }

      if (fromDate) {
        const { data, error } = await supabase
          .from('community_reports')
          .select('user_id, user:users!community_reports_user_id_fkey(id, display_name, avatar_url, trust_score, report_count)')
          .gte('created_at', fromDate)
          .limit(100);
        if (error) return [];
        const countMap = new Map<string, { user: any; count: number }>();
        for (const row of (data ?? []) as any[]) {
          if (!row.user_id) continue;
          const existing = countMap.get(row.user_id);
          if (existing) existing.count++;
          else countMap.set(row.user_id, { user: row.user, count: 1 });
        }
        const keys = Array.from(countMap.keys());
        return Array.from(countMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)
          .map((entry, i) => ({
            rank: i + 1,
            user_id: keys[i],
            display_name: entry.user?.display_name ?? 'Anonymous',
            trust_score: entry.user?.trust_score ?? 0,
            report_count: entry.count,
          }));
      } else {
        const { data, error } = await supabase
          .from('users')
          .select('id, display_name, trust_score, report_count, avatar_url')
          .order('report_count', { ascending: false })
          .limit(20);
        if (error) return [];
        return (data ?? []).map((u: any, i: number) => ({
          rank: i + 1,
          user_id: u.id,
          display_name: u.display_name ?? 'Anonymous',
          trust_score: u.trust_score ?? 0,
          report_count: u.report_count ?? 0,
        }));
      }
    },
    staleTime: 60_000,
  });

  const currentUserRank = leaderboard?.findIndex(e => e.user_id === user?.id);
  const currentUserEntry = currentUserRank !== undefined && currentUserRank >= 0
    ? leaderboard![currentUserRank]
    : null;

  return (
    <SafeAreaView style={lb.root}>
      <View style={lb.header}>
        <TouchableOpacity style={lb.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={lb.title}>👑 {t('leaderboard.title')}</Text>
          <Text style={lb.subtitle}>{t('leaderboard.sub')}</Text>
        </View>
        <TouchableOpacity style={lb.infoBtn} />
      </View>

      {/* Period tabs */}
      <View style={lb.periodTabs}>
        {periods.map(p => (
          <TouchableOpacity key={p} style={[lb.periodTab, activePeriod === p && lb.periodTabActive]} onPress={() => setActivePeriod(p)}>
            <Text style={[lb.periodText, activePeriod === p && lb.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* My rank */}
      {currentUserEntry ? (
        <View style={lb.myRank}>
          <Text style={lb.myRankNum}>{currentUserEntry.rank}</Text>
          <View style={lb.myRankAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={lb.myRankName}>{currentUserEntry.display_name}</Text>
            <Text style={lb.myRankLevel}>{getScoreLabel(currentUserEntry.trust_score)} Reporter</Text>
          </View>
          <View style={lb.myRankStats}>
            <View style={{ alignItems: 'center' }}>
              <Text style={lb.myRankLabel}>Trust Score</Text>
              <Text style={lb.myRankScore}>✓ {currentUserEntry.trust_score}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={lb.myRankLabel}>Reports</Text>
              <Text style={lb.myRankPoints}>⭐ {currentUserEntry.report_count}</Text>
            </View>
          </View>
        </View>
      ) : user ? (
        <View style={[lb.myRank, { opacity: 0.6 }]}>
          <Text style={lb.myRankNum}>—</Text>
          <View style={lb.myRankAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={lb.myRankName}>{user.display_name ?? 'You'}</Text>
            <Text style={lb.myRankLevel}>Not ranked yet</Text>
          </View>
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={lb.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => { setRefreshing(true); await refetch(); setRefreshing(false); }}
            tintColor={Colors.dark.primary}
          />
        }
      >
        {/* Table header */}
        <View style={lb.tableHeader}>
          <Text style={lb.thNum}>#</Text>
          <Text style={lb.thReporter}>Reporter</Text>
          <Text style={lb.thScore}>Trust Score</Text>
          <Text style={lb.thPoints}>Reports</Text>
        </View>
        <View style={lb.divider} />

        {isLoading ? (
          <View style={{ paddingVertical: Spacing['space-5'], alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
          </View>
        ) : error ? (
          <View style={{ paddingVertical: Spacing['space-5'], alignItems: 'center' }}>
            <Text style={{ color: Colors.dark['text-secondary'], ...Typography['body-sm'] }}>Failed to load leaderboard.</Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: Spacing['space-3'] }}>
              <Text style={{ color: Colors.dark.primary, ...Typography['body-sm'], fontWeight: '600' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !leaderboard?.length ? (
          <View style={{ paddingVertical: Spacing['space-5'], alignItems: 'center' }}>
            <Text style={{ color: Colors.dark['text-secondary'], ...Typography['body-sm'] }}>{t('leaderboard.no_data')}</Text>
          </View>
        ) : (
          /* Rows */
          <View style={lb.tableCard}>
            {leaderboard.map((entry, i) => {
              const rankColor = entry.rank === 1 ? Colors.dark.accent : entry.rank === 2 ? Colors.dark['text-secondary'] : entry.rank === 3 ? Colors.dark.accent : undefined;
              const isMe = entry.user_id === user?.id;
              const scoreLabel = getScoreLabel(entry.trust_score);
              return (
                <View key={entry.user_id + entry.rank}>
                  <View style={[lb.userRow, isMe && lb.userRowMe]}>
                    <View style={[lb.rankCircle, rankColor ? { backgroundColor: rankColor } : {}]}>
                      <Text style={[lb.rankNum, rankColor ? { color: Colors.dark['bg-base'] } : {}]}>{entry.rank}</Text>
                    </View>
                    <View style={lb.userAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={[lb.userName, isMe && { color: Colors.dark.primary }]}>{entry.display_name}</Text>
                      <Text style={lb.userLevel}>{scoreLabel} Reporter</Text>
                    </View>
                    <View style={{ alignItems: 'center', width: 70 }}>
                      <Text style={lb.scoreNum}>{entry.trust_score}</Text>
                      <Text style={[lb.scoreLabel, { color: SCORE_COLORS[scoreLabel] ?? Colors.dark['text-secondary'] }]}>{scoreLabel}</Text>
                    </View>
                    <View style={lb.pointsCol}>
                      <Text style={lb.pointsStar}>⭐</Text>
                      <Text style={lb.pointsVal}>{entry.report_count}</Text>
                    </View>
                  </View>
                  {i < leaderboard.length - 1 && <View style={lb.rowDivider} />}
                </View>
              );
            })}
          </View>
        )}

        <View style={lb.footer}>
          <Text style={lb.footerTime}>
            Last updated: {new Date().toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}
          </Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={lb.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const lb = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-3'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  infoBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16 },
  periodTabs: { flexDirection: 'row', marginHorizontal: Spacing['space-5'], backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border },
  periodTab: { flex: 1, paddingVertical: Spacing['space-3'], alignItems: 'center', borderRadius: Radius['radius-md'] },
  periodTabActive: { backgroundColor: Colors.dark.primary },
  periodText: { ...Typography.body, fontWeight: '500', color: Colors.dark['text-secondary'] },
  periodTextActive: { fontWeight: '700', color: Colors.dark['bg-base'] },
  myRank: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-3'], backgroundColor: Colors.dark['primary-subtle'], borderRadius: 14, borderWidth: 1, borderColor: Colors.dark['primary-dim'], padding: Spacing['space-3'] },
  myRankNum: { fontSize: 20, fontWeight: '800', color: Colors.dark.primary, width: 36, textAlign: 'center' },
  myRankAvatar: { width: 44, height: 44, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 22 },
  myRankName: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  myRankLevel: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  myRankStats: { flexDirection: 'row', gap: Spacing['space-4'] },
  myRankLabel: { fontSize: 9, color: Colors.dark['text-secondary'] },
  myRankScore: { ...Typography.body, fontWeight: '700', color: Colors.dark.primary, marginTop: 2 },
  myRankPoints: { ...Typography.body, fontWeight: '700', color: Colors.dark.accent, marginTop: 2 },
  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['space-3'] },
  thNum: { width: 40, ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-tertiary'] },
  thReporter: { flex: 1, ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-tertiary'] },
  thScore: { width: 70, ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-tertiary'], textAlign: 'center' },
  thPoints: { width: 60, ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-tertiary'], textAlign: 'right' },
  divider: { height: 1, backgroundColor: Colors.dark.border },
  tableCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], padding: Spacing['space-3'] },
  userRowMe: { backgroundColor: Colors.dark['primary-subtle'] },
  rankCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.dark['bg-overlay'], alignItems: 'center', justifyContent: 'center' },
  rankNum: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-secondary'] },
  userAvatar: { width: 36, height: 36, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 18 },
  userName: { ...Typography.body, fontWeight: '600', color: Colors.dark['text-primary'] },
  userLevel: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 1 },
  scoreNum: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  scoreLabel: { ...Typography.caption, fontWeight: '600', marginTop: 2 },
  pointsCol: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60, justifyContent: 'flex-end' },
  pointsStar: { ...Typography['body-sm'] },
  pointsVal: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  rowDivider: { height: 1, backgroundColor: Colors.dark.border, marginHorizontal: Spacing['space-3'] },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTime: { ...Typography.caption, color: Colors.dark['text-tertiary'] },
  refreshText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
});
