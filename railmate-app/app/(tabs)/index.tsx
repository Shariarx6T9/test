import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  BellSimple, 
  ArrowsDownUp, 
  CalendarBlank, 
  MapPin,
  Plus,
  Train,
  ArrowRight,
  CaretRight
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
import { Colors } from '../../constants/colors';
import { usePrefsStore } from '../../stores/prefsStore';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = usePrefsStore();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const activeColors = theme === 'dark' ? Colors.dark : Colors.light;

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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting_morning');
    if (hour < 18) return t('home.greeting_afternoon');
    return t('home.greeting_evening');
  }, [t]);

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
    <ScreenWrapper className="bg-bg-base">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Area */}
        <View className="flex-row justify-between items-center py-6">
          <View>
            <Typography variant="h1" className="text-text-primary" isBengali={isBengali}>
              {greeting}
            </Typography>
            <Typography variant="body" className="text-text-secondary" isBengali={isBengali}>
              {new Date().toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Typography>
          </View>
          <Pressable className="bg-bg-card p-2.5 rounded-full border border-border shadow-sm">
            <BellSimple size={24} color={activeColors['text-secondary']} weight="duotone" />
            <View className="absolute top-2 right-2 w-3 h-3 bg-danger rounded-full border-2 border-bg-card" />
          </Pressable>
        </View>

        {/* Search Widget Card */}
        <Card className="p-5 mb-8 border-primary/20 shadow-lg shadow-primary/5">
          <View className="relative">
            {/* Journey Line Decorator */}
            <View className="absolute left-[11px] top-[24px] bottom-[24px] w-[2px] items-center">
               <View className="flex-1 w-[2px] bg-border-strong border-dashed" style={{ borderStyle: 'dashed' }} />
            </View>

            {/* From Station */}
            <Pressable 
              onPress={() => setSelectorConfig({ visible: true, type: 'from' })}
              className="flex-row items-center mb-4"
            >
              <View className="z-10 w-6 h-6 rounded-full bg-danger/10 border-2 border-danger items-center justify-center mr-4">
                 <View className="w-2 h-2 rounded-full bg-danger" />
              </View>
              <View className="flex-1 pb-4 border-b border-border">
                <Typography variant="caption" className="text-text-tertiary mb-0.5" isBengali={isBengali}>
                  {t('search.from')}
                </Typography>
                <Typography variant="h3" className={fromStation ? "text-text-primary" : "text-text-tertiary"} isBengali={isBengali}>
                  {fromStation ? (isBengali ? fromStation.name_bn : fromStation.name_en) : t('station.search_placeholder')}
                </Typography>
              </View>
            </Pressable>

            {/* Swap Button */}
            <Pressable 
              onPress={swapStations}
              className="absolute right-0 top-[28%] bg-bg-card border border-border w-12 h-12 rounded-full items-center justify-center z-20 shadow-md active:scale-90"
            >
              <ArrowsDownUp size={22} color={activeColors.primary} weight="bold" />
            </Pressable>

            {/* To Station */}
            <Pressable 
              onPress={() => setSelectorConfig({ visible: true, type: 'to' })}
              className="flex-row items-center mb-6"
            >
              <View className="z-10 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary items-center justify-center mr-4">
                 <View className="w-2 h-2 rounded-full bg-primary" />
              </View>
              <View className="flex-1">
                <Typography variant="caption" className="text-text-tertiary mb-0.5" isBengali={isBengali}>
                  {t('search.to')}
                </Typography>
                <Typography variant="h3" className={toStation ? "text-text-primary" : "text-text-tertiary"} isBengali={isBengali}>
                  {toStation ? (isBengali ? toStation.name_bn : toStation.name_en) : t('station.search_placeholder')}
                </Typography>
              </View>
            </Pressable>
          </View>

          {/* Date Selector */}
          <Pressable 
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center bg-bg-elevated p-4 rounded-md border border-border mb-6"
          >
            <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
              <CalendarBlank size={24} color={activeColors.primary} weight="duotone" />
            </View>
            <View className="flex-1">
               <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
                 {t('search.date')}
               </Typography>
               <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
                 {formattedDate}
               </Typography>
            </View>
            <CaretRight size={20} color={activeColors['text-tertiary']} />
          </Pressable>

          <Button 
            label={t('search.button')} 
            onPress={handleSearch}
            disabled={!fromStation || !toStation}
            className="w-full h-14"
            isBengali={isBengali}
            icon={ArrowRight}
            iconPosition="right"
          />
        </Card>

        {/* Saved Routes Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Typography variant="h3" className="text-text-primary" isBengali={isBengali}>
              {t('home.saved_routes')}
            </Typography>
            {savedRoutes.length > 0 && (
              <Pressable onPress={() => router.push('/profile')}>
                <Typography variant="label" className="text-primary" isBengali={isBengali}>
                  See All
                </Typography>
              </Pressable>
            )}
          </View>

          {savedRoutes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-1 px-1">
              {savedRoutes.map((route) => (
                <SavedRouteChip 
                  key={route.id} 
                  route={route} 
                  onPress={handleSavedRoutePress} 
                  isBengali={isBengali}
                />
              ))}
              <Pressable 
                onPress={() => router.push('/search')}
                className="bg-primary/10 border border-primary/30 border-dashed rounded-full px-5 py-3 flex-row items-center h-[52px]"
              >
                <View className="mr-2">
                   <Plus size={16} color={activeColors.primary} weight="bold" />
                </View>
                <Typography variant="label" className="text-primary font-inter-semibold" isBengali={isBengali}>
                  {t('common.add')}
                </Typography>
              </Pressable>
            </ScrollView>
          ) : (
            <Card className="p-8 items-center border-dashed border-border-strong bg-transparent">
              <View className="w-16 h-16 rounded-full bg-bg-card items-center justify-center mb-4">
                <MapPin size={32} color={activeColors['text-tertiary']} weight="thin" />
              </View>
              <Typography variant="h4" className="text-text-primary text-center" isBengali={isBengali}>
                {t('home.no_saved_routes')}
              </Typography>
              <Typography variant="body-sm" className="text-text-tertiary text-center mt-2 px-6" isBengali={isBengali}>
                {t('home.no_saved_routes_hint')}
              </Typography>
              <Button 
                label={t('home.add_route')} 
                variant="ghost" 
                size="sm" 
                className="mt-4" 
                onPress={() => router.push('/search')}
                isBengali={isBengali}
              />
            </Card>
          )}
        </View>

        {/* Info Card / Ad / Promo */}
        <Card className="bg-primary p-6 mb-10 relative overflow-hidden">
           <View className="z-10">
             <Typography variant="h3" className="text-text-inverse mb-1" isBengali={isBengali}>
                Travel Smarter.
             </Typography>
             <Typography variant="body" className="text-text-inverse/80 mb-4" isBengali={isBengali}>
                Get real-time updates and live train tracking in our next update.
             </Typography>
             <View className="flex-row">
                <View className="bg-text-inverse px-3 py-1 rounded-full">
                   <Typography variant="label" className="text-primary font-inter-bold" isBengali={isBengali}>
                      PRO
                   </Typography>
                </View>
             </View>
           </View>
           <View className="absolute -right-4 -bottom-4 opacity-20">
              <Train size={120} color="#FFFFFF" weight="duotone" />
           </View>
        </Card>
      </ScrollView>

      {/* Station Selector Modal */}
      <Modal
        visible={selectorConfig.visible}
        animationType="slide"
        presentationStyle="pageSheet"
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
