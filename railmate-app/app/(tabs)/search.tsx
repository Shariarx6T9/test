// app/(tabs)/search.tsx
// Matches Search_Trains.png: From/To vertical stack with swap, date/class/
// quota pickers, Search button, Recent Searches list with bookmark toggle,
// and an "Explore" promo card.

import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text, Modal, Alert,
  TextInput, FlatList, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  ArrowLeft, Clock, CaretRight, X, BookmarkSimple, ArrowsDownUp,
  CalendarBlank, Armchair, MagnifyingGlass, CompassRose,
} from 'phosphor-react-native';

import { StationSelector } from '../../components/features/StationSelector/StationSelector';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useSearchStore } from '../../stores/searchStore';
import { useRecentSearches, RecentSearch } from '../../hooks/useRecentSearches';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { Station, TrainClass } from '../../types/database.types';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { Radius } from '../../constants/radius';
import { ALL_TRAIN_CLASSES, trainClassLabel } from '../../utils/trainClassLabel';

// The "Quota" concept appears on the reference design but has no table,
// column, or type anywhere in the schema or API. We present a UI-only
// selector (General / Disabled / Freedom Fighters) but do not send the
// value to any API until the schema is extended. Flagged in delivery notes.
const QUOTA_OPTIONS = [
  { key: 'general',          label: 'General',          sub: 'General Quota' },
  { key: 'disabled',         label: 'Disabled',         sub: 'Disabled Quota' },
  { key: 'freedom_fighters', label: 'Freedom Fighters', sub: 'Freedom Fighter Quota' },
] as const;
type QuotaKey = typeof QUOTA_OPTIONS[number]['key'];

function formatSearchDate(isoDate: string, isBengali: boolean): string {
  const d = new Date(isoDate);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const base = d.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return isToday ? `Today, ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}` : base;
}

function formatSearchDateBn(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function recentSearchLabel(r: RecentSearch): string {
  return `${r.fromStation.name_en} → ${r.toStation.name_en}`;
}

function recentSearchMeta(r: RecentSearch, isBengali: boolean): string {
  const d = new Date(r.date);
  const parts: string[] = [d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })];
  if (r.selectedClass) parts.push(trainClassLabel(r.selectedClass));
  else parts.push('All Classes');
  return parts.join(' • ');
}

function SearchContent() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const {
    fromStation, toStation, date, selectedClass,
    setFromStation, setToStation, setDate, setSelectedClass, swapStations,
  } = useSearchStore();

  const { recentSearches, addRecentSearch, clearAll } = useRecentSearches();
  const { saveRoute, isRouteSaved } = useSavedRoutes();

  const [selectorConfig, setSelectorConfig] = useState<{ visible: boolean; type: 'from' | 'to' }>({ visible: false, type: 'from' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showQuotaPicker, setShowQuotaPicker] = useState(false);
  const [quota, setQuota] = useState<QuotaKey>('general');

  const handleStationSelect = useCallback((station: Station) => {
    if (selectorConfig.type === 'from') setFromStation(station);
    else setToStation(station);
    setSelectorConfig(prev => ({ ...prev, visible: false }));
  }, [selectorConfig.type, setFromStation, setToStation]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleSearch = async () => {
    if (!fromStation || !toStation) {
      Alert.alert('', t('search.select_stations'));
      return;
    }
    await addRecentSearch(
      { id: fromStation.id as number, name_en: fromStation.name_en, name_bn: fromStation.name_bn, code: fromStation.code },
      { id: toStation.id as number, name_en: toStation.name_en, name_bn: toStation.name_bn, code: toStation.code },
      date,
      selectedClass,
    );
    router.push({ pathname: '/search/results', params: { fromId: fromStation.id, toId: toStation.id, date } });
  };

  const handleRecentPress = (r: RecentSearch) =>
    router.push({ pathname: '/search/results', params: { fromId: r.fromStation.id, toId: r.toStation.id, date: r.date } });

  const handleBookmarkRecent = async (r: RecentSearch) => {
    await saveRoute(
      { id: String(r.fromStation.id), name_en: r.fromStation.name_en, name_bn: r.fromStation.name_bn, code: r.fromStation.code },
      { id: String(r.toStation.id), name_en: r.toStation.name_en, name_bn: r.toStation.name_bn, code: r.toStation.code },
    );
  };

  const quotaOption = QUOTA_OPTIONS.find(q => q.key === quota) ?? QUOTA_OPTIONS[0];
  const classLabel = selectedClass ? trainClassLabel(selectedClass) : 'All Classes';
  const classSub = selectedClass ? 'Selected Class' : 'All Available Classes';

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <Text style={s.headerTitle}>{t('search.title')}</Text>
        <Pressable style={s.recentBtn} onPress={() => router.push('/notifications' as any)}>
          <Clock size={14} color={colors.primary} weight="fill" />
          <Text style={s.recentBtnText}>Recent</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Search Form Card */}
        <View style={s.formCard}>
          {/* From row */}
          <Pressable style={s.stationRow} onPress={() => setSelectorConfig({ visible: true, type: 'from' })}>
            <View style={s.stationDot} />
            <View style={s.stationTextWrap}>
              <Text style={s.stationHint}>{t('search.from')}</Text>
              <Text style={s.stationName} numberOfLines={1}>
                {fromStation ? fromStation.name_en : 'Select station'}
              </Text>
              {fromStation && (
                <Text style={s.stationSub} numberOfLines={1}>
                  {fromStation.name_bn}
                </Text>
              )}
            </View>
            {fromStation && (
              <Pressable onPress={() => setFromStation(null)} hitSlop={8}>
                <View style={s.clearBtn}><X size={14} color={colors['text-secondary']} /></View>
              </Pressable>
            )}
          </Pressable>

          {/* Swap + dashed connector */}
          <View style={s.swapRow}>
            <View style={s.dashedLine} />
            <Pressable style={s.swapBtn} onPress={swapStations}>
              <ArrowsDownUp size={16} color={colors.primary} weight="bold" />
            </Pressable>
          </View>

          {/* To row */}
          <Pressable style={s.stationRow} onPress={() => setSelectorConfig({ visible: true, type: 'to' })}>
            <View style={[s.stationDot, s.stationDotTo]} />
            <View style={s.stationTextWrap}>
              <Text style={s.stationHint}>{t('search.to')}</Text>
              <Text style={s.stationName} numberOfLines={1}>
                {toStation ? toStation.name_en : 'Select station'}
              </Text>
              {toStation && (
                <Text style={s.stationSub} numberOfLines={1}>
                  {toStation.name_bn}
                </Text>
              )}
            </View>
            {toStation && (
              <Pressable onPress={() => setToStation(null)} hitSlop={8}>
                <View style={s.clearBtn}><X size={14} color={colors['text-secondary']} /></View>
              </Pressable>
            )}
          </Pressable>

          <View style={s.divider} />

          {/* Date row */}
          <Pressable style={s.pickerRow} onPress={() => setShowDatePicker(true)}>
            <View style={s.pickerIconWrap}>
              <CalendarBlank size={18} color={colors.primary} weight="fill" />
            </View>
            <View style={s.pickerTextWrap}>
              <Text style={s.pickerHint}>{t('search.date_of_journey')}</Text>
              <Text style={s.pickerValue}>{formatSearchDate(date, isBengali)}</Text>
              {isBengali && (
                <Text style={s.pickerSub}>{formatSearchDateBn(date)}</Text>
              )}
            </View>
            <CaretRight size={16} color={colors['text-tertiary']} />
          </Pressable>

          {/* Class row */}
          <Pressable style={s.pickerRow} onPress={() => setShowClassPicker(true)}>
            <View style={s.pickerIconWrap}>
              <Armchair size={18} color={colors.primary} weight="fill" />
            </View>
            <View style={s.pickerTextWrap}>
              <Text style={s.pickerHint}>Class (Optional)</Text>
              <Text style={s.pickerValue}>{classLabel}</Text>
              <Text style={s.pickerSub}>{classSub}</Text>
            </View>
            <CaretRight size={16} color={colors['text-tertiary']} />
          </Pressable>

          {/* Quota row — UI only (no schema backing yet) */}
          <Pressable style={[s.pickerRow, { borderBottomWidth: 0 }]} onPress={() => setShowQuotaPicker(true)}>
            <View style={s.pickerIconWrap}>
              <MagnifyingGlass size={18} color={colors.primary} weight="fill" />
            </View>
            <View style={s.pickerTextWrap}>
              <Text style={s.pickerHint}>Quota (Optional)</Text>
              <Text style={s.pickerValue}>{quotaOption.label}</Text>
              <Text style={s.pickerSub}>{quotaOption.sub}</Text>
            </View>
            <CaretRight size={16} color={colors['text-tertiary']} />
          </Pressable>
        </View>

        {/* Search button */}
        <Pressable
          style={[s.searchBtn, (!fromStation || !toStation) && { opacity: 0.55 }]}
          onPress={handleSearch}
          disabled={!fromStation || !toStation}
        >
          <MagnifyingGlass size={20} color={colors['text-inverse']} weight="bold" />
          <Text style={s.searchBtnText}>{t('search.button')}</Text>
        </Pressable>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Recent Searches</Text>
              <Pressable onPress={clearAll}>
                <Text style={s.clearAllText}>Clear All</Text>
              </Pressable>
            </View>
            {recentSearches.map((r) => {
              const saved = isRouteSaved(String(r.fromStation.id), String(r.toStation.id));
              return (
                <Pressable key={r.id} style={s.recentRow} onPress={() => handleRecentPress(r)}>
                  <View style={s.recentIconWrap}>
                    <Clock size={16} color={colors.primary} weight="fill" />
                  </View>
                  <View style={s.recentTextWrap}>
                    <Text style={s.recentLabel} numberOfLines={1}>{recentSearchLabel(r)}</Text>
                    <Text style={s.recentMeta} numberOfLines={1}>{recentSearchMeta(r, isBengali)}</Text>
                  </View>
                  <Pressable onPress={() => handleBookmarkRecent(r)} hitSlop={8}>
                    <BookmarkSimple
                      size={18}
                      color={saved ? colors.primary : colors['text-tertiary']}
                      weight={saved ? 'fill' : 'regular'}
                    />
                  </Pressable>
                  <CaretRight size={14} color={colors['text-tertiary']} />
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Explore promo card */}
        <Pressable style={s.promoCard} onPress={() => router.push('/(tabs)/search' as any)}>
          <View style={s.promoTextWrap}>
            <Text style={s.promoQuestion}>ট্রেন খুঁজতে সাহায্য লাগছে?</Text>
            <Text style={s.promoBody}>Use our Station Guide or Route Map{'\n'}to plan your journey better.</Text>
          </View>
          <Pressable style={s.exploreBtn} onPress={() => router.push('/(tabs)/search' as any)}>
            <CompassRose size={14} color={colors.primary} weight="fill" />
            <Text style={s.exploreBtnText}>Explore</Text>
          </Pressable>
        </Pressable>
      </ScrollView>

      {/* Station selector modal */}
      <Modal
        visible={selectorConfig.visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectorConfig(prev => ({ ...prev, visible: false }))}
      >
        <StationSelector
          onSelect={handleStationSelect}
          onClose={() => setSelectorConfig(prev => ({ ...prev, visible: false }))}
          isBengali={isBengali}
        />
      </Modal>

      {/* Date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Class picker modal */}
      <Modal visible={showClassPicker} transparent animationType="fade" onRequestClose={() => setShowClassPicker(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setShowClassPicker(false)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Select Class</Text>
            <Pressable style={s.sheetRow} onPress={() => { setSelectedClass(null); setShowClassPicker(false); }}>
              <Text style={[s.sheetRowText, !selectedClass && { color: colors.primary }]}>All Classes</Text>
            </Pressable>
            {ALL_TRAIN_CLASSES.map((cls) => (
              <Pressable key={cls} style={s.sheetRow} onPress={() => { setSelectedClass(cls); setShowClassPicker(false); }}>
                <Text style={[s.sheetRowText, selectedClass === cls && { color: colors.primary }]}>
                  {trainClassLabel(cls)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Quota picker modal */}
      <Modal visible={showQuotaPicker} transparent animationType="fade" onRequestClose={() => setShowQuotaPicker(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setShowQuotaPicker(false)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Select Quota</Text>
            {QUOTA_OPTIONS.map((q) => (
              <Pressable key={q.key} style={s.sheetRow} onPress={() => { setQuota(q.key); setShowQuotaPicker(false); }}>
                <Text style={[s.sheetRowText, quota === q.key && { color: colors.primary }]}>{q.label}</Text>
                <Text style={s.sheetRowSub}>{q.sub}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function SearchScreen() {
  return <ErrorBoundary name="Search Trains"><SearchContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:             { flex: 1, backgroundColor: colors['bg-base'] },

  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'], gap: Spacing['space-3'] },
  backBtn:          { width: 36, height: 36, borderRadius: Radius['radius-full'], backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle:      { ...Typography['h2'], color: colors['text-primary'], flex: 1 },
  recentBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary, borderRadius: Radius['radius-full'], paddingHorizontal: Spacing['space-3'], paddingVertical: Spacing['space-1'] },
  recentBtnText:    { ...Typography['label'], color: colors.primary },

  formCard:         { marginHorizontal: Spacing['space-5'], backgroundColor: colors['bg-card'], borderRadius: Radius['radius-xl'], borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },

  stationRow:       { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing['space-4'], gap: Spacing['space-3'] },
  stationDot:       { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginTop: 6 },
  stationDotTo:     { backgroundColor: colors.primary },
  stationTextWrap:  { flex: 1 },
  stationHint:      { ...Typography['caption'], color: colors['text-tertiary'] },
  stationName:      { ...Typography['h3'], color: colors['text-primary'], marginTop: 2 },
  stationSub:       { ...Typography['caption'], color: colors.primary, marginTop: 2 },
  clearBtn:         { width: 26, height: 26, borderRadius: 13, backgroundColor: colors['bg-elevated'], alignItems: 'center', justifyContent: 'center', marginTop: 6 },

  swapRow:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['space-4'], marginVertical: -4 },
  dashedLine:       { flex: 1, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border },
  swapBtn:          { width: 36, height: 36, borderRadius: Radius['radius-full'], backgroundColor: colors['bg-elevated'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', zIndex: 1 },

  divider:          { height: 1, backgroundColor: colors.border, marginHorizontal: Spacing['space-4'] },

  pickerRow:        { flexDirection: 'row', alignItems: 'center', padding: Spacing['space-4'], gap: Spacing['space-3'], borderBottomWidth: 1, borderBottomColor: colors.border },
  pickerIconWrap:   { width: 38, height: 38, borderRadius: Radius['radius-lg'], backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
  pickerTextWrap:   { flex: 1 },
  pickerHint:       { ...Typography['caption'], color: colors['text-tertiary'] },
  pickerValue:      { ...Typography['h4'], color: colors['text-primary'], marginTop: 1 },
  pickerSub:        { ...Typography['caption'], color: colors['text-secondary'], marginTop: 1 },

  searchBtn:        { marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-5'], backgroundColor: colors.primary, borderRadius: Radius['radius-full'], paddingVertical: Spacing['space-4'], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing['space-2'] },
  searchBtnText:    { ...Typography['button'], color: colors['text-inverse'] },

  section:          { marginTop: Spacing['space-6'], paddingHorizontal: Spacing['space-5'] },
  sectionHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing['space-3'] },
  sectionTitle:     { ...Typography['h3'], color: colors['text-primary'] },
  clearAllText:     { ...Typography['label'], color: colors.primary },

  recentRow:        { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], paddingVertical: Spacing['space-3'], borderBottomWidth: 1, borderBottomColor: colors.border },
  recentIconWrap:   { width: 36, height: 36, borderRadius: Radius['radius-lg'], backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
  recentTextWrap:   { flex: 1 },
  recentLabel:      { ...Typography['body'], color: colors['text-primary'] },
  recentMeta:       { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },

  promoCard:        { marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-5'], flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, padding: Spacing['space-4'], gap: Spacing['space-3'], overflow: 'hidden' },
  promoTextWrap:    { flex: 1 },
  promoQuestion:    { ...Typography['label-lg'], color: colors.primary, marginBottom: 4 },
  promoBody:        { ...Typography['caption'], color: colors['text-secondary'], lineHeight: 18 },
  exploreBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary, borderRadius: Radius['radius-full'], paddingHorizontal: Spacing['space-3'], paddingVertical: Spacing['space-2'] },
  exploreBtnText:   { ...Typography['label'], color: colors.primary },

  modalBackdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:            { backgroundColor: colors['bg-card'], borderTopLeftRadius: Radius['radius-xl'], borderTopRightRadius: Radius['radius-xl'], padding: Spacing['space-5'], paddingBottom: Spacing['space-10'], maxHeight: '80%' },
  sheetTitle:       { ...Typography['h3'], color: colors['text-primary'], marginBottom: Spacing['space-4'] },
  sheetRow:         { paddingVertical: Spacing['space-3'], borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetRowText:     { ...Typography['body'], color: colors['text-primary'] },
  sheetRowSub:      { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },
});
