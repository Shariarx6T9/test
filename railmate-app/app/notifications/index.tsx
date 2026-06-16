import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, BellSimple, Warning, Users, CheckCircle, Calendar, Trash } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

const GROUP_KEYS = ['all', 'delay', 'crowding', 'verified', 'schedule'] as const;
type GroupKey = typeof GROUP_KEYS[number];

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  // Mock notification feed — placeholder pending live notifications API
  const NOTIFICATIONS = useMemo(() => [
    { id: '1', groupKey: 'delay' as GroupKey, icon: Warning, color: colors.accent, title: 'Subarna Express delayed', body: '25 min delay reported by 8 travelers on the Dhaka–Chattogram route.', time: '5m ago', read: false },
    { id: '2', groupKey: 'crowding' as GroupKey, icon: Users, color: colors.danger, title: 'High crowding — Turna Express', body: 'S-Chair coaches full. Consider AC coach if available.', time: '18m ago', read: false },
    { id: '3', groupKey: 'verified' as GroupKey, icon: CheckCircle, color: colors.primary, title: 'Your report was verified', body: 'Your delay report for Mahanagar Express was confirmed by 5 travelers.', time: '1h ago', read: true },
    { id: '4', groupKey: 'schedule' as GroupKey, icon: Calendar, color: colors.info, title: 'Schedule change — Parabat Exp', body: 'Departure time changed from 10:30 to 11:00 for tomorrow.', time: '3h ago', read: true },
    { id: '5', groupKey: 'delay' as GroupKey, icon: Warning, color: colors.accent, title: 'Egarosindhur Express — 40 min', body: 'Long delay due to signal failure near Narsingdi.', time: '5h ago', read: true },
  ], [colors]);

  const [filter, setFilter] = useState<GroupKey>('all');
  const filtered = NOTIFICATIONS.filter((n) => filter === 'all' || n.groupKey === filter);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <View>
          <Text style={s.title}>{t('notifications.title')}</Text>
          {unread > 0 && <Text style={s.unreadCount}>{t('notifications.unread', { count: unread })}</Text>}
        </View>
        <Pressable hitSlop={12}><Trash size={20} color={colors['text-tertiary']} /></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
        {GROUP_KEYS.map((g) => (
          <Pressable key={g} style={[s.filterChip, filter === g && s.filterActive]} onPress={() => setFilter(g)}>
            <Text style={[s.filterText, filter === g && s.filterActiveText]}>{t(`notifications.${g}` as TranslationKey)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <BellSimple size={48} color={colors['text-tertiary']} weight="thin" />
            <Text style={s.emptyText}>{t('notifications.empty')}</Text>
          </View>
        ) : filtered.map((n) => (
          <View key={n.id} style={[s.card, !n.read && s.cardUnread]}>
            <View style={[s.iconWrap, { backgroundColor: n.color + '18' }]}>
              <n.icon size={20} color={n.color} weight="fill" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={[s.cardTitle, !n.read && { color: colors['text-primary'] }]} numberOfLines={1}>{n.title}</Text>
                {!n.read && <View style={s.dot} />}
              </View>
              <Text style={s.cardBody} numberOfLines={2}>{n.body}</Text>
              <Text style={s.time}>{n.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:            { flex: 1, backgroundColor: colors['bg-base'] },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:           { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  unreadCount:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.primary, marginTop: 2 },
  filters:         { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  filterChip:      { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterActive:    { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  filterActiveText:{ color: colors['text-inverse'] },
  card:            { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 10 },
  cardUnread:      { borderColor: colors.primary + '4D', backgroundColor: colors['primary-subtle'] },
  iconWrap:        { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle:       { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-secondary'], flex: 1, marginRight: 8 },
  cardBody:        { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], lineHeight: 20, marginBottom: 6 },
  time:            { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  dot:             { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 3 },
  empty:           { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText:       { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors['text-tertiary'] },
});
