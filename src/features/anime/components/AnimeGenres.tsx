import { Text, View } from 'react-native';

interface AnimeGenresProps {
  genres?: string[];
}

export function AnimeGenres({ genres }: AnimeGenresProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2 my-2">
      {genres.map((genre) => (
        <View
          key={genre}
          className="px-3.5 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10">
          <Text className="text-crunchyroll-primary font-bold text-xs">{genre}</Text>
        </View>
      ))}
    </View>
  );
}
