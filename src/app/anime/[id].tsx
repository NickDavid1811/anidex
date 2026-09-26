import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { AnimeGenres } from '@/features/anime/components/AnimeGenres';
import { AnimeScoreBadge } from '@/features/anime/components/AnimeScoreBadge';
import { useAnimeDetail } from '@/features/anime/hooks/useAnimeDetail';

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { anime, isLoading, error, refetch } = useAnimeDetail(id);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg justify-center items-center">
        <Stack.Screen options={{ title: 'Cargando...', headerBackTitle: 'Volver' }} />
        <LoadingState message="Cargando detalles del anime..." />
      </View>
    );
  }

  if (error || !anime) {
    return (
      <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg justify-center items-center">
        <Stack.Screen options={{ title: 'Detalle', headerBackTitle: 'Volver' }} />
        <ErrorState message={error || 'No se encontró el anime'} onRetry={refetch} />
      </View>
    );
  }

  const title = anime.title.english || anime.title.userPreferred || anime.title.romaji || 'Anime';
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>?/gm, '')
    : 'Sin descripción disponible.';

  return (
    <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg">
      <Stack.Screen
        options={{
          title,
          headerBackTitle: 'Atrás',
        }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 64 }}
        showsVerticalScrollIndicator={false}
        className="w-full max-w-[800px] self-center">
        {/* Banner Superior */}
        {anime.bannerImage ? (
          <Image
            source={{ uri: anime.bannerImage }}
            className="w-full h-48"
            contentFit="cover"
          />
        ) : null}

        <View className="p-4 gap-4">
          {/* Header con Póster y Títulos */}
          <View className="flex-row gap-3">
            <Image
              source={{ uri: anime.coverImage.large || anime.coverImage.medium }}
              className="w-28 h-40 rounded-2xl shadow-sm"
              contentFit="cover"
              transition={200}
            />

            <View className="flex-1 justify-center gap-1.5">
              <Text className="text-xl font-bold text-slate-900 dark:text-white leading-6">
                {title}
              </Text>
              {anime.title.native && (
                <Text className="text-xs text-slate-500 dark:text-zinc-400">
                  {anime.title.native}
                </Text>
              )}
              <View className="flex-row gap-2 items-center mt-1">
                <AnimeScoreBadge score={anime.averageScore} />
                <View className="px-2 py-0.5 rounded-lg bg-crunchyroll-light-surface-high dark:bg-crunchyroll-dark-surface-high">
                  <Text className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">
                    {anime.status || 'STATUS'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chips de Géneros */}
          <AnimeGenres genres={anime.genres} />

          {/* Grid de Metadatos estilo Material Design 3 */}
          <View className="flex-row justify-around p-3.5 rounded-2xl border border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface">
            <View className="items-center gap-1">
              <Text className="text-xs text-slate-500 dark:text-zinc-400">Episodios</Text>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {anime.episodes ?? 'N/A'}
              </Text>
            </View>

            <View className="items-center gap-1">
              <Text className="text-xs text-slate-500 dark:text-zinc-400">Formato</Text>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {anime.format ?? 'TV'}
              </Text>
            </View>

            <View className="items-center gap-1">
              <Text className="text-xs text-slate-500 dark:text-zinc-400">Temporada</Text>
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {anime.season ? `${anime.season} ${anime.seasonYear ?? ''}` : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Sección de Sinopsis */}
          <View className="gap-2 p-4 rounded-2xl border border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface">
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Sinopsis
            </Text>
            <Text className="text-sm leading-6 text-slate-600 dark:text-zinc-300">
              {cleanDescription}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
