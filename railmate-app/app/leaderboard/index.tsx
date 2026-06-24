// app/leaderboard.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

type Period = 'Weekly' | 'Monthly' | 'All Time';

interface LeaderboardUser {
  rank: number;
  name: string;
  level: string;
  trustScore: number;
  scoreLabel: string;
  points: string;
  rankColor?: string;
  isMe?: boolean;
}

const USERS: LeaderboardUser[] = [
  { rank: 1, name: 'Farhan Ahmed', level: 'Level 5 • Expert Reporter', trustScore: 950, scoreLabel: 'Excellent', points: '2,840', rankColor: C.gold },
  { rank: 2, name: 'Ayesha Akter', level: 'Level 4 • Trusted Reporter', trustScore: 920, scoreLabel: 'Excellent', points: '2,520', rankColor: C.text2 },
  { rank: 3, name: 'Raihan Uddin', level: 'Level 4 • Trusted Reporter', trustScore: 880, scoreLabel: 'Excellent', points: '2,310', rankColor: C.orange },
  { rank: 4, name: 'Mehedi Hasan', level: 'Level 4 • Trusted Reporter', trustScore: 850, scoreLabel: 'Very Good', points: '2,150' },
  { rank: 5, name: 'Arif Hossain', level: 'Level 3 • Reliable Reporter', trustScore: 760, scoreLabel: 'Very Good', points: '1,860' },
  { rank: 6, name: 'Sadia Islam', level: 'Level 3 • Reliable Reporter', trustScore: 720, scoreLabel: 'Good', points: '1,540' },
  { rank: 7, name: 'Tahsin Rahman', level: 'Level 3 • Reliable Reporter', trustScore: 680, scoreLabel: 'Good', points: '1,420' },
  { rank: 8, name: 'Najmul Hasan', level: 'Level 4 • Trusted Reporter', trustScore: 810, scoreLabel: 'Very Good', points: '1,240', isMe: true },
  { rank: 9, name: 'Fahim Rahat', level: 'Level 2 • Active Reporter', trustScore: 620, scoreLabel: 'Good', points: '1,020' },
  { rank: 10, name: 'Nusrat Jahan', level: 'Level 2 • Active Reporter', trustScore: 580, scoreLabel: 'Fair', points: '860' },
];

const SCORE_COLORS: Record<string, string> = {
  Excellent: C.green, 'Very Good': C.blue, Good: C.green, Fair: C.orange,
};

export default function LeaderboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('Weekly');
  const periods: Period[] = ['Weekly', 'Monthly', 'All Time'];

  return (
    <SafeAreaView style={lb.root}>
      <View style={lb.header}>
        <TouchableOpacity style={lb.backBtn} onPress={() => router.back()} />
        <View style={{ alignItems: 'center' }}>
          <Text style={lb.title}>👑 Leaderboard</Text>
          <Text style={lb.subtitle}>Top contributors in the RailMate community</Text>
        </View>
        <TouchableOpacity style={lb.infoBtn} />
      </View>

      {/* Period tabs */}
      <View style={lb.periodTabs}>
        {periods.map(p => (
          <TouchableOpacity key={p} style={[lb.periodTab, period === p && lb.periodTabActive]} onPress={() => setPeriod(p)}>
            <Text style={[lb.periodText, period === p && lb.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* My rank */}
      <View style={lb.myRank}>
        <Text style={lb.myRankNum}>8</Text>
        <View style={lb.myRankAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={lb.myRankName}>Najmul Hasan</Text>
          <Text style={lb.myRankLevel}>Trusted Reporter</Text>
        </View>
        <View style={lb.myRankStats}>
          <View style={{ alignItems: 'center' }}>
            <Text style={lb.myRankLabel}>Trust Score</Text>
            <Text style={lb.myRankScore}>✓ 810</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={lb.myRankLabel}>Points</Text>
            <Text style={lb.myRankPoints}>⭐ 1,240</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={lb.scroll}>
        {/* Table header */}
        <View style={lb.tableHeader}>
          <Text style={lb.thNum}>#</Text>
          <Text style={lb.thReporter}>Reporter</Text>
          <Text style={lb.thScore}>Trust Score</Text>
          <Text style={lb.thPoints}>Points</Text>
        </View>
        <View style={lb.divider} />

        {/* Rows */}
        <View style={lb.tableCard}>
          {USERS.map((user, i) => (
            <View key={user.rank}>
              <View style={[lb.userRow, user.isMe && lb.userRowMe]}>
                <View style={[lb.rankCircle, user.rankColor ? { backgroundColor: user.rankColor } : {}]}>
                  <Text style={[lb.rankNum, user.rankColor ? { color: C.bg } : {}]}>{user.rank}</Text>
                </View>
                <View style={lb.userAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={[lb.userName, user.isMe && { color: C.green }]}>{user.name}</Text>
                  <Text style={lb.userLevel}>{user.level}</Text>
                </View>
                <View style={{ alignItems: 'center', width: 70 }}>
                  <Text style={lb.scoreNum}>{user.trustScore}</Text>
                  <Text style={[lb.scoreLabel, { color: SCORE_COLORS[user.scoreLabel] }]}>{user.scoreLabel}</Text>
                </View>
                <View style={lb.pointsCol}>
                  <Text style={lb.pointsStar}>⭐</Text>
                  <Text style={lb.pointsVal}>{user.points}</Text>
                </View>
              </View>
              {i < USERS.length - 1 && <View style={lb.rowDivider} />}
            </View>
          ))}
        </View>

        <View style={lb.footer}>
          <Text style={lb.footerTime}>Last updated: May 21, 2025 09:30 AM</Text>
          <TouchableOpacity><Text style={lb.refreshText}>Refresh</Text></TouchableOpacity>
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
