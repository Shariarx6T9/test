import React, { useState, useMemo } from 'react';
import {
  View, ScrollView, Pressable, Modal, StyleSheet, Text, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowsDownUp, CalendarBlank, MagnifyingGlass,
  CaretRight, BookmarkSimple, Train, CaretDown,
} from 'phosphor-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { StationSelector } from '../../components/features/StationSelector/StationSelector';
import { SavedRouteChip } from '../../components/features/SavedRouteChip/SavedRouteChip';
import { useSearchStore } from '../../stores/searchStore';
import { useSavedRoutes, SavedRoute } from '../../hooks/useSavedRoutes';
import { useTranslation } from '../../i18n';
import { Station } from '../../types/station.types';

const C = {
  bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035',
  primary: '#00A859', accent: '#F5A623',
  textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480',
  border: '#1E2E42', borderStrong: '#2A3F57',
  danger: '#E8394B',
};

export default function HomeScreen() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const { fromStation, toStation, date, setFromStation, setToStation, setDate, swapStations } = useSearchStore();
  const { savedRoutes } = useSavedRoutes();

  const [selectorConfig, setSelectorConfig] = useState<{ visible: boolean; type: 'from' | 'to' }>({ visible: false, type: 'from' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStationSelect = (station: Station) => {
    if (selectorConfig.type === 'from') setFromStation(station);
    else setToStation(station);
    setSelectorConfig({ ...selectorConfig, visible: false });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleSearch = () => {
    if (fromStation && toStation) {
      router.push({ pathname: '/search/results', params: { fromId: fromStation.id, toId: toStation.id, date } });
    }
  };

  const handleSavedRoutePress = (route: SavedRoute) => {
    setFromStation(route.fromStation as any);
    setToStation(route.toStation as any);
    router.push({ pathname: '/search/results', params: { fromId: route.fromStation.id, toId: route.toStation.id, date } });
  };

  const formattedDate = useMemo(() => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const dayStr = d.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { weekday: 'short', day: 'numeric', month: 'long' });
    return isToday ? `Today, ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}` : dayStr;
  }, [date, isBengali]);

  const fromLabel = fromStation
    ? { bn: fromStation.name_bn, en: fromStation.name_en }
    : { bn: 'ঢাকা', en: 'Dhaka' };

  const toLabel = toStation
    ? { bn: toStation.name_bn, en: toStation.name_en }
    : { bn: 'চট্টগ্রাম', en: 'Chattogram' };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Header ─────────────────── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.logoPill}>
              <Train size={20} color="#fff" weight="fill" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[s.brandRail]}>Rail</Text>
                <Text style={[s.brandMate]}>Mate</Text>
              </View>
              <Text style={s.brandSub}>Bangladesh</Text>
            </View>
          </View>
          <Pressable style={s.bdtPill}>
            <Text style={s.bdtFlag}>🇧🇩</Text>
            <Text style={s.bdtText}>BDT</Text>
            <CaretDown size={12} color={C.textSec} />
          </Pressable>
        </View>

        {/* ── Hero ────────────────────── */}
        <View style={s.hero}>
          <Text style={s.heroTitle}>{t('home.find_journey')}</Text>
          <Text style={s.heroSub}>{t('home.tagline')}</Text>
        </View>

        {/* ── Search Card ─────────────── */}
        <View style={s.card}>
          {/* FROM */}
          <Pressable style={s.stationRow} onPress={() => setSelectorConfig({ visible: true, type: 'from' })}>
            <View style={s.stationIcon}>
              <Train size={18} color={C.primary} weight="fill" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.stationLabel}>FROM</Text>
              <Text style={s.stationName}>{isBengali ? fromLabel.bn : fromLabel.en}</Text>
              {isBengali && <Text style={s.stationNameEn}>{fromLabel.en}</Text>}
            </View>
            <CaretRight size={18} color={C.textTer} />
          </Pressable>

          {/* Divider + swap */}
          <View style={s.dividerRow}>
            <View style={s.divider} />
            <Pressable style={s.swapBtn} onPress={swapStations}>
              <ArrowsDownUp size={18} color={C.primary} weight="bold" />
            </Pressable>
          </View>

          {/* TO */}
          <Pressable style={s.stationRow} onPress={() => setSelectorConfig({ visible: true, type: 'to' })}>
            <View style={[s.stationIcon, { backgroundColor: '#00A85915' }]}>
              <Train size={18} color={C.primary} weight="fill" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.stationLabel}>TO</Text>
              <Text style={s.stationName}>{isBengali ? toLabel.bn : toLabel.en}</Text>
              {isBengali && <Text style={s.stationNameEn}>{toLabel.en}</Text>}
            </View>
            <CaretRight size={18} color={C.textTer} />
          </Pressable>

          {/* Divider */}
          <View style={[s.divider, { marginVertical: 4 }]} />

          {/* DATE */}
          <Pressable style={s.stationRow} onPress={() => setShowDatePicker(true)}>
            <View style={[s.stationIcon, { backgroundColor: '#F5A62315' }]}>
              <CalendarBlank size={18} color={C.accent} weight="fill" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.stationLabel}>DATE</Text>
              <Text style={s.stationName}>{formattedDate}</Text>
            </View>
            <CaretRight size={18} color={C.textTer} />
          </Pressable>

          {/* Search button */}
          <Pressable
            style={[s.searchBtn, (!fromStation || !toStation) && { opacity: 0.6 }]}
            onPress={handleSearch}
          >
            <MagnifyingGlass size={20} color="#fff" weight="bold" />
            <Text style={s.searchBtnText}>{t('search.button')}</Text>
          </Pressable>
        </View>

        {/* ── Saved Routes ─────────────── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <BookmarkSimple size={18} color={C.accent} weight="fill" />
              <Text style={s.sectionTitle}>{t('home.saved_routes')}</Text>
            </View>
            {savedRoutes.length > 0 && (
              <Pressable onPress={() => router.push('/profile' as any)} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Text style={s.seeAll}>{t('home.see_all')}</Text>
                <CaretRight size={13} color={C.accent} />
              </Pressable>
            )}
          </View>

          {savedRoutes.length > 0 ? (
            savedRoutes.slice(0, 5).map((route) => (
              <Pressable key={route.id} style={s.routeItem} onPress={() => handleSavedRoutePress(route)}>
                <View style={s.routeIcon}>
                  <View style={s.routeDot} />
                  <View style={s.routeLine} />
                  <View style={s.routeDot} />
                </View>
                <Text style={s.routeText}>
                  {route.fromStation.name_en} → {route.toStation.name_en}
                </Text>
                <BookmarkSimple size={18} color={C.accent} weight="fill" />
              </Pressable>
            ))
          ) : (
            <View style={s.emptyRoutes}>
              <Text style={s.emptyText}>{t('home.no_saved_routes')}</Text>
              <Text style={s.emptyHint}>{t('home.no_saved_routes_hint')}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Station Selector Modal */}
      <Modal visible={selectorConfig.visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectorConfig({ ...selectorConfig, visible: false })}>
        <StationSelector
          onSelect={handleStationSelect}
          onClose={() => setSelectorConfig({ ...selectorConfig, visible: false })}
          isBengali={isBengali}
        />
      </Modal>

      {showDatePicker && (
        <DateTimePicker value={new Date(date)} mode="date" display="default" onChange={handleDateChange} minimumDate={new Date()} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:            { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 56 },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  headerLeft:      { flexDirection: 'row', alignItems: 'center' },
  logoPill:        { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  brandRail:       { fontFamily: 'Inter_700Bold', fontSize: 18, color: C.textPri },
  brandMate:       { fontFamily: 'Inter_700Bold', fontSize: 18, color: C.primary },
  brandSub:        { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer },
  bdtPill:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  bdtFlag:         { fontSize: 14 },
  bdtText:         { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec },
  hero:            { marginBottom: 24 },
  heroTitle:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 34, color: C.textPri, lineHeight: 42, marginBottom: 6 },
  heroSub:         { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSec, lineHeight: 22 },
  card:            { backgroundColor: C.bgCard, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 28 },
  stationRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  stationIcon:     { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00A85920', alignItems: 'center', justifyContent: 'center' },
  stationLabel:    { fontFamily: 'Inter_500Medium', fontSize: 11, color: C.textTer, letterSpacing: 1, marginBottom: 2 },
  stationName:     { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: C.textPri },
  stationNameEn:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSec, marginTop: 1 },
  dividerRow:      { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  divider:         { flex: 1, height: 1, backgroundColor: C.border },
  swapBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: C.bgElevated, borderWidth: 1, borderColor: C.borderStrong, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  searchBtn:       { marginTop: 16, backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  searchBtnText:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: '#fff' },
  section:         { marginBottom: 24 },
  sectionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.textPri },
  seeAll:          { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.accent },
  routeItem:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bgCard, borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10 },
  routeIcon:       { width: 28, alignItems: 'center', marginRight: 12 },
  routeDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  routeLine:       { width: 2, height: 12, backgroundColor: C.border, marginVertical: 2 },
  routeText:       { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: C.textPri },
  emptyRoutes:     { backgroundColor: C.bgCard, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 24, alignItems: 'center' },
  emptyText:       { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.textPri, marginBottom: 6 },
  emptyHint:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSec, textAlign: 'center' },
});
