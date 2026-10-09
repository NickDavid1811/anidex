import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';
import { AnimeMedia } from '../types/anime.types';
import { FavoriteActionButton } from './FavoriteActionButton';

interface M3RankCardProps {
  anime: AnimeMedia;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function M3RankCard({
  anime,
  isFavorite,
  onToggleFavorite,
}: M3RankCardProps) {
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  const title =
    anime.title.english ||
    anime.title.userPreferred ||
    anime.title.romaji ||
    'Anime';
  const coverUrl =
    anime.coverImage.medium ||
    anime.coverImage.large ||
    anime.coverImage.extraLarge;
  const score = anime.averageScore
    ? `${(anime.averageScore / 10).toFixed(1)}/10`
    : null;
  const year = anime.seasonYear || anime.startDate?.year || '';
  const eps = anime.episodes ? `${anime.episodes} eps` : '';
  const genres = anime.genres ? anime.genres.slice(0, 2).join(' • ') : '';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles de ${title}`}
      onPress={() => router.push(`/anime/${anime.id}` as any)}
      className={`will-change-variable flex-row items-center p-3 rounded-2xl mb-2.5 border active:opacity-90 ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}
    >
      {/* Thumbnail */}
      <View className="w-16 h-24 rounded-xl overflow-hidden bg-neutral-900 mr-3 border border-black/10 shadow-sm">
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View
            className="w-full h-full"
            style={{ backgroundColor: anime.coverImage.color || '#333' }}
          />
        )}
      </View>

      {/* Anime Info */}
      <View className="flex-1 mr-2 gap-1 justify-center">
        <Text
          className={`text-base font-manrope-bold leading-6 ${
            isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
          }`}
          numberOfLines={2}
        >
          {title}
        </Text>

        <View className="flex-row items-center flex-wrap gap-1">
          {score && (
            <View className="flex-row items-center">
              <Ionicons name="star" size={10} color={isDark ? '#FBBF24' : '#8B4F26'} />
              <Text className={`text-sm font-manrope-bold ml-1 ${isDark ? 'text-[#FBBF24]' : 'text-[#8B4F26]'}`}>
                {score}
              </Text>
            </View>
          )}
          {score && (year || eps) && (
            <Text
              className={`font-manrope text-sm ${
                isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
              }`}
            >
              •
            </Text>
          )}
          {year ? (
            <Text
              className={`font-manrope text-sm ${
                isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
              }`}
            >
              {year}
            </Text>
          ) : null}
          {year && eps && (
            <Text
              className={`font-manrope text-sm ${
                isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
              }`}
            >
              •
            </Text>
          )}
          {eps ? (
            <Text
              className={`font-manrope text-sm ${
                isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
              }`}
            >
              {eps}
            </Text>
          ) : null}
        </View>

        {genres ? (
          <Text
            className={`text-sm font-manrope-medium ${
              isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
            }`}
            numberOfLines={2}
          >
            {genres}
          </Text>
        ) : null}
      </View>

      {/* Bouncy Heart Action Button */}
      <FavoriteActionButton
        accessibilityLabel={`${isFavorite ? 'Quitar' : 'Guardar'} ${title} ${isFavorite ? 'de' : 'en'} favoritos`}
        active={isFavorite}
        isDark={isDark}
        onPress={onToggleFavorite}
        contained={false}
      />
    </Pressable>
  );
}
