import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  HomeCategories,
  HomeFeaturedCarousel,
  HomeHeader,
  HomeRandomBanner,
  HomeRankingSection,
  HomeRecentFavorites,
  useTrendingAnime,
} from '@/features/anime';
import { useFavorites } from '@/features/favorites';
import { useAppTheme } from '@/features/theme';

export default function HomeScreen() {
  const { animes, isLoading, isRefreshing, error, refetch } = useTrendingAnime();
  const { isFavorite, toggleFavorite, favorites, count: favoritesCount } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  const screenWidth = Dimensions.get('window').width;
  const contentWidth = Math.min(screenWidth, 800);

  const handleRandomSpin = () => {
    if (animes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * animes.length);
    const chosen = animes[randomIndex];
    router.push(`/anime/${chosen.id}` as any);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}>
        <LoadingState message="Cargando las series del momento..." />
      </View>
    );
  }

  if (error && animes.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}>
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
      }`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor={isDark ? '#E09F7D' : '#8B4F26'}
              colors={[isDark ? '#E09F7D' : '#8B4F26']}
            />
          }>
          <HomeHeader isDark={isDark} />

          <HomeFeaturedCarousel
            animes={animes.slice(0, 5)}
            contentWidth={contentWidth}
            isDark={isDark}
          />

          <HomeCategories isDark={isDark} />

          <HomeRecentFavorites
            favorites={favorites}
            favoritesCount={favoritesCount}
            isDark={isDark}
          />

          <HomeRandomBanner onSpin={handleRandomSpin} isDark={isDark} />

          <HomeRankingSection
            animes={animes.slice(0, 8)}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            isDark={isDark}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
