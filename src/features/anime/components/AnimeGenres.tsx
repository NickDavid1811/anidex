import { StyleSheet, Text, View } from 'react-native';

interface AnimeGenresProps {
  genres?: string[];
}

export function AnimeGenres({ genres }: AnimeGenresProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <View style={styles.container}>
      {genres.map((genre) => (
        <View key={genre} style={styles.chip}>
          <Text style={styles.text}>{genre}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    backgroundColor: 'rgba(244, 117, 33, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(244, 117, 33, 0.35)',
  },
  text: {
    color: '#F47521',
    fontSize: 12,
    fontWeight: '700',
  },
});
