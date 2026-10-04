import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const bannerUrl = anime.bannerImage || coverUrl;

  const score =
    anime.averageScore != null
      ? `${(anime.averageScore / 10).toFixed(1)}/10`
      : 'Sin puntuación';
  const year = anime.seasonYear || anime.startDate?.year || '';
  const eps = anime.episodes
    ? `${anime.episodes} episodios`
    : anime.status === 'RELEASING'
      ? 'En emisión'
      : '';
  const genre =
    anime.genres && anime.genres.length > 0 ? anime.genres[0] : 'Anime';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles de ${title}`}
      onPress={() => router.push(`/anime/${anime.id}` as any)}
      className={`will-change-variable rounded-[28px] overflow-hidden border active:opacity-95 shadow-lg relative ${
        isDark
          ? 'bg-[#1E1713] border-[#3E3028]/80'
          : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-md'
      }`}
      style={{ height: 195 }}
    >
      {/* Background Cinematic Banner with Ambient Blur */}
      {bannerUrl ? (
        <Image
          source={{ uri: bannerUrl }}
          style={[StyleSheet.absoluteFill, { opacity: isDark ? 0.32 : 0.22 }]}
          contentFit="cover"
          blurRadius={14}
          transition={250}
        />
      ) : null}

      {/* Ambient Tint Overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? 'rgba(20, 18, 17, 0.45)'
              : 'rgba(255, 255, 255, 0.4)',
          },
        ]}
      />

      {/* Card Content Foreground */}
      <View className="flex-1 flex-row p-3.5 items-center">
        {/* Crisp Poster Thumbnail */}
        <View
          className="w-24 h-36 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg"
          style={{ elevation: 6 }}
        >
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

        {/* Info Column */}
        <View className="flex-1 ml-3.5 justify-between py-1 h-36">
          <View className="gap-1.5">
            {/* Rating Pill + Status */}
            <View className="flex-row items-center gap-1.5">
              <View className="flex-row items-center px-2 py-0.5 rounded-full bg-[#F59E0B]/25 border border-[#F59E0B]/40">
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text className="text-xs font-manrope-bold text-[#F59E0B] ml-1">
                  {score}
                </Text>
              </View>

              <View
                className={`px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-[#2F241E]/80 border-[#3E3028]'
                    : 'bg-[#EDE5DF]/80 border-[#D8CDC5]'
                }`}
              >
                <Text
                  className={`text-xs font-manrope-bold ${
                    isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
                  }`}
                >
                  {genre}
                </Text>
              </View>
            </View>

            {/* Anime Title */}
            <Text
              className={`text-base font-manrope-bold leading-5 ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}
              numberOfLines={2}
            >
              {title}
            </Text>

            {/* Metadata (Year & Episodes) */}
            <Text
              className={`text-xs font-manrope-medium ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}
            >
              {[year, eps].filter(Boolean).join(' · ')}
            </Text>
          </View>

          {/* Action Button: "Ver detalles" */}
          <View className="flex-row items-center self-start px-3 py-1.5 rounded-xl bg-[#8B4F26] dark:bg-[#E09F7D]/20 border dark:border-[#E09F7D]/40 gap-1.5">
            <Text className="text-xs font-manrope-bold text-white dark:text-[#E09F7D]">
              Ver detalles
            </Text>
            <Ionicons
              name="arrow-forward"
              size={12}
              color={isDark ? '#E09F7D' : '#FFFFFF'}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
