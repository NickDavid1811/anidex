import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export const POPULAR_CATEGORIES = [
  { id: 'Action', label: 'Acción', icon: '⚔️', color: '#EF4444' },
  { id: 'Fantasy', label: 'Fantasía', icon: '🪄', color: '#8B5CF6' },
  { id: 'Comedy', label: 'Comedia', icon: '😄', color: '#F59E0B' },
  { id: 'Romance', label: 'Romance', icon: '💖', color: '#EC4899' },
  { id: 'Supernatural', label: 'Sobrenatural', icon: '🔮', color: '#A855F7' },
  { id: 'Sci-Fi', label: 'Sci-Fi', icon: '🚀', color: '#06B6D4' },
  { id: 'Sports', label: 'Deportes', icon: '🏀', color: '#F97316' },
  { id: 'Drama', label: 'Drama', icon: '🎭', color: '#6366F1' },
];

interface HomeCategoriesProps {
  isDark: boolean;
}

export function HomeCategories({ isDark }: HomeCategoriesProps) {
  const handleCategoryPress = (genreId: string) => {
    router.navigate({
      pathname: '/(tabs)/explore' as any,
      params: { genre: genreId },
    });
  };

  const handleExploreAll = () => {
    router.navigate('/(tabs)/explore' as any);
  };

  return (
    <View className="mt-5 px-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`text-base font-bold ${
            isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
          }`}>
          Categorías Populares
        </Text>
        <Pressable
          onPress={handleExploreAll}
          className="flex-row items-center gap-1 active:opacity-75">
          <Text
            className={`text-xs font-semibold ${
              isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
            }`}>
            Ver todas
          </Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color={isDark ? '#E09F7D' : '#8B4F26'}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {POPULAR_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => handleCategoryPress(cat.id)}
            style={{
              backgroundColor: isDark
                ? `${cat.color}15`
                : `${cat.color}12`,
              borderColor: isDark
                ? `${cat.color}35`
                : `${cat.color}30`,
            }}
            className="flex-row items-center px-3.5 py-2 rounded-2xl border active:scale-95 shadow-sm">
            <Text className="text-sm mr-1.5">{cat.icon}</Text>
            <Text
              className={`text-xs font-bold ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
