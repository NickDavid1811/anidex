import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useAppTheme } from '@/context/theme-context';
import { AnimeGenres } from '@/features/anime/components/AnimeGenres';
import { AnimeScoreBadge } from '@/features/anime/components/AnimeScoreBadge';
import { useAnimeDetail } from '@/features/anime/hooks/useAnimeDetail';

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { anime, isLoading, error, refetch } = useAnimeDetail(id);
  const insets = useSafeAreaInsets();

  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';

  if (isLoading) {
    return (
      <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg justify-center items-center">
        <LoadingState message="Cargando detalles del anime..." />
      </View>
    );
  }

  if (error || !anime) {
    return (
      <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg justify-center items-center">
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
      {/* Barra superior con botón volver */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="px-4 pb-2 flex-row items-center gap-3 border-b border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface z-10">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-crunchyroll-light-surface-high dark:bg-crunchyroll-dark-surface-high active:opacity-70">
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? '#FFFFFF' : '#0F172A'}
          />
        </Pressable>
        <Text
          className="flex-1 text-base font-bold text-slate-900 dark:text-white"
          numberOfLines={1}>
          {title}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 64 }}
        showsVerticalScrollIndicator={false}
        className="w-full max-w-[800px] self-center">
        {/* Banner Superior */}
        {anime.bannerImage ? (
          <Image
            source={{ uri: anime.bannerImage }}
            style={{ width: '100%', height: 192 }}
            contentFit="cover"
          />
        ) : null}

        <View className="p-4 gap-4">
          {/* Header con Póster y Títulos */}
          <View className="flex-row gap-3">
            <Image
              source={{ uri: anime.coverImage.large || anime.coverImage.medium }}
              style={{ width: 112, height: 160 }}
              className="rounded-2xl"
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
