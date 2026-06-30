import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/radius';

/**
 * SkeletonTrainCard - Loading placeholder matching TrainCard layout
 */
export const SkeletonTrainCard: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <Skeleton width={60} height={24} radius={6} />
        <Skeleton width={120} height={20} radius={6} />
        <View style={styles.spacer} />
        <Skeleton width={80} height={24} radius={12} />
      </View>

      {/* Route */}
      <View style={styles.row}>
        <Skeleton width="60%" height={14} radius={4} />
      </View>

      {/* Times */}
      <View style={styles.timesRow}>
        <Skeleton width={60} height={28} radius={6} />
        <Skeleton width={80} height={12} radius={4} />
        <Skeleton width={60} height={28} radius={6} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom row */}
      <View style={styles.row}>
        <Skeleton width={100} height={14} radius={4} />
        <View style={styles.spacer} />
        <Skeleton width={80} height={14} radius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark['bg-card'],
    borderRadius: Radius['radius-md'],
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
  },
});
