import React from 'react';
import { View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MagnifyingGlass, Faders, Train, ArrowRight } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/layout/Header';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { TrainCard } from '../../components/features/TrainCard/TrainCard';
import { useSearchTrains } from '../../hooks/useTrains';
import { useStations } from '../../hooks/useStations';
import { useTranslation } from '../../i18n';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { fromId, toId, date } = useLocalSearchParams<{
    fromId: string;
    toId: string;
    date: string;
  }>();

  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const c = Colors.dark;

  const { data: stations } = useStations();
  const { data: trains, isLoading, error } = useSearchTrains({
    fromStationId: fromId,
    toStationId: toId,
    date: date,
  });

  const fromStation = stations?.find((s) => s.id === fromId);
  const toStation = stations?.find((s) => s.id === toId);

  const formattedDate = new Date(date).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const headerTitle = fromStation && toStation
    ? (isBengali
        ? `${fromStation.name_bn} → ${toStation.name_bn}`
        : `${fromStation.name_en} → ${toStation.name_en}`)
    : t('results.title');

  const renderHeader = () => (
    <View className="mb-5">
      {/* Route pill */}
      <View className="flex-row items-center gap-2 bg-bg-card border border-border rounded-full px-4 py-2.5 self-start mb-4">
        <Train size={15} color={c.primary} weight="fill" />
        <Typography variant="label" className="text-primary">{formattedDate}</Typography>
        <View style={{ width: 1, height: 12, backgroundColor: c['border-strong'] }} />
        <Typography variant="label" className="text-text-secondary">
          {t('results.found', { count: trains?.length || 0 })}
        </Typography>
      </View>

      {/* Sub-header row */}
      <View className="flex-row items-center justify-between">
        <Typography variant="h4" className="text-text-secondary" isBengali={isBengali}>
          {t('search.all_classes') || 'Today • All Classes'}
        </Typography>
        <Pressable className="flex-row items-center gap-1.5 bg-bg-card border border-border rounded-full px-3 py-1.5">
          <Faders size={15} color={c['text-secondary']} />
          <Typography variant="label" className="text-text-secondary">Filter</Typography>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <Header
        title={headerTitle}
        subtitle={formattedDate}
        isBengali={isBengali}
        rightElement={
          <Pressable className="w-10 h-10 bg-bg-card border border-border rounded-xl items-center justify-center">
            <Faders size={20} color={c['text-secondary']} />
          </Pressable>
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-4">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center">
            <Train size={32} color={c.primary} weight="duotone" />
          </View>
          <ActivityIndicator color={c.primary} size="large" />
          <Typography variant="body" className="text-text-secondary" isBengali={isBengali}>
            {t('loading')}
          </Typography>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6 gap-4">
          <Typography variant="h4" className="text-danger text-center" isBengali={isBengali}>
            {t('error.generic')}
          </Typography>
          <Button
            label="Try Again"
            onPress={() => router.back()}
            isBengali={isBengali}
          />
        </View>
      ) : trains && trains.length > 0 ? (
        <FlatList
          data={trains}
          keyExtractor={(item) => item.train_id}
          renderItem={({ item }) => (
            <TrainCard train={item} fromId={fromId} toId={toId} />
          )}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-6 gap-4">
          <View className="w-20 h-20 rounded-full bg-bg-card border border-border items-center justify-center">
            <MagnifyingGlass size={40} color={c['text-tertiary']} weight="thin" />
          </View>
          <Typography variant="h3" className="text-text-primary text-center" isBengali={isBengali}>
            {t('results.none')}
          </Typography>
          <Typography variant="body" className="text-text-secondary text-center" isBengali={isBengali}>
            {t('results.none_hint')}
          </Typography>
          <Button
            label="Search Again"
            variant="secondary"
            onPress={() => router.back()}
            isBengali={isBengali}
            icon={ArrowRight}
            iconPosition="right"
          />
        </View>
      )}
    </ScreenWrapper>
  );
}
