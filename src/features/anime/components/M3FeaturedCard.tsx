import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';
import { useLocalization } from '@/features/localization';
import { AnimeMedia } from '../types/anime.types';

export function M3FeaturedCard({ anime }: { anime: AnimeMedia }) {
  const { activeScheme } = useAppTheme();
  const { t } = useLocalization();
  const isDark = activeScheme === 'dark';
  const title = anime.title.english || anime.title.userPreferred || anime.title.romaji || 'Anime';
  const imageUrl = anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium;
  const year = anime.seasonYear || anime.startDate?.year;
  const episodes = anime.episodes ? t('anime.episodes', { count: anime.episodes }) : anime.status === 'RELEASING' ? t('anime.airing') : '';
  const metadata = [year, episodes].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('anime.viewDetails', { title })}
      onPress={() => router.push(`/anime/${anime.id}`)}
      className={`rounded-3xl overflow-hidden border active:opacity-90 ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}
    >
      <View style={{ height: 152, backgroundColor: anime.coverImage.color || (isDark ? '#2F241E' : '#EDE5DF') }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={200} />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="image-outline" size={40} color={isDark ? '#D0C3BC' : '#53433C'} />
          </View>
        )}
      </View>
      <View className="p-4 gap-2">
        <Text numberOfLines={2} className={`text-xl leading-7 font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>{title}</Text>
        <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
          {anime.averageScore != null && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={16} color={isDark ? '#FBBF24' : '#8B4F26'} />
              <Text className={`text-sm font-manrope-bold ${isDark ? 'text-[#FBBF24]' : 'text-[#8B4F26]'}`}>{(anime.averageScore / 10).toFixed(1)}/10</Text>
            </View>
          )}
          {metadata ? <Text className={`text-sm font-manrope ${isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'}`}>{metadata}</Text> : null}
        </View>
        <View className="flex-row items-center gap-2 pt-1">
          <Text className={`text-sm font-manrope-bold ${isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'}`}>{t('anime.viewDetailsShort')}</Text>
          <Ionicons name="arrow-forward" size={18} color={isDark ? '#E09F7D' : '#8B4F26'} />
        </View>
      </View>
    </Pressable>
  );
}
