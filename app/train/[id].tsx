import React from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BookmarkSimple, Bookmark } from 'phosphor-react-native';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/layout/Header';
import { Typography } from '../../components/ui/Typography/Typography';
import { Card } from '../../components/ui/Card/Card';
import { TrainTimeline } from '../../components/features/TrainTimeline/TrainTimeline';
import { FareTable } from '../../components/features/FareTable/FareTable';
import { useTrainDetail, useTrainFares } from '../../hooks/useTrainDetail';
import { useSearchStore } from '../../stores/searchStore';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useTranslation } from '../../i18n';

export default function TrainDetailScreen() {
  const { id, fromId, toId } = useLocalSearchParams<{
    id: string;
    fromId?: string;
    toId?: string;
  }>();

  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const { date } = useSearchStore();
  const { savedRoutes, saveRoute, deleteRoute, isRouteSaved } = useSavedRoutes();

  const { data: train, isLoading: isTrainLoading } = useTrainDetail(id);
  const { data: fares, isLoading: isFaresLoading } = useTrainFares({
    trainId: id,
    fromStationId: fromId || '',
    toStationId: toId || '',
  });

  const isBookmarked = fromId && toId ? isRouteSaved(fromId, toId) : false;

  const handleBookmark = async () => {
    if (!fromId || !toId || !train) return;

    if (isBookmarked) {
      // Find the saved route ID to delete
      const routeToDelete = savedRoutes.find(
        r => r.fromStation.id === fromId && r.toStation.id === toId
      );
      if (routeToDelete) {
        await deleteRoute(routeToDelete.id);
      }
    } else {
      // Find origin and destination from stops or search store
      const origin = train.stops.find(s => s.station_id === fromId)?.station;
      const destination = train.stops.find(s => s.station_id === toId)?.station;

      if (origin && destination) {
        await saveRoute(
          { id: origin.id, name_en: origin.name_en, name_bn: origin.name_bn, code: origin.code },
          { id: destination.id, name_en: destination.name_en, name_bn: destination.name_bn, code: destination.code }
        );
      }
    }
  };

  const formattedDate = new Date(date).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const headerTitle = train ? `${isBengali ? train.name_bn : train.name_en} #${train.number}` : t('train.detail');

  if (isTrainLoading) {
    return (
      <ScreenWrapper>
        <Header title={t('train.detail')} isBengali={isBengali} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#00A859" size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!train) {
    return (
      <ScreenWrapper>
        <Header title={t('train.detail')} isBengali={isBengali} />
        <View className="flex-1 items-center justify-center p-6">
          <Typography variant="h4" className="text-danger text-center" isBengali={isBengali}>
            Train not found
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header 
        title={headerTitle} 
        isBengali={isBengali} 
        rightElement={
          fromId && toId ? (
            <Pressable onPress={handleBookmark} className="p-2 -mr-2">
              {isBookmarked ? (
                <Bookmark size={24} color="#00A859" weight="fill" />
              ) : (
                <BookmarkSimple size={24} color="#8FA3C0" />
              )}
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Subheader */}
        <View className="mb-6">
          <Typography variant="body" className="text-text-secondary" isBengali={isBengali}>
            {isBengali 
              ? `${train.origin?.name_bn || ''} → ${train.destination?.name_bn || ''}` 
              : `${train.origin?.name_en || ''} → ${train.destination?.name_en || ''}`}
          </Typography>
          <Typography variant="caption" className="text-text-tertiary" isBengali={isBengali}>
            {formattedDate}
          </Typography>
        </View>

        {/* Journey Section */}
        <View className="mb-8">
          <Typography variant="label" className="text-text-tertiary mb-4 uppercase tracking-widest" isBengali={isBengali}>
            {t('train.journey')}
          </Typography>
          <TrainTimeline stops={train.stops as any} />
        </View>

        {/* Fares Section */}
        <View className="mb-10">
          <Typography variant="label" className="text-text-tertiary mb-4 uppercase tracking-widest" isBengali={isBengali}>
            {t('train.fares')}
          </Typography>
          {isFaresLoading ? (
            <ActivityIndicator color="#00A859" />
          ) : (
            <>
              <FareTable fares={fares || []} isBengali={isBengali} />
              {fares && fares.length > 0 && fares[0].last_verified && (
                <Typography variant="caption" className="text-text-tertiary mt-3 text-center" isBengali={isBengali}>
                  {t('train.fare_data_from', { date: new Date(fares[0].last_verified).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US') })}
                </Typography>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
