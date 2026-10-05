import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { GENRE_LABELS } from '@/features/anime/constants/genres';

import { FavoritesSortButton, SortType } from './FavoritesSortButton';

export const FAVORITES_FILTER_GENRES = [
  'Todos',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Supernatural',
];

interface FavoritesFilterBarProps {
  filterText: string;
  onFilterTextChange: (text: string) => void;
  sortType: SortType;
  onSortTypeChange: (sort: SortType) => void;
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  isDark: boolean;
}

export function FavoritesFilterBar({
  filterText,
  onFilterTextChange,
  sortType,
  onSortTypeChange,
  selectedGenre,
  onGenreSelect,
  isDark,
}: FavoritesFilterBarProps) {
  return (
    <View className="gap-3">
      {/* Fila con Barra de filtrado + Botón de Ordenamiento M3 interactivo */}
      <View className="gap-2">
        <View
          className={`flex-row items-center rounded-2xl pl-3.5 pr-1 min-h-14 border ${
            isDark
              ? 'bg-[#221A16] border-[#3E3028]'
              : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
          }`}
        >
          <Ionicons
            name="search"
            size={18}
            color={isDark ? '#A89C94' : '#776962'}
            style={{ marginRight: 8 }}
          />
          <TextInput
            className={`flex-1 text-base font-manrope-medium ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}
            placeholder="Buscar en favoritos…"
            placeholderTextColor={isDark ? '#D0C3BC' : '#53433C'}
            value={filterText}
            onChangeText={onFilterTextChange}
            accessibilityLabel="Buscar favoritos por título"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
          />
          {filterText.length > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Limpiar búsqueda" onPress={() => onFilterTextChange('')} style={{ width: 48, height: 48 }} className="items-center justify-center">
              <Ionicons
                name="close-circle"
                size={18}
                color={isDark ? '#A89C94' : '#776962'}
              />
            </Pressable>
          )}
        </View>

        <View className="self-start">
        <FavoritesSortButton
          currentSort={sortType}
          onSortChange={onSortTypeChange}
          isDark={isDark}
        />
        </View>
      </View>

      {/* Chips de filtro por categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        {FAVORITES_FILTER_GENRES.map((g) => {
          const isSelected = selectedGenre === g;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={g}
              onPress={() => onGenreSelect(g)}
              className={`min-h-12 justify-center px-3.5 py-2 rounded-full border active:opacity-80 ${
                isSelected
                  ? isDark
                    ? 'bg-[#58392B] border-[#E09F7D]'
                    : 'bg-[#FFDCC2] border-[#8B4F26]'
                  : isDark
                    ? 'bg-[#221A16] border-[#3E3028]'
                    : 'bg-[#FFFFFF] border-[#D8CDC5]'
              }`}
            >
              <Text
                className={`text-sm font-manrope-semibold ${
                  isSelected
                    ? isDark
                      ? 'text-[#FFDCC2]'
                      : 'text-[#351A08]'
                    : isDark
                      ? 'text-[#A89C94]'
                      : 'text-[#53433C]'
                }`}
              >
                {GENRE_LABELS[g] ?? g}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
