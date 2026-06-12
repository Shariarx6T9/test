import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Card } from '../../ui/Card/Card';
import { Typography } from '../../ui/Typography/Typography';
import { Chip } from '../../ui/Chip/Chip';
import { TrainSearchResult } from '../../../types/train.types';
import { formatTime } from '../../../utils/formatTime';
import { formatDuration } from '../../../utils/formatDuration';
import { useTranslation } from '../../../i18n';
import { Clock } from 'phosphor-react-native';

interface TrainCardProps {
  train: TrainSearchResult;
  fromId?: string;
  toId?: string;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, fromId, toId }) => {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const handlePress = () => {
    router.push({
      pathname: '/train/[id]',
      params: { id: train.train_id, fromId, toId },
    });
  };

  return (
    <Card onPress={handlePress} className="relative overflow-hidden pl-5">
      {/* 3px left accent bar */}
      <View className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
      
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Typography variant="h4" className="text-text-primary">
            {train.train_name_en}
          </Typography>
          <Typography variant="caption" className="text-text-secondary" isBengali={true}>
            {train.train_name_bn}
          </Typography>
        </View>
        <Typography variant="caption" className="text-text-tertiary">
          #{train.train_number}
        </Typography>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Typography variant="time" className="text-text-primary">
            {formatTime(train.departure_time)}
          </Typography>
          <View className="mx-2 h-[1px] w-4 bg-border-strong" />
          <Typography variant="time" className="text-text-primary">
            {formatTime(train.arrival_time)}
          </Typography>
        </View>

        <View className="flex-row items-center bg-bg-overlay px-2 py-1 rounded-sm">
          <Clock size={14} color="#8FA3C0" />
          <Typography variant="mono" className="text-text-secondary ml-1">
            {formatDuration(train.duration_minutes)}
          </Typography>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {train.available_classes.map((cls) => (
          <Chip
            key={cls}
            label={t(`fare.class.${cls}` as any)}
            isBengali={isBengali}
          />
        ))}
      </View>
    </Card>
  );
};
