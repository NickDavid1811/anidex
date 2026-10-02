import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavorites } from '@/features/favorites';
import { ThemeSettingCard, useAppTheme } from '@/features/theme';

export default function SettingsScreen() {
  const { activeScheme } = useAppTheme();
  const { count: favoritesCount } = useFavorites();
  const insets = useSafeAreaInsets();
  const isDark = activeScheme === 'dark';

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'
      }`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}>
        {/* Header Ajustes */}
        <View className="px-4 pt-3 pb-3 gap-0.5">
          <Text
            className={`text-2xl font-black tracking-tight ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}>
            Ajustes
          </Text>
          <Text
            className={`text-xs font-semibold ${
              isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
            }`}>
            Personaliza la apariencia y preferencias de Anidex
          </Text>
        </View>

        <View
          className="px-4 gap-4"
          style={{ paddingBottom: insets.bottom + 90 }}>
          {/* Card Material 3 de Tema */}
          <ThemeSettingCard />

          {/* Estadísticas locales / Base de datos */}
          <View
            className={`rounded-3xl border p-4 gap-2 ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}>
            <View className="flex-row items-center gap-3">
              <View
                className={`w-11 h-11 rounded-2xl items-center justify-center ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}>
                <Ionicons
                  name="server-outline"
                  size={20}
                  color={isDark ? '#E09F7D' : '#8B4F26'}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-bold ${
                    isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                  }`}>
                  Base de Datos Local (SQLite)
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                  }`}>
                  {favoritesCount} animes guardados en tus favoritos
                </Text>
              </View>
            </View>
          </View>

          {/* Información de la App */}
          <View
            className={`rounded-2xl border p-4 items-center gap-1 ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}>
            <Text
              className={`text-sm font-bold ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}>
              Anidex Mobile
            </Text>
            <Text
              className={`text-xs ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}>
              Material Design 3 • Expo SDK 57 & SQLite
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
