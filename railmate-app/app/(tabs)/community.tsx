import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { Plus, ThumbsUp, ChatCircle, ShareNetwork, Flag, CheckCircle, Warning, Users, Train, ArrowRight } from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useCommunityReports } from '../../hooks/useCommunityReports';

const C = {
  bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035',
  primary: '#00A859', accent: '#F5A623', danger: '#E8394B', info: '#4EA8E0', purple: '#A855F7',
  textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480',
  border: '#1E2E42',
};

const FILTERS = ['All', 'Following', 'Verified', 'My Posts'] as const;
type Filter = typeof FILTERS[number];

const REPORT_TYPES: Record<string, { label: string; color: string }> = {
  DELAY:    { label: 'Delay',          color: C.accent },
  CROWD:    { label: 'Crowding',       color: C.danger },
  GENERAL:  { label: 'General',        color: C.info   },
  ACCIDENT: { label: 'Incident',       color: C.purple },
  PLATFORM: { label: 'Platform',       color: '#00C977' },
  SCHEDULE: { label: 'Schedule',       color: C.primary },
};

// Rich mock feed data
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

function CommunityCard({ item, onHelpful }: { item: typeof MOCK_FEED[0]; onHelpful: () => void }) {
  const typeInfo = REPORT_TYPES[item.type] ?? { label: item.type, color: C.textSec };

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
                <CheckCircle size={10} color={C.primary} weight="fill" />
                <Text style={card.trustedText}>Trusted</Text>
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
          <CheckCircle size={13} color={C.primary} weight="fill" />
          <Text style={card.stat}>{item.confirmations} confirmed</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ThumbsUp size={13} color={C.textTer} />
          <Text style={card.stat}>{item.helpful} helpful</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ChatCircle size={13} color={C.textTer} />
          <Text style={card.stat}>{item.comments}</Text>
        </View>
        <Text style={card.time}>{item.time}</Text>
      </View>

      {/* Actions */}
      <View style={card.actions}>
        <Pressable style={card.actionBtn} onPress={onHelpful}>
          <ThumbsUp size={16} color={C.textSec} />
          <Text style={card.actionText}>Helpful</Text>
        </Pressable>
        <Pressable style={card.actionBtn}>
          <ChatCircle size={16} color={C.textSec} />
          <Text style={card.actionText}>Comment</Text>
        </Pressable>
        <Pressable style={card.actionBtn}>
          <ShareNetwork size={16} color={C.textSec} />
          <Text style={card.actionText}>Share</Text>
        </Pressable>
        <Pressable style={card.actionBtn}>
          <Flag size={16} color={C.textTer} />
        </Pressable>
      </View>
    </View>
  );
}

function CommunityContent() {
  const [filter, setFilter] = useState<Filter>('All');
  const { data: reports, isLoading } = useCommunityReports();
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Community</Text>
          <Text style={s.sub}>Live reports from travelers</Text>
        </View>
        <Pressable style={s.addBtn}>
          <Plus size={20} color="#fff" weight="bold" />
        </Pressable>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>
        {FILTERS.map((f) => (
          <Pressable key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>{f}</Text>
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
            onHelpful={() => setHelpful((h) => ({ ...h, [item.id]: !h[item.id] }))}
          />
        )}
        ListFooterComponent={
          isLoading ? <ActivityIndicator color={C.primary} style={{ marginTop: 20 }} /> : null
        }
      />

      {/* FAB */}
      <Pressable style={s.fab}>
        <Plus size={20} color="#fff" weight="bold" />
        <Text style={s.fabText}>Share Update</Text>
      </Pressable>
    </View>
  );
}

export default function CommunityScreen() {
  return <ErrorBoundary name="Community"><CommunityContent /></ErrorBoundary>;
}

const s = StyleSheet.create({
  root:            { flex: 1, backgroundColor: C.bg },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:           { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: C.textPri },
  sub:             { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec, marginTop: 3 },
  addBtn:          { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  filtersRow:      { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterChip:      { borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChipActive:{ backgroundColor: C.primary, borderColor: C.primary },
  filterText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec },
  filterTextActive:{ color: '#fff' },
  fab:             { position: 'absolute', bottom: 90, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 15, elevation: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  fabText:         { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' },
});

const card = StyleSheet.create({
  root:         { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 14, overflow: 'hidden' },
  topAccent:    { height: 3 },
  userRow:      { flexDirection: 'row', alignItems: 'flex-start', padding: 16, paddingBottom: 12 },
  userName:     { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.textPri },
  trustedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: C.primary + '18', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  trustedText:  { fontFamily: 'Inter_500Medium', fontSize: 10, color: C.primary },
  trainName:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec, marginTop: 2 },
  route:        { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer },
  typeBadge:    { borderWidth: 1, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  typeText:     { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.2 },
  body:         { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textPri, lineHeight: 22, paddingHorizontal: 16, paddingBottom: 12 },
  statsRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  stat:         { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer },
  time:         { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer, marginLeft: 'auto' },
  actions:      { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.border, paddingHorizontal: 8 },
  actionBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center', paddingVertical: 12 },
  actionText:   { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec },
});
