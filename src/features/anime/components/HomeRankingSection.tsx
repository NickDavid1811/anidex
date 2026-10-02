import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { AnimeMedia } from '../types/anime.types';
import { M3RankCard } from './M3RankCard';

interface HomeRankingSectionProps {
  animes: AnimeMedia[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (anime: AnimeMedia) => void;
  isDark: boolean;
}

export function HomeRankingSection({
  animes,
  isFavorite,
  onToggleFavorite,
  isDark,
}: HomeRankingSectionProps) {
  if (animes.length === 0) return null;

  return (
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
        {animes.map((anime, index) => (
          <M3RankCard
            key={`rank-${anime.id}`}
            rank={index + 1}
            anime={anime}
            isFavorite={isFavorite(anime.id)}
            onToggleFavorite={() => onToggleFavorite(anime)}
          />
        ))}
      </View>
    </View>
  );
}
