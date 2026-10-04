import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth';
import { useFavorites } from '@/features/favorites';
import { ThemeSettingCard, useAppTheme } from '@/features/theme';

export default function SettingsScreen() {
  const { activeScheme } = useAppTheme();
  const { count: favoritesCount } = useFavorites();
  const auth = useAuth();
  const insets = useSafeAreaInsets();
  const isDark = activeScheme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      <SafeAreaView
        className="flex-1 w-full max-w-[800px] self-center"
        edges={['top', 'left', 'right']}
      >
        {/* Header Ajustes */}
        <View className="px-4 pt-3 pb-3 gap-0.5">
          <Text
            className={`text-2xl font-manrope-bold tracking-tight ${
              isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
            }`}
          >
            Ajustes
          </Text>
          <Text
            className={`text-xs font-manrope-semibold ${
              isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
            }`}
          >
            Personaliza la apariencia y preferencias de Anidex
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingBottom: insets.bottom + 90 }}>
          <View className={`rounded-3xl border p-4 gap-3 ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
            <Text className={`font-manrope-bold text-lg ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}>Cuenta de AniList</Text>
            <Text className={`font-manrope text-sm ${isDark ? 'text-[#A89C94]' : 'text-[#776962]'}`}>
              {auth.user ? `Conectado como ${auth.user.name}` : 'Conecta tu cuenta para preparar tu biblioteca de AniList.'}
            </Text>
            {auth.error && <Text accessibilityRole="alert" className="font-manrope text-sm text-[#C95143]">{auth.error}</Text>}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: auth.isRestoring || auth.isConnecting, busy: auth.isRestoring || auth.isConnecting }} disabled={auth.isRestoring || auth.isConnecting} onPress={() => { void (auth.user ? auth.disconnect() : auth.connect()); }} className={`min-h-12 rounded-2xl items-center justify-center px-4 ${isDark ? 'bg-[#E09F7D]' : 'bg-[#8B4F26]'}`}>
              {auth.isRestoring || auth.isConnecting ? <ActivityIndicator color={isDark ? '#201A17' : '#FFFFFF'} /> : <Text className={`font-manrope-bold ${isDark ? 'text-[#201A17]' : 'text-white'}`}>{auth.user ? 'Desconectar cuenta' : 'Conectar con AniList'}</Text>}
            </Pressable>
          </View>
          {/* Card Material 3 de Tema */}
          <ThemeSettingCard />

          {/* Estadísticas locales / Base de datos */}
          <View
            className={`will-change-variable rounded-3xl border p-4 gap-2 ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`w-11 h-11 rounded-2xl items-center justify-center ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}
              >
                <Ionicons
                  name="server-outline"
                  size={20}
                  color={isDark ? '#E09F7D' : '#8B4F26'}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-manrope-bold ${
                    isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                  }`}
                >
                  Tus favoritos
                </Text>
                <Text
                  className={`font-manrope text-xs ${
                    isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                  }`}
                >
                  {favoritesCount} animes guardados en este dispositivo
                </Text>
              </View>
            </View>
          </View>

          {/* Información de la App */}
          <View
            className={`will-change-variable rounded-2xl border p-4 items-center gap-1 ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
            }`}
          >
            <Text
              className={`text-sm font-manrope-bold ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}
            >
              Anidex Mobile
            </Text>
            <Text
              className={`font-manrope text-xs ${
                isDark ? 'text-[#A89C94]' : 'text-[#776962]'
              }`}
            >
              Datos de AniList · Versión 1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
