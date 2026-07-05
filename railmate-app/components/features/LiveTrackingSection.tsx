import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Chip } from '../ui/Chip/Chip';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { useLiveTrainPositions } from '../../hooks/useLiveTrainPositions';
import { LiveTrainCard } from './LiveTrainCard';
import { useTranslation } from '../../i18n';
import type { LiveTrainPosition } from '../../types/liveTracking.types';

const C = Colors.dark;

type StatusFilter = 'ALL' | 'ON_TIME' | 'DELAYED' | 'SCHEDULED';

interface LiveTrackingSectionProps {
  journeyDate: string;
  onTrainPress: (trainId: string) => void;
}

export function LiveTrackingSection({ journeyDate, onTrainPress }: LiveTrackingSectionProps) {
  const { t } = useTranslation();
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('ALL');
  const { data: trains = [], isLoading, error, refetch } = useLiveTrainPositions(journeyDate);

  const filteredTrains: LiveTrainPosition[] =
    activeStatus === 'ALL'
      ? trains
      : trains.filter((tr) => tr.live_status === activeStatus);

  const liveCount = trains.filter(
    (tr) => tr.live_status === 'ON_TIME' || tr.live_status === 'DELAYED',
  ).length;

  const statusChips: { key: StatusFilter; label: string }[] = [
    { key: 'ALL',       label: 'All' },
    { key: 'ON_TIME',   label: 'On Time' },
    { key: 'DELAYED',   label: 'Delayed' },
    { key: 'SCHEDULED', label: 'Scheduled' },
  ];

  return (
    <View style={s.container}>
      {/* Stat line */}
      {!isLoading && !error && trains.length > 0 && (
        <View style={s.statLine}>
          <Text style={s.statText}>
            {t('updates.stat_tracked', { count: trains.length })}{' · '}
            {t('updates.stat_live', { liveCount })}
          </Text>
        </View>
      )}

      {/* Disclaimer */}
      <Text style={s.disclaimer}>{t('updates.tracking_disclaimer')}</Text>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.chipsWrap}
        contentContainerStyle={s.chipsContent}
      >
        {statusChips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            isActive={activeStatus === chip.key}
            onPress={() => setActiveStatus(chip.key)}
          />
        ))}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <>
          <Skeleton width="100%" height={90} radius={12} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={90} radius={12} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={90} radius={12} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={90} radius={12} style={{ marginBottom: 10 }} />
        </>
      ) : error ? (
        <EmptyState
          iconName="Warning"
          title={t('updates.tracking_error')}
          description="Please check your connection and try again"
          ctaLabel="Retry"
          onCta={refetch}
        />
      ) : filteredTrains.length === 0 ? (
        <EmptyState
          iconName="Train"
          title={t('updates.tracking_empty')}
          description="No trains are being tracked for this date"
        />
      ) : (
        filteredTrains.map((train) => (
          <LiveTrainCard
            key={train.train_id}
            train={train}
            onPress={() => onTrainPress(train.train_id)}
          />
        ))
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  statLine: {
    marginBottom: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: C['text-primary'],
  },
  disclaimer: {
    fontSize: 11,
    fontStyle: 'italic',
    color: C['text-tertiary'],
    marginBottom: 10,
  },
  chipsWrap: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 12,
  },
  chipsContent: {
    flexDirection: 'row',
    gap: 8,
  },
});
