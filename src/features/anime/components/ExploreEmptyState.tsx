import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ExploreEmptyStateProps {
  hasFilters: boolean;
  isDark: boolean;
}

export function ExploreEmptyState({ hasFilters, isDark }: ExploreEmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-6 gap-2">
      <Ionicons
        name="search-outline"
        size={48}
        color={isDark ? '#3E3028' : '#D8CDC5'}
      />
      <Text
        className={`text-base font-bold text-center ${
          isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
        }`}>
        {hasFilters
          ? 'No se encontraron resultados'
          : 'Escribe algo o elige un género para comenzar'}
      </Text>
      <Text
        className={`text-xs text-center ${
          isDark ? 'text-[#A89C94]' : 'text-[#776962]'
        }`}>
        {hasFilters
          ? 'Prueba buscando con otro término o género diferente.'
          : 'Explora entre miles de series de anime en tiempo real.'}
      </Text>
    </View>
  );
}
