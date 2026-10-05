import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { Typography } from '@/features/theme';

interface FavoritesEmptyStateProps {
  hasTotalFavorites: boolean;
  onClearFilters: () => void;
  isDark: boolean;
}

export function FavoritesEmptyState({ hasTotalFavorites, onClearFilters, isDark }: FavoritesEmptyStateProps) {
  const accent = isDark ? '#E09F7D' : '#8B4F26';
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 }}>
      <Ionicons name={hasTotalFavorites ? 'search-outline' : 'heart-outline'} size={48} color={accent} />
      <Text accessibilityRole="header" style={{ color: isDark ? '#EDE0DB' : '#201A17', fontFamily: Typography.bold, fontSize: 22, textAlign: 'center' }}>
        {hasTotalFavorites ? 'No hay coincidencias' : 'Todavía no tienes favoritos'}
      </Text>
      <Text style={{ color: isDark ? '#D0C3BC' : '#53433C', fontFamily: Typography.regular, fontSize: 16, lineHeight: 24, textAlign: 'center' }}>
        {hasTotalFavorites ? 'Prueba con otro título o elimina los filtros.' : 'Guarda los animes que te interesan tocando el corazón. Los encontrarás aquí.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={hasTotalFavorites ? onClearFilters : () => router.navigate('/(tabs)/explore')}
        style={{ minHeight: 48, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, backgroundColor: accent, justifyContent: 'center' }}
      >
        <Text style={{ color: isDark ? '#201A17' : '#FFFFFF', fontFamily: Typography.bold, fontSize: 16, textAlign: 'center' }}>
          {hasTotalFavorites ? 'Limpiar filtros' : 'Explorar anime'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
