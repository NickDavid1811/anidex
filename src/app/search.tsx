import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AnimeCard } from '@/features/anime/components/AnimeCard';
import { useSearchAnime } from '@/features/anime/hooks/useSearchAnime';
import { useTheme } from '@/hooks/use-theme';

const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
];

export default function SearchScreen() {
  const {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    results,
    isLoading,
    error,
    refresh,
  } = useSearchAnime(400);

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleGenrePress = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? undefined : genre));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Buscar</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>
            Explora por nombre o género en AniList
          </ThemedText>

          <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Buscar anime (ej. Naruto, Attack on Titan)..."
              placeholderTextColor={theme.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchTerm.length > 0 && (
              <Pressable onPress={() => setSearchTerm('')} style={styles.clearButton}>
                <Text style={[styles.clearText, { color: theme.textSecondary }]}>✕</Text>
              </Pressable>
            )}
          </View>

          <FlatList
            data={GENRES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.genresList}
            renderItem={({ item }) => {
              const isSelected = selectedGenre === item;
              return (
                <Pressable
                  onPress={() => handleGenrePress(item)}
                  style={[
                    styles.genreChip,
                    {
                      backgroundColor: isSelected ? '#3c87f7' : theme.backgroundElement,
                      borderColor: isSelected ? '#3c87f7' : theme.backgroundSelected,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.genreText,
                      { color: isSelected ? '#ffffff' : theme.text },
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        {isLoading ? (
          <LoadingState message="Buscando animes..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {searchTerm || selectedGenre
                ? 'No se encontraron resultados'
                : 'Escribe algo o elige un género para comenzar'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {searchTerm || selectedGenre
                ? 'Prueba buscando con otro término o género.'
                : 'Busca entre miles de animes de la base de datos de AniList.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + Spacing.six + 50 },
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <AnimeCard anime={item} />}
          />
        )}
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
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 46,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  clearButton: {
    padding: 6,
  },
  clearText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  genresList: {
    gap: 8,
    paddingVertical: 6,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  genreText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
