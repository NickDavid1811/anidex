import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';
import { AnimeMedia } from '../types/anime.types';

interface M3FeaturedCardProps {
  anime: AnimeMedia;
}

export function M3FeaturedCard({ anime }: M3FeaturedCardProps) {
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  const title =
    anime.title.english ||
    anime.title.userPreferred ||
    anime.title.romaji ||
    'Anime';
  const coverUrl =
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    anime.coverImage.medium;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : '9.0';
  const year = anime.seasonYear || anime.startDate?.year || '2024';
  const eps = anime.episodes ? `${anime.episodes} Episodios` : 'En emisión';
  const genre = anime.genres && anime.genres.length > 0 ? anime.genres[0] : 'Anime';

  return (
    <Pressable
      onPress={() => router.push(`/anime/${anime.id}` as any)}
      className={`p-4 rounded-3xl border active:opacity-95 ${
        isDark
          ? 'bg-[#221A16] border-[#3E3028]'
          : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-md'
      }`}>
      <View className="flex-row">
        {/* Cover Poster */}
        <View className="w-28 h-38 rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              className="w-full h-full"
              style={{ backgroundColor: anime.coverImage.color || '#333' }}
            />
          )}
        </View>

        {/* Details Column */}
        <View className="flex-1 ml-4 justify-between py-1">
          <View className="gap-2">
            {/* Rating Pill */}
            <View className="self-start flex-row items-center px-2.5 py-1 rounded-full bg-[#F59E0B]/20">
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text className="text-xs font-bold text-[#F59E0B] ml-1">
                {score} • Recomendado
              </Text>
            </View>

            {/* Title */}
            <Text
              className={`text-lg font-black leading-6 ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}
              numberOfLines={2}>
              {title}
            </Text>

            {/* Year & Episodes */}
            <Text
              className={`text-xs font-medium ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              {year} • {eps}
            </Text>

            {/* Genre Badge */}
            <View
              className={`self-start px-2.5 py-0.5 rounded-lg ${
                isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
              }`}>
              <Text
                className={`text-[11px] font-semibold ${
                  isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
                }`}>
                {genre}
              </Text>
            </View>
          </View>

          {/* Action Link: Detalles ↗ */}
          <View className="flex-row items-center gap-1 mt-2">
            <Text
              className={`text-sm font-bold ${
                isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
              }`}>
              Detalles
            </Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={isDark ? '#E09F7D' : '#8B4F26'}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
