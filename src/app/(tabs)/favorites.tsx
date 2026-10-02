import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { M3AnimeCard } from '@/features/anime';
import {
  FavoritesEmptyState,
  FavoritesFilterBar,
  SortType,
  useFavorites,
} from '@/features/favorites';
import { useAppTheme } from '@/features/theme';

export default function FavoritesScreen() {
  const { favorites, count, removeFavorite, refreshFavorites } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';
  const insets = useSafeAreaInsets();

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
        return [...list].sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
      case 'recent':
      default:
        return list; // Preserva orden según fecha de agregado a la base de datos
    }
  }, [favorites, filterText, selectedGenre, sortType]);

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
      }`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}>
        {/* Header Mis Favoritos */}
        <View className="px-4 pt-3 pb-2 gap-3">
          <View className="flex-row items-center gap-2.5">
            <Text
              className={`text-2xl font-black tracking-tight ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}>
              Mis Favoritos
            </Text>
            {count > 0 && (
              <View
                className={`px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-[#8B4F26]' : 'bg-[#FFDCC2]'
                }`}>
                <Text
                  className={`text-xs font-black ${
                    isDark ? 'text-[#FFDCC2]' : 'text-[#351A08]'
                  }`}>
                  {count}
                </Text>
              </View>
            )}
          </View>

          <FavoritesFilterBar
            filterText={filterText}
            onFilterTextChange={setFilterText}
            sortType={sortType}
            onSortTypeChange={setSortType}
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
            isDark={isDark}
          />
        </View>

        {/* Lista de Favoritos */}
        {favorites.length === 0 || filteredAndSortedFavorites.length === 0 ? (
          <FavoritesEmptyState
            hasTotalFavorites={favorites.length > 0}
            onClearFilters={() => {
              setFilterText('');
              setSelectedGenre('Todos');
            }}
            isDark={isDark}
          />
        ) : (
          <FlatList
            data={filteredAndSortedFavorites}
            keyExtractor={(item) => `fav-${item.id}`}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: insets.bottom + 90,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <M3AnimeCard
                anime={item}
                isFavorite={true}
                actionType="delete"
                onActionPress={() => removeFavorite(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
