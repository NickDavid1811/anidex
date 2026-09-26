import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useFavorites } from '@/context/favorites-context';
import { useAppTheme } from '@/context/theme-context';
import { M3AnimeCard } from '@/features/anime/components/M3AnimeCard';
import { useSearchAnime } from '@/features/anime/hooks/useSearchAnime';

const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
];

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

          {/* Barra de búsqueda M3 */}
          <View
            className={`flex-row items-center rounded-2xl px-3.5 h-12 border ${
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
              placeholder="Buscar animes..."
              placeholderTextColor={isDark ? '#7E736C' : '#9E928B'}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchTerm.length > 0 && (
              <Pressable onPress={() => setSearchTerm('')} className="p-1">
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={isDark ? '#A89C94' : '#776962'}
                />
              </Pressable>
            )}
          </View>

          {/* Chips de Categorías */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {GENRES.map((g) => {
              const isSelected = selectedGenre === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => handleGenrePress(g)}
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
          <View className="flex-1 justify-center items-center p-6 gap-2">
            <Ionicons
              name="search-outline"
              size={48}
              color={isDark ? '#3E3028' : '#D8CDC5'}
            />
            <Text
              className={`text-base font-bold text-center ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}>
              {searchTerm || selectedGenre
                ? 'No se encontraron resultados'
                : 'Escribe algo o elige un género para comenzar'}
            </Text>
            <Text
              className={`text-xs text-center ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              {searchTerm || selectedGenre
                ? 'Prueba buscando con otro término o género diferente.'
                : 'Explora entre miles de series de anime en tiempo real.'}
            </Text>
          </View>
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
