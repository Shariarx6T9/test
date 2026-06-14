import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TrainStop, Station } from '../../../types/database.types';
import { formatTime } from '../../../utils/formatTime';

const C = { primary:'#00A859', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', border:'#1E2E42', borderStrong:'#2A3F57' };

interface TrainTimelineProps { stops: (TrainStop & { station: Station })[]; }

export const TrainTimeline: React.FC<TrainTimelineProps> = ({ stops }) => (
  <View style={{ paddingVertical: 8 }}>
    {stops.map((stop, index) => {
      const isFirst = index === 0;
      const isLast  = index === stops.length - 1;
      const isMid   = !isFirst && !isLast;
      return (
        <View key={stop.id} style={{ flexDirection: 'row' }}>
          {/* Line + dot */}
          <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}>
            <View style={{ width: 2, height: isFirst ? 10 : 14, backgroundColor: isFirst ? 'transparent' : C.primary }} />
            <View style={[s.dot, (isFirst || isLast) ? s.dotEnd : s.dotMid]} />
            {!isLast && <View style={{ flex: 1, width: 2, minHeight: 44, backgroundColor: C.primary, opacity: 0.35 }} />}
          </View>
          {/* Text */}
          <View style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={[s.stationName, (isFirst || isLast) && s.stationNameEnd]}>{stop.station.name_en}</Text>
                {(isFirst || isLast) && (
                  <Text style={s.stationRole}>{isFirst ? 'Departure' : 'Arrival'}</Text>
                )}
                {isMid && stop.halt_minutes > 0 && (
                  <Text style={s.stopInfo}>{formatTime(stop.arrival_time)} • {stop.halt_minutes}m stop</Text>
                )}
              </View>
              <Text style={[s.timeText, (isFirst || isLast) && s.timeTextEnd]}>
                {isFirst ? formatTime(stop.departure_time) : formatTime(stop.arrival_time)}
              </Text>
            </View>
          </View>
        </View>
      );
    })}
  </View>
);

const s = StyleSheet.create({
  dot:           { width: 12, height: 12, borderRadius: 6 },
  dotEnd:        { width: 16, height: 16, borderRadius: 8, backgroundColor: C.primary },
  dotMid:        { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: C.borderStrong, backgroundColor: 'transparent' },
  stationName:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec, lineHeight: 20 },
  stationNameEnd:{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.textPri },
  stationRole:   { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.primary, marginTop: 2 },
  stopInfo:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer, marginTop: 2 },
  timeText:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: C.textSec },
  timeTextEnd:   { fontFamily: 'JetBrainsMono_500Medium', fontSize: 15, color: C.textPri },
});
