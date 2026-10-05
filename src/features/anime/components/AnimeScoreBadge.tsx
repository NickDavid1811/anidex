import { Text, View } from 'react-native';

interface AnimeScoreBadgeProps {
  score?: number;
  showSource?: boolean;
}

export function AnimeScoreBadge({ score, showSource = false }: AnimeScoreBadgeProps) {
  if (score === undefined || score === null) return null;

  const isHigh = score >= 75;
  const isMedium = score >= 60 && score < 75;

  const bgClass = isHigh
    ? 'bg-emerald-700'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-rose-700';

  return (
    <View accessible accessibilityLabel={`Puntuación de AniList: ${(score / 10).toFixed(1)} de 10`} className={`px-2 py-0.5 rounded-lg self-start ${bgClass}`}>
      <Text className={`${isMedium ? 'text-[#201A17]' : 'text-white'} ${showSource ? 'text-sm' : 'text-xs'} font-manrope-bold`}>
        ★ {(score / 10).toFixed(1)}/10{showSource ? ' · AniList' : ''}
      </Text>
    </View>
  );
}
