import React from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { Typography } from '../Typography/Typography';
import { ButtonProps } from './Button.types';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../constants/colors';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  label,
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  isBengali = false,
  disabled,
  ...props
}) => {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === 'light' ? 'light' : 'dark';
  const currentColors = Colors[theme];

  const baseClasses = "h-[48px] flex-row items-center justify-center rounded-md px-4 active:scale-[0.97]";
  
  const variantClasses = {
    primary: "bg-primary active:bg-primary-dim",
    secondary: "bg-transparent border-[1.5px] border-primary",
    ghost: "bg-transparent active:bg-bg-overlay",
  };

  const textClasses = {
    primary: "text-text-inverse",
    secondary: "text-primary",
    ghost: "text-text-secondary",
  };

  const iconColor = {
    primary: currentColors['text-inverse'],
    secondary: currentColors['primary'],
    ghost: currentColors['text-secondary'],
  };

  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${isDisabled ? "opacity-40" : ""} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? iconColor.primary : iconColor.secondary} />
      ) : (
        <View className="flex-row items-center justify-center">
          {Icon && iconPosition === 'left' && (
            <Icon 
                size={20} 
                color={variant === 'primary' ? iconColor.primary : (variant === 'secondary' ? iconColor.secondary : iconColor.ghost)} 
                style={{ marginRight: 8 }}
            />
          )}
          <Typography
            variant="label-lg"
            isBengali={isBengali}
            className={textClasses[variant]}
          >
            {label}
          </Typography>
          {Icon && iconPosition === 'right' && (
            <Icon 
                size={20} 
                color={variant === 'primary' ? iconColor.primary : (variant === 'secondary' ? iconColor.secondary : iconColor.ghost)} 
                style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};
