import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  ExploreEmptyState,
  ExploreHeader,
  M3AnimeCard,
  useSearchAnime,
} from '@/features/anime';
import { useFavorites } from '@/features/favorites';
import { useAppTheme } from '@/features/theme';

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ genre?: string; sort?: string }>();
  const {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    sort,
    setSort,
    results,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    refresh,
    retry,
    pageInfo,
  } = useSearchAnime();
  const { isFavorite, toggleFavorite, error: favoritesError } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';
  const insets = useSafeAreaInsets();
  const accent = isDark ? '#E09F7D' : '#8B4F26';
  const textClass = isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]';

  useEffect(() => {
    if (params.genre !== undefined || params.sort !== undefined) {
      setSearchTerm('');
      setSelectedGenre(params.genre || undefined);
      setSort(params.sort === 'trending' ? 'TRENDING_DESC' : 'POPULARITY_DESC');
    }
  }, [params.genre, params.sort, setSearchTerm, setSelectedGenre, setSort]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre(undefined);
  };
  const hasFilters = Boolean(searchTerm.trim() || selectedGenre);

  const exploreHeader = (
    <>
      <ExploreHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sort={sort}
        onSortChange={setSort}
        selectedGenre={selectedGenre}
        onGenreSelect={(genre) =>
          setSelectedGenre((previous) =>
            previous === genre ? undefined : genre
          )
        }
        hasFilters={hasFilters}
        isLoading={isLoading}
        resultCount={results.length}
        error={error}
        favoritesError={favoritesError}
        onClearFilters={clearFilters}
        isDark={isDark}
      />
      {isLoading && results.length > 0 && (
        <ActivityIndicator color={accent} style={{ padding: 8 }} />
      )}
    </>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}
      >
        <FlatList
          data={results}
          keyExtractor={(item) => `explore-${item.id}`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 90,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={exploreHeader}
          ListEmptyComponent={
            isLoading ? (
              <LoadingState message="Descubriendo animes…" />
            ) : error ? (
              <ErrorState message={error} onRetry={refresh} />
            ) : (
              <ExploreEmptyState hasFilters={hasFilters} isDark={isDark} />
            )
          }
          renderItem={({ item }) => (
            <View className="px-4">
              <M3AnimeCard
                anime={item}
                compact
                isFavorite={isFavorite(item.id)}
                onActionPress={() => {
                  void toggleFavorite(item).catch(() => {});
                }}
              />
            </View>
          )}
          ListFooterComponent={
            results.length > 0 ? (
              <View className="py-3 items-center gap-2">
                {error ? (
                  <ErrorState
                    message="No pudimos actualizar la lista. Puedes intentarlo otra vez."
                    onRetry={retry}
                  />
                ) : isLoadingMore ? (
                  <ActivityIndicator color={accent} />
                ) : !isLoading && pageInfo?.hasNextPage ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={loadMore}
                    className="min-h-12 px-6 justify-center rounded-2xl"
                    style={{ backgroundColor: isDark ? '#58392B' : '#FFDCC2' }}
                  >
                    <Text className={`text-sm font-manrope-bold ${textClass}`}>
                      Cargar más animes
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </View>
  );
}
