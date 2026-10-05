import React from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';

import { GENRE_LABELS } from '../constants/genres';

interface AnimeGenresProps {
  genres?: string[];
}

export function AnimeGenres({ genres }: AnimeGenresProps) {
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  if (!genres || genres.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2 my-2">
      {genres.map((genre) => (
        <View
          key={genre}
          className={`px-3 py-1.5 rounded-xl border ${
            isDark
              ? 'bg-[#2F241E] border-[#3E3028]'
              : 'bg-[#EDE5DF] border-[#D8CDC5]'
          }`}
        >
          <Text
            className={`font-manrope-semibold text-sm ${
              isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
            }`}
          >
            {GENRE_LABELS[genre] ?? genre}
          </Text>
        </View>
      ))}
    </View>
  );
}
