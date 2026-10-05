import React from 'react';
import { GENRE_LABELS } from '../constants/genres';
import { Pressable, ScrollView, Text } from 'react-native';

export const EXPLORE_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
];

interface ExploreGenreChipsProps {
  selectedGenre?: string;
  onGenreSelect: (genre: string) => void;
  isDark: boolean;
}

export function ExploreGenreChips({
  selectedGenre,
  onGenreSelect,
  isDark,
}: ExploreGenreChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {EXPLORE_GENRES.map((g) => {
        const isSelected = selectedGenre === g;
        return (
          <Pressable
            key={g}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
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
                    ? 'text-[#D0C3BC]'
                    : 'text-[#53433C]'
              }`}
            >
              {GENRE_LABELS[g] ?? g}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
