import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { AnimeCard } from '@/features/anime/components/AnimeCard';
import { useTrendingAnime } from '@/features/anime/hooks/useTrendingAnime';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { animes, isLoading, isRefreshing, error, refetch } = useTrendingAnime();
  const theme = useTheme();

  if (isLoading && !isRefreshing) {
    return (
      <ThemedView style={styles.container}>
        <LoadingState message="Cargando animes en tendencia..." />
      </ThemedView>
    );
  }

  if (error && animes.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ErrorState message={error} onRetry={refetch} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Anidex</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>
            Tendencias de Anime (AniList)
          </ThemedText>
        </View>

        <FlatList
          data={animes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor="#3c87f7"
              colors={['#3c87f7']}
            />
          }
          renderItem={({ item }) => <AnimeCard anime={item} />}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
