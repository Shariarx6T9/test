import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellSimple, Warning, Info, Shield, Plus, CheckCircle, Users, Clock } from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

const FILTER_KEYS = ['filter_all', 'filter_active', 'filter_past'] as const;
type FilterKey = typeof FILTER_KEYS[number];

// Mock alert feed — placeholder pending live alerts API. Dates/times are
// illustrative sample data.
const MOCK_UPDATES = [
  {
    id: '1', type: 'departure' as const, trainName: 'Subarna Express', trainNum: '#721',
    Icon: BellSimple, msgParams: { mins: 30 },
    date: '13 June, 06:40', time: '9:10 PM', filterKey: 'filter_active' as FilterKey,
  },
  {
    id: '2', type: 'delay' as const, trainName: 'Turna Express', trainNum: '#762',
    Icon: Warning, msgParams: { mins: 25 }, confirmations: 8,
    date: '13 June, 08:15', time: '8:20 PM', filterKey: 'filter_active' as FilterKey,
  },
  {
    id: '3', type: 'schedule' as const, trainName: 'Mahanagar Express', trainNum: '#236',
    Icon: Info, msgParams: undefined,
    date: '13 June, 12:30', time: '7:45 PM', filterKey: 'filter_active' as FilterKey,
  },
];

function UpdatesContent() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const TYPE_META: Record<typeof MOCK_UPDATES[number]['type'], { label: string; msg: string; color: string }> = {
    departure: { label: t('updates.departure'), msg: t('updates.leaves_in', { mins: 30 }), color: colors.primary },
    delay:     { label: t('updates.delay'), msg: t('updates.min_delay', { mins: 25 }), color: colors.accent },
    schedule:  { label: t('updates.schedule'), msg: t('updates.schedule_updated'), color: colors.info },
  };

  const [filter, setFilter] = useState<FilterKey>('filter_all');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({ '1': true, '2': true, '3': true });

  const filtered = MOCK_UPDATES.filter((u) => filter === 'filter_all' || u.filterKey === filter);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={s.title}>{t('updates.title')}</Text>
          <Text style={s.sub}>{t('updates.sub')}</Text>
        </View>
        <View style={s.bellWrap}>
          <BellSimple size={20} color={colors['text-secondary']} weight="regular" />
          <View style={s.badge}><Text style={s.badgeText}>{filtered.length}</Text></View>
        </View>
      </View>

      {/* Filters */}
      <View style={s.filters}>
        {FILTER_KEYS.map((f) => (
          <Pressable key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>{t(`updates.${f}` as TranslationKey)}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {filtered.map((u) => {
          const meta = TYPE_META[u.type];
          return (
            <View key={u.id} style={s.card}>
              <View style={[s.cardAccent, { backgroundColor: meta.color }]} />

              <View style={s.cardTop}>
                <View style={[s.iconWrap, { backgroundColor: meta.color + '20' }]}>
                  <u.Icon size={22} color={meta.color} weight="fill" />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[s.cardLabel, { color: meta.color }]}>{meta.label}</Text>
                  <Text style={s.cardTrain}>{u.trainName} {u.trainNum}</Text>
                </View>
                <Switch
                  value={toggleStates[u.id]}
                  onValueChange={(v) => setToggleStates({ ...toggleStates, [u.id]: v })}
                  trackColor={{ false: colors.border, true: colors.primary + '60' }}
                  thumbColor={toggleStates[u.id] ? colors.primary : colors['text-tertiary']}
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                />
              </View>

              <View style={s.cardBody}>
                <View style={s.statusRow}>
                  <View style={[s.statusDot, { backgroundColor: meta.color }]} />
                  <Text style={[s.statusMsg, { color: meta.color }]}>{meta.msg}</Text>
                </View>
                {u.confirmations != null && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Users size={12} color={colors['text-tertiary']} />
                    <Text style={s.confirm}>{t('updates.confirmed_by', { count: u.confirmations })}</Text>
                  </View>
                )}
              </View>

              <View style={s.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Clock size={12} color={colors['text-tertiary']} />
                  <Text style={s.footerDate}>{u.date}</Text>
                </View>
                <Text style={s.footerTime}>{u.time}</Text>
              </View>
            </View>
          );
        })}

        {/* Info card */}
        <View style={s.infoCard}>
          <Shield size={28} color={colors.primary} weight="duotone" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.infoTitle}>{t('updates.info_title')}</Text>
            <Text style={s.infoSub}>{t('updates.info_sub')}</Text>
          </View>
          <CheckCircle size={22} color={colors.primary} weight="fill" />
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable style={s.fab}>
        <Plus size={20} color={colors['text-inverse']} weight="bold" />
        <Text style={s.fabText}>{t('updates.create')}</Text>
      </Pressable>
    </View>
  );
}

export default function UpdatesScreen() {
  return <ErrorBoundary name="Live Updates"><UpdatesContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:            { flex: 1, backgroundColor: colors['bg-base'] },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingBottom: 16 },
  title:           { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: colors['text-primary'] },
  sub:             { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], marginTop: 3 },
  bellWrap:        { width: 44, height: 44, borderRadius: 22, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  badge:           { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText:       { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: colors['text-inverse'] },
  filters:         { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 4 },
  filterChip:      { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChipActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  filterTextActive:{ color: colors['text-inverse'] },
  card:            { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14, overflow: 'hidden' },
  cardAccent:      { height: 3 },
  cardTop:         { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12 },
  iconWrap:        { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardLabel:       { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 0.3, marginBottom: 3 },
  cardTrain:       { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-primary'] },
  cardBody:        { paddingHorizontal: 16, paddingBottom: 12 },
  statusRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot:       { width: 8, height: 8, borderRadius: 4 },
  statusMsg:       { fontFamily: 'Inter_500Medium', fontSize: 13 },
  confirm:         { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  cardFooter:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  footerDate:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  footerTime:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  infoCard:        { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 14 },
  infoTitle:       { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'], marginBottom: 4 },
  infoSub:         { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], lineHeight: 20 },
  fab:             { position: 'absolute', bottom: 90, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 15, elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  fabText:         { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
});
