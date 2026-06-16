import React, { useMemo, useState } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text,
  FlatList, ActivityIndicator, Alert, Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, ThumbsUp, ChatCircle, ShareNetwork, Flag, CheckCircle } from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import {
  useCommunityReports,
  useVoteReport,
} from '../../hooks/useCommunityReports';
import { useAuthStore } from '../../stores/authStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

const FILTER_KEYS = ['filter_all', 'filter_following', 'filter_verified', 'filter_mine'] as const;
type FilterKey = typeof FILTER_KEYS[number];

// Colors per Master Reference Part 03 Section 3.5 — Community Report Card
// Delay → --color-danger | Crowding → --color-accent | Condition → --color-info
const TYPE_COLORS: Record<string, string> = {
  DELAY:           '#E8394B',
  CROWDING:        '#F5A623',
  COACH_CONDITION: '#4EA8E0',
};

function formatTime(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function CommunityContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { user, isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState<FilterKey>('filter_all');

  const apiFilter = filter === 'filter_verified' ? { type: 'VERIFIED' } :
                    filter === 'filter_mine'     ? { userId: user?.id }   :
                    null;

  const { data: reports, isLoading, refetch } = useCommunityReports(apiFilter as any);
  const { mutate: vote } = useVoteReport();

  const handleVote = (reportId: string, currentVote: 'CONFIRM' | 'DISPUTE' | null) => {
    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
    vote({ reportId, voteType: 'CONFIRM', existingVote: currentVote, activeFilter: apiFilter as any });
  };

  const handleShare = async (reportId: string, text: string) => {
    try { await Share.share({ message: `RailMate Report: ${text}` }); } catch {}
  };

  const handleReport = (reportId: string) => {
    Alert.alert(t('community.report_abuse'), 'This report will be reviewed by our team.', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: 'Submit', style: 'destructive', onPress: () => {} },
    ]);
  };

  const renderCard = ({ item }: { item: any }) => {
    const typeColor = TYPE_COLORS[item.report_type] ?? colors['text-secondary'];
    const typeLabel = t(('community.type_' + (item.report_type ?? '').toLowerCase()) as TranslationKey) || item.report_type;
    const hasVoted = item.current_user_vote === 'CONFIRM';

    return (
      <View style={s.card}>
        <View style={[s.cardAccent, { backgroundColor: typeColor }]} />
        <View style={s.userRow}>
          <Avatar name={item.user?.display_name ?? 'User'} size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={s.userName}>{item.user?.display_name ?? t('auth.guest_user')}</Text>
              {item.user?.is_trusted && (
                <View style={s.trustedBadge}>
                  <CheckCircle size={10} color={colors.primary} weight="fill" />
                  <Text style={s.trustedText}>{t('community.trusted')}</Text>
                </View>
              )}
            </View>
            <Text style={s.trainName}>{item.train?.name_en ?? ''}</Text>
          </View>
          <View style={[s.typeBadge, { backgroundColor: typeColor + '20', borderColor: typeColor + '40' }]}>
            <Text style={[s.typeText, { color: typeColor }]}>{typeLabel}</Text>
          </View>
        </View>

        <Text style={s.body}>{item.description}</Text>

        <View style={s.statsRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={13} color={colors.primary} weight="fill" />
            <Text style={s.stat}>{t('community.confirmed', { count: item.verification_count ?? 0 })}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ThumbsUp size={13} color={colors['text-tertiary']} />
            <Text style={s.stat}>{t('community.helpful_count', { count: item.helpful_count ?? 0 })}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ChatCircle size={13} color={colors['text-tertiary']} />
            <Text style={s.stat}>{item.comment_count ?? 0}</Text>
          </View>
          <Text style={s.time}>{formatTime(item.created_at)}</Text>
        </View>

        <View style={s.actions}>
          <Pressable style={[s.actionBtn, hasVoted && { backgroundColor: colors['primary-subtle'] }]}
            onPress={() => handleVote(item.id, item.current_user_vote)}>
            <ThumbsUp size={16} color={hasVoted ? colors.primary : colors['text-secondary']} weight={hasVoted ? 'fill' : 'regular'} />
            <Text style={[s.actionText, hasVoted && { color: colors.primary }]}>{t('community.helpful')}</Text>
          </Pressable>
          <Pressable style={s.actionBtn} onPress={() => router.push({ pathname: '/report/[id]' as any, params: { id: item.id } })}>
            <ChatCircle size={16} color={colors['text-secondary']} />
            <Text style={s.actionText}>{t('community.comment')}</Text>
          </Pressable>
          <Pressable style={s.actionBtn} onPress={() => handleShare(item.id, item.description)}>
            <ShareNetwork size={16} color={colors['text-secondary']} />
            <Text style={s.actionText}>{t('community.share')}</Text>
          </Pressable>
          <Pressable style={s.actionBtn} onPress={() => handleReport(item.id)}>
            <Flag size={16} color={colors['text-tertiary']} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={s.title}>{t('community.title')}</Text>
          <Text style={s.sub}>{t('community.sub')}</Text>
        </View>
        <Pressable style={s.addBtn} onPress={() => router.push('/report/submit' as any)}>
          <Plus size={20} color={colors['text-inverse']} weight="bold" />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>
        {FILTER_KEYS.map((f) => (
          <Pressable key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>
              {t(('community.' + f) as TranslationKey)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={reports ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: colors['text-tertiary'] }}>
                {t('updates.empty_body')}
              </Text>
            </View>
          }
        />
      )}

      <Pressable style={s.fab} onPress={() => router.push('/report/submit' as any)}>
        <Plus size={20} color={colors['text-inverse']} weight="bold" />
        <Text style={s.fabText}>{t('community.fab_share_update')}</Text>
      </Pressable>
    </View>
  );
}

export default function CommunityScreen() {
  return <ErrorBoundary name="Community"><CommunityContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:             { flex: 1, backgroundColor: colors['bg-base'] },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  title:            { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: colors['text-primary'] },
  sub:              { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], marginTop: 3 },
  addBtn:           { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  filtersRow:       { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterChip:       { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  filterTextActive: { color: colors['text-inverse'] },
  card:             { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14, overflow: 'hidden' },
  cardAccent:       { height: 3 },
  userRow:          { flexDirection: 'row', alignItems: 'flex-start', padding: 16, paddingBottom: 12 },
  userName:         { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  trustedBadge:     { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors['primary-subtle'], borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  trustedText:      { fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.primary },
  trainName:        { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },
  typeBadge:        { borderWidth: 1, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  typeText:         { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  body:             { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-primary'], lineHeight: 22, paddingHorizontal: 16, paddingBottom: 12 },
  statsRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  stat:             { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  time:             { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginLeft: 'auto' },
  actions:          { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 8 },
  actionBtn:        { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center', paddingVertical: 12, borderRadius: 8 },
  actionText:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  fab:              { position: 'absolute', bottom: 90, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 15, elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  fabText:          { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
});
