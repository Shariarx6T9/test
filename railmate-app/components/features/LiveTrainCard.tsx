import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import type { LiveTrainPosition } from '../../types/liveTracking.types';
import { TrainProgressBar } from './TrainProgressBar';

const C = Colors.dark;

interface LiveTrainCardProps {
  train: LiveTrainPosition;
  onPress: () => void;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function statusColor(status: LiveTrainPosition['live_status']): string {
  switch (status) {
    case 'ON_TIME':   return C.success;
    case 'DELAYED':   return C.danger;
    case 'ARRIVED':   return C['border-strong'];
    case 'SCHEDULED':
    default:          return C['text-tertiary'];
  }
}

function statusLabel(status: LiveTrainPosition['live_status']): string {
  switch (status) {
    case 'ON_TIME':   return 'On Time';
    case 'DELAYED':   return 'Delayed';
    case 'ARRIVED':   return 'Arrived';
    case 'SCHEDULED': return 'Scheduled';
    default:          return status;
  }
}

export function LiveTrainCard({ train, onPress }: LiveTrainCardProps) {
  const color = statusColor(train.live_status);
  const depTime = formatTime(train.scheduled_departure);
  const arrTime = formatTime(train.scheduled_arrival);
  const hasDelay = train.estimated_delay_minutes > 0;

  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }]}
      onPress={onPress}
    >
      {/* Top row: number + name + status */}
      <View style={s.topRow}>
        <Text style={s.trainNumber}>#{train.train_number}</Text>
        <Text style={s.trainName} numberOfLines={1}>{train.train_name_en}</Text>
        <View style={[s.statusBadge, { backgroundColor: `${color}20` }]}>
          <Text style={[s.statusText, { color }]}>{statusLabel(train.live_status)}</Text>
        </View>
      </View>

      {/* Route row */}
      <Text style={s.routeText} numberOfLines={1}>
        {train.origin_name_en} → {train.destination_name_en}
      </Text>

      {/* Time row */}
      <View style={s.timeRow}>
        <Text style={s.timeText}>{depTime}</Text>
        <Text style={s.timeSep}> → </Text>
        <Text style={s.timeText}>{arrTime}</Text>
        {hasDelay && (
          <View style={s.delayBadge}>
            <Text style={s.delayText}>+{train.estimated_delay_minutes}m</Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      <TrainProgressBar
        progress={train.progress_pct}
        status={train.live_status}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C['bg-card'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trainNumber: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: C['text-secondary'],
  },
  trainName: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: C['text-primary'],
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  routeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: C['text-secondary'],
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: C['text-primary'],
  },
  timeSep: {
    fontSize: 12,
    color: C['text-tertiary'],
  },
  delayBadge: {
    marginLeft: 8,
    backgroundColor: `${C.danger}20`,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  delayText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.danger,
  },
});
