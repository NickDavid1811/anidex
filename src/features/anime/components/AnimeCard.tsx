import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AnimeMedia } from '../types/anime.types';
import { AnimeScoreBadge } from './AnimeScoreBadge';

interface AnimeCardProps {
  anime: AnimeMedia;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const theme = useTheme();
  const title = anime.title.english || anime.title.userPreferred || anime.title.romaji || 'Sin título';
  const coverUrl = anime.coverImage.large || anime.coverImage.medium;

  const handlePress = () => {
    router.push(`/anime/${anime.id}` as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={styles.imageContainer}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: anime.coverImage.color || '#333' }]} />
        )}
        <View style={styles.badgeWrapper}>
          <AnimeScoreBadge score={anime.averageScore} />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
          {anime.format || 'ANIME'} {anime.seasonYear ? `• ${anime.seasonYear}` : ''}
        </Text>
        {anime.genres && anime.genres.length > 0 && (
          <Text style={[styles.genres, { color: '#F47521' }]} numberOfLines={1}>
            {anime.genres.slice(0, 2).join(' • ')}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '48%',
    marginBottom: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  badgeWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  info: {
    padding: Spacing.two,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  genres: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
