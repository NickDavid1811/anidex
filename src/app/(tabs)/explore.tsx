import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  ExploreEmptyState,
  ExploreGenreChips,
  ExploreSearchBar,
  M3AnimeCard,
  useSearchAnime,
} from '@/features/anime';
import { useFavorites } from '@/features/favorites';
import { useAppTheme } from '@/features/theme';

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ genre?: string }>();
  const {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    results,
    isLoading,
    error,
    refresh,
  } = useSearchAnime(350);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (params.genre) {
      setSelectedGenre(params.genre);
    }
  }, [params.genre, setSelectedGenre]);

  const handleGenrePress = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? undefined : genre));
  };

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
      }`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}>
        {/* Header Explorar */}
        <View className="px-4 pt-3 pb-2 gap-3">
          <Text
            className={`text-2xl font-black tracking-tight ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}>
            Explorar
          </Text>

          <ExploreSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDark={isDark}
          />

          <ExploreGenreChips
            selectedGenre={selectedGenre}
            onGenreSelect={handleGenrePress}
            isDark={isDark}
          />
        </View>

        {/* Lista de Resultados */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <LoadingState message="Buscando animes..." />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <ErrorState message={error} onRetry={refresh} />
          </View>
        ) : results.length === 0 ? (
          <ExploreEmptyState
            hasFilters={Boolean(searchTerm || selectedGenre)}
            isDark={isDark}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => `explore-${item.id}`}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: insets.bottom + 90,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <M3AnimeCard
                anime={item}
                isFavorite={isFavorite(item.id)}
                actionType="favorite"
                onActionPress={() => toggleFavorite(item)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
