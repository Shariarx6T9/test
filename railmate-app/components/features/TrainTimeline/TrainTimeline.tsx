import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../ui/Typography/Typography';
import { TrainStop, Station } from '../../../types/database.types';
import { formatTime } from '../../../utils/formatTime';
import { useTranslation } from '../../../i18n';
import { Colors } from '../../../constants/colors';

interface TrainTimelineProps {
  stops: (TrainStop & { station: Station })[];
}

export const TrainTimeline: React.FC<TrainTimelineProps> = ({ stops }) => {
  const { t } = useTranslation();
  const c = Colors.dark;

  return (
    <View className="py-2">
      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        const isMid = !isFirst && !isLast;

        const dotSize = isFirst || isLast ? 16 : 12;
        const dotBg = isFirst || isLast ? c.primary : 'transparent';
        const dotBorder = isFirst || isLast ? c.primary : c['border-strong'];
        const dotBorderWidth = isFirst || isLast ? 0 : 2;

        return (
          <View key={stop.id} className="flex-row">
            {/* Timeline column */}
            <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}>
              {/* Top connector */}
              <View style={{
                width: 2,
                height: isFirst ? 10 : 12,
                backgroundColor: isFirst ? 'transparent' : c.primary,
              }} />

              {/* Node dot */}
              <View style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: dotBg,
                borderWidth: dotBorderWidth,
                borderColor: dotBorder,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isMid && (
                  <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: c['border-strong'] }} />
                )}
              </View>

              {/* Bottom connector */}
              {!isLast && (
                <View style={{ flex: 1, width: 2, minHeight: 44, backgroundColor: c.primary, opacity: 0.4 }} />
              )}
            </View>

            {/* Content column */}
            <View style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                  <Typography
                    variant={isFirst || isLast ? 'h4' : 'body'}
                    className={isFirst || isLast ? 'text-text-primary' : 'text-text-secondary'}
                  >
                    {stop.station.name_en}
                  </Typography>
                  {(isFirst || isLast) && (
                    <Typography variant="caption" className="text-primary mt-0.5" isBengali={true}>
                      {isFirst ? 'Departure' : 'Arrival'}
                    </Typography>
                  )}
                  {isMid && stop.halt_minutes > 0 && (
                    <Typography variant="caption" className="text-text-tertiary mt-0.5">
                      {formatTime(stop.arrival_time)} • {stop.halt_minutes}m stop
                    </Typography>
                  )}
                </View>

                <View className="items-end">
                  <Typography
                    style={{
                      fontFamily: 'JetBrainsMono_500Medium',
                      fontSize: isFirst || isLast ? 16 : 14,
                      color: isFirst || isLast ? c['text-primary'] : c['text-secondary'],
                      letterSpacing: -0.3,
                    }}
                  >
                    {isFirst
                      ? formatTime(stop.departure_time)
                      : isLast
                      ? formatTime(stop.arrival_time)
                      : formatTime(stop.arrival_time)}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
