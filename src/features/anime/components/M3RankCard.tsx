import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/context/theme-context';
import { AnimeMedia } from '../types/anime.types';

interface M3RankCardProps {
  rank: number;
  anime: AnimeMedia;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function M3RankCard({
  rank,
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
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : null;
  const year = anime.seasonYear || anime.startDate?.year || '';
  const eps = anime.episodes ? `${anime.episodes} eps` : '';
  const genres = anime.genres ? anime.genres.slice(0, 2).join(' • ') : '';

  const getRankBadgeStyle = (r: number) => {
    switch (r) {
      case 1:
        return { bg: 'bg-[#F59E0B]', text: 'text-black' };
      case 2:
        return { bg: 'bg-[#A8A29E]', text: 'text-black' };
      case 3:
        return { bg: 'bg-[#C27838]', text: 'text-white' };
      default:
        return {
          bg: isDark ? 'bg-[#362922]' : 'bg-[#E5DCD4]',
          text: isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]',
        };
    }
  };

  const badgeStyle = getRankBadgeStyle(rank);

  return (
    <Pressable
      onPress={() => router.push(`/anime/${anime.id}` as any)}
      className={`flex-row items-center p-3 rounded-2xl mb-2.5 border active:opacity-90 ${
        isDark
          ? rank === 1
            ? 'bg-[#261E1A] border-[#F59E0B]/50'
            : 'bg-[#221A16] border-[#3E3028]'
          : rank === 1
          ? 'bg-[#FFFDF7] border-[#F59E0B]/60 shadow-sm'
          : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
      }`}>
      {/* Rank Badge */}
      <View
        className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${badgeStyle.bg}`}>
        <Text className={`text-xs font-black ${badgeStyle.text}`}>
          #{rank}
        </Text>
      </View>

      {/* Thumbnail */}
      <View className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-900 mr-3">
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
          className={`text-sm font-bold leading-4 ${
            isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
          }`}
          numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center flex-wrap gap-1">
          {score && (
            <View className="flex-row items-center">
              <Ionicons name="star" size={10} color="#F59E0B" />
              <Text className="text-[11px] font-bold text-[#F59E0B] ml-1">
                {score}
              </Text>
            </View>
          )}
          {score && (year || eps) && (
            <Text
              className={`text-[11px] ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              •
            </Text>
          )}
          {year ? (
            <Text
              className={`text-[11px] ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              {year}
            </Text>
          ) : null}
          {year && eps && (
            <Text
              className={`text-[11px] ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              •
            </Text>
          )}
          {eps ? (
            <Text
              className={`text-[11px] ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              {eps}
            </Text>
          ) : null}
        </View>

        {genres ? (
          <Text
            className={`text-[11px] ${
              isDark ? 'text-[#A89C94]' : 'text-[#776962]'
            }`}
            numberOfLines={1}>
            {genres}
          </Text>
        ) : null}
      </View>

      {/* Heart Action Button */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        hitSlop={8}
        className="p-2 active:scale-110">
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? '#E53935' : isDark ? '#A89C94' : '#776962'}
        />
      </Pressable>
    </Pressable>
  );
}
