import React, { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Typography } from '../Typography/Typography';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  isBengali?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = '',
  isBengali = false,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === 'light' ? 'light' : 'dark';
  const currentColors = Colors[theme];

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Typography variant="label" className="mb-1.5 ml-1 text-text-secondary" isBengali={isBengali}>
          {label}
        </Typography>
      )}
      <View
        className={`h-[48px] px-4 bg-bg-card border-[1.5px] rounded-sm flex-row items-center ${
          error ? 'border-danger' : isFocused ? 'border-border-focus' : 'border-border'
        }`}
      >
        <TextInput
          className="flex-1 text-text-primary font-inter text-[14px]"
          placeholderTextColor={currentColors['text-tertiary']}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={currentColors['primary']}
          {...props}
        />
      </View>
      {error && (
        <Typography variant="caption" className="mt-1 ml-1 text-danger" isBengali={isBengali}>
          {error}
        </Typography>
      )}
    </View>
  );
};
