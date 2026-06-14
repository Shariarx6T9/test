import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { Typography } from '../Typography/Typography';

const C = {
  bgCard:      '#162035',
  border:      '#1E2E42',
  borderFocus: '#00A859',
  borderDanger:'#E8394B',
  textPrimary: '#F0F4FF',
  textTertiary:'#4E6480',
  danger:      '#E8394B',
};

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  isBengali?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  isBengali = false,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography variant="label" isBengali={isBengali} style={{ color: C.textTertiary, marginBottom: 6, marginLeft: 2 }}>
          {label}
        </Typography>
      )}
      <View style={[
        styles.inputBox,
        isFocused && styles.inputFocused,
        !!error && styles.inputError,
      ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={C.textTertiary}
          selectionColor={C.borderFocus}
          onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
          onBlur={(e)  => { setIsFocused(false); onBlur?.(e); }}
          {...props}
        />
      </View>
      {!!error && (
        <Typography variant="caption" style={{ color: C.danger, marginTop: 4, marginLeft: 2 }} isBengali={isBengali}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { width: '100%' },
  inputBox:     { height: 48, paddingHorizontal: 16, backgroundColor: '#162035', borderWidth: 1.5, borderColor: '#1E2E42', borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  inputFocused: { borderColor: '#00A859' },
  inputError:   { borderColor: '#E8394B' },
  input:        { flex: 1, color: '#F0F4FF', fontFamily: 'Inter_400Regular', fontSize: 14 },
});
