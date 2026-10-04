import { Text, View } from 'react-native';

interface AnimeScoreBadgeProps {
  score?: number;
}

export function AnimeScoreBadge({ score }: AnimeScoreBadgeProps) {
  if (score === undefined || score === null) return null;

  const isHigh = score >= 75;
  const isMedium = score >= 60 && score < 75;

  const bgClass = isHigh
    ? 'bg-emerald-600'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-rose-600';

  return (
    <View className={`px-2 py-0.5 rounded-lg self-start ${bgClass}`}>
      <Text className="text-white text-xs font-bold">
        ★ {(score / 10).toFixed(1)}/10
      </Text>
    </View>
  );
}
