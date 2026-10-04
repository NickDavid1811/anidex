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
  ExploreGenreChips,
  ExploreSearchBar,
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
  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}
      >
        <View className="px-4 pt-3 pb-2 gap-3">
          <Text className={`text-2xl font-black tracking-tight ${textClass}`}>
            Explorar
          </Text>
          <ExploreSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDark={isDark}
          />
          <View className="flex-row gap-2">
            {(['POPULARITY_DESC', 'TRENDING_DESC'] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected: sort === value }}
                onPress={() => setSort(value)}
                className={`min-h-12 px-4 justify-center rounded-full ${sort === value ? (isDark ? 'bg-[#58392B]' : 'bg-[#FFDCC2]') : isDark ? 'bg-[#221A16]' : 'bg-[#EDE5DF]'}`}
              >
                <Text className={`text-sm font-semibold ${textClass}`}>
                  {value === 'POPULARITY_DESC' ? 'Populares' : 'Tendencias'}
                </Text>
              </Pressable>
            ))}
          </View>
          <ExploreGenreChips
            selectedGenre={selectedGenre}
            onGenreSelect={(genre) =>
              setSelectedGenre((previous) =>
                previous === genre ? undefined : genre
              )
            }
            isDark={isDark}
          />
          <View className="flex-row items-center justify-between">
            <Text
              accessibilityLiveRegion="polite"
              className={`text-sm ${textClass}`}
            >
              {isLoading && results.length
                ? 'Actualizando resultados…'
                : hasFilters
                  ? `${results.length} resultados cargados`
                  : sort === 'TRENDING_DESC'
                    ? 'Tendencias del momento'
                    : 'Descubre los más populares'}
            </Text>
            {hasFilters && (
              <Pressable
                accessibilityRole="button"
                onPress={clearFilters}
                className="min-h-12 px-2 justify-center"
              >
                <Text style={{ color: accent }} className="text-sm font-bold">
                  Limpiar filtros
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        {favoritesError && (
          <Text
            accessibilityRole="alert"
            className="px-4 py-2 text-sm text-red-600"
          >
            {favoritesError}
          </Text>
        )}
        {isLoading && results.length === 0 ? (
          <View className="flex-1 justify-center">
            <LoadingState message="Descubriendo animes…" />
          </View>
        ) : error && results.length === 0 ? (
          <View className="flex-1 justify-center">
            <ErrorState message={error} onRetry={refresh} />
          </View>
        ) : results.length === 0 ? (
          <ExploreEmptyState hasFilters={hasFilters} isDark={isDark} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => `explore-${item.id}`}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: insets.bottom + 90,
            }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              isLoading ? (
                <ActivityIndicator color={accent} style={{ padding: 8 }} />
              ) : null
            }
            renderItem={({ item }) => (
              <M3AnimeCard
                anime={item}
                isFavorite={isFavorite(item.id)}
                onActionPress={() => {
                  void toggleFavorite(item).catch(() => {});
                }}
              />
            )}
            ListFooterComponent={
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
                    <Text className={`text-sm font-bold ${textClass}`}>
                      Cargar más animes
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}
