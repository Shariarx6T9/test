import React from 'react';
import { View, ScrollView, ActivityIndicator, Pressable, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BookmarkSimple, Bookmark, Train, Warning, Users, ChatCircleDots } from 'phosphor-react-native';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/layout/Header';
import { Typography } from '../../components/ui/Typography/Typography';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { TrainTimeline } from '../../components/features/TrainTimeline/TrainTimeline';
import { FareTable } from '../../components/features/FareTable/FareTable';
import { useTrainDetail, useTrainFares } from '../../hooks/useTrainDetail';
import { useSearchStore } from '../../stores/searchStore';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useTranslation } from '../../i18n';
import { Colors } from '../../constants/colors';

export default function TrainDetailScreen() {
  const { id, fromId, toId } = useLocalSearchParams<{
    id: string;
    fromId?: string;
    toId?: string;
  }>();

  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const c = Colors.dark;

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
      const routeToDelete = savedRoutes.find(
        (r) => r.fromStation.id === fromId && r.toStation.id === toId
      );
      if (routeToDelete) await deleteRoute(routeToDelete.id);
    } else {
      const origin = train.stops.find((s) => s.station_id === fromId)?.station;
      const destination = train.stops.find((s) => s.station_id === toId)?.station;
      if (origin && destination) {
        await saveRoute(
          { id: origin.id, name_en: origin.name_en, name_bn: origin.name_bn, code: origin.code },
          { id: destination.id, name_en: destination.name_en, name_bn: destination.name_bn, code: destination.code }
        );
      }
    }
  };

  const headerTitle = train
    ? `${isBengali ? train.name_bn : train.name_en} #${train.number}`
    : t('train.detail');

  const routeSubtitle = train
    ? isBengali
      ? `${train.origin?.name_bn || ''} → ${train.destination?.name_bn || ''}`
      : `${train.origin?.name_en || ''} → ${train.destination?.name_en || ''}`
    : '';

  if (isTrainLoading) {
    return (
      <ScreenWrapper>
        <Header title={t('train.detail')} isBengali={isBengali} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={c.primary} size="large" />
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
    <ScreenWrapper withPadding={false}>
      {/* Padded header */}
      <View className="px-5">
        <Header
          title={headerTitle}
          subtitle={routeSubtitle}
          isBengali={isBengali}
          rightElement={
            fromId && toId ? (
              <Pressable
                onPress={handleBookmark}
                className="w-10 h-10 bg-bg-card border border-border rounded-xl items-center justify-center active:scale-95"
              >
                {isBookmarked ? (
                  <Bookmark size={20} color={c.primary} weight="fill" />
                ) : (
                  <BookmarkSimple size={20} color={c['text-secondary']} />
                )}
              </Pressable>
            ) : undefined
          }
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero image area */}
        <View
          style={{
            height: 180,
            backgroundColor: c['bg-elevated'],
            marginBottom: 24,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#0a1a2e',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Train size={80} color={c.primary} weight="thin" style={{ opacity: 0.3 }} />
          </View>
          {/* Gradient overlay bottom */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: c['bg-base'],
              opacity: 0.9,
            }}
          />
        </View>

        <View className="px-5">
          {/* Community Insights */}
          <View className="mb-6">
            <Typography variant="label" className="text-text-tertiary mb-3 uppercase tracking-widest">
              Community Insights
            </Typography>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-bg-card border border-border rounded-xl p-3 items-center gap-1">
                <Warning size={18} color={c.accent} weight="fill" />
                <Typography variant="label" style={{ color: c.accent }}>15 min delay</Typography>
                <Typography variant="caption" className="text-text-tertiary">Reported</Typography>
              </View>
              <View className="flex-1 bg-bg-card border border-border rounded-xl p-3 items-center gap-1">
                <Users size={18} color={c.danger} weight="fill" />
                <Typography variant="label" style={{ color: c.danger }}>High crowding</Typography>
                <Typography variant="caption" className="text-text-tertiary">Expected</Typography>
              </View>
              <View className="flex-1 bg-bg-card border border-border rounded-xl p-3 items-center gap-1">
                <ChatCircleDots size={18} color={c.info} weight="fill" />
                <Typography variant="label" style={{ color: c.info }}>8 reports</Typography>
                <Typography variant="caption" className="text-text-tertiary">Today</Typography>
              </View>
            </View>
          </View>

          {/* Journey Timeline */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Train size={16} color={c.primary} weight="fill" />
              <Typography variant="label" className="text-text-tertiary uppercase tracking-widest" isBengali={isBengali}>
                {t('train.journey')}
              </Typography>
            </View>
            <Card className="p-4">
              <TrainTimeline stops={train.stops as any} />
            </Card>
          </View>

          {/* Fares */}
          <View className="mb-10">
            <Typography variant="label" className="text-text-tertiary mb-4 uppercase tracking-widest" isBengali={isBengali}>
              {t('train.fares')}
            </Typography>
            {isFaresLoading ? (
              <ActivityIndicator color={c.primary} />
            ) : (
              <>
                <FareTable fares={fares || []} isBengali={isBengali} />
                {fares && fares.length > 0 && fares[0].last_verified && (
                  <Typography variant="caption" className="text-text-tertiary mt-3 text-center" isBengali={isBengali}>
                    {t('train.fare_data_from', {
                      date: new Date(fares[0].last_verified).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US'),
                    })}
                  </Typography>
                )}
              </>
            )}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3 mb-8">
            <Button
              label="Set Alert"
              variant="secondary"
              className="flex-1"
              isBengali={isBengali}
            />
            <Button
              label="Buy Ticket"
              variant="primary"
              className="flex-1"
              isBengali={isBengali}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
