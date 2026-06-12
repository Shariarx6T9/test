import React from 'react';
import { View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MagnifyingGlass, CaretLeft, Faders } from 'phosphor-react-native';
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

  const { data: stations } = useStations();
  const { data: trains, isLoading, error } = useSearchTrains({
    fromStationId: fromId,
    toStationId: toId,
    date: date,
  });

  const fromStation = stations?.find((s) => s.id === fromId);
  const toStation = stations?.find((s) => s.id === toId);

  const formattedDate = new Date(date).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const headerTitle = fromStation && toStation 
    ? (isBengali ? `${fromStation.name_bn} → ${toStation.name_bn}` : `${fromStation.name_en} → ${toStation.name_en}`)
    : t('results.title');

  const renderHeader = () => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Typography variant="body" className="text-text-secondary" isBengali={isBengali}>
          {formattedDate}
        </Typography>
        <Typography variant="body" className="text-primary" isBengali={isBengali}>
          {t('results.found', { count: trains?.length || 0 })}
        </Typography>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <Header 
        title={headerTitle} 
        isBengali={isBengali} 
        rightElement={
          <Pressable className="p-2 -mr-2">
            <Faders size={24} color={Colors.dark['text-secondary']} />
          </Pressable>
        }
      />
      
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#00A859" size="large" />
          <Typography variant="body" className="text-text-secondary mt-4" isBengali={isBengali}>
            {t('loading')}
          </Typography>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Typography variant="h4" className="text-danger text-center" isBengali={isBengali}>
            {t('error.generic')}
          </Typography>
          <Button 
            label="Try Again" 
            onPress={() => router.back()} 
            className="mt-6"
            isBengali={isBengali}
          />
        </View>
      ) : trains && trains.length > 0 ? (
        <FlatList
          data={trains}
          keyExtractor={(item) => item.train_id}
          renderItem={({ item }) => (
            <View className="mb-4">
              <TrainCard train={item} fromId={fromId} toId={toId} />
            </View>
          )}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-20 h-20 rounded-full bg-bg-card items-center justify-center mb-6">
            <MagnifyingGlass size={48} color={Colors.dark['text-tertiary']} weight="thin" />
          </View>
          <Typography variant="h3" className="text-text-primary text-center mb-2" isBengali={isBengali}>
            {t('results.none')}
          </Typography>
          <Typography variant="body" className="text-text-secondary text-center mb-8" isBengali={isBengali}>
            {t('results.none_hint')}
          </Typography>
          <Button 
            label="Search Again" 
            variant="secondary"
            onPress={() => router.back()} 
            isBengali={isBengali}
          />
        </View>
      )}
    </ScreenWrapper>
  );
}
