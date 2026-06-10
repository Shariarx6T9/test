import React, { useState } from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  BellSimple, 
  ArrowsDownUp, 
  CalendarBlank, 
  MapPin,
  Plus
} from 'phosphor-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { StationSelector } from '../../components/features/StationSelector/StationSelector';
import { SavedRouteChip } from '../../components/features/SavedRouteChip/SavedRouteChip';
import { useSearchStore } from '../../stores/searchStore';
import { useSavedRoutes, SavedRoute } from '../../hooks/useSavedRoutes';
import { useTranslation } from '../../i18n';
import { Station } from '../../types/station.types';

export default function HomeScreen() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const { 
    fromStation, 
    toStation, 
    date, 
    setFromStation, 
    setToStation, 
    setDate, 
    swapStations 
  } = useSearchStore();

  const { savedRoutes } = useSavedRoutes();

  const [selectorConfig, setSelectorConfig] = useState<{
    visible: boolean;
    type: 'from' | 'to';
  }>({ visible: false, type: 'from' });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStationSelect = (station: Station) => {
    if (selectorConfig.type === 'from') {
      setFromStation(station);
    } else {
      setToStation(station);
    }
    setSelectorConfig({ ...selectorConfig, visible: false });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSearch = () => {
    if (fromStation && toStation) {
      router.push({
        pathname: '/search/results',
        params: {
          fromId: fromStation.id,
          toId: toStation.id,
          date: date,
        },
      });
    }
  };

  const handleSavedRoutePress = (route: SavedRoute) => {
    setFromStation(route.fromStation as any);
    setToStation(route.toStation as any);
    router.push({
      pathname: '/search/results',
      params: {
        fromId: route.fromStation.id,
        toId: route.toStation.id,
        date: date,
      },
    });
  };

  const formattedDate = new Date(date).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Area */}
        <View className="flex-row justify-between items-start py-6">
          <View>
            <Typography variant="h2" className="text-text-primary" isBengali={isBengali}>
              {t('home.greeting')}
            </Typography>
            <Typography variant="body" className="text-text-secondary" isBengali={isBengali}>
              {new Date().toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Typography>
          </View>
          <Pressable className="bg-bg-card p-2 rounded-full border border-border">
            <BellSimple size={24} color="#8FA3C0" />
          </Pressable>
        </View>

        {/* Search Widget Card */}
        <Card className="p-4 mb-8">
          <View className="relative">
            {/* From Station */}
            <Pressable 
              onPress={() => setSelectorConfig({ visible: true, type: 'from' })}
              className="flex-row items-center py-3"
            >
              <View className="w-2 h-2 rounded-full bg-danger mr-4" />
              <View className="flex-1">
                <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
                  {t('search.from')}
                </Typography>
                <Typography variant="h4" className={fromStation ? "text-text-primary" : "text-text-tertiary"} isBengali={isBengali}>
                  {fromStation ? (isBengali ? fromStation.name_bn : fromStation.name_en) : t('station.search_placeholder')}
                </Typography>
              </View>
            </Pressable>

            {/* Divider */}
            <View className="h-[1px] bg-border ml-6" />

            {/* Swap Button */}
            <Pressable 
              onPress={swapStations}
              className="absolute right-0 top-[35%] bg-bg-card border border-border w-10 h-10 rounded-full items-center justify-center z-10"
            >
              <ArrowsDownUp size={20} color="#00A859" weight="bold" />
            </Pressable>

            {/* To Station */}
            <Pressable 
              onPress={() => setSelectorConfig({ visible: true, type: 'to' })}
              className="flex-row items-center py-3"
            >
              <View className="w-2 h-2 rounded-full bg-primary mr-4" />
              <View className="flex-1">
                <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
                  {t('search.to')}
                </Typography>
                <Typography variant="h4" className={toStation ? "text-text-primary" : "text-text-tertiary"} isBengali={isBengali}>
                  {toStation ? (isBengali ? toStation.name_bn : toStation.name_en) : t('station.search_placeholder')}
                </Typography>
              </View>
            </Pressable>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-border mb-4" />

          {/* Date and Search Button Row */}
          <View className="flex-row items-center justify-between">
            <Pressable 
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center flex-1"
            >
              <CalendarBlank size={20} color="#00A859" className="mr-2" />
              <Typography variant="body" className="text-text-primary ml-2" isBengali={isBengali}>
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

        {/* Saved Routes Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="h3" className="text-text-primary" isBengali={isBengali}>
              {t('home.saved_routes')}
            </Typography>
          </View>

          {savedRoutes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {savedRoutes.map((route) => (
                <SavedRouteChip 
                  key={route.id} 
                  route={route} 
                  onPress={handleSavedRoutePress} 
                  isBengali={isBengali}
                />
              ))}
              {savedRoutes.length < 3 && (
                <Pressable 
                  onPress={() => router.push('/search')}
                  className="bg-primary-subtle border border-primary-dim border-dashed rounded-full px-4 py-2 flex-row items-center"
                >
                  <Plus size={16} color="#00A859" weight="bold" className="mr-1" />
                  <Typography variant="label" className="text-primary" isBengali={isBengali}>
                    Add
                  </Typography>
                </Pressable>
              )}
            </ScrollView>
          ) : (
            <Card className="p-6 items-center border-dashed">
              <MapPin size={32} color="#4E6480" weight="thin" />
              <Typography variant="h4" className="text-text-primary mt-2" isBengali={isBengali}>
                {t('home.no_saved_routes')}
              </Typography>
              <Typography variant="caption" className="text-text-tertiary text-center mt-1" isBengali={isBengali}>
                {t('home.no_saved_routes_hint')}
              </Typography>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Station Selector Modal */}
      <Modal
        visible={selectorConfig.visible}
        animationType="slide"
        onRequestClose={() => setSelectorConfig({ ...selectorConfig, visible: false })}
      >
        <StationSelector 
          onSelect={handleStationSelect}
          onClose={() => setSelectorConfig({ ...selectorConfig, visible: false })}
          isBengali={isBengali}
        />
      </Modal>

      {/* Date Picker */}
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
