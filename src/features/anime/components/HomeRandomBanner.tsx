import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface HomeRandomBannerProps {
  onSpin: () => void;
  isDark: boolean;
}

export function HomeRandomBanner({ onSpin, isDark }: HomeRandomBannerProps) {
  return (
    <View className="mt-5 px-4">
      <View
        className={`p-4 rounded-3xl border gap-3 ${
          isDark
            ? 'bg-[#221A16] border-[#3E3028]'
            : 'bg-[#FFF9F5] border-[#D8CDC5] shadow-sm'
        }`}
      >
        <View className="flex-row items-center flex-1 mr-3">
          <View
            className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${
              isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
            }`}
          >
            <Text className="font-manrope text-2xl">🎲</Text>
          </View>
          <View className="flex-1">
            <Text
              className={`text-sm font-manrope-bold ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}
            >
              ¿No sabes qué ver hoy?
            </Text>
            <Text
              className={`font-manrope text-sm mt-0.5 ${
                isDark ? 'text-[#D0C3BC]' : 'text-[#53433C]'
              }`}
            >
              Prueba un anime al azar
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Elegir un anime al azar"
          style={{ minHeight: 48 }}
          onPress={onSpin}
          className={`flex-row items-center justify-center gap-2 px-4 py-2.5 rounded-2xl active:scale-95 ${
            isDark ? 'bg-[#3A2D25]' : 'bg-[#8B4F26]'
          }`}
        >
          <Text
            className={`text-sm font-manrope-bold mr-1 ${
              isDark ? 'text-[#EDE0DB]' : 'text-white'
            }`}
          >
            Sorpréndeme
          </Text>
          <Ionicons
            name="dice-outline"
            size={20}
            color={isDark ? '#EDE0DB' : '#FFFFFF'}
          />
        </Pressable>
      </View>
    </View>
  );
}
