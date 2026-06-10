import React from 'react';
import { View, ViewProps, Pressable } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, onPress, className = '', ...props }) => {
  const containerClasses = "bg-bg-card border border-border rounded-md p-4";
  
  if (onPress) {
    return (
      <Pressable 
        onPress={onPress}
        className={`${containerClasses} active:scale-[0.99] ${className}`}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={`${containerClasses} ${className}`} {...props}>
      {children}
    </View>
  );
};
