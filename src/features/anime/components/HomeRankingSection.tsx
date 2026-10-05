import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AnimeMedia } from '../types/anime.types';
import { HomeSectionHeader } from './HomeSectionHeader';
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
      <HomeSectionHeader title="Más tendencias" action="Ver más" accessibilityLabel="Explorar más tendencias" isDark={isDark}
        onPress={() => router.push({ pathname: '/(tabs)/explore', params: { sort: 'trending', genre: '' } })} />

      <View className="mt-2">
        {animes.map((anime) => (
          <M3RankCard
            key={`rank-${anime.id}`}
            anime={anime}
            isFavorite={isFavorite(anime.id)}
            onToggleFavorite={() => onToggleFavorite(anime)}
          />
        ))}
      </View>
    </View>
  );
}
