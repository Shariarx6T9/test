import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../ui/Typography/Typography';
import { TrainStop, Station } from '../../../types/database.types';
import { formatTime } from '../../../utils/formatTime';
import { useTranslation } from '../../../i18n';

interface TrainTimelineProps {
  stops: (TrainStop & { station: Station })[];
}

export const TrainTimeline: React.FC<TrainTimelineProps> = ({ stops }) => {
  const { t } = useTranslation();

  return (
    <View className="py-2">
      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        
        return (
          <View key={stop.id} className="flex-row">
            {/* Left Column: Timeline Graphics */}
            <View className="items-center w-6 mr-4">
              {/* Top Line */}
              <View className={`w-[2px] h-2 ${isFirst ? 'bg-transparent' : 'bg-primary'}`} />
              
              {/* Dot */}
              <View className="w-2 h-2 rounded-full bg-primary" />
              
              {/* Bottom Line */}
              <View className={`flex-1 w-[2px] min-h-[40px] ${isLast ? 'bg-transparent' : 'bg-primary'}`} />
            </View>

            {/* Right Column: Stop Info */}
            <View className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                  <Typography 
                    variant={isFirst || isLast ? "h4" : "body-sm"} 
                    className="text-text-primary"
                  >
                    {stop.station.name_en}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className="text-text-secondary" 
                    isBengali={true}
                  >
                    {stop.station.name_bn}
                  </Typography>
                </View>

                <View className="items-end">
                  {isFirst ? (
                    <Typography variant="time" className="text-text-primary">
                      {formatTime(stop.departure_time)}
                    </Typography>
                  ) : isLast ? (
                    <Typography variant="time" className="text-text-primary">
                      {formatTime(stop.arrival_time)}
                    </Typography>
                  ) : (
                    <View className="items-end">
                      <View className="flex-row items-center">
                         <Typography variant="time" className="text-text-primary">
                          {formatTime(stop.arrival_time)}
                        </Typography>
                        <Typography variant="caption" className="text-text-tertiary mx-1">
                          →
                        </Typography>
                        <Typography variant="time" className="text-text-primary">
                          {formatTime(stop.departure_time)}
                        </Typography>
                      </View>
                      {stop.halt_minutes > 0 && (
                        <Typography variant="caption" className="text-text-tertiary mt-0.5">
                          ({t('train.halt', { minutes: stop.halt_minutes })})
                        </Typography>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
