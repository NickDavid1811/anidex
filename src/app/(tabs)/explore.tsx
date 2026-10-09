import { Ionicons } from '@expo/vector-icons';
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

  const exploreHeader = (
    <>
      <View className="px-4 pt-3 pb-2 gap-3">
        <Text
          className={`text-2xl font-manrope-bold tracking-tight ${textClass}`}
        >
          Explorar
        </Text>
        <ExploreSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
        <View accessibilityRole="radiogroup" accessibilityLabel="Ordenar animes" className={`flex-row rounded-2xl p-1 ${isDark ? 'bg-[#221A16]' : 'bg-[#EDE5DF]'}`}>
          {(['POPULARITY_DESC', 'TRENDING_DESC'] as const).map((value) => (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked: sort === value }}
              onPress={() => setSort(value)}
              className={`min-h-12 flex-1 flex-row gap-2 items-center justify-center px-2 py-2 rounded-xl ${sort === value ? (isDark ? 'bg-[#58392B]' : 'bg-[#FFDCC2]') : isDark ? 'bg-[#221A16]' : 'bg-[#EDE5DF]'}`}
            >
              {sort === value && <Ionicons name="checkmark" size={18} color={accent} />}
              <Text className={`shrink text-center text-sm font-manrope-semibold ${textClass}`}>
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
        {(hasFilters || (isLoading && results.length > 0)) && (
          <View className="flex-row flex-wrap items-center justify-between gap-x-2">
            <Text
              accessibilityLiveRegion="polite"
              className={`font-manrope text-sm shrink ${textClass}`}
            >
              {isLoading
                ? 'Buscando animes…'
                : error
                  ? 'No se pudieron actualizar los resultados'
                  : `${results.length} resultados cargados`}
            </Text>
            {hasFilters && (
              <Pressable
                accessibilityRole="button"
                onPress={clearFilters}
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
