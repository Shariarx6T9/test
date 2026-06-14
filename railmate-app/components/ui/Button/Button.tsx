import React from 'react';
import { Pressable, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { ButtonProps } from './Button.types';

const C = {
  primary:     '#00A859',
  primaryDim:  '#007A40',
  border:      '#1E2E42',
  textInverse: '#080D17',
  textPrimary: '#F0F4FF',
  textSecond:  '#8FA3C0',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  isBengali = false,
  disabled,
  style,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const sizeStyle = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size];

  const variantStyle = {
    primary: styles.primary,
    secondary: styles.secondary,
    ghost: styles.ghost,
  }[variant];

  const iconColor = {
    primary: C.textInverse,
    secondary: C.primary,
    ghost: C.textSecond,
  }[variant];

  const textColor = {
    primary: C.textInverse,
    secondary: C.primary,
    ghost: C.textSecond,
  }[variant];

  const fontFamily = isBengali ? 'NotoSansBengali_600SemiBold' : 'Inter_500Medium';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        variantStyle,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.inner}>
          {Icon && iconPosition === 'left' && (
            <Icon size={20} color={iconColor} style={{ marginRight: 8 }} />
          )}
          <Text style={[styles.label, { color: textColor, fontFamily }]}>
            {label}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon size={20} color={iconColor} style={{ marginLeft: 8 }} />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base:      { borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  inner:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label:     { fontSize: 15, letterSpacing: 0.1 },
  sizeSm:    { height: 38, paddingHorizontal: 16 },
  sizeMd:    { height: 52, paddingHorizontal: 24 },
  sizeLg:    { height: 56, paddingHorizontal: 32 },
  primary:   { backgroundColor: '#00A859' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#00A859' },
  ghost:     { backgroundColor: 'transparent' },
  disabled:  { opacity: 0.4 },
  pressed:   { opacity: 0.85, transform: [{ scale: 0.97 }] },
});
