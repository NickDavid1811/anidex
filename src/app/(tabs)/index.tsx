import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { AnimeCard } from '@/features/anime/components/AnimeCard';
import { useTrendingAnime } from '@/features/anime/hooks/useTrendingAnime';

export default function HomeScreen() {
  const { animes, isLoading, isRefreshing, error, refetch } = useTrendingAnime();
  const insets = useSafeAreaInsets();

  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg justify-center items-center">
        <LoadingState message="Cargando animes en tendencia..." />
      </View>
    );
  }

  if (error && animes.length === 0) {
    return (
      <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg justify-center items-center">
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg">
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center" edges={['top', 'left', 'right']}>
        {/* Header estilo Material Design 3 */}
        <View className="px-4 pt-2 pb-3 gap-0.5">
          <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Anidex
          </Text>
          <Text className="text-xs font-semibold text-crunchyroll-primary">
            Tendencias de Anime • AniList
          </Text>
        </View>

        <FlatList
          data={animes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 90,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor="#F47521"
              colors={['#F47521']}
            />
          }
          renderItem={({ item }) => <AnimeCard anime={item} />}
        />
      </SafeAreaView>
    </View>
  );
}
