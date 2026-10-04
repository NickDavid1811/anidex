import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AnimeMedia } from '../types/anime.types';

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
      <View className="flex-row items-center justify-between mb-2.5">
        <Text
          className={`text-base font-manrope-bold ${
            isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
          }`}
        >
          Mis Favoritos Recientes
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/favorites' as any)}
          className="flex-row items-center gap-1"
        >
          <Text
            className={`text-xs font-manrope-semibold ${
              isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
            }`}
          >
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
                numberOfLines={1}
                className={`text-xs font-manrope-semibold ${
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
