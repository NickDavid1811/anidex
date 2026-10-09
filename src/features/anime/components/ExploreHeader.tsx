import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { ExploreGenreChips } from './ExploreGenreChips';
import { ExploreSearchBar } from './ExploreSearchBar';

type ExploreSort = 'POPULARITY_DESC' | 'TRENDING_DESC';

interface ExploreHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sort: ExploreSort;
  onSortChange: (value: ExploreSort) => void;
  selectedGenre?: string;
  onGenreSelect: (genre: string) => void;
  hasFilters: boolean;
  isLoading: boolean;
  resultCount: number;
  error: string | null;
  favoritesError: string | null;
  onClearFilters: () => void;
  isDark: boolean;
}

export function ExploreHeader({
  searchTerm,
  onSearchChange,
  sort,
  onSortChange,
  selectedGenre,
  onGenreSelect,
  hasFilters,
  isLoading,
  resultCount,
  error,
  favoritesError,
  onClearFilters,
  isDark,
}: ExploreHeaderProps) {
  const accent = isDark ? '#E09F7D' : '#8B4F26';
  const textClass = isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]';

  return (
    <>
      <View className="px-4 pt-3 pb-2 gap-3">
        <Text className={`text-2xl font-manrope-bold tracking-tight ${textClass}`}>
          Explorar
        </Text>
        <ExploreSearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          isDark={isDark}
        />
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Ordenar animes"
          className={`flex-row rounded-2xl p-1 ${isDark ? 'bg-[#221A16]' : 'bg-[#EDE5DF]'}`}
        >
          {(['POPULARITY_DESC', 'TRENDING_DESC'] as const).map((value) => (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked: sort === value }}
              onPress={() => onSortChange(value)}
              className={`min-h-12 flex-1 flex-row gap-2 items-center justify-center px-2 py-2 rounded-xl ${
                sort === value
                  ? isDark
                    ? 'bg-[#58392B]'
                    : 'bg-[#FFDCC2]'
                  : isDark
                    ? 'bg-[#221A16]'
                    : 'bg-[#EDE5DF]'
              }`}
            >
              {sort === value && (
                <Ionicons name="checkmark" size={18} color={accent} />
              )}
              <Text className={`shrink text-center text-sm font-manrope-semibold ${textClass}`}>
                {value === 'POPULARITY_DESC' ? 'Populares' : 'Tendencias'}
              </Text>
            </Pressable>
          ))}
        </View>
        <ExploreGenreChips
          selectedGenre={selectedGenre}
          onGenreSelect={onGenreSelect}
          isDark={isDark}
        />
        {(hasFilters || (isLoading && resultCount > 0)) && (
          <View className="flex-row flex-wrap items-center justify-between gap-x-2">
            <Text
              accessibilityLiveRegion="polite"
              className={`font-manrope text-sm shrink ${textClass}`}
            >
              {isLoading
                ? 'Buscando animes…'
                : error
                  ? 'No se pudieron actualizar los resultados'
                  : `${resultCount} resultados cargados`}
            </Text>
            {hasFilters && (
              <Pressable
                accessibilityRole="button"
                onPress={onClearFilters}
                style={{ minHeight: 48 }}
                className="px-2 justify-center"
              >
                <Text style={{ color: accent }} className="text-sm font-manrope-bold">
                  Limpiar filtros
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
      {favoritesError && (
        <Text
          accessibilityRole="alert"
          className="font-manrope px-4 py-2 text-sm text-red-600"
        >
          {favoritesError}
        </Text>
      )}
    </>
  );
}
