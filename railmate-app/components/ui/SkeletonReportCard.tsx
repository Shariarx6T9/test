import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/radius';

/**
 * SkeletonReportCard - Loading placeholder matching CommunityReportCard layout
 */
export const SkeletonReportCard: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Header with avatar */}
      <View style={styles.header}>
        <Skeleton width={40} height={40} radius={20} />
        <View style={styles.headerText}>
          <Skeleton width={120} height={14} radius={4} />
          <Skeleton width={180} height={12} radius={4} style={styles.spacing} />
        </View>
      </View>

      {/* Report type header */}
      <Skeleton width="80%" height={18} radius={4} style={styles.spacing} />

      {/* Description */}
      <Skeleton width="100%" height={14} radius={4} />
      <Skeleton width="90%" height={14} radius={4} style={styles.spacing} />

      {/* Confirmation row */}
      <Skeleton width={150} height={12} radius={4} style={styles.spacing} />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Action bar */}
      <View style={styles.actions}>
        <Skeleton width={60} height={14} radius={4} />
        <Skeleton width={80} height={14} radius={4} />
        <Skeleton width={60} height={14} radius={4} />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  spacing: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
