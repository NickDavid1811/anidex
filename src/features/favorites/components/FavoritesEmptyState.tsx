import React from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface FavoritesEmptyStateProps {
  hasTotalFavorites: boolean;
  onClearFilters: () => void;
  isDark: boolean;
}

export function FavoritesEmptyState({
  hasTotalFavorites,
  onClearFilters,
  isDark,
}: FavoritesEmptyStateProps) {
  if (!hasTotalFavorites) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text
          className={`text-sm font-manrope-semibold text-center ${
            isDark ? 'text-[#A89C94]' : 'text-[#776962]'
          }`}
        >
          Tu próxima serie favorita te espera
        </Text>
        <Text
          className={`font-manrope text-sm text-center mt-2 ${isDark ? 'text-[#A89C94]' : 'text-[#776962]'}`}
        >
          Guarda los animes que te interesan tocando el corazón.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/explore')}
          className="mt-5 px-5 py-3 rounded-2xl bg-[#8B4F26]"
        >
          <Text className="text-white text-sm font-manrope-bold">
            Descubrir anime
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6 gap-2">
      <Text
        className={`text-sm font-manrope-semibold text-center ${
          isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
        }`}
      >
        No se encontraron favoritos con ese filtro
      </Text>
      <Pressable onPress={onClearFilters}>
        <Text
          className={`text-xs font-manrope-bold ${
            isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
          }`}
        >
          Limpiar filtros
        </Text>
      </Pressable>
    </View>
  );
}
