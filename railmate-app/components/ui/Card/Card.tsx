import React from 'react';
import { View, ViewProps, Pressable } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: () => void;
  className?: string;
  accentColor?: string; // left border accent
}

export const Card: React.FC<CardProps> = ({ children, onPress, className = '', accentColor, ...props }) => {
  const containerClasses = "bg-bg-card border border-border rounded-xl p-4";

  const inner = (
    <>
      {accentColor && (
        <View
          style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 3,
            backgroundColor: accentColor,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
        />
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${containerClasses} active:scale-[0.985] active:opacity-90 overflow-hidden relative ${className}`}
        {...props}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View className={`${containerClasses} overflow-hidden relative ${className}`} {...props}>
      {inner}
    </View>
  );
};
