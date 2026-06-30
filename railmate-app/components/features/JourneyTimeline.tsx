import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../ui/AppText';
import { Badge } from '../ui/Badge/Badge';
import { Colors } from '../../constants/colors';

type StopType = 'origin' | 'stop' | 'destination';

interface Stop {
  station_en: string;
  station_bn: string;
  time: string;
  halt_minutes?: number;
  type: StopType;
  is_current?: boolean;
}

interface JourneyTimelineProps {
  stops: Stop[];
  compact?: boolean;
}

/**
 * JourneyTimeline - Vertical timeline showing train stops
 * Shows origin, stops, and destination with connecting dashed lines
 */
export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  stops,
  compact = false,
}) => {
  // If compact, show only origin, one middle stop, and destination
  const displayStops = compact && stops.length > 3
    ? [stops[0], stops[Math.floor(stops.length / 2)], stops[stops.length - 1]]
    : stops;

  return (
    <View style={styles.container}>
      {displayStops.map((stop, index) => (
        <View key={`${stop.station_en}-${index}`}>
          <View style={styles.stopRow}>
            {/* Time */}
            <AppText variant="mono" color={Colors.dark['text-secondary']} style={styles.time}>
              {stop.time}
            </AppText>

            {/* Dot */}
            <View style={styles.dotContainer}>
              {renderDot(stop.type, stop.is_current)}
            </View>

            {/* Station info */}
            <View style={styles.stationInfo}>
              <View style={styles.stationRow}>
                <AppText variant="h4" color={Colors.dark['text-primary']}>
                  {stop.station_en}
                </AppText>
                {stop.type === 'origin' && (
                  <Badge label="Start" variant="success" />
                )}
                {stop.type === 'destination' && (
                  <Badge label="End" variant="neutral" />
                )}
              </View>
              <AppText variant="bengaliSm" color={Colors.dark['text-secondary']}>
                {stop.station_bn}
              </AppText>
            </View>

            {/* Halt duration */}
            {stop.halt_minutes && stop.halt_minutes > 0 && (
              <AppText variant="caption" color={Colors.dark['text-tertiary']} style={styles.halt}>
                ({stop.halt_minutes} min stop)
              </AppText>
            )}
          </View>

          {/* Connecting line */}
          {index < displayStops.length - 1 && (
            <View style={styles.lineContainer}>
              <View style={[
                styles.line,
                { height: compact ? 40 : 52 },
              ]} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

function renderDot(type: StopType, isCurrent?: boolean) {
  if (isCurrent) {
    // Animated pulse dot for current position
    return (
      <View style={styles.currentDot}>
        <View style={styles.currentDotInner} />
      </View>
    );
  }

  if (type === 'origin' || type === 'destination') {
    // Filled circle for origin/destination
    return (
      <View style={[styles.dot, styles.dotFilled]} />
    );
  }

  // Outlined circle for regular stops
  return (
    <View style={[styles.dot, styles.dotOutlined]} />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  time: {
    width: 60,
    paddingTop: 2,
  },
  dotContainer: {
    width: 32,
    alignItems: 'center',
    marginTop: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotFilled: {
    backgroundColor: Colors.dark.primary,
  },
  dotOutlined: {
    borderWidth: 2,
    borderColor: Colors.dark['border-strong'],
    backgroundColor: 'transparent',
  },
  currentDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark['bg-base'],
  },
  stationInfo: {
    flex: 1,
    gap: 2,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  halt: {
    marginLeft: 8,
  },
  lineContainer: {
    flexDirection: 'row',
    paddingLeft: 60 + 16, // time width + half of dot container
  },
  line: {
    width: 2,
    borderLeftWidth: 2,
    borderLeftColor: Colors.dark['border-strong'],
    borderStyle: 'dashed',
  },
});
