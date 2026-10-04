import React, { useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import {
  HomeCategories,
  HomeFeaturedCarousel,
  HomeHeader,
  HomeRandomBanner,
  HomeRankingSection,
  HomeRecentFavorites,
  HomeSkeleton,
  RandomRouletteModal,
  useTrendingAnime,
} from '@/features/anime';
import { useFavorites } from '@/features/favorites';
import { useAppTheme } from '@/features/theme';

export default function HomeScreen() {
  const { animes, isLoading, isRefreshing, error, refetch } =
    useTrendingAnime();
  const {
    isFavorite,
    toggleFavorite,
    favorites,
    count: favoritesCount,
    error: favoritesError,
  } = useFavorites();
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  const [rouletteVisible, setRouletteVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const contentWidth = Math.min(screenWidth, 800);

  if (isLoading && !isRefreshing) {
    return <HomeSkeleton isDark={isDark} />;
  }

  if (error && animes.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}
      >
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}
      >
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
          }
        >
          <HomeHeader isDark={isDark} />
          {favoritesError && (
            <Text
              accessibilityRole="alert"
              className="px-4 py-2 text-sm text-red-600"
            >
              {favoritesError}
            </Text>
          )}

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

          <HomeRandomBanner
            onSpin={() => setRouletteVisible(true)}
            isDark={isDark}
          />

          <HomeRankingSection
            animes={animes.slice(5, 13)}
            isFavorite={isFavorite}
            onToggleFavorite={(anime) => {
              void toggleFavorite(anime).catch(() => {});
            }}
            isDark={isDark}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Modal Interactivo de Ruleta Aleatoria */}
      <RandomRouletteModal
        visible={rouletteVisible}
        onClose={() => setRouletteVisible(false)}
        animes={animes}
        isDark={isDark}
      />
    </View>
  );
}
