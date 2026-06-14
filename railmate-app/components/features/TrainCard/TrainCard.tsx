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
import { Clock, Warning, Star, CheckCircle, Users } from 'phosphor-react-native';
import { Colors } from '../../../constants/colors';

interface TrainCardProps {
  train: TrainSearchResult;
  fromId?: string;
  toId?: string;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, fromId, toId }) => {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const c = Colors.dark;

  const handlePress = () => {
    router.push({
      pathname: '/train/[id]',
      params: { id: train.train_id, fromId, toId },
    });
  };

  // Mock status for demo — replace with real community data when available
  const statusType: 'ontime' | 'delay' | 'crowded' | null = null;

  return (
    <Card
      onPress={handlePress}
      className="pl-5 mb-3"
      accentColor={c.primary}
    >
      {/* Train Name Row */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-3">
          <Typography variant="h4" className="text-text-primary">
            {train.train_name_en}
          </Typography>
          <Typography variant="caption" className="text-text-secondary mt-0.5" isBengali={true}>
            {train.train_name_bn}
          </Typography>
        </View>
        <View className="flex-row items-center gap-1">
          <Star size={14} color={c.accent} weight="fill" />
          <Typography variant="caption" className="text-text-tertiary">
            #{train.train_number}
          </Typography>
        </View>
      </View>

      {/* Time Row */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Typography style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 22, color: c['text-primary'], letterSpacing: -0.5 }}>
            {formatTime(train.departure_time)}
          </Typography>
          <View className="items-center px-2">
            <View style={{ width: 32, height: 1, backgroundColor: c['border-strong'] }} />
            <View className="bg-bg-overlay rounded-full px-2 py-0.5 mt-1 flex-row items-center gap-1">
              <Clock size={11} color={c['text-tertiary']} />
              <Typography style={{ fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: c['text-secondary'] }}>
                {formatDuration(train.duration_minutes)}
              </Typography>
            </View>
          </View>
          <Typography style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 22, color: c['text-primary'], letterSpacing: -0.5 }}>
            {formatTime(train.arrival_time)}
          </Typography>
        </View>
      </View>

      {/* Status Badge */}
      {statusType === 'delay' && (
        <View className="flex-row items-center gap-1.5 mb-3">
          <Warning size={14} color={c.accent} weight="fill" />
          <Typography variant="caption" style={{ color: c.accent }}>15 min delay reported</Typography>
        </View>
      )}
      {statusType === 'ontime' && (
        <View className="flex-row items-center gap-1.5 mb-3">
          <CheckCircle size={14} color={c.success} weight="fill" />
          <Typography variant="caption" style={{ color: c.success }}>On Time</Typography>
        </View>
      )}
      {statusType === 'crowded' && (
        <View className="flex-row items-center gap-1.5 mb-3">
          <Users size={14} color={c.danger} weight="fill" />
          <Typography variant="caption" style={{ color: c.danger }}>Crowding: High</Typography>
        </View>
      )}

      {/* Class Chips */}
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
