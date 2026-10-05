import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface HomeSectionHeaderProps {
  title: string;
  action: string;
  accessibilityLabel: string;
  onPress: () => void;
  isDark: boolean;
}

export function HomeSectionHeader({ title, action, accessibilityLabel, onPress, isDark }: HomeSectionHeaderProps) {
  return (
    <View className="flex-row flex-wrap items-center justify-between gap-x-3 mb-2">
      <Text accessibilityRole="header" className={`text-base font-manrope-bold shrink ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>
        {title}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={{ minHeight: 48 }} className="flex-row items-center gap-1.5 px-1 active:opacity-70">
        <Text className={`text-sm font-manrope-semibold ${isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'}`}>{action}</Text>
        <Ionicons name="arrow-forward" size={16} color={isDark ? '#E09F7D' : '#8B4F26'} />
      </Pressable>
    </View>
  );
}
