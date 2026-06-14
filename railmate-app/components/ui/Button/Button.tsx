import React from 'react';
import { Pressable, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  isBengali = false,
  disabled,
  onPress,
  style,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;
  const fontFamily = isBengali ? 'NotoSansBengali_600SemiBold' : 'Inter_600SemiBold';
  const bg       = variant === 'primary' ? '#00A859' : 'transparent';
  const bdr      = variant === 'secondary' ? { borderWidth: 1.5, borderColor: '#00A859' } : {};
  const txtColor = variant === 'primary' ? '#FFFFFF' : variant === 'secondary' ? '#00A859' : '#8FA3C0';
  const height   = size === 'lg' ? 56 : size === 'sm' ? 38 : 52;
  const px       = size === 'lg' ? 32 : size === 'sm' ? 16 : 24;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        s.base,
        { backgroundColor: bg, height, paddingHorizontal: px, ...bdr },
        isDisabled && s.disabled,
        pressed && s.pressed,
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={txtColor} />
      ) : (
        <View style={s.row}>
          {Icon && iconPosition === 'left'  && <Icon size={20} color={txtColor} style={{ marginRight: 8 }} />}
          <Text style={[s.label, { color: txtColor, fontFamily }]}>{label}</Text>
          {Icon && iconPosition === 'right' && <Icon size={20} color={txtColor} style={{ marginLeft: 8 }} />}
        </View>
      )}
    </Pressable>
  );
};

const s = StyleSheet.create({
  base:    { borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  row:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label:   { fontSize: 15, letterSpacing: 0.1 },
  disabled:{ opacity: 0.4 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
});
