import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/features/theme';
import { useLocalization } from '@/features/localization';
import { GENRE_LABELS } from '../constants/genres';
import { AnimeMedia } from '../types/anime.types';
import { FavoriteActionButton } from './FavoriteActionButton';

interface M3AnimeCardProps {
  anime: AnimeMedia;
  compact?: boolean;
  isFavorite?: boolean;
  actionType?: 'favorite' | 'delete';
  onActionPress?: () => void;
}

export function M3AnimeCard({
  anime,
  compact = false,
  isFavorite = false,
  actionType = 'favorite',
  onActionPress,
}: M3AnimeCardProps) {
  const { activeScheme } = useAppTheme();
  const { t } = useLocalization();
  const isDark = activeScheme === 'dark';

  const title =
    anime.title.english ||
    anime.title.userPreferred ||
    anime.title.romaji ||
    'Anime';
  const coverUrl =
    anime.coverImage.large ||
    anime.coverImage.medium ||
    anime.coverImage.extraLarge;
  const score = anime.averageScore
    ? `${(anime.averageScore / 10).toFixed(1)}/10`
    : null;
  const year = anime.seasonYear || anime.startDate?.year || '';
  const eps = anime.episodes ? `${anime.episodes} eps` : '';
  const genre =
    anime.genres && anime.genres.length > 0 ? anime.genres[0] : null;

  const formatPopularity = (pop?: number) => {
    if (!pop) return null;
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`;
    return `${pop}`;
  };

  const popularityStr = formatPopularity(anime.popularity);

  const handleCardPress = () => {
    router.push(`/anime/${anime.id}` as any);
  };

  if (compact) {
    const active = actionType === 'delete' || isFavorite;
    const metadata = [
      anime.averageScore != null ? `★ ${(anime.averageScore / 10).toFixed(1)}` : null,
      year,
      anime.episodes ? t('anime.episodes', { count: anime.episodes }) : null,
    ].filter(Boolean).join(' · ');

    return (
      <View className={`flex-row items-center rounded-2xl mb-2 border ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
        <Pressable
          onPress={handleCardPress}
          accessibilityRole="button"
          accessibilityLabel={t('anime.viewDetails', { title })}
          className="flex-1 flex-row items-center gap-3 p-3 pr-1 active:opacity-75"
        >
          <View style={{ width: 64, height: 88, borderRadius: 10, overflow: 'hidden', backgroundColor: anime.coverImage.color || '#333' }}>
            {coverUrl ? <Image source={{ uri: coverUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} /> : null}
          </View>
          <View className="flex-1 gap-1.5">
            <Text numberOfLines={2} style={{ fontSize: 16, lineHeight: 22 }} className={`font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>
              {title}
            </Text>
            {metadata ? <Text style={{ fontSize: 14, lineHeight: 20 }} className={`font-manrope-medium ${isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'}`}>{metadata}</Text> : null}
            {genre ? <Text numberOfLines={1} className={`text-sm font-manrope ${isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'}`}>{GENRE_LABELS[genre] ?? genre}</Text> : null}
          </View>
        </Pressable>
        {onActionPress && (
          <View className="mr-2">
            <FavoriteActionButton
              active={active}
              accessibilityLabel={t(active ? 'anime.remove' : 'anime.save', { title })}
              isDark={isDark}
              onPress={onActionPress}
              contained={active}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={t('anime.viewDetails', { title })}
      className={`will-change-variable flex-row p-3 rounded-2xl mb-3 border active:opacity-90 ${
        isDark
          ? 'bg-[#221A16] border-[#3E3028]'
          : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
      }`}
    >
      {/* Thumbnail poster */}
      <View className="w-24 h-32 rounded-xl overflow-hidden bg-neutral-900 self-center">
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

      {/* Info column */}
      <View className="flex-1 ml-3.5 justify-between py-0.5">
        <View className="gap-1.5">
          <Text
            className={`text-base font-manrope-bold leading-5 ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Badges row: Score, Year, Episodes, Genre */}
          <View className="flex-row flex-wrap items-center gap-1.5">
            {score && (
              <View className="flex-row items-center px-2 py-0.5 rounded-md bg-[#F59E0B]/15">
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text className="text-xs font-manrope-bold text-[#F59E0B] ml-1">
                  {score}
                </Text>
              </View>
            )}

            {year ? (
              <View
                className={`px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}
              >
                <Text
                  className={`text-xs font-manrope-medium ${
                    isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
                  }`}
                >
                  {year}
                </Text>
              </View>
            ) : null}

            {eps ? (
              <View
                className={`flex-row items-center px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}
              >
                <Ionicons
                  name="tv-outline"
                  size={11}
                  color={isDark ? '#A89C94' : '#776962'}
                />
                <Text
                  className={`text-xs font-manrope-medium ml-1 ${
                    isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
                  }`}
                >
                  {eps}
                </Text>
              </View>
            ) : null}

            {genre && (
              <View
                className={`px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}
              >
                <Text
                  className={`text-xs font-manrope-medium ${
                    isDark ? 'text-[#A89C94]' : 'text-[#53433C]'
                  }`}
                >
                  {genre}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom row: Popularity and Action button */}
        <View className="flex-row items-center justify-between mt-2">
          {popularityStr ? (
            <View className="flex-row items-center gap-1">
              <Ionicons
                name="people-outline"
                size={14}
                color={isDark ? '#A89C94' : '#776962'}
              />
              <Text
                className={`font-manrope text-xs ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}
              >
                {popularityStr}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {/* Action Button: Favorite or Delete */}
          {onActionPress && (
            <FavoriteActionButton
              active={actionType === 'delete' || isFavorite}
              accessibilityLabel={t(actionType === 'delete' || isFavorite ? 'anime.remove' : 'anime.save', { title })}
              isDark={isDark}
              onPress={onActionPress}
              size={18}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}
