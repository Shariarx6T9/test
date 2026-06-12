import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  withPadding?: boolean;
  /**
   * Background class applied to BOTH the SafeAreaView and the inner View.
   * Defaults to 'bg-bg-base'. Pass a different token to override, e.g. 'bg-bg-elevated'.
   */
  bgClass?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  withPadding = true,
  bgClass = 'bg-bg-base',
  className = '',
  ...props
}) => {
  return (
    <SafeAreaView
      className={`flex-1 ${bgClass}`}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style="auto" />
      <View
        className={`flex-1 ${withPadding ? 'px-4' : ''} ${bgClass} ${className}`}
        {...props}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
