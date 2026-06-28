// app/search-trains.tsx — Search Trains Screen

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useSearchStore } from '../stores/searchStore';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useTranslation } from '../i18n';
import { StationSelector } from '../components/features/StationSelector/StationSelector';
import { Station } from '../types/station.types';

export default function SearchTrainsScreen() {
  const router = useRouter();
  const { t, isBengali } = useTranslation();
  const { fromStation, toStation, date, setFromStation, setToStation, setDate, swapStations } = useSearchStore();
  const { recentSearches, addRecentSearch, removeRecentSearch, clearAll } = useRecentSearches();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchError, setSearchError] = useState('');

  const formatDateDisplay = (isoDate: string) => {
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('en-BD', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSearch = async () => {
    if (!fromStation || !toStation) {
      setSearchError(t('search.select_stations'));
      return;
    }
    setSearchError('');
    await addRecentSearch(
      { id: fromStation.id, name_en: fromStation.name_en, name_bn: fromStation.name_bn, code: fromStation.code },
      { id: toStation.id, name_en: toStation.name_en, name_bn: toStation.name_bn, code: toStation.code },
      date,
      null,
    );
    router.push({
      pathname: '/search-results' as any,
      params: {
        from_station_id: fromStation.id,
        to_station_id: toStation.id,
        date,
        from_name: isBengali ? fromStation.name_bn : fromStation.name_en,
        to_name: isBengali ? toStation.name_bn : toStation.name_en,
      },
    });
  };

  const handleRecentTap = (item: typeof recentSearches[0]) => {
    setFromStation({ id: item.fromStation.id, code: item.fromStation.code, name_en: item.fromStation.name_en, name_bn: item.fromStation.name_bn, division: null, zone: null, is_major: false });
    setToStation({ id: item.toStation.id, code: item.toStation.code, name_en: item.toStation.name_en, name_bn: item.toStation.name_bn, division: null, zone: null, is_major: false });
    setDate(item.date);
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} />
        <Text style={s.title}>Search Trains</Text>
        <TouchableOpacity style={s.recentBtn}>
          <Text style={s.recentBtnText}>Recent</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Search Form */}
        <View style={s.formCard}>

          {/* From */}
          <TouchableOpacity style={s.fieldRow} onPress={() => setShowFromPicker(true)}>
            <View style={[s.fieldDot, { backgroundColor: C.green }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>From</Text>
              <Text style={s.fieldValue}>
                {fromStation ? (isBengali ? fromStation.name_bn : fromStation.name_en) : t('search.placeholder_from')}
              </Text>
              <Text style={s.fieldSub}>{fromStation?.division ?? fromStation?.code ?? ''}</Text>
            </View>
            <TouchableOpacity style={s.clearBtn} onPress={() => setFromStation(null)}>
              <View style={s.clearDot} />
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
          <TouchableOpacity style={s.fieldRow} onPress={() => setShowToPicker(true)}>
            <View style={[s.fieldDot, { backgroundColor: C.text2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>To</Text>
              <Text style={s.fieldValue}>
                {toStation ? (isBengali ? toStation.name_bn : toStation.name_en) : t('search.placeholder_to')}
              </Text>
              <Text style={s.fieldSub}>{toStation?.division ?? toStation?.code ?? ''}</Text>
            </View>
            <TouchableOpacity style={s.clearBtn} onPress={() => setToStation(null)}>
              <View style={s.clearDot} />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Date */}
          <TouchableOpacity style={s.fieldRow} onPress={() => setShowDatePicker(true)}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Date of Journey</Text>
              <Text style={s.fieldValue}>{formatDateDisplay(date)}</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Class */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Class (Optional)</Text>
              <Text style={s.fieldValue}>All Classes</Text>
              <Text style={s.fieldSub}>All Available Classes</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Quota */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Quota (Optional)</Text>
              <Text style={s.fieldValue}>General</Text>
              <Text style={s.fieldSub}>General Quota</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Text style={s.searchBtnText}>Search Trains</Text>
        </TouchableOpacity>

        {/* Search Error */}
        {searchError !== '' && (
          <Text style={{ color: C.red, fontSize: T.sm }}>{searchError}</Text>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={s.recentSection}>
            <View style={s.recentHeader}>
              <Text style={s.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearAll}><Text style={s.clearAll}>Clear All</Text></TouchableOpacity>
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
                  <Text style={s.recentMeta}>{formatDateDisplay(item.date)}</Text>
                </View>
                <View style={s.bookmarkIcon} />
                <View style={s.chevron} />
              </TouchableOpacity>
            ))}
          </View>
        )}

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

      {/* From Station Picker Modal */}
      <Modal visible={showFromPicker} animationType="slide" onRequestClose={() => setShowFromPicker(false)}>
        <StationSelector
          onSelect={(station: Station) => { setFromStation(station); setShowFromPicker(false); }}
          onClose={() => setShowFromPicker(false)}
          isBengali={isBengali}
        />
      </Modal>

      {/* To Station Picker Modal */}
      <Modal visible={showToPicker} animationType="slide" onRequestClose={() => setShowToPicker(false)}>
        <StationSelector
          onSelect={(station: Station) => { setToStation(station); setShowToPicker(false); }}
          onClose={() => setShowToPicker(false)}
          isBengali={isBengali}
        />
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(date + 'T00:00:00')}
          mode="date"
          minimumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
          }}
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
