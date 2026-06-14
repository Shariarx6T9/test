import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  withPadding?: boolean;
  bgColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  withPadding = true,
  bgColor = '#080D17',
  style,
  ...props
}) => {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={bgColor} />
      <View
        style={[
          styles.inner,
          { backgroundColor: bgColor },
          withPadding && styles.padding,
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1 },
  inner:   { flex: 1, width: '100%' },
  padding: { paddingHorizontal: 20 },
});
