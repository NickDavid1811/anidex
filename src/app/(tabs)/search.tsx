import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { AnimeCard } from '@/features/anime/components/AnimeCard';
import { useSearchAnime } from '@/features/anime/hooks/useSearchAnime';

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

  const insets = useSafeAreaInsets();

  const handleGenrePress = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? undefined : genre));
  };

  return (
    <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg">
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center" edges={['top', 'left', 'right']}>
        <View className="px-4 pt-2 pb-2 gap-2">
          <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Buscar
          </Text>
          <Text className="text-xs font-semibold text-crunchyroll-primary">
            Explora por nombre o género en AniList
          </Text>

          {/* Barra de búsqueda MD3 */}
          <View className="flex-row items-center rounded-2xl px-4 h-12 border border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface mt-1">
            <TextInput
              className="flex-1 text-sm text-slate-900 dark:text-white"
              placeholder="Buscar anime (ej. Naruto, Jujutsu, Solo Leveling)..."
              placeholderTextColor="#938F99"
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchTerm.length > 0 && (
              <Pressable onPress={() => setSearchTerm('')} className="p-1.5">
                <Text className="text-sm font-bold text-slate-400 dark:text-zinc-400">✕</Text>
              </Pressable>
            )}
          </View>

          {/* Chips horizontales de Géneros */}
          <FlatList
            data={GENRES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
            renderItem={({ item }) => {
              const isSelected = selectedGenre === item;
              return (
                <Pressable
                  onPress={() => handleGenrePress(item)}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-crunchyroll-primary border-crunchyroll-primary'
                      : 'bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface border-crunchyroll-light-border dark:border-crunchyroll-dark-border'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-700 dark:text-zinc-200'
                    }`}>
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
          <View className="flex-1 justify-center items-center p-6 gap-2">
            <Text className="text-base font-bold text-slate-900 dark:text-white text-center">
              {searchTerm || selectedGenre
                ? 'No se encontraron resultados'
                : 'Escribe algo o elige un género para comenzar'}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-zinc-400 text-center">
              {searchTerm || selectedGenre
                ? 'Prueba buscando con otro término o género.'
                : 'Explora entre miles de títulos de la base de datos de AniList.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: insets.bottom + 90,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <AnimeCard anime={item} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
