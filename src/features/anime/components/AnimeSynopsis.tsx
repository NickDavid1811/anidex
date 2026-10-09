import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalization } from '@/features/localization';

interface AnimeSynopsisProps {
  description?: string;
  isDark: boolean;
}

export function AnimeSynopsis({ description, isDark }: AnimeSynopsisProps) {
  const { t } = useLocalization();
  const [expanded, setExpanded] = useState(false);
  const text = description
    ?.replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim() || t('anime.noDescription');
  const canExpand = text.length > 280;
  const cutoff = text.lastIndexOf(' ', 280);
  const preview = canExpand
    ? `${text.slice(0, cutoff > 0 ? cutoff : 280).trimEnd()}…`
    : text;

  return (
    <View className={`gap-3 p-4 rounded-2xl border ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
      <Text accessibilityRole="header" className={`text-lg font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>
        {t('anime.synopsis')}
      </Text>
      <Text
        style={{ fontSize: 16, lineHeight: 26 }}
        className={`font-manrope ${isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'}`}
      >
        {expanded ? text : preview}
      </Text>
      {canExpand && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={expanded ? t('anime.collapseSynopsis') : t('anime.readFullSynopsis')}
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          style={{ minHeight: 48 }}
          className={`flex-row items-center justify-center gap-2 px-3 py-2 rounded-xl ${isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'}`}
        >
          <Text className={`text-base font-manrope-semibold ${isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'}`}>
            {expanded ? t('anime.readLess') : t('anime.readMore')}
          </Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={isDark ? '#E09F7D' : '#8B4F26'} />
        </Pressable>
      )}
    </View>
  );
}
