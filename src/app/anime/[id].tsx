import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { AnimeGenres, AnimeScoreBadge, useAnimeDetail } from '@/features/anime';
import { useFavorites } from '@/features/favorites';
import { useAppTheme } from '@/features/theme';

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { anime, isLoading, error, refetch } = useAnimeDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };
  const backControl = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      onPress={goBack}
      style={{ position: 'absolute', top: insets.top + 8, left: 16 }}
      className="w-12 h-12 rounded-full items-center justify-center"
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={isDark ? '#EDE0DB' : '#201A17'}
      />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}
      >
        {backControl}
        <LoadingState message="Cargando detalles del anime..." />
      </View>
    );
  }

  if (error || !anime) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
        }`}
      >
        {backControl}
        <ErrorState
          message={error || 'No se encontró el anime'}
          onRetry={refetch}
        />
      </View>
    );
  }

  const title =
    anime.title.english ||
    anime.title.userPreferred ||
    anime.title.romaji ||
    'Anime';
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>?/gm, '')
    : 'Sin descripción disponible.';

  const isFav = isFavorite(anime.id);
  const saveFavorite = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await toggleFavorite(anime);
    } catch {
      setSaveError('No pudimos guardar el cambio. Inténtalo otra vez.');
    } finally {
      setIsSaving(false);
    }
  };
  const statusLabels: Record<string, string> = {
    FINISHED: 'Finalizado',
    RELEASING: 'En emisión',
    NOT_YET_RELEASED: 'Próximamente',
    CANCELLED: 'Cancelado',
    HIATUS: 'En pausa',
  };
  const seasonLabels: Record<string, string> = {
    WINTER: 'Invierno',
    SPRING: 'Primavera',
    SUMMER: 'Verano',
    FALL: 'Otoño',
  };
  const formatLabels: Record<string, string> = {
    TV: 'Serie',
    TV_SHORT: 'Serie corta',
    MOVIE: 'Película',
    SPECIAL: 'Especial',
    OVA: 'OVA',
    ONA: 'ONA',
    MUSIC: 'Música',
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      {/* Barra superior con botón volver y botón de Favorito */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className={`will-change-variable px-4 pb-3 flex-row items-center justify-between border-b z-10 ${
          isDark
            ? 'bg-[#221A16] border-[#3E3028]'
            : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
        }`}
      >
        <View className="flex-row items-center flex-1 mr-3 gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={goBack}
            className={`w-12 h-12 rounded-full items-center justify-center active:opacity-70 ${
              isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={isDark ? '#EDE0DB' : '#201A17'}
            />
          </Pressable>
          <Text
            className={`flex-1 text-base font-bold ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Botón de Guardar en Favoritos (Base de Datos Local) */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'
          }
          accessibilityState={{ selected: isFav, disabled: isSaving }}
          disabled={isSaving}
          onPress={saveFavorite}
          className={`will-change-variable w-12 h-12 rounded-full items-center justify-center active:scale-95 shadow-sm ${
            isFav
              ? 'bg-[#D32F2F]'
              : isDark
                ? 'bg-[#2F241E] border border-[#3E3028]'
                : 'bg-[#EDE5DF] border border-[#D8CDC5]'
          }`}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={20}
            color={isFav ? '#FFFFFF' : isDark ? '#EDE0DB' : '#53433C'}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 64 }}
        showsVerticalScrollIndicator={false}
        className="w-full max-w-[800px] self-center"
      >
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
              source={{
                uri: anime.coverImage.large || anime.coverImage.medium,
              }}
              style={{ width: 112, height: 160 }}
              className="rounded-2xl"
              contentFit="cover"
              transition={200}
            />

            <View className="flex-1 justify-center gap-1.5">
              <Text
                className={`text-xl font-bold leading-6 ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {title}
              </Text>
              {anime.title.native && (
                <Text
                  className={`text-xs ${
                    isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                  }`}
                >
                  {anime.title.native}
                </Text>
              )}
              <View className="flex-row gap-2 items-center mt-1">
                <AnimeScoreBadge score={anime.averageScore} />
                <View
                  className={`px-2 py-0.5 rounded-lg ${
                    isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
                    }`}
                  >
                    {anime.status
                      ? statusLabels[anime.status]
                      : 'Estado desconocido'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isFav, disabled: isSaving }}
            disabled={isSaving}
            onPress={saveFavorite}
            className={`min-h-12 rounded-2xl px-4 py-3 flex-row items-center justify-center gap-2 ${isDark ? 'bg-[#58392B]' : 'bg-[#FFDCC2]'}`}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isDark ? '#FFDCC2' : '#8B4F26'}
            />
            <Text
              className={`text-base font-bold ${isDark ? 'text-[#FFDCC2]' : 'text-[#351A08]'}`}
            >
              {isSaving
                ? 'Guardando…'
                : isFav
                  ? 'Guardado en favoritos'
                  : 'Guardar en favoritos'}
            </Text>
          </Pressable>
          {saveError && (
            <Text accessibilityRole="alert" className="text-sm text-red-600">
              {saveError}
            </Text>
          )}
          {/* Chips de Géneros */}
          <AnimeGenres genres={anime.genres} />

          {/* Grid de Metadatos estilo Material Design 3 */}
          <View
            className={`will-change-variable flex-row justify-around p-3.5 rounded-2xl border ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}
          >
            <View className="items-center gap-1">
              <Text
                className={`text-xs ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}
              >
                Episodios
              </Text>
              <Text
                className={`text-sm font-bold ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {anime.episodes ?? 'Por confirmar'}
              </Text>
            </View>

            <View className="items-center gap-1">
              <Text
                className={`text-xs ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}
              >
                Formato
              </Text>
              <Text
                className={`text-sm font-bold ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {anime.format ? formatLabels[anime.format] : 'Por confirmar'}
              </Text>
            </View>

            <View className="items-center gap-1">
              <Text
                className={`text-xs ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}
              >
                Temporada
              </Text>
              <Text
                className={`text-sm font-bold ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {anime.season
                  ? `${seasonLabels[anime.season]} ${anime.seasonYear ?? ''}`
                  : (anime.seasonYear ?? 'Por confirmar')}
              </Text>
            </View>
          </View>

          {/* Sección de Sinopsis */}
          <View
            className={`will-change-variable gap-2 p-4 rounded-2xl border ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}
          >
            <Text
              className={`text-base font-bold ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}
            >
              Sinopsis
            </Text>
            <Text
              className={`text-sm leading-6 ${
                isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
              }`}
            >
              {expandedDescription || cleanDescription.length <= 280
                ? cleanDescription
                : `${cleanDescription.slice(0, 280).trim()}…`}
            </Text>
            {cleanDescription.length > 280 && (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: expandedDescription }}
                onPress={() => setExpandedDescription((value) => !value)}
                className="min-h-12 justify-center"
              >
                <Text
                  className={`text-sm font-bold ${isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'}`}
                >
                  {expandedDescription ? 'Leer menos' : 'Leer más'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
