import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

const TAB_KEYS = ['weekly', 'monthly', 'all_time'] as const;
type TabKey = typeof TAB_KEYS[number];

// Mock leaderboard data — placeholder pending live RailPoints API
const DATA = [
  { rank: 1, name: 'Rahim U.', points: 2840, reports: 42, badge: '🥇', isYou: false },
  { rank: 2, name: 'Fatema B.', points: 2210, reports: 35, badge: '🥈', isYou: false },
  { rank: 3, name: 'Karim H.', points: 1980, reports: 31, badge: '🥉', isYou: false },
  { rank: 4, name: 'Sumaiya R.', points: 1540, reports: 24, badge: '', isYou: false },
  { rank: 5, name: 'Noor Islam', points: 1320, reports: 20, badge: '', isYou: false },
  { rank: 6, name: 'You', points: 980, reports: 15, badge: '', isYou: true },
  { rank: 7, name: 'Anwar S.', points: 870, reports: 13, badge: '', isYou: false },
  { rank: 8, name: 'Rubina K.', points: 750, reports: 11, badge: '', isYou: false },
];

const PODIUM_COLORS = ['#F5A623', '#8FA3C0', '#C87941'];

export default function LeaderboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);
  const [tab, setTab] = useState<TabKey>('weekly');

  const top3 = DATA.slice(0, 3);
  const rest = DATA.slice(3);

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={colors['text-primary']} weight="bold" /></Pressable>
        <Text style={s.title}>{t('leaderboard.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.tabs}>
        {TAB_KEYS.map((tk) => (
          <Pressable key={tk} style={[s.tab, tab === tk && s.tabActive]} onPress={() => setTab(tk)}>
            <Text style={[s.tabText, tab === tk && s.tabTextActive]}>{t(`leaderboard.${tk}` as TranslationKey)}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={s.podium}>
          {[top3[1], top3[0], top3[2]].map((u, i) => {
            const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const h = realRank === 1 ? 110 : realRank === 2 ? 80 : 70;
            return (
              <View key={u.rank} style={[s.podiumCol, { marginTop: realRank === 1 ? 0 : 30 }]}>
                <Text style={s.podiumBadge}>{u.badge}</Text>
                <Avatar name={u.name} size={realRank === 1 ? 56 : 44} />
                <Text style={s.podiumName} numberOfLines={1}>{u.isYou ? t('leaderboard.you') : u.name}</Text>
                <Text style={s.podiumPts}>{u.points}</Text>
                <View style={[s.podiumBar, { height: h, backgroundColor: PODIUM_COLORS[realRank - 1] + '30', borderColor: PODIUM_COLORS[realRank - 1] + '60' }]}>
                  <Text style={[s.podiumRank, { color: PODIUM_COLORS[realRank - 1] }]}>#{realRank}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Rest */}
        <View style={{ paddingHorizontal: 20 }}>
          {rest.map((u) => (
            <View key={u.rank} style={[s.row, u.isYou && s.rowYou]}>
              <Text style={[s.rankNum, u.isYou && { color: colors.primary }]}>#{u.rank}</Text>
              <Avatar name={u.name} size={36} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[s.rowName, u.isYou && { color: colors.primary }]}>
                  {u.isYou ? `${u.name} (${t('leaderboard.you')})` : u.name}
                </Text>
                <Text style={s.rowReports}>{t('leaderboard.reports_count', { count: u.reports })}</Text>
              </View>
              <View style={s.ptsBadge}>
                <Star size={11} color={colors.accent} weight="fill" />
                <Text style={s.pts}>{u.points}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors['bg-base'] },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:         { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  tabs:          { flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 4, marginBottom: 24 },
  tab:           { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  tabActive:     { backgroundColor: colors.primary },
  tabText:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  tabTextActive: { color: colors['text-inverse'], fontFamily: 'Inter_600SemiBold' },
  podium:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 28, gap: 8 },
  podiumCol:     { flex: 1, alignItems: 'center' },
  podiumBadge:   { fontSize: 22, marginBottom: 6 },
  podiumName:    { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors['text-primary'], marginTop: 6, marginBottom: 2, textAlign: 'center' },
  podiumPts:     { fontFamily: 'JetBrainsMono_500Medium', fontSize: 13, color: colors.accent, marginBottom: 8 },
  podiumBar:     { width: '100%', borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 },
  podiumRank:    { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18 },
  row:           { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8 },
  rowYou:        { borderColor: colors.primary, backgroundColor: colors['primary-subtle'] },
  rankNum:       { fontFamily: 'JetBrainsMono_500Medium', fontSize: 14, color: colors['text-tertiary'], width: 32 },
  rowName:       { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  rowReports:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginTop: 1 },
  ptsBadge:      { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accent + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  pts:           { fontFamily: 'JetBrainsMono_500Medium', fontSize: 13, color: colors.accent },
});
