import React from 'react';
import { Text, View } from 'react-native';

interface HomeHeaderProps {
  isDark: boolean;
}

export function HomeHeader({ isDark }: HomeHeaderProps) {
  return (
    <View className="px-4 pt-3 pb-2 flex-row justify-between items-center">
      <View>
        <Text
          className={`text-2xl font-black tracking-tight ${
            isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
          }`}>
          ¡Hola, Otaku! 👋
        </Text>
        <Text
          className={`text-xs mt-0.5 ${
            isDark ? 'text-[#A89C94]' : 'text-[#776962]'
          }`}>
          Descubre las series del momento.
        </Text>
      </View>
    </View>
  );
}
