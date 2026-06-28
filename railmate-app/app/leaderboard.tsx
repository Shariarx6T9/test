// app/leaderboard.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';

type Period = 'Weekly' | 'Monthly' | 'All Time';

const SCORE_COLORS: Record<string, string> = {
  Excellent: C.green, 'Very Good': C.blue, Good: C.green, Fair: C.orange,
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
        <TouchableOpacity style={lb.backBtn} onPress={() => router.back()} />
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
            tintColor={C.green}
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
          <View style={{ paddingVertical: S.xl, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={C.green} />
          </View>
        ) : error ? (
          <View style={{ paddingVertical: S.xl, alignItems: 'center' }}>
            <Text style={{ color: C.text2, fontSize: T.sm }}>Failed to load leaderboard.</Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: S.md }}>
              <Text style={{ color: C.green, fontSize: T.sm, fontWeight: '600' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !leaderboard?.length ? (
          <View style={{ paddingVertical: S.xl, alignItems: 'center' }}>
            <Text style={{ color: C.text2, fontSize: T.sm }}>{t('leaderboard.no_data')}</Text>
          </View>
        ) : (
          /* Rows */
          <View style={lb.tableCard}>
            {leaderboard.map((entry, i) => {
              const rankColor = entry.rank === 1 ? C.gold : entry.rank === 2 ? C.text2 : entry.rank === 3 ? C.orange : undefined;
              const isMe = entry.user_id === user?.id;
              const scoreLabel = getScoreLabel(entry.trust_score);
              return (
                <View key={entry.user_id + entry.rank}>
                  <View style={[lb.userRow, isMe && lb.userRowMe]}>
                    <View style={[lb.rankCircle, rankColor ? { backgroundColor: rankColor } : {}]}>
                      <Text style={[lb.rankNum, rankColor ? { color: C.bg } : {}]}>{entry.rank}</Text>
                    </View>
                    <View style={lb.userAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={[lb.userName, isMe && { color: C.green }]}>{entry.display_name}</Text>
                      <Text style={lb.userLevel}>{scoreLabel} Reporter</Text>
                    </View>
                    <View style={{ alignItems: 'center', width: 70 }}>
                      <Text style={lb.scoreNum}>{entry.trust_score}</Text>
                      <Text style={[lb.scoreLabel, { color: SCORE_COLORS[scoreLabel] ?? C.text2 }]}>{scoreLabel}</Text>
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
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.md, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  infoBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  periodTabs: { flexDirection: 'row', marginHorizontal: S.xl, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border },
  periodTab: { flex: 1, paddingVertical: S.md, alignItems: 'center', borderRadius: R.md },
  periodTabActive: { backgroundColor: C.green },
  periodText: { fontSize: T.base, fontWeight: '500', color: C.text2 },
  periodTextActive: { fontWeight: '700', color: C.bg },
  myRank: { flexDirection: 'row', alignItems: 'center', gap: S.md, marginHorizontal: S.xl, marginTop: S.md, backgroundColor: C.greenTint, borderRadius: 14, borderWidth: 1, borderColor: C.greenDark, padding: S.md },
  myRankNum: { fontSize: 20, fontWeight: '800', color: C.green, width: 36, textAlign: 'center' },
  myRankAvatar: { width: 44, height: 44, backgroundColor: C.surface2, borderRadius: 22 },
  myRankName: { fontSize: T.base, fontWeight: '700', color: C.white },
  myRankLevel: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  myRankStats: { flexDirection: 'row', gap: S.lg },
  myRankLabel: { fontSize: 9, color: C.text2 },
  myRankScore: { fontSize: T.base, fontWeight: '700', color: C.green, marginTop: 2 },
  myRankPoints: { fontSize: T.base, fontWeight: '700', color: C.gold, marginTop: 2 },
  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.md },
  thNum: { width: 40, fontSize: T.sm, fontWeight: '700', color: C.text3 },
  thReporter: { flex: 1, fontSize: T.sm, fontWeight: '700', color: C.text3 },
  thScore: { width: 70, fontSize: T.sm, fontWeight: '700', color: C.text3, textAlign: 'center' },
  thPoints: { width: 60, fontSize: T.sm, fontWeight: '700', color: C.text3, textAlign: 'right' },
  divider: { height: 1, backgroundColor: C.border },
  tableCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm, padding: S.md },
  userRowMe: { backgroundColor: C.greenTint },
  rankCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' },
  rankNum: { fontSize: T.sm, fontWeight: '700', color: C.text2 },
  userAvatar: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  userName: { fontSize: T.base, fontWeight: '600', color: C.white },
  userLevel: { fontSize: T.xs, color: C.text2, marginTop: 1 },
  scoreNum: { fontSize: T.base, fontWeight: '700', color: C.white },
  scoreLabel: { fontSize: T.xs, fontWeight: '600', marginTop: 2 },
  pointsCol: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60, justifyContent: 'flex-end' },
  pointsStar: { fontSize: T.sm },
  pointsVal: { fontSize: T.base, fontWeight: '700', color: C.white },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: S.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTime: { fontSize: T.xs, color: C.text3 },
  refreshText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
