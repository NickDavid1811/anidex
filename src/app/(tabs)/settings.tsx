import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavorites } from '@/context/favorites-context';
import { ThemePreference, useAppTheme } from '@/context/theme-context';

interface OptionItem {
  id: ThemePreference;
  title: string;
  subtitle: string;
  icon: string;
}

const THEME_OPTIONS: OptionItem[] = [
  {
    id: 'system',
    title: 'Automático (Sistema)',
    subtitle: 'Sigue la configuración de tema de tu dispositivo',
    icon: '⚙️',
  },
  {
    id: 'light',
    title: 'Modo Claro',
    subtitle: 'Superficies cálidas y limpias Material Design 3',
    icon: '☀️',
  },
  {
    id: 'dark',
    title: 'Modo Oscuro',
    subtitle: 'Tonalidad cálida café y carbón Material Design 3',
    icon: '🌙',
  },
];

export default function SettingsScreen() {
  const { preference, setPreference, activeScheme } = useAppTheme();
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
          <View
            className={`rounded-3xl border p-4 gap-3 ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}>
            <View className="flex-row items-center gap-3">
              <View
                className={`w-11 h-11 rounded-2xl items-center justify-center ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}>
                <Text className="text-xl">🎨</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text
                  className={`text-base font-bold ${
                    isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                  }`}>
                  Tema de la aplicación
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                  }`}>
                  Material Design 3 Palette
                </Text>
              </View>
            </View>

            <View className="gap-2.5 mt-1">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <Pressable
                    key={opt.id}
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
                    }`}>
                    <Text className="text-xl mr-3">{opt.icon}</Text>
                    <View className="flex-1 gap-0.5">
                      <Text
                        className={`text-sm font-bold ${
                          isSelected
                            ? isDark
                              ? 'text-[#FFDCC2]'
                              : 'text-[#8B4F26]'
                            : isDark
                            ? 'text-[#EDE0DB]'
                            : 'text-[#201A17]'
                        }`}>
                        {opt.title}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                        }`}>
                        {opt.subtitle}
                      </Text>
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
                      }`}>
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
                <Ionicons name="server-outline" size={20} color={isDark ? '#E09F7D' : '#8B4F26'} />
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
