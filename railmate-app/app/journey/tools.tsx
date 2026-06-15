import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Suitcase, BookmarkSimple, BellSimple, ChartBar, Plus, Train, CaretRight } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

// Mock journey data — placeholder pending live trips/stats API
const UPCOMING = [
  { id: '1', train: 'Subarna Express', from: 'Dhaka', to: 'Chattogram', date: '15 Jun', time: '06:40', fareClass: 'SHOVON_CHAIR' },
  { id: '2', train: 'Turna Express', from: 'Sylhet', to: 'Dhaka', date: '20 Jun', time: '08:00', fareClass: 'AC_BERTH' },
];
const SAVED = [
  { id: '1', from: 'Dhaka', to: 'Chattogram', alerts: true },
  { id: '2', from: 'Dhaka', to: 'Sylhet', alerts: false },
  { id: '3', from: 'Rajshahi', to: 'Dhaka', alerts: true },
];

export default function JourneyToolsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');

  const STATS = [
    ['42', t('journey.stat_journeys')],
    ['1,240 km', t('journey.stat_distance')],
    ['8h 20m', t('journey.stat_saved_time')],
    ['৳12,400', t('journey.stat_spent')],
  ];

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={colors['text-primary']} weight="bold" /></Pressable>
        <Text style={s.title}>{t('journey.title')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        {/* My Trips */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Suitcase size={18} color={colors.primary} weight="duotone" />
            <Text style={s.sectionTitle}>{t('journey.trips')}</Text>
          </View>
          <View style={s.tabRow}>
            {(['upcoming', 'completed'] as const).map((tb) => (
              <Pressable key={tb} style={[s.tabChip, tab === tb && s.tabChipActive]} onPress={() => setTab(tb)}>
                <Text style={[s.tabText, tab === tb && s.tabTextActive]}>{t(`journey.${tb}` as TranslationKey)}</Text>
              </Pressable>
            ))}
          </View>
          {tab === 'upcoming' ? UPCOMING.map((trip) => (
            <View key={trip.id} style={s.tripCard}>
              <View style={s.tripAccent} />
              <View style={{ flex: 1 }}>
                <Text style={s.tripTrain}>{trip.train}</Text>
                <Text style={s.tripRoute}>{trip.from} → {trip.to}</Text>
                <Text style={s.tripMeta}>{trip.date} · {trip.time} · {t(`fare.class.${trip.fareClass}` as TranslationKey)}</Text>
              </View>
              <Train size={20} color={colors.primary} weight="duotone" />
            </View>
          )) : (
            <View style={s.emptyBox}>
              <Text style={s.emptyTitle}>{t('journey.no_trips')}</Text>
              <Text style={s.emptyHint}>{t('journey.no_trips_hint')}</Text>
            </View>
          )}
        </View>

        {/* Saved Routes */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <BookmarkSimple size={18} color={colors.accent} weight="fill" />
            <Text style={s.sectionTitle}>{t('journey.saved_routes')}</Text>
          </View>
          {SAVED.map((r) => (
            <View key={r.id} style={s.savedRow}>
              <View style={s.savedDots}><View style={s.dot} /><View style={s.dotLine} /><View style={s.dot} /></View>
              <Text style={s.savedText}>{r.from} → {r.to}</Text>
              <BellSimple size={16} color={r.alerts ? colors.primary : colors['text-tertiary']} weight={r.alerts ? 'fill' : 'regular'} />
              <CaretRight size={16} color={colors['text-tertiary']} />
            </View>
          ))}
          <Pressable style={s.addBtn}><Plus size={16} color={colors.primary} /><Text style={s.addBtnText}>{t('journey.add_route')}</Text></Pressable>
        </View>

        {/* Travel Stats */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <ChartBar size={18} color={colors.info} weight="duotone" />
            <Text style={s.sectionTitle}>{t('journey.stats')}</Text>
          </View>
          <View style={s.statsGrid}>
            {STATS.map(([val, label]) => (
              <View key={label} style={s.statCard}>
                <Text style={s.statVal}>{val}</Text>
                <Text style={s.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
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
  section:       { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors['text-primary'] },
  tabRow:        { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabChip:       { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  tabChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  tabTextActive: { color: colors['text-inverse'] },
  tripCard:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 10, overflow: 'hidden' },
  tripAccent:    { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.primary },
  tripTrain:     { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'] },
  tripRoute:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },
  tripMeta:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors['text-tertiary'], marginTop: 4 },
  emptyBox:      { backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: 'center' },
  emptyTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'], marginBottom: 6 },
  emptyHint:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], textAlign: 'center' },
  savedRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, gap: 12 },
  savedDots:     { alignItems: 'center' },
  dot:           { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  dotLine:       { width: 2, height: 12, backgroundColor: colors.border, marginVertical: 2 },
  savedText:     { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: colors['text-primary'] },
  addBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 13, marginTop: 4 },
  addBtnText:    { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.primary },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard:      { flex: 1, minWidth: '44%', backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 18, alignItems: 'center' },
  statVal:       { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: colors.primary, marginBottom: 4 },
  statLabel:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'] },
});
