import React, { useState, useMemo } from 'react';
import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { 
  ArrowsDownUp, 
  CalendarBlank, 
  Train,
  MagnifyingGlass
} from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useSearchStore } from '../../stores/searchStore';
import { useStations } from '../../hooks/useStations';
import { useTranslation } from '../../i18n';
import { Station } from '../../types/station.types';

export default function SearchScreen() {
  return <ErrorBoundary name="Search"><SearchScreenInner /></ErrorBoundary>;
}

function SearchScreenInner() {
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

  const { data: stations, isLoading } = useStations();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredStations = useMemo(() => {
    if (!stations) return [];
    if (!searchQuery) return stations;

    const query = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.name_en.toLowerCase().includes(query) ||
        s.name_bn.includes(query) ||
        s.code.toLowerCase().includes(query)
    );
  }, [stations, searchQuery]);

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

  const renderStationItem = ({ item }: { item: Station }) => (
    <Pressable
      onPress={() => {
        // By default, set as "To" station if "From" is already set, else set as "From"
        if (!fromStation) {
          setFromStation(item);
        } else {
          setToStation(item);
        }
      }}
      className="flex-row items-center py-4 border-b border-border"
    >
      <View className="w-10 h-10 rounded-full bg-primary-subtle items-center justify-center mr-3">
        <Train size={20} color="#00A859" weight="bold" />
      </View>
      <View className="flex-1">
        <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
          {isBengali ? item.name_bn : item.name_en}
        </Typography>
        <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
          {item.code} {item.division ? `• ${item.division}` : ''}
        </Typography>
      </View>
    </Pressable>
  );

  const formattedDate = new Date(date).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Search Widget */}
        <Card className="p-4 mt-4 mb-6">
          <View className="relative">
            {/* From Station */}
            <Pressable 
              onPress={() => {/* In this screen we use the list below */}}
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
              onPress={() => {/* In this screen we use the list below */}}
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

          <View className="h-[1px] bg-border mb-4" />

          <View className="flex-row items-center justify-between">
            <Pressable 
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center flex-1"
            >
              <View className="mr-2">
                <CalendarBlank size={20} color="#00A859" />
              </View>
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

        {/* Searchable Station List */}
        <View className="flex-1">
          <Input
            placeholder={t('station.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            isBengali={isBengali}
            className="mb-4"
          />

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#00A859" size="large" />
            </View>
          ) : (
            <FlatList
              data={filteredStations}
              keyExtractor={(item) => item.id}
              renderItem={renderStationItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="py-10 items-center">
                  <Typography variant="body" className="text-text-tertiary" isBengali={isBengali}>
                    No stations found
                  </Typography>
                </View>
              }
            />
          )}
        </View>
      </View>

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
