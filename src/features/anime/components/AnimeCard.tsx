import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AnimeMedia } from '../types/anime.types';
import { AnimeScoreBadge } from './AnimeScoreBadge';

interface AnimeCardProps {
  anime: AnimeMedia;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const title = anime.title.english || anime.title.userPreferred || anime.title.romaji || 'Sin título';
  const coverUrl = anime.coverImage.large || anime.coverImage.medium;

  const handlePress = () => {
    router.push(`/anime/${anime.id}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="w-[48%] mb-4 rounded-2xl overflow-hidden border border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface active:opacity-80 active:scale-[0.98]">
      <View className="w-full aspect-[3/4] relative bg-neutral-900 overflow-hidden">
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={250}
          />
        ) : (
          <View
            className="w-full h-full"
            style={{ width: '100%', height: '100%', backgroundColor: anime.coverImage.color || '#222' }}
          />
        )}
        <View className="absolute top-2 right-2">
          <AnimeScoreBadge score={anime.averageScore} />
        </View>
      </View>

      <View className="p-2.5 gap-1">
        <Text
          className="text-sm font-bold text-slate-900 dark:text-white leading-4"
          numberOfLines={2}>
          {title}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-zinc-400" numberOfLines={1}>
          {anime.format || 'ANIME'} {anime.seasonYear ? `• ${anime.seasonYear}` : ''}
        </Text>
        {anime.genres && anime.genres.length > 0 && (
          <Text className="text-[11px] font-bold text-crunchyroll-primary" numberOfLines={1}>
            {anime.genres.slice(0, 2).join(' • ')}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
