// app/leaderboard/index.tsx
// Leaderboard — matches Image 4 (app structure, leaderboard screen)
// Ranking by: Trust Score / Helpful Votes / Confirmed Reports
// Filters: This Week / This Month / All Time

import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Crown, Star, ThumbsUp, CheckCircle } from 'phosphor-react-native';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../stores/authStore';
import { ErrorBoundary } from '../../components/ErrorBoundary';

type FilterKey = 'weekly' | 'monthly' | 'all_time';
type SortKey = 'trust_score' | 'helpful_vote_count' | 'report_count';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'weekly',    label: 'This Week' },
  { key: 'monthly',   label: 'This Month' },
  { key: 'all_time',  label: 'All Time' },
];

const SORT_COLS: { key: SortKey; label: string; Icon: any }[] = [
  { key: 'trust_score',        label: 'Trust Score',       Icon: Star },
  { key: 'helpful_vote_count', label: 'Helpful Votes',     Icon: ThumbsUp },
  { key: 'report_count',       label: 'Confirmed Reports', Icon: CheckCircle },
];

interface LeaderEntry {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  trust_score: number;
  helpful_vote_count: number;
  report_count: number;
  is_trusted: boolean;
}

async function fetchLeaderboard(sortCol: SortKey): Promise<LeaderEntry[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, display_name, avatar_url, trust_score, helpful_vote_count, report_count, is_trusted')
    .order(sortCol, { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return (data ?? []) as LeaderEntry[];
}

const MEDAL_COLORS = ['#F5A623', '#98A2B3', '#CD7F32'];
const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];

function LeaderboardContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const s = useMemo(() => createStyles(colors), [colors]);
  const { user: me } = useAuthStore();

  const [filter, setFilter] = useState<FilterKey>('monthly');
  const [sortCol, setSortCol] = useState<SortKey>('trust_score');

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', sortCol],
    queryFn: () => fetchLeaderboard(sortCol),
    staleTime: 60_000,
  });

  const currentSortMeta = SORT_COLS.find(c => c.key === sortCol)!;

  const formatVal = (entry: LeaderEntry) => {
    if (sortCol === 'trust_score') return `${entry.trust_score.toFixed(1)}/5`;
    if (sortCol === 'helpful_vote_count') return String(entry.helpful_vote_count);
    return String(entry.report_count);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <View>
          <Text style={s.title}>Leaderboard</Text>
          <Text style={s.sub}>Top RailMate contributors</Text>
        </View>
      </View>

      {/* Time filters — Weekly / Monthly / All Time */}
      <View style={s.filterRow}>
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[s.filterChip, filter === key && s.filterChipActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[s.filterText, filter === key && s.filterTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Ranking column selector — Trust Score / Helpful Votes / Confirmed Reports */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.sortRow}
      >
        {SORT_COLS.map(({ key, label, Icon }) => (
          <Pressable
            key={key}
            style={[s.sortChip, sortCol === key && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => setSortCol(key)}
          >
            <Icon size={14} color={sortCol === key ? '#fff' : colors['text-secondary']} weight={sortCol === key ? 'fill' : 'regular'} />
            <Text style={[s.sortText, sortCol === key && { color: '#fff' }]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Top 3 podium */}
      {!isLoading && data && data.length >= 3 && (
        <View style={s.podium}>
          {/* 2nd */}
          <View style={[s.podiumSlot, { marginTop: 20 }]}>
            <Text style={s.podiumMedal}>{MEDAL_EMOJIS[1]}</Text>
            <Avatar name={data[1].display_name ?? 'U'} size={48} />
            <Text style={s.podiumName} numberOfLines={1}>{data[1].display_name ?? 'Anonymous'}</Text>
            <Text style={[s.podiumVal, { color: MEDAL_COLORS[1] }]}>{formatVal(data[1])}</Text>
          </View>
          {/* 1st */}
          <View style={s.podiumSlot}>
            <Crown size={22} color={MEDAL_COLORS[0]} weight="fill" style={{ marginBottom: 4 }} />
            <Text style={s.podiumMedal}>{MEDAL_EMOJIS[0]}</Text>
            <Avatar name={data[0].display_name ?? 'U'} size={62} />
            <Text style={s.podiumName} numberOfLines={1}>{data[0].display_name ?? 'Anonymous'}</Text>
            <Text style={[s.podiumVal, { color: MEDAL_COLORS[0] }]}>{formatVal(data[0])}</Text>
          </View>
          {/* 3rd */}
          <View style={[s.podiumSlot, { marginTop: 32 }]}>
            <Text style={s.podiumMedal}>{MEDAL_EMOJIS[2]}</Text>
            <Avatar name={data[2].display_name ?? 'U'} size={44} />
            <Text style={s.podiumName} numberOfLines={1}>{data[2].display_name ?? 'Anonymous'}</Text>
            <Text style={[s.podiumVal, { color: MEDAL_COLORS[2] }]}>{formatVal(data[2])}</Text>
          </View>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 32 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        >
          {/* Rank rows 4+ */}
          {(data ?? []).slice(3).map((entry, i) => {
            const rank = i + 4;
            const isMe = entry.id === me?.id;
            return (
              <View key={entry.id} style={[s.row, isMe && s.rowMe]}>
                <Text style={s.rank}>#{rank}</Text>
                <Avatar name={entry.display_name ?? 'U'} size={40} avatarUrl={entry.avatar_url ?? undefined} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={s.rowName} numberOfLines={1}>
                      {entry.display_name ?? 'Anonymous'}
                    </Text>
                    {entry.is_trusted && (
                      <CheckCircle size={13} color={colors.primary} weight="fill" />
                    )}
                    {isMe && <Text style={s.youTag}>You</Text>}
                  </View>
                  <View style={s.miniStats}>
                    <Text style={s.miniStat}>
                      <Star size={11} color={colors['text-tertiary']} /> {entry.trust_score.toFixed(1)}
                    </Text>
                    <Text style={s.miniStat}>
                      <ThumbsUp size={11} color={colors['text-tertiary']} /> {entry.helpful_vote_count}
                    </Text>
                    <Text style={s.miniStat}>
                      <CheckCircle size={11} color={colors['text-tertiary']} /> {entry.report_count}
                    </Text>
                  </View>
                </View>
                <Text style={[s.rowVal, { color: colors.primary }]}>{formatVal(entry)}</Text>
              </View>
            );
          })}

          {(data ?? []).length === 0 && (
            <Text style={{ textAlign: 'center', color: colors['text-tertiary'], marginTop: 40, fontFamily: 'Inter_400Regular', fontSize: 15 }}>
              No data yet. Be the first to contribute!
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

export default function LeaderboardScreen() {
  return <ErrorBoundary name="Leaderboard"><LeaderboardContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:             { flex: 1, backgroundColor: colors['bg-base'] },
    header:           { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 16 },
    backBtn:          { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    title:            { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: colors['text-primary'] },
    sub:              { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },

    filterRow:        { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 10 },
    filterChip:       { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 8, alignItems: 'center' },
    filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterText:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
    filterTextActive: { color: '#fff' },

    sortRow:          { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
    sortChip:         { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors['bg-card'] },
    sortText:         { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },

    podium:           { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 12, paddingHorizontal: 20, paddingBottom: 20 },
    podiumSlot:       { alignItems: 'center', gap: 4, flex: 1 },
    podiumMedal:      { fontSize: 22 },
    podiumName:       { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors['text-primary'], textAlign: 'center' },
    podiumVal:        { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14 },

    row:              { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 4 },
    rowMe:            { backgroundColor: colors['primary-subtle'], marginHorizontal: -20, paddingHorizontal: 20, borderRadius: 12 },
    rank:             { fontFamily: 'JetBrainsMono_400Regular', fontSize: 14, color: colors['text-tertiary'], width: 32 },
    rowName:          { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'], flex: 1 },
    youTag:           { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.primary, backgroundColor: colors['primary-subtle'], borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
    miniStats:        { flexDirection: 'row', gap: 10, marginTop: 3 },
    miniStat:         { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'] },
    rowVal:           { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16 },
  });
