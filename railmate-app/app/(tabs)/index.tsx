import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BellSimple,
  ArrowsDownUp,
  CalendarBlank,
  MapPin,
  Plus,
  Train,
  MagnifyingGlass,
  CaretRight,
  BookmarkSimple,
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
    swapStations,
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
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  const c = activeColors;

  return (
    <ScreenWrapper className="bg-bg-base">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 w-full"
        contentContainerClassName="flex-grow pb-8"
      >
        {/* ── Header ─────────────────────────────── */}
        <View className="flex-row justify-between items-center pt-2 pb-6">
          <View className="flex-row items-center gap-3">
            {/* Logo pill */}
            <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
              <Train size={22} color="#fff" weight="fill" />
            </View>
            <View>
              <View className="flex-row items-baseline gap-1">
                <Typography variant="h3" className="text-text-primary">Rail</Typography>
                <Typography variant="h3" className="text-primary">Mate</Typography>
              </View>
              <Typography variant="caption" className="text-text-tertiary">Bangladesh</Typography>
            </View>
          </View>

          <Pressable className="w-10 h-10 bg-bg-card rounded-xl border border-border items-center justify-center relative">
            <BellSimple size={20} color={c['text-secondary']} weight="duotone" />
            <View className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
          </Pressable>
        </View>

        {/* ── Hero CTA ───────────────────────────── */}
        <View className="mb-6">
          <Typography variant="display-lg" className="text-text-primary" isBengali={isBengali}>
            {t('home.find_journey') || 'Find Your\nJourney'}
          </Typography>
          <Typography variant="body" className="text-text-secondary mt-1" isBengali={isBengali}>
            {t('home.tagline') || 'Search trains. Plan better. Travel Bangladesh.'}
          </Typography>
        </View>

        {/* ── Search Card ────────────────────────── */}
        <Card className="p-5 mb-6">
          {/* Dashed vertical line */}
          <View
            style={{
              position: 'absolute',
              left: 32,
              top: 62,
              bottom: 130,
              width: 1,
              borderLeftWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: c['border-strong'],
            }}
          />

          {/* FROM */}
          <Pressable
            onPress={() => setSelectorConfig({ visible: true, type: 'from' })}
            className="flex-row items-center mb-5"
          >
            <View className="w-8 h-8 rounded-full bg-danger/10 border-2 border-danger items-center justify-center mr-4 z-10">
              <View className="w-2.5 h-2.5 rounded-full bg-danger" />
            </View>
            <View className="flex-1 border-b border-border pb-4">
              <Typography variant="caption" className="text-text-tertiary mb-0.5 uppercase tracking-widest" isBengali={isBengali}>
                {t('search.from')}
              </Typography>
              <Typography
                variant="h3"
                className={fromStation ? 'text-text-primary' : 'text-text-tertiary'}
                isBengali={isBengali}
              >
                {fromStation
                  ? (isBengali ? fromStation.name_bn : fromStation.name_en)
                  : (isBengali ? 'ঢাকা' : t('station.search_placeholder'))}
              </Typography>
            </View>
          </Pressable>

          {/* SWAP */}
          <Pressable
            onPress={swapStations}
            style={{
              position: 'absolute',
              right: 20,
              top: 52,
              zIndex: 20,
            }}
            className="w-10 h-10 bg-bg-elevated border border-border-strong rounded-full items-center justify-center active:scale-90"
          >
            <ArrowsDownUp size={18} color={c.primary} weight="bold" />
          </Pressable>

          {/* TO */}
          <Pressable
            onPress={() => setSelectorConfig({ visible: true, type: 'to' })}
            className="flex-row items-center mb-5"
          >
            <View className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary items-center justify-center mr-4 z-10">
              <View className="w-2.5 h-2.5 rounded-full bg-primary" />
            </View>
            <View className="flex-1">
              <Typography variant="caption" className="text-text-tertiary mb-0.5 uppercase tracking-widest" isBengali={isBengali}>
                {t('search.to')}
              </Typography>
              <Typography
                variant="h3"
                className={toStation ? 'text-text-primary' : 'text-text-tertiary'}
                isBengali={isBengali}
              >
                {toStation
                  ? (isBengali ? toStation.name_bn : toStation.name_en)
                  : (isBengali ? 'চট্টগ্রাম' : t('station.search_placeholder'))}
              </Typography>
            </View>
          </Pressable>

          {/* DATE */}
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center bg-bg-elevated rounded-xl border border-border px-4 py-3 mb-5"
          >
            <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <CalendarBlank size={20} color={c.primary} weight="duotone" />
            </View>
            <View className="flex-1">
              <Typography variant="caption" className="text-text-tertiary uppercase tracking-widest" isBengali={isBengali}>
                {t('search.date')}
              </Typography>
              <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
                {formattedDate}
              </Typography>
            </View>
            <CaretRight size={18} color={c['text-tertiary']} />
          </Pressable>

          <Button
            label={t('search.button')}
            onPress={handleSearch}
            disabled={!fromStation || !toStation}
            className="w-full"
            size="lg"
            isBengali={isBengali}
            icon={MagnifyingGlass}
            iconPosition="left"
          />
        </Card>

        {/* ── Saved Routes ───────────────────────── */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <View className="flex-row items-center gap-2">
              <BookmarkSimple size={18} color={c.accent} weight="fill" />
              <Typography variant="h3" className="text-text-primary" isBengali={isBengali}>
                {t('home.saved_routes')}
              </Typography>
            </View>
            {savedRoutes.length > 0 && (
              <Pressable onPress={() => router.push('/profile')}>
                <View className="flex-row items-center gap-1">
                  <Typography variant="label" className="text-primary" isBengali={isBengali}>
                    {t('home.see_all')}
                  </Typography>
                  <CaretRight size={14} color={c.primary} />
                </View>
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
                className="bg-primary/10 border border-primary/30 border-dashed rounded-full px-5 flex-row items-center h-[52px] mr-3"
              >
                <Plus size={16} color={c.primary} weight="bold" />
                <Typography variant="label" className="text-primary ml-2" isBengali={isBengali}>
                  {t('common.add')}
                </Typography>
              </Pressable>
            </ScrollView>
          ) : (
            <Card className="p-8 items-center border-dashed border-border-strong bg-transparent">
              <View className="w-16 h-16 rounded-full bg-bg-card items-center justify-center mb-4">
                <MapPin size={32} color={c['text-tertiary']} weight="thin" />
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

        {/* ── Promo Banner ───────────────────────── */}
        <Card className="bg-primary p-6 mb-10 relative overflow-hidden">
          <View className="z-10">
            <Typography variant="h3" className="text-text-inverse mb-1" isBengali={isBengali}>
              {t('home.promo_title')}
            </Typography>
            <Typography variant="body" className="text-text-inverse/80 mb-4" isBengali={isBengali}>
              {t('home.promo_body')}
            </Typography>
            <View className="flex-row">
              <View className="bg-text-inverse/20 px-3 py-1 rounded-full">
                <Typography variant="label" className="text-text-inverse" isBengali={isBengali}>
                  {t('home.pro_badge')}
                </Typography>
              </View>
            </View>
          </View>
          <View className="absolute -right-6 -bottom-6 opacity-15">
            <Train size={130} color="#FFFFFF" weight="fill" />
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
