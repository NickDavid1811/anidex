import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavorites } from '@/context/favorites-context';
import { useAppTheme } from '@/context/theme-context';
import {
  FavoritesSortButton,
  SortType,
} from '@/features/anime/components/FavoritesSortButton';
import { M3AnimeCard } from '@/features/anime/components/M3AnimeCard';

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

export default function FavoritesScreen() {
  const { favorites, count, removeFavorite } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [filterText, setFilterText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortType, setSortType] = useState<SortType>('recent');

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

          {/* Fila con Barra de filtrado + Botón de Ordenamiento M3 interactivo */}
          <View className="flex-row items-center gap-2">
            <View
              className={`flex-1 flex-row items-center rounded-2xl px-3.5 h-12 border ${
                isDark
                  ? 'bg-[#221A16] border-[#3E3028]'
                  : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
              }`}>
              <Ionicons
                name="search"
                size={18}
                color={isDark ? '#A89C94' : '#776962'}
                style={{ marginRight: 8 }}
              />
              <TextInput
                className={`flex-1 text-sm font-medium ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
                placeholder="Filtrar por nombre..."
                placeholderTextColor={isDark ? '#7E736C' : '#9E928B'}
                value={filterText}
                onChangeText={setFilterText}
                autoCapitalize="none"
                returnKeyType="done"
              />
              {filterText.length > 0 && (
                <Pressable onPress={() => setFilterText('')} className="p-1">
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={isDark ? '#A89C94' : '#776962'}
                  />
                </Pressable>
              )}
            </View>

            {/* Botón de Ordenamiento: Tap abre opciones con icono / Swipe para cambiar rápido */}
            <FavoritesSortButton
              currentSort={sortType}
              onSortChange={setSortType}
              isDark={isDark}
            />
          </View>

          {/* Chips de filtro por categoría */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {FILTER_GENRES.map((g) => {
              const isSelected = selectedGenre === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setSelectedGenre(g)}
                  className={`px-3.5 py-1.5 rounded-full border active:opacity-80 ${
                    isSelected
                      ? isDark
                        ? 'bg-[#58392B] border-[#E09F7D]'
                        : 'bg-[#FFDCC2] border-[#8B4F26]'
                      : isDark
                      ? 'bg-[#221A16] border-[#3E3028]'
                      : 'bg-[#FFFFFF] border-[#D8CDC5]'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected
                        ? isDark
                          ? 'text-[#FFDCC2]'
                          : 'text-[#351A08]'
                        : isDark
                        ? 'text-[#A89C94]'
                        : 'text-[#53433C]'
                    }`}>
                    {g}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de Favoritos */}
        {favorites.length === 0 ? (
          <View className="flex-1 justify-center items-center p-6 gap-3">
            <View
              className={`w-16 h-16 rounded-full items-center justify-center ${
                isDark ? 'bg-[#221A16]' : 'bg-[#EDE5DF]'
              }`}>
              <Ionicons name="heart-outline" size={32} color="#D32F2F" />
            </View>
            <Text
              className={`text-base font-bold text-center ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}>
              Aún no tienes favoritos guardados
            </Text>
            <Text
              className={`text-xs text-center max-w-[280px] leading-5 ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              Toca el botón de corazón en cualquier anime desde Inicio o Explorar para guardarlo en tu base de datos local.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/explore' as any)}
              className={`mt-2 px-5 py-2.5 rounded-2xl ${
                isDark ? 'bg-[#3A2D25]' : 'bg-[#8B4F26]'
              }`}>
              <Text className="text-xs font-bold text-white">
                Explorar animes
              </Text>
            </Pressable>
          </View>
        ) : filteredAndSortedFavorites.length === 0 ? (
          <View className="flex-1 justify-center items-center p-6 gap-2">
            <Text
              className={`text-sm font-semibold text-center ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}>
              No se encontraron favoritos con ese filtro
            </Text>
            <Pressable
              onPress={() => {
                setFilterText('');
                setSelectedGenre('Todos');
              }}>
              <Text
                className={`text-xs font-bold ${
                  isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
                }`}>
                Limpiar filtros
              </Text>
            </Pressable>
          </View>
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
