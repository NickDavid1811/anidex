import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Cargando animes...' }: LoadingStateProps) {
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  return (
    <View className="flex-1 justify-center items-center p-6 gap-3">
      <ActivityIndicator size="large" color={isDark ? '#E09F7D' : '#8B4F26'} />
      <Text
        className={`text-sm font-medium ${
          isDark ? 'text-[#A89C94]' : 'text-[#776962]'
        }`}>
        {message}
      </Text>
    </View>
  );
}
