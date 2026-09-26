import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useFavorites } from '@/context/favorites-context';
import { useAppTheme } from '@/context/theme-context';
import { M3FeaturedCard } from '@/features/anime/components/M3FeaturedCard';
import { M3RankCard } from '@/features/anime/components/M3RankCard';
import { useTrendingAnime } from '@/features/anime/hooks/useTrendingAnime';
import { AnimeMedia } from '@/features/anime/types/anime.types';

const CATEGORIES = [
  { id: 'Action', label: 'Acción', icon: '⚔️' },
  { id: 'Fantasy', label: 'Fantasía', icon: '🪄' },
  { id: 'Comedy', label: 'Comedia', icon: '😄' },
  { id: 'Romance', label: 'Romance', icon: '💖' },
  { id: 'Supernatural', label: 'Sobrenatural', icon: '🔮' },
  { id: 'Sci-Fi', label: 'Sci-Fi', icon: '🚀' },
  { id: 'Sports', label: 'Deportes', icon: '🏀' },
  { id: 'Drama', label: 'Drama', icon: '🎭' },
];

export default function HomeScreen() {
  const { animes, isLoading, isRefreshing, error, refetch } = useTrendingAnime();
  const { isFavorite, toggleFavorite, favorites, count: favoritesCount } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  const [activeSlide, setActiveSlide] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = Math.min(screenWidth, 800);

  // Animes destacados para el carrusel superior (primeros 5)
  const featuredAnimes = animes.slice(0, 5);

  // Top ranking (primeros 8)
  const rankingAnimes = animes.slice(0, 8);

  // Animes favoritos recientes (últimos 6 agregados)
  const recentFavorites = favorites.slice(0, 6);

  const handleRandomSpin = () => {
    if (animes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * animes.length);
    const chosen = animes[randomIndex];
    router.push(`/anime/${chosen.id}` as any);
  };

  const handleCategoryPress = (genreId: string) => {
    router.push({
      pathname: '/(tabs)/explore' as any,
      params: { genre: genreId },
    });
  };

  if (isLoading && !isRefreshing) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}>
        <LoadingState message="Cargando las series del momento..." />
      </View>
    );
  }

  if (error && animes.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}>
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
      }`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor={isDark ? '#E09F7D' : '#8B4F26'}
              colors={[isDark ? '#E09F7D' : '#8B4F26']}
            />
          }>
          {/* Header Saludo Otaku */}
          <View className="px-4 pt-3 pb-2 flex-row justify-between items-center">
            <View>
              <Text
                className={`text-2xl font-black tracking-tight ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}>
                ¡Hola, Otaku! 👋
              </Text>
              <Text
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}>
                Descubre las series del momento.
              </Text>
            </View>
          </View>

          {/* Sección 1: Destacados de la Temporada */}
          {featuredAnimes.length > 0 && (
            <View className="mt-3">
              <View className="flex-row items-center justify-between px-4 mb-2.5">
                <Text
                  className={`text-base font-bold ${
                    isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                  }`}>
                  Destacados de la Temporada
                </Text>
                <Pressable
                  onPress={() => router.push('/(tabs)/explore' as any)}
                  className="flex-row items-center gap-1">
                  <Text
                    className={`text-xs font-semibold ${
                      isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
                    }`}>
                    Ver todo
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color={isDark ? '#E09F7D' : '#8B4F26'}
                  />
                </Pressable>
              </View>

              {/* Carrusel */}
              <FlatList
                data={featuredAnimes}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `featured-${item.id}`}
                onMomentumScrollEnd={(e) => {
                  const newIndex = Math.round(
                    e.nativeEvent.contentOffset.x / (contentWidth - 32)
                  );
                  setActiveSlide(newIndex);
                }}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                  <View style={{ width: contentWidth - 32, marginRight: 12 }}>
                    <M3FeaturedCard anime={item} />
                  </View>
                )}
              />

              {/* Dots del Carrusel */}
              <View className="flex-row justify-center items-center mt-3 gap-1.5">
                {featuredAnimes.map((_, i) => (
                  <View
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === i
                        ? isDark
                          ? 'w-5 bg-[#E09F7D]'
                          : 'w-5 bg-[#8B4F26]'
                        : isDark
                        ? 'w-1.5 bg-[#3E3028]'
                        : 'w-1.5 bg-[#D8CDC5]'
                    }`}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Sección 2: Categorías Populares */}
          <View className="mt-5 px-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className={`text-base font-bold ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}>
                Categorías Populares
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}>
                Toca para explorar
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => handleCategoryPress(cat.id)}
                  className={`flex-row items-center px-3.5 py-2 rounded-2xl border active:opacity-80 ${
                    isDark
                      ? 'bg-[#221A16] border-[#3E3028]'
                      : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
                  }`}>
                  <Text className="text-sm mr-1.5">{cat.icon}</Text>
                  <Text
                    className={`text-xs font-semibold ${
                      isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                    }`}>
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Sección 3: Mis Favoritos Recientes (Persistidos en SQLite) */}
          {favorites.length > 0 && (
            <View className="mt-5 px-4">
              <View className="flex-row items-center justify-between mb-2.5">
                <Text
                  className={`text-base font-bold ${
                    isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                  }`}>
                  Mis Favoritos Recientes
                </Text>
                <Pressable
                  onPress={() => router.push('/(tabs)/favorites' as any)}
                  className="flex-row items-center gap-1">
                  <Text
                    className={`text-xs font-semibold ${
                      isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
                    }`}>
                    Ver todos ({favoritesCount})
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color={isDark ? '#E09F7D' : '#8B4F26'}
                  />
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}>
                {recentFavorites.map((fav) => {
                  const title =
                    fav.title.english ||
                    fav.title.userPreferred ||
                    fav.title.romaji ||
                    'Anime';
                  const cover =
                    fav.coverImage.medium || fav.coverImage.large;
                  return (
                    <Pressable
                      key={`recent-fav-${fav.id}`}
                      onPress={() => router.push(`/anime/${fav.id}` as any)}
                      className="w-24 active:opacity-85">
                      <View className="w-24 h-32 rounded-xl overflow-hidden bg-neutral-900 mb-1 border border-[#3E3028]/40">
                        {cover ? (
                          <Image
                            source={{ uri: cover }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                          />
                        ) : (
                          <View className="w-full h-full bg-neutral-800" />
                        )}
                      </View>
                      <Text
                        numberOfLines={1}
                        className={`text-xs font-semibold ${
                          isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                        }`}>
                        {title}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Sección 4: Banner Ruleta "¿No sabes qué ver hoy?" */}
          <View className="mt-5 px-4">
            <View
              className={`p-4 rounded-3xl border flex-row items-center justify-between ${
                isDark
                  ? 'bg-[#221A16] border-[#3E3028]'
                  : 'bg-[#FFF9F5] border-[#D8CDC5] shadow-sm'
              }`}>
              <View className="flex-row items-center flex-1 mr-3">
                <View
                  className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${
                    isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                  }`}>
                  <Text className="text-2xl">🎲</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-sm font-black ${
                      isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                    }`}>
                    ¿No sabes qué ver hoy?
                  </Text>
                  <Text
                    className={`text-xs mt-0.5 ${
                      isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                    }`}>
                    Descubre un anime al azar con la ruleta
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleRandomSpin}
                className={`flex-row items-center px-4 py-2.5 rounded-2xl active:scale-95 ${
                  isDark ? 'bg-[#3A2D25]' : 'bg-[#8B4F26]'
                }`}>
                <Text
                  className={`text-xs font-bold mr-1 ${
                    isDark ? 'text-[#EDE0DB]' : 'text-white'
                  }`}>
                  Girar
                </Text>
                <Ionicons
                  name="flash"
                  size={12}
                  color={isDark ? '#F59E0B' : '#FFFFFF'}
                />
              </Pressable>
            </View>
          </View>

          {/* Sección 5: Top Ranking de la Comunidad */}
          <View className="mt-6 px-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-7 h-7 rounded-lg items-center justify-center bg-[#F59E0B]/20">
                  <Ionicons name="trophy" size={16} color="#F59E0B" />
                </View>
                <View>
                  <Text
                    className={`text-base font-bold ${
                      isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                    }`}>
                    Top Ranking de la Comunidad
                  </Text>
                  <Text
                    className={`text-xs ${
                      isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                    }`}>
                    Las series mejor valoradas
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push('/(tabs)/explore' as any)}
                className="flex-row items-center gap-1">
                <Text
                  className={`text-xs font-semibold ${
                    isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
                  }`}>
                  Ver más
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={isDark ? '#E09F7D' : '#8B4F26'}
                />
              </Pressable>
            </View>

            <View className="mt-2">
              {rankingAnimes.map((anime, index) => (
                <M3RankCard
                  key={`rank-${anime.id}`}
                  rank={index + 1}
                  anime={anime}
                  isFavorite={isFavorite(anime.id)}
                  onToggleFavorite={() => toggleFavorite(anime)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
