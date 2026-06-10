import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { Typography } from '../ui/Typography/Typography';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  isBengali?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
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
            className="mr-3 p-1 -ml-1"
          >
            <CaretLeft size={24} color="#00A859" weight="bold" />
          </Pressable>
        )}
        <Typography 
          variant="h3" 
          className="text-text-primary" 
          isBengali={isBengali}
          numberOfLines={1}
        >
          {title}
        </Typography>
      </View>
      
      {rightElement && (
        <View className="ml-4">
          {rightElement}
        </View>
      )}
    </View>
  );
};
