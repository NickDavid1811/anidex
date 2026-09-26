import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AnimeGenres } from '@/features/anime/components/AnimeGenres';
import { AnimeScoreBadge } from '@/features/anime/components/AnimeScoreBadge';
import { useAnimeDetail } from '@/features/anime/hooks/useAnimeDetail';
import { useTheme } from '@/hooks/use-theme';

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { anime, isLoading, error, refetch } = useAnimeDetail(id);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Cargando...', headerBackTitle: 'Volver' }} />
        <LoadingState message="Cargando detalles del anime..." />
      </ThemedView>
    );
  }

  if (error || !anime) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Detalle', headerBackTitle: 'Volver' }} />
        <ErrorState message={error || 'No se encontró el anime'} onRetry={refetch} />
      </ThemedView>
    );
  }

  const title = anime.title.english || anime.title.userPreferred || anime.title.romaji || 'Anime';
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>?/gm, '')
    : 'Sin descripción disponible.';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title,
          headerBackTitle: 'Atrás',
          headerTintColor: theme.text,
          headerStyle: { backgroundColor: theme.background },
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.six }]}
        showsVerticalScrollIndicator={false}>
        {anime.bannerImage ? (
          <Image
            source={{ uri: anime.bannerImage }}
            style={styles.banner}
            contentFit="cover"
          />
        ) : null}

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Image
              source={{ uri: anime.coverImage.large || anime.coverImage.medium }}
              style={styles.poster}
              contentFit="cover"
              transition={200}
            />

            <View style={styles.headerDetails}>
              <ThemedText type="subtitle" style={styles.mainTitle}>
                {title}
              </ThemedText>
              {anime.title.native && (
                <Text style={[styles.nativeTitle, { color: theme.textSecondary }]}>
                  {anime.title.native}
                </Text>
              )}
              <View style={styles.badgesRow}>
                <AnimeScoreBadge score={anime.averageScore} />
                <View style={[styles.statusBadge, { backgroundColor: theme.backgroundSelected }]}>
                  <Text style={[styles.statusText, { color: theme.text }]}>
                    {anime.status || 'STATUS'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <AnimeGenres genres={anime.genres} />

          <View
            style={[
              styles.metaGrid,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Episodios</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>
                {anime.episodes ?? 'N/A'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Formato</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>
                {anime.format ?? 'TV'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Temporada</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>
                {anime.season ? `${anime.season} ${anime.seasonYear ?? ''}` : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.synopsisSection}>
            <ThemedText type="default" style={styles.sectionHeading}>
              Sinopsis
            </ThemedText>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {cleanDescription}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  banner: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  mainInfo: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  poster: {
    width: 110,
    height: 160,
    borderRadius: 12,
  },
  headerDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  mainTitle: {
    fontSize: 20,
    lineHeight: 24,
  },
  nativeTitle: {
    fontSize: 13,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
  },
  metaItem: {
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  synopsisSection: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
});
