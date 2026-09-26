import { StyleSheet, Text, View } from 'react-native';

interface AnimeScoreBadgeProps {
  score?: number;
}

export function AnimeScoreBadge({ score }: AnimeScoreBadgeProps) {
  if (score === undefined || score === null) return null;

  const isHigh = score >= 75;
  const isMedium = score >= 60 && score < 75;

  const backgroundColor = isHigh ? '#10B981' : isMedium ? '#F59E0B' : '#EF4444';

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>★ {score}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
