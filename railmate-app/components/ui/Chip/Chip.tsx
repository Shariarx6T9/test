import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '../Typography/Typography';

interface ChipProps {
  label: string;
  onPress?: () => void;
  isActive?: boolean;
  className?: string;
  isBengali?: boolean;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  isActive = false,
  className = '',
  isBengali = false,
  icon,
}) => {
  const containerClasses = isActive
    ? 'bg-primary border-primary'
    : 'bg-bg-elevated border-border-strong';

  const textClasses = isActive ? 'text-text-inverse' : 'text-text-secondary';

  const content = (
    <View className="flex-row items-center gap-1">
      {icon}
      <Typography variant="label" className={textClasses} isBengali={isBengali}>
        {label}
      </Typography>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`px-3 py-1.5 rounded-lg border items-center justify-center ${containerClasses} ${className}`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={`px-3 py-1.5 rounded-lg border items-center justify-center ${containerClasses} ${className}`}>
      {content}
    </View>
  );
};
