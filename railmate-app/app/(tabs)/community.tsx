import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ThumbsUp, ChatCircle, ShareNetwork, Flag, CheckCircle } from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

const FILTER_KEYS = ['filter_all', 'filter_following', 'filter_verified', 'filter_mine'] as const;
type FilterKey = typeof FILTER_KEYS[number];

// Rich mock feed data — placeholder pending live community reports API
const MOCK_FEED = [
  {
    id: '1', user: 'Rahim Uddin', avatar: null, badge: '🟢', trusted: true,
    train: 'Subarna Express #721', route: 'Dhaka → Chattogram',
    type: 'DELAY', text: 'Train is currently 25 minutes late due to track maintenance at Comilla. Platform 3, likely to depart 07:05.',
    time: '5 min ago', confirmations: 14, helpful: 32, comments: 7,
  },
  {
    id: '2', user: 'Fatema B.', avatar: null, badge: '🔵', trusted: false,
    train: 'Turna Express #762', route: 'Dhaka → Sylhet',
    type: 'CROWD', text: 'Extremely crowded at Kamalapur. S-Chair coaches full. Consider AC coach if available.',
    time: '18 min ago', confirmations: 9, helpful: 21, comments: 3,
  },
  {
    id: '3', user: 'Karim Hossain', avatar: null, badge: '🟡', trusted: true,
    train: 'Mahanagar Exp #236', route: 'Dhaka → Narayanganj',
    type: 'PLATFORM', text: 'Platform changed from 4 to 6 last minute. Announcement made only in Bengali. Heads up for non-Bengali speakers.',
    time: '34 min ago', confirmations: 6, helpful: 18, comments: 2,
  },
];

function CommunityCard({ item, onHelpful, colors, t }: {
  item: typeof MOCK_FEED[0];
  onHelpful: () => void;
  colors: ThemeColors;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  const card = useMemo(() => createCardStyles(colors), [colors]);

  const REPORT_TYPES: Record<string, { label: string; color: string }> = {
    DELAY:    { label: t('community.type_delay'),    color: colors.accent },
    CROWD:    { label: t('community.type_crowding'), color: colors.danger },
    GENERAL:  { label: t('community.type_general'),  color: colors.info },
    ACCIDENT: { label: t('community.type_incident'), color: '#A855F7' },
    PLATFORM: { label: t('community.type_platform'), color: colors.success },
    SCHEDULE: { label: t('community.type_schedule'), color: colors.primary },
  };

  const typeInfo = REPORT_TYPES[item.type] ?? { label: item.type, color: colors['text-secondary'] };

  return (
    <View style={card.root}>
      <View style={[card.topAccent, { backgroundColor: typeInfo.color }]} />

      {/* User row */}
      <View style={card.userRow}>
        <Avatar name={item.user} size={40} badge={item.badge} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={card.userName}>{item.user}</Text>
            {item.trusted && (
              <View style={card.trustedBadge}>
                <CheckCircle size={10} color={colors.primary} weight="fill" />
                <Text style={card.trustedText}>{t('community.trusted')}</Text>
              </View>
            )}
          </View>
          <Text style={card.trainName}>{item.train}</Text>
          <Text style={card.route}>{item.route}</Text>
        </View>
        <View style={[card.typeBadge, { backgroundColor: typeInfo.color + '20', borderColor: typeInfo.color + '40' }]}>
          <Text style={[card.typeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
        </View>
      </View>

      {/* Report text */}
      <Text style={card.body}>{item.text}</Text>

      {/* Stats */}
      <View style={card.statsRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <CheckCircle size={13} color={colors.primary} weight="fill" />
          <Text style={card.stat}>{t('community.confirmed', { count: item.confirmations })}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ThumbsUp size={13} color={colors['text-tertiary']} />
          <Text style={card.stat}>{t('community.helpful_count', { count: item.helpful })}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ChatCircle size={13} color={colors['text-tertiary']} />
          <Text style={card.stat}>{item.comments}</Text>
        </View>
        <Text style={card.time}>{item.time}</Text>
      </View>

      {/* Actions */}
      <View style={card.actions}>
        <Pressable style={card.actionBtn} onPress={onHelpful}>
          <ThumbsUp size={16} color={colors['text-secondary']} />
          <Text style={card.actionText}>{t('community.helpful')}</Text>
        </Pressable>
        <Pressable style={card.actionBtn}>
          <ChatCircle size={16} color={colors['text-secondary']} />
          <Text style={card.actionText}>{t('community.comment')}</Text>
        </Pressable>
        <Pressable style={card.actionBtn}>
          <ShareNetwork size={16} color={colors['text-secondary']} />
          <Text style={card.actionText}>{t('community.share')}</Text>
        </Pressable>
        <Pressable style={card.actionBtn}>
          <Flag size={16} color={colors['text-tertiary']} />
        </Pressable>
      </View>
    </View>
  );
}

function CommunityContent() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const [filter, setFilter] = useState<FilterKey>('filter_all');
  const { isLoading } = useCommunityReports();
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={s.title}>{t('community.title')}</Text>
          <Text style={s.sub}>{t('community.sub')}</Text>
        </View>
        <Pressable style={s.addBtn}>
          <Plus size={20} color={colors['text-inverse']} weight="bold" />
        </Pressable>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>
        {FILTER_KEYS.map((f) => (
          <Pressable key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>{t(`community.${f}` as TranslationKey)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Feed */}
      <FlatList
        data={MOCK_FEED}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CommunityCard
            item={item}
            colors={colors}
            t={t}
            onHelpful={() => setHelpful((h) => ({ ...h, [item.id]: !h[item.id] }))}
          />
        )}
        ListFooterComponent={
          isLoading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} /> : null
        }
      />

      {/* FAB */}
      <Pressable style={s.fab}>
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
  root:            { flex: 1, backgroundColor: colors['bg-base'] },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  title:           { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: colors['text-primary'] },
  sub:             { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], marginTop: 3 },
  addBtn:          { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  filtersRow:      { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterChip:      { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChipActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  filterTextActive:{ color: colors['text-inverse'] },
  fab:             { position: 'absolute', bottom: 90, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 15, elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  fabText:         { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
});

const createCardStyles = (colors: ThemeColors) => StyleSheet.create({
  root:         { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14, overflow: 'hidden' },
  topAccent:    { height: 3 },
  userRow:      { flexDirection: 'row', alignItems: 'flex-start', padding: 16, paddingBottom: 12 },
  userName:     { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  trustedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors['primary-subtle'], borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  trustedText:  { fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.primary },
  trainName:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },
  route:        { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  typeBadge:    { borderWidth: 1, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  typeText:     { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.2 },
  body:         { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-primary'], lineHeight: 22, paddingHorizontal: 16, paddingBottom: 12 },
  statsRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  stat:         { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  time:         { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginLeft: 'auto' },
  actions:      { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 8 },
  actionBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center', paddingVertical: 12 },
  actionText:   { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
});
