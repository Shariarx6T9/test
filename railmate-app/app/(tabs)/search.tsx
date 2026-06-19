import React, { useState, useMemo, useCallback } from 'react';
import {
  View, FlatList, Pressable, Modal, Text, StyleSheet,
} from 'react-native';
import {
  ArrowsDownUp, CalendarBlank, Train,
} from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StationSelector } from '../../components/features/StationSelector/StationSelector';
import { useSearchStore } from '../../stores/searchStore';
import { useStations } from '../../hooks/useStations';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { Station } from '../../types/database.types';

export default function SearchScreen() {
  return <ErrorBoundary name="Search"><SearchScreenInner /></ErrorBoundary>;
}

function SearchScreenInner() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const {
    fromStation, toStation, date,
    setFromStation, setToStation, setDate, swapStations,
  } = useSearchStore();

  const { data: stations } = useStations();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectorConfig, setSelectorConfig] = useState<{
    visible: boolean; type: 'from' | 'to';
  }>({ visible: false, type: 'from' });

  const filteredStations = useMemo(() => {
    if (!stations) return [];
    if (!searchQuery.trim()) return stations;
    const q = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.name_en.toLowerCase().includes(q) ||
        s.name_bn.includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }, [stations, searchQuery]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleSearch = () => {
    if (fromStation && toStation) {
      router.push({
        pathname: '/search/results',
        params: { fromId: fromStation.id, toId: toStation.id, date },
      });
    }
  };

  const handleStationSelect = useCallback((station: Station) => {
    if (selectorConfig.type === 'from') setFromStation(station);
    else setToStation(station);
    setSelectorConfig((prev) => ({ ...prev, visible: false }));
  }, [selectorConfig.type, setFromStation, setToStation]);

  const formattedDate = new Date(date).toLocaleDateString(
    isBengali ? 'bn-BD' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  const renderStationItem = ({ item }: { item: Station }) => (
    <Pressable
      onPress={() => {
        // Smart fill: set from first, then to
        if (!fromStation) setFromStation(item);
        else if (!toStation) setToStation(item);
        else setToStation(item); // override to-station if both already set
      }}
      style={s.stationItem}
    >
      <View style={s.stationIconWrap}>
        <Train size={18} color={colors.primary} weight="bold" />
      </View>
      <View style={{ flex: 1 }}>
        <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
          {isBengali ? item.name_bn : item.name_en}
        </Typography>
        <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
          {item.code}{item.division ? ` • ${item.division}` : ''}
        </Typography>
      </View>
      {/* Show indicator if this station is selected as from/to */}
      {fromStation?.id === item.id && (
        <View style={[s.selectionDot, { backgroundColor: colors.danger }]} />
      )}
      {toStation?.id === item.id && (
        <View style={[s.selectionDot, { backgroundColor: colors.primary }]} />
      )}
    </Pressable>
  );

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        {/* Search widget */}
        <Card className="p-4 mt-4 mb-4">
          <View style={{ position: 'relative' }}>
            {/* From station — tappable to open selector modal */}
            <Pressable
              onPress={() => setSelectorConfig({ visible: true, type: 'from' })}
              style={s.stationRow}
            >
              <View style={[s.dot, { backgroundColor: colors.danger }]} />
              <View style={{ flex: 1 }}>
                <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
                  {t('search.from')}
                </Typography>
                <Typography
                  variant="h4"
                  className={fromStation ? 'text-text-primary' : 'text-text-tertiary'}
                  isBengali={isBengali}
                >
                  {fromStation
                    ? (isBengali ? fromStation.name_bn : fromStation.name_en)
                    : t('station.search_placeholder')}
                </Typography>
              </View>
            </Pressable>

            <View style={s.divider} />

            {/* Swap button */}
            <Pressable
              onPress={swapStations}
              style={s.swapBtn}
            >
              <ArrowsDownUp size={18} color={colors.primary} weight="bold" />
            </Pressable>

            {/* To station — tappable to open selector modal */}
            <Pressable
              onPress={() => setSelectorConfig({ visible: true, type: 'to' })}
              style={s.stationRow}
            >
              <View style={[s.dot, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
                  {t('search.to')}
                </Typography>
                <Typography
                  variant="h4"
                  className={toStation ? 'text-text-primary' : 'text-text-tertiary'}
                  isBengali={isBengali}
                >
                  {toStation
                    ? (isBengali ? toStation.name_bn : toStation.name_en)
                    : t('station.search_placeholder')}
                </Typography>
              </View>
            </Pressable>
          </View>

          <View style={s.bottomRow}>
            <Pressable onPress={() => setShowDatePicker(true)} style={s.dateRow}>
              <CalendarBlank size={18} color={colors.primary} />
              <Typography variant="body" className="text-text-primary" isBengali={isBengali}>
                {formattedDate}
              </Typography>
            </Pressable>
            <Button
              label={t('search.button')}
              onPress={handleSearch}
              disabled={!fromStation || !toStation}
              size="sm"
              isBengali={isBengali}
            />
          </View>
        </Card>

        {/* Station list for quick tap-to-select */}
        <Input
          placeholder={t('station.search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          isBengali={isBengali}
          className="mb-3"
        />

        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.id}
          renderItem={renderStationItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Typography variant="body" className="text-text-tertiary" isBengali={isBengali}>
                {t('search.no_stations_found')}
              </Typography>
            </View>
          }
        />
      </View>

      {/* Station selector modal — presentationStyle removed: iOS-only, breaks Android background */}
      <Modal
        visible={selectorConfig.visible}
        animationType="slide"
        onRequestClose={() => setSelectorConfig((p) => ({ ...p, visible: false }))}
      >
        <View style={{ flex: 1, backgroundColor: colors['bg-base'] }}>
          <StationSelector
            onSelect={handleStationSelect}
            onClose={() => setSelectorConfig((p) => ({ ...p, visible: false }))}
            isBengali={isBengali}
          />
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </ScreenWrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    stationRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
    dot:            { width: 10, height: 10, borderRadius: 5 },
    divider:        { height: 1, backgroundColor: colors.border, marginLeft: 22 },
    swapBtn:        { position: 'absolute', right: 0, top: '35%', width: 36, height: 36, borderRadius: 18, backgroundColor: colors['bg-elevated'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    bottomRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
    dateRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    stationItem:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
    stationIconWrap:{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
    selectionDot:   { width: 8, height: 8, borderRadius: 4 },
  });
