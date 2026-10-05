import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AnimeMedia } from '../types/anime.types';
import { HomeSectionHeader } from './HomeSectionHeader';

interface HomeRecentFavoritesProps {
  favorites: AnimeMedia[];
  favoritesCount: number;
  isDark: boolean;
}

export function HomeRecentFavorites({
  favorites,
  favoritesCount,
  isDark,
}: HomeRecentFavoritesProps) {
  if (favorites.length === 0) return null;

  const recentFavorites = favorites.slice(0, 6);

  return (
    <View className="mt-5 px-4">
      <HomeSectionHeader title="Tus favoritos" action="Ver todos" accessibilityLabel={`Ver tus ${favoritesCount} favoritos`} onPress={() => router.push('/(tabs)/favorites')} isDark={isDark} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {recentFavorites.map((fav) => {
          const title =
            fav.title.english ||
            fav.title.userPreferred ||
            fav.title.romaji ||
            'Anime';
          const cover = fav.coverImage.medium || fav.coverImage.large;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ver detalles de ${title}`}
              key={`recent-fav-${fav.id}`}
              onPress={() => router.push(`/anime/${fav.id}` as any)}
              className="w-24 active:opacity-85"
            >
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
                numberOfLines={2}
                className={`text-sm leading-5 font-manrope-semibold ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
