import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { Typography } from '../ui/Typography/Typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  isBengali?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  rightElement,
  isBengali = false,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between py-4 min-h-[64px]">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            className="mr-3 w-9 h-9 rounded-xl bg-bg-card border border-border items-center justify-center active:scale-95"
          >
            <CaretLeft size={20} color="#00A859" weight="bold" />
          </Pressable>
        )}
        <View className="flex-1">
          <Typography
            variant="h3"
            className="text-text-primary"
            isBengali={isBengali}
            numberOfLines={1}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
              {subtitle}
            </Typography>
          )}
        </View>
      </View>

      {rightElement && (
        <View className="ml-3">
          {rightElement}
        </View>
      )}
    </View>
  );
};
