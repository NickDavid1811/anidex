import { Pressable, ScrollView, Text, View } from 'react-native';

import { GENRE_LABELS } from '@/features/anime';
import { useLocalization } from '@/features/localization';

import { FavoritesSortButton, SortType } from './FavoritesSortButton';

const FILTER_GENRES = [
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

interface FavoritesFilterControlsProps {
  sortType: SortType;
  onSortTypeChange: (sort: SortType) => void;
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  isDark: boolean;
}

export function FavoritesFilterControls({
  sortType,
  onSortTypeChange,
  selectedGenre,
  onGenreSelect,
  isDark,
}: FavoritesFilterControlsProps) {
  const { language, t } = useLocalization();
  return (
    <View className="gap-3">
      <View className="self-start">
        <FavoritesSortButton
          currentSort={sortType}
          onSortChange={onSortTypeChange}
          isDark={isDark}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        {FILTER_GENRES.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={genre}
              onPress={() => onGenreSelect(genre)}
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
                {genre === 'Todos' ? t('common.all') : language === 'es' ? (GENRE_LABELS[genre] ?? genre) : genre}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
