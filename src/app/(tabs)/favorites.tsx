import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Animated, { FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { AnimeMedia, M3AnimeCard } from '@/features/anime';
import {
  FavoritesEmptyState,
  FavoritesFilterControls,
  FavoritesSearchBar,
  useFilteredFavorites,
  useFavorites,
} from '@/features/favorites';
import { LoadingState } from '@/components/ui/loading-state';
import { useAppTheme } from '@/features/theme';

type FavoritesListItem =
  | { type: 'controls'; id: 'controls' }
  | { type: 'anime'; id: number; anime: AnimeMedia };

export default function FavoritesScreen() {
  const {
    favorites,
    count,
    removeFavorite,
    restoreFavorite,
    refreshFavorites,
    isLoading,
    error,
  } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  const [removedAnime, setRemovedAnime] = useState<AnimeMedia | null>(null);
  const [noticeHeight, setNoticeHeight] = useState(0);
  const [isUndoing, setIsUndoing] = useState(false);
  const {
    filterText,
    setFilterText,
    selectedGenre,
    setSelectedGenre,
    sortType,
    setSortType,
    filteredFavorites,
    clearFilters,
  } = useFilteredFavorites(favorites);

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  const listData = useMemo<FavoritesListItem[]>(() => {
    if (isLoading || favorites.length === 0) return [];

    return [
      { type: 'controls', id: 'controls' },
      ...filteredFavorites.map((anime) => ({
        type: 'anime' as const,
        id: anime.id,
        anime,
      })),
    ];
  }, [favorites.length, filteredFavorites, isLoading]);

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}
      >
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          data={listData}
          keyExtractor={(item) =>
            item.type === 'controls' ? item.id : `fav-${item.id}`
          }
          stickyHeaderIndices={listData.length > 0 ? [1] : undefined}
          contentContainerStyle={{
            paddingBottom: removedAnime ? noticeHeight + 24 : 24,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <>
              <View className="px-4 pt-3 pb-2 gap-3">
                <View className="flex-row items-center gap-2.5">
                  <Text
                    className={`text-2xl font-manrope-bold tracking-tight ${
                      isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                    }`}
                  >
                    Mis Favoritos
                  </Text>
                  {count > 0 && (
                    <View
                      className={`px-2.5 py-0.5 rounded-full ${
                        isDark ? 'bg-[#8B4F26]' : 'bg-[#FFDCC2]'
                      }`}
                    >
                      <Text
                        className={`text-xs font-manrope-bold ${
                          isDark ? 'text-[#FFDCC2]' : 'text-[#351A08]'
                        }`}
                      >
                        {count}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  className={`font-manrope text-sm ${isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'}`}
                >
                  Guardados en este dispositivo
                </Text>

                {favorites.length > 0 && (
                  <FavoritesSearchBar
                    filterText={filterText}
                    onFilterTextChange={setFilterText}
                    isDark={isDark}
                  />
                )}
              </View>
              {error && (
                <Text
                  accessibilityRole="alert"
                  className="font-manrope px-4 py-2 text-sm text-red-600"
                >
                  {error}
                </Text>
              )}
            </>
          )}
          ListEmptyComponent={
            isLoading ? (
              <LoadingState message="Cargando tus favoritos…" />
            ) : (
              <FavoritesEmptyState
                hasTotalFavorites={favorites.length > 0}
                onClearFilters={clearFilters}
                isDark={isDark}
              />
            )
          }
          ListFooterComponent={
            !isLoading &&
            favorites.length > 0 &&
            filteredFavorites.length === 0 ? (
              <FavoritesEmptyState
                hasTotalFavorites
                onClearFilters={clearFilters}
                isDark={isDark}
              />
            ) : null
          }
          renderItem={({ item }) => (
            item.type === 'controls' ? (
              <View
                className={`px-4 pt-2 pb-3 ${
                  isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
                }`}
              >
                <FavoritesFilterControls
                  sortType={sortType}
                  onSortTypeChange={setSortType}
                  selectedGenre={selectedGenre}
                  onGenreSelect={setSelectedGenre}
                  isDark={isDark}
                />
              </View>
            ) : (
              <Animated.View
                className="px-4"
                collapsable={false}
                layout={LinearTransition.springify().damping(18).stiffness(180)}
                exiting={FadeOutLeft.duration(180)}
              >
                <M3AnimeCard
                  anime={item.anime}
                  compact
                  isFavorite={true}
                  actionType="delete"
                  onActionPress={() => {
                    void removeFavorite(item.anime.id)
                      .then(() => setRemovedAnime(item.anime))
                      .catch(() => {});
                  }}
                />
              </Animated.View>
            )
          )}
        />
      </SafeAreaView>
      {removedAnime && (
        <View
          accessibilityLiveRegion="polite"
          onLayout={(event) => setNoticeHeight(event.nativeEvent.layout.height)}
          style={{ bottom: 12, left: 16, right: 16, position: 'absolute' }}
          className={`absolute left-4 right-4 rounded-2xl p-3 flex-row items-center gap-2 ${isDark ? 'bg-[#EDE0DB]' : 'bg-[#30241E]'}`}
        >
          <Text
            numberOfLines={3}
            className={`font-manrope flex-1 text-sm ${isDark ? 'text-[#201A17]' : 'text-white'}`}
          >
            {removedAnime.title.english || removedAnime.title.userPreferred || removedAnime.title.romaji || 'Anime'} quitado de favoritos
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isUndoing, busy: isUndoing }}
            disabled={isUndoing}
            className="min-h-12 px-3 justify-center"
            onPress={async () => {
              const anime = removedAnime;
              setIsUndoing(true);
              try {
                await restoreFavorite(anime);
                setRemovedAnime((current) =>
                  current === anime ? null : current
                );
              } catch {
                /* El contexto muestra el error y conserva Deshacer. */
              } finally {
                setIsUndoing(false);
              }
            }}
          >
            <Text
              className={`text-sm font-manrope-bold ${isDark ? 'text-[#8B4F26]' : 'text-[#FFDCC2]'}`}
            >
              {isUndoing ? 'Restaurando…' : 'Deshacer'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar aviso"
            onPress={() => setRemovedAnime(null)}
            className="min-h-12 px-3 justify-center"
          >
            <Text
              className={`font-manrope ${isDark ? 'text-[#201A17]' : 'text-white'}`}
            >
              ✕
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
