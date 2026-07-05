// app/(tabs)/search.tsx — Search Tab

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { X } from 'phosphor-react-native';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';
import { useSearchStore } from '../../stores/searchStore';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { useTranslation } from '../../i18n';
import { StationSelector } from '../../components/features/StationSelector/StationSelector';
import { Station } from '../../types/station.types';

export default function SearchTabScreen() {
  const router = useRouter();
  const { t, isBengali } = useTranslation();

  const {
    fromStation,
    toStation,
    date,
    setFromStation,
    setToStation,
    setDate,
    swapStations,
  } = useSearchStore();

  const { recentSearches, addRecentSearch, clearAll } = useRecentSearches();

  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchError, setSearchError] = useState('');

  // ── Station selection ────────────────────────────────────────────────────────

  const handleSelectFrom = useCallback((station: Station) => {
    setFromStation(station);
    setShowFromSelector(false);
    setSearchError('');
  }, [setFromStation]);

  const handleSelectTo = useCallback((station: Station) => {
    setToStation(station);
    setShowToSelector(false);
    setSearchError('');
  }, [setToStation]);

  // ── Date picker ──────────────────────────────────────────────────────────────

  const handleDateChange = useCallback((_event: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // keep open on iOS until dismissed
    if (selected) {
      setDate(selected.toISOString().split('T')[0]);
    }
  }, [setDate]);

  const dateObj = (() => {
    try { return new Date(date); } catch { return new Date(); }
  })();

  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ── Search handler ───────────────────────────────────────────────────────────

  const handleSearch = useCallback(() => {
    if (!fromStation || !toStation) {
      setSearchError(t('search.select_stations'));
      return;
    }
    setSearchError('');

    // Record in recent searches (fire-and-forget — no await needed in handler)
    addRecentSearch(
      { id: fromStation.id, name_en: fromStation.name_en, name_bn: fromStation.name_bn, code: fromStation.code },
      { id: toStation.id, name_en: toStation.name_en, name_bn: toStation.name_bn, code: toStation.code },
      date,
      null,
    );

    router.push({
      pathname: '/search-results',
      params: {
        from_station_id: fromStation.id,
        to_station_id: toStation.id,
        date,
        from_name: fromStation.name_en,
        to_name: toStation.name_en,
      },
    } as any);
  }, [fromStation, toStation, date, addRecentSearch, router, t]);

  // ── Recent search tap ────────────────────────────────────────────────────────

  const handleRecentTap = useCallback((item: typeof recentSearches[number]) => {
    setFromStation({
      id: item.fromStation.id,
      code: item.fromStation.code,
      name_en: item.fromStation.name_en,
      name_bn: item.fromStation.name_bn,
      division: null,
      zone: null,
      is_major: false,
    });
    setToStation({
      id: item.toStation.id,
      code: item.toStation.code,
      name_en: item.toStation.name_en,
      name_bn: item.toStation.name_bn,
      division: null,
      zone: null,
      is_major: false,
    });
    setDate(item.date);

    router.push({
      pathname: '/search-results',
      params: {
        from_station_id: item.fromStation.id,
        to_station_id: item.toStation.id,
        date: item.date,
        from_name: item.fromStation.name_en,
        to_name: item.toStation.name_en,
      },
    } as any);
  }, [setFromStation, setToStation, setDate, router]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getFieldSub = (station: Station | null): string => {
    if (!station) return '';
    return station.division ?? station.code ?? '';
  };

  const formatRecentDate = (isoDate: string): string => {
    try {
      return new Date(isoDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header — no back button (tab screen) */}
      <View style={s.header}>
        <View style={s.backBtn} />
        <Text style={s.title}>{t('search.title')}</Text>
        <TouchableOpacity style={s.recentBtn}>
          <Text style={s.recentBtnText}>{t("search.recent")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Search Form */}
        <View style={s.formCard}>

          {/* From */}
          <TouchableOpacity style={s.fieldRow} onPress={() => setShowFromSelector(true)}>
            <View style={[s.fieldDot, { backgroundColor: C.green }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>{t('search.from')}</Text>
              <Text style={s.fieldValue}>
                {fromStation
                  ? (isBengali ? fromStation.name_bn : fromStation.name_en)
                  : t('search.placeholder_from')}
              </Text>
              {fromStation && (
                <Text style={s.fieldSub}>{getFieldSub(fromStation)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={s.clearBtn}
              onPress={() => setFromStation(null)}
            >
              <X size={12} color={C.text2} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Swap button */}
          <View style={s.swapWrapper}>
            <View style={s.swapLine} />
            <TouchableOpacity style={s.swapBtn} onPress={swapStations}>
              <Text style={s.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* To */}
          <TouchableOpacity style={s.fieldRow} onPress={() => setShowToSelector(true)}>
            <View style={[s.fieldDot, { backgroundColor: C.text2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>{t('search.to')}</Text>
              <Text style={s.fieldValue}>
                {toStation
                  ? (isBengali ? toStation.name_bn : toStation.name_en)
                  : t('search.placeholder_to')}
              </Text>
              {toStation && (
                <Text style={s.fieldSub}>{getFieldSub(toStation)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={s.clearBtn}
              onPress={() => setToStation(null)}
            >
              <X size={12} color={C.text2} />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Date */}
          <TouchableOpacity style={s.fieldRow} onPress={() => setShowDatePicker(true)}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>{t('search.date_of_journey')}</Text>
              <Text style={s.fieldValue}>{formattedDate}</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Class — static display (no real class-picker modal yet) */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Class (Optional)</Text>
              <Text style={s.fieldValue}>All Classes</Text>
              <Text style={s.fieldSub}>All Available Classes</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Text style={s.searchBtnText}>{t('search.button')}</Text>
        </TouchableOpacity>

        {/* Validation error */}
        {!!searchError && (
          <Text style={s.errorText}>{searchError}</Text>
        )}

        {/* Recent Searches */}
        <View style={s.recentSection}>
          <View style={s.recentHeader}>
            <Text style={s.recentTitle}>{t('home.recent_searches')}</Text>
            <TouchableOpacity onPress={clearAll}>
              <Text style={s.clearAll}>Clear All</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.recentItem}
              onPress={() => handleRecentTap(item)}
            >
              <View style={s.recentIcon} />
              <View style={{ flex: 1 }}>
                <Text style={s.recentRoute}>
                  {isBengali ? item.fromStation.name_bn : item.fromStation.name_en}
                  {' → '}
                  {isBengali ? item.toStation.name_bn : item.toStation.name_en}
                </Text>
                <Text style={s.recentMeta}>
                  {formatRecentDate(item.date)}
                  {item.selectedClass ? ` • ${item.selectedClass}` : ' • All Classes'}
                </Text>
              </View>
              <View style={s.bookmarkIcon} />
              <View style={s.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Explore Banner */}
        <View style={s.exploreBanner}>
          <View style={s.exploreImg} />
          <View style={{ flex: 1 }}>
            <Text style={s.exploreTitleBn}>ট্রেন খুঁজতে সহায়তা লাগছে?</Text>
            <Text style={s.exploreSub}>Use our Station Guide or Route Map to plan your journey better.</Text>
          </View>
          <TouchableOpacity style={s.exploreBtn}>
            <Text style={s.exploreBtnText}>Explore</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── From Station Selector Modal ── */}
      <Modal
        visible={showFromSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFromSelector(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#080D17' }}>
          <StationSelector
            onSelect={handleSelectFrom}
            onClose={() => setShowFromSelector(false)}
            isBengali={isBengali}
          />
        </View>
      </Modal>

      {/* ── To Station Selector Modal ── */}
      <Modal
        visible={showToSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowToSelector(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#080D17' }}>
          <StationSelector
            onSelect={handleSelectTo}
            onClose={() => setShowToSelector(false)}
            isBengali={isBengali}
          />
        </View>
      </Modal>

      {/* ── Date Picker ── */}
      {showDatePicker && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.xl, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  recentBtn: { backgroundColor: C.greenTint, borderRadius: 16, paddingHorizontal: S.md, paddingVertical: 6, borderWidth: 1, borderColor: C.green },
  recentBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  formCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border },
  fieldRow: { flexDirection: 'row', alignItems: 'center', padding: S.xl, gap: S.md },
  fieldDot: { width: 20, height: 20, borderRadius: 10 },
  fieldIcon: { width: 20, height: 20, borderRadius: 6 },
  fieldContent: { flex: 1, gap: 2 },
  fieldLabel: { fontSize: T.xs, color: C.text2 },
  fieldValue: { fontSize: T.md, fontWeight: '600', color: C.white },
  fieldSub: { fontSize: T.sm, color: C.green },
  clearBtn: { width: 24, height: 24, backgroundColor: C.surface2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clearDot: { width: 8, height: 8, backgroundColor: C.text2, borderRadius: 4 },
  swapWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.xl },
  swapLine: { flex: 1, height: 1, backgroundColor: C.border },
  swapBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  swapIcon: { fontSize: 16, color: C.green },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: S.xl },
  chevron: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 4 },
  searchBtn: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  searchBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
  errorText: { fontSize: T.sm, color: C.red, textAlign: 'center', marginTop: -S.md },
  recentSection: { gap: S.md },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  clearAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  recentIcon: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 10 },
  recentRoute: { fontSize: T.base, fontWeight: '600', color: C.white },
  recentMeta: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  bookmarkIcon: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 4 },
  exploreBanner: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  exploreImg: { width: 56, height: 56, backgroundColor: C.surface2, borderRadius: 10 },
  exploreTitleBn: { fontSize: T.sm, fontWeight: '600', color: C.green },
  exploreSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  exploreBtn: { backgroundColor: C.greenTint, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm, borderWidth: 1, borderColor: C.green },
  exploreBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
