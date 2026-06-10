import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '../Typography/Typography';

interface ChipProps {
  label: string;
  onPress?: () => void;
  isActive?: boolean;
  className?: string;
  isBengali?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  isActive = false,
  className = '',
  isBengali = false,
}) => {
  const containerClasses = isActive 
    ? "bg-primary border-primary"
    : "bg-primary-subtle border-transparent";
  
  const textClasses = isActive
    ? "text-text-inverse"
    : "text-primary";

  if (onPress) {
    return (
      <Pressable 
        onPress={onPress}
        className={`px-3 py-1 rounded-full border-[1px] items-center justify-center ${containerClasses} ${className}`}
      >
        <Typography variant="label" className={textClasses} isBengali={isBengali}>
          {label}
        </Typography>
      </Pressable>
    );
  }

  return (
    <View className={`px-3 py-1 rounded-full border-[1px] items-center justify-center ${containerClasses} ${className}`}>
      <Typography variant="label" className={textClasses} isBengali={isBengali}>
        {label}
      </Typography>
    </View>
  );
};
