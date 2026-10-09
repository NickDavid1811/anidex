import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useLocalization } from '@/features/localization';

import { AnimeMedia } from '../types/anime.types';
import { HomeSectionHeader } from './HomeSectionHeader';
import { M3FeaturedCard } from './M3FeaturedCard';

interface HomeFeaturedCarouselProps {
  animes: AnimeMedia[];
  contentWidth: number;
  isDark: boolean;
}

export function HomeFeaturedCarousel({
  animes,
  contentWidth,
  isDark,
}: HomeFeaturedCarouselProps) {
  const { t } = useLocalization();
  const [activeSlide, setActiveSlide] = useState(0);

  if (animes.length === 0) return null;

  return (
    <View className="mt-3">
      <View className="px-4">
        <HomeSectionHeader title={t('home.trending')} action={t('home.viewAll')} accessibilityLabel={t('home.viewAllTrends')} isDark={isDark}
          onPress={() => router.push({ pathname: '/(tabs)/explore', params: { sort: 'trending', genre: '' } })} />
      </View>

      {/* Carrusel */}
      <FlatList
        data={animes}
        horizontal
        snapToInterval={contentWidth - 20}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `featured-${item.id}`}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / (contentWidth - 20)
          );
          setActiveSlide(Math.min(animes.length - 1, Math.max(0, newIndex)));
        }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={{ width: contentWidth - 32, marginRight: 12 }}>
            <M3FeaturedCard anime={item} />
          </View>
        )}
      />

      {/* Dots del Carrusel */}
      <View className="flex-row justify-center items-center mt-3 gap-1.5">
        {animes.map((_, i) => (
          <View
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              activeSlide === i
                ? isDark
                  ? 'w-5 bg-[#E09F7D]'
                  : 'w-5 bg-[#8B4F26]'
                : isDark
                  ? 'w-1.5 bg-[#3E3028]'
                  : 'w-1.5 bg-[#D8CDC5]'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
