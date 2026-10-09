import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { AnimeMedia, M3AnimeCard } from '@/features/anime';
import {
  FavoritesEmptyState,
  FavoritesFilterBar,
  SortType,
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
  const [filterText, setFilterText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortType, setSortType] = useState<SortType>('recent');

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  const filteredAndSortedFavorites = useMemo(() => {
    const list = favorites.filter((anime) => {
      const title = (
        anime.title.english ||
        anime.title.userPreferred ||
        anime.title.romaji ||
        ''
      ).toLowerCase();
      const matchesSearch =
        filterText.trim().length === 0 ||
        title.includes(filterText.toLowerCase().trim());

      const matchesGenre =
        selectedGenre === 'Todos' ||
        (anime.genres && anime.genres.includes(selectedGenre));

      return matchesSearch && matchesGenre;
    });

    switch (sortType) {
      case 'alphabetical':
        return [...list].sort((a, b) => {
          const titleA = (
            a.title.english ||
            a.title.userPreferred ||
            a.title.romaji ||
            ''
          ).toLowerCase();
          const titleB = (
            b.title.english ||
            b.title.userPreferred ||
            b.title.romaji ||
            ''
          ).toLowerCase();
          return titleA.localeCompare(titleB);
        });
      case 'ranking':
        return [...list].sort(
          (a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0)
        );
      case 'recent':
      default:
        return list; // Preserva orden según fecha de agregado a la base de datos
    }
  }, [favorites, filterText, selectedGenre, sortType]);

  const listData = useMemo<FavoritesListItem[]>(() => {
    if (isLoading || favorites.length === 0) return [];

    return [
      { type: 'controls', id: 'controls' },
      ...filteredAndSortedFavorites.map((anime) => ({
        type: 'anime' as const,
        id: anime.id,
        anime,
      })),
    ];
  }, [favorites.length, filteredAndSortedFavorites, isLoading]);

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
                  <FavoritesFilterBar
                    filterText={filterText}
                    onFilterTextChange={setFilterText}
                    sortType={sortType}
                    onSortTypeChange={setSortType}
                    selectedGenre={selectedGenre}
                    onGenreSelect={setSelectedGenre}
                    isDark={isDark}
                    mode="search"
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
                onClearFilters={() => {
                  setFilterText('');
                  setSelectedGenre('Todos');
                }}
                isDark={isDark}
              />
            )
          }
          ListFooterComponent={
            !isLoading &&
            favorites.length > 0 &&
            filteredAndSortedFavorites.length === 0 ? (
              <FavoritesEmptyState
                hasTotalFavorites
                onClearFilters={() => {
                  setFilterText('');
                  setSelectedGenre('Todos');
                }}
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
                <FavoritesFilterBar
                  filterText={filterText}
                  onFilterTextChange={setFilterText}
                  sortType={sortType}
                  onSortTypeChange={setSortType}
                  selectedGenre={selectedGenre}
                  onGenreSelect={setSelectedGenre}
                  isDark={isDark}
                  mode="controls"
                />
              </View>
            ) : (
              <View className="px-4">
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
              </View>
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
