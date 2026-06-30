import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/radius';

interface TrainNumberBadgeProps {
  number: string;
  style?: ViewStyle;
}

/**
 * TrainNumberBadge - Displays train number with # prefix
 * Used in train cards and train detail screens
 */
export const TrainNumberBadge: React.FC<TrainNumberBadgeProps> = ({ number, style }) => {
  return (
    <View style={[styles.container, style]}>
      <AppText variant="labelLg" color={Colors.dark.primary}>
        #{number}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.dark['bg-card'],
    borderRadius: Radius['radius-sm'],
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    alignSelf: 'flex-start',
  },
});
