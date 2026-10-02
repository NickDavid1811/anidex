import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  // Configuración de estilo del Podio Top 3
  const getPodiumConfig = (r: number) => {
    switch (r) {
      case 1:
        return {
          cardBg: isDark ? 'bg-[#2A2016]' : 'bg-[#FFFDF5]',
          cardBorder: isDark ? 'border-[#F59E0B]/60' : 'border-[#F59E0B]/70',
          badgeBg: 'bg-[#F59E0B]',
          badgeText: 'text-black',
          crown: '👑',
          shadow: 'shadow-md',
        };
      case 2:
        return {
          cardBg: isDark ? 'bg-[#23201D]' : 'bg-[#F8FAFC]',
          cardBorder: isDark ? 'border-[#94A3B8]/50' : 'border-[#CBD5E1]/70',
          badgeBg: 'bg-[#94A3B8]',
          badgeText: 'text-black',
          crown: '🥈',
          shadow: 'shadow-sm',
        };
      case 3:
        return {
          cardBg: isDark ? 'bg-[#251C17]' : 'bg-[#FFF7ED]',
          cardBorder: isDark ? 'border-[#D97706]/45' : 'border-[#D97706]/55',
          badgeBg: 'bg-[#D97706]',
          badgeText: 'text-white',
          crown: '🥉',
          shadow: 'shadow-sm',
        };
      default:
        return {
          cardBg: isDark ? 'bg-[#221A16]' : 'bg-[#FFFFFF]',
          cardBorder: isDark ? 'border-[#3E3028]' : 'border-[#D8CDC5]',
          badgeBg: isDark ? 'bg-[#362922]' : 'bg-[#E5DCD4]',
          badgeText: isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]',
          crown: null,
          shadow: 'shadow-sm',
        };
    }
  };

  const podium = getPodiumConfig(rank);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    try {
      Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleFavorite();
  };

  return (
    <Pressable
      onPress={() => router.push(`/anime/${anime.id}` as any)}
      className={`flex-row items-center p-3 rounded-2xl mb-2.5 border active:opacity-90 ${podium.cardBg} ${podium.cardBorder} ${podium.shadow}`}>
      {/* Rank Badge with Trophy/Medal icon for top 3 */}
      <View
        className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${podium.badgeBg}`}>
        {rank === 1 ? (
          <Ionicons name="trophy" size={16} color="#000000" />
        ) : (
          <Text className={`text-xs font-black ${podium.badgeText}`}>
            #{rank}
          </Text>
        )}
      </View>

      {/* Thumbnail */}
      <View className="w-12 h-16 rounded-xl overflow-hidden bg-neutral-900 mr-3 border border-black/10 shadow-sm">
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
            className={`text-[11px] font-medium ${
              isDark ? 'text-[#A89C94]' : 'text-[#776962]'
            }`}
            numberOfLines={1}>
            {genres}
          </Text>
        ) : null}
      </View>

      {/* Bouncy Heart Action Button */}
      <Pressable
        onPress={handleFavoritePress}
        hitSlop={10}
        className="p-2">
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? '#E53935' : isDark ? '#A89C94' : '#776962'}
          />
        </Animated.View>
      </Pressable>
    </Pressable>
  );
}
