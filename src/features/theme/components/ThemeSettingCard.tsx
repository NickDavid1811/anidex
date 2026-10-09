import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalization } from '@/features/localization';

import { ThemePreference, useAppTheme } from '../context/theme-context';

interface OptionItem {
  id: ThemePreference;
  label: 'system' | 'light' | 'dark';
  icon: string;
}

const THEME_OPTIONS: OptionItem[] = [
  {
    id: 'system',
    label: 'system',
    icon: '⚙️',
  },
  {
    id: 'light',
    label: 'light',
    icon: '☀️',
  },
  {
    id: 'dark',
    label: 'dark',
    icon: '🌙',
  },
];

export function ThemeSettingCard() {
  const { preference, setPreference, activeScheme } = useAppTheme();
  const { t } = useLocalization();
  const isDark = activeScheme === 'dark';

  return (
    <View
      className={`rounded-3xl border p-4 gap-3 ${
        isDark
          ? 'bg-[#221A16] border-[#3E3028]'
          : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
      }`}
    >
      <Text accessibilityRole="header" className={`text-lg font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>
        {t('theme.title')}
      </Text>

      <View accessibilityRole="radiogroup" accessibilityLabel={t('theme.accessibility')} className="gap-2.5 mt-1">
        {THEME_OPTIONS.map((opt) => {
          const isSelected = preference === opt.id;
          return (
            <Pressable
              key={opt.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              style={{ minHeight: 56 }}
              onPress={(e) =>
                setPreference(opt.id, {
                  x: e.nativeEvent.pageX,
                  y: e.nativeEvent.pageY,
                })
              }
              className={`flex-row items-center p-3.5 rounded-2xl border active:opacity-80 ${
                isSelected
                  ? isDark
                    ? 'bg-[#58392B]/30 border-[#E09F7D]'
                    : 'bg-[#FFDCC2]/40 border-[#8B4F26]'
                  : isDark
                    ? 'bg-[#2F241E] border-transparent'
                    : 'bg-[#EDE5DF] border-transparent'
              }`}
            >
              <Text className="font-manrope text-xl mr-3">{opt.icon}</Text>
              <View className="flex-1 gap-0.5">
                <Text
                  className={`text-base font-manrope-bold ${
                    isSelected
                      ? isDark
                        ? 'text-[#FFDCC2]'
                        : 'text-[#8B4F26]'
                      : isDark
                        ? 'text-[#EDE0DB]'
                        : 'text-[#201A17]'
                  }`}
                >
                  {t(`theme.${opt.label}`)}
                </Text>
                {opt.id === 'system' && <Text
                  className={`font-manrope text-sm ${
                    isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
                  }`}
                >
                  {t('theme.systemHint')}
                </Text>}
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  isSelected
                    ? isDark
                      ? 'border-[#E09F7D]'
                      : 'border-[#8B4F26]'
                    : isDark
                      ? 'border-[#7E736C]'
                      : 'border-[#9E928B]'
                }`}
              >
                {isSelected && (
                  <View
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDark ? 'bg-[#E09F7D]' : 'bg-[#8B4F26]'
                    }`}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
