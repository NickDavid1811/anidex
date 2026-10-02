import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

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
      <View className="flex-row items-center gap-2">
        <View
          className={`flex-1 flex-row items-center rounded-2xl px-3.5 h-12 border ${
            isDark
              ? 'bg-[#221A16] border-[#3E3028]'
              : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
          }`}>
          <Ionicons
            name="search"
            size={18}
            color={isDark ? '#A89C94' : '#776962'}
            style={{ marginRight: 8 }}
          />
          <TextInput
            className={`flex-1 text-sm font-medium ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}
            placeholder="Filtrar por nombre..."
            placeholderTextColor={isDark ? '#7E736C' : '#9E928B'}
            value={filterText}
            onChangeText={onFilterTextChange}
            autoCapitalize="none"
            returnKeyType="done"
          />
          {filterText.length > 0 && (
            <Pressable onPress={() => onFilterTextChange('')} className="p-1">
              <Ionicons
                name="close-circle"
                size={18}
                color={isDark ? '#A89C94' : '#776962'}
              />
            </Pressable>
          )}
        </View>

        <FavoritesSortButton
          currentSort={sortType}
          onSortChange={onSortTypeChange}
          isDark={isDark}
        />
      </View>

      {/* Chips de filtro por categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
        {FAVORITES_FILTER_GENRES.map((g) => {
          const isSelected = selectedGenre === g;
          return (
            <Pressable
              key={g}
              onPress={() => onGenreSelect(g)}
              className={`px-3.5 py-1.5 rounded-full border active:opacity-80 ${
                isSelected
                  ? isDark
                    ? 'bg-[#58392B] border-[#E09F7D]'
                    : 'bg-[#FFDCC2] border-[#8B4F26]'
                  : isDark
                  ? 'bg-[#221A16] border-[#3E3028]'
                  : 'bg-[#FFFFFF] border-[#D8CDC5]'
              }`}>
              <Text
                className={`text-xs font-semibold ${
                  isSelected
                    ? isDark
                      ? 'text-[#FFDCC2]'
                      : 'text-[#351A08]'
                    : isDark
                    ? 'text-[#A89C94]'
                    : 'text-[#53433C]'
                }`}>
                {g}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
