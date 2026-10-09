import { Pressable, Text, View } from 'react-native';

import { LanguagePreference, useLocalization } from '../context/localization-context';

const OPTIONS: { id: LanguagePreference; label: 'system' | 'spanish' | 'english'; icon: string }[] = [
  { id: 'system', label: 'system', icon: '🌐' },
  { id: 'es', label: 'spanish', icon: 'ES' },
  { id: 'en', label: 'english', icon: 'EN' },
];

export function LanguageSettingCard({ isDark }: { isDark: boolean }) {
  const { preference, setPreference, t } = useLocalization();

  return (
    <View className={`rounded-3xl border p-4 gap-3 ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
      <Text accessibilityRole="header" className={`text-lg font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>{t('language.title')}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={t('language.description')} className="gap-2.5 mt-1">
        {OPTIONS.map((option) => {
          const selected = preference === option.id;
          return (
            <Pressable key={option.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => setPreference(option.id)} style={{ minHeight: 56 }} className={`flex-row items-center p-3.5 rounded-2xl border ${selected ? isDark ? 'bg-[#58392B]/30 border-[#E09F7D]' : 'bg-[#FFDCC2]/40 border-[#8B4F26]' : isDark ? 'bg-[#2F241E] border-transparent' : 'bg-[#EDE5DF] border-transparent'}`}>
              <Text className="w-9 font-manrope-bold text-base">{option.icon}</Text>
              <View className="flex-1">
                <Text className={`text-base font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>{t(`language.${option.label}`)}</Text>
                {option.id === 'system' && <Text className={`text-sm font-manrope ${isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'}`}>{t('language.systemHint')}</Text>}
              </View>
              <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selected ? 'border-[#E09F7D]' : 'border-[#7E736C]'}`}>{selected && <View className="w-2.5 h-2.5 rounded-full bg-[#E09F7D]" />}</View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
