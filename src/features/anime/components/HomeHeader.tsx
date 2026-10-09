import React from 'react';
import { Text, View } from 'react-native';
import { useLocalization } from '@/features/localization';

export function HomeHeader({ isDark }: { isDark: boolean }) {
  const { t } = useLocalization();
  return (
    <View className="px-4 pt-4 pb-2">
      <Text accessibilityRole="header" className={`text-2xl font-manrope-bold tracking-tight ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>
        {t('home.title')}
      </Text>
    </View>
  );
}
