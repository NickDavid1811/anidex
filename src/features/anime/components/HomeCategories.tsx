import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { HomeSectionHeader } from './HomeSectionHeader';

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
      params: { genre: genreId, sort: 'popular' },
    });
  };

  const handleExploreAll = () => {
    router.navigate({
      pathname: '/(tabs)/explore',
      params: { genre: '', sort: 'popular' },
    });
  };

  return (
    <View className="mt-5 px-4">
      <HomeSectionHeader title="Categorías" action="Ver todas" accessibilityLabel="Explorar todas las categorías" onPress={handleExploreAll} isDark={isDark} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
      >
        {POPULAR_CATEGORIES.map((cat) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Explorar ${cat.label}`}
            key={cat.id}
            onPress={() => handleCategoryPress(cat.id)}
            style={{
              backgroundColor: isDark ? `${cat.color}15` : `${cat.color}12`,
              borderColor: isDark ? `${cat.color}35` : `${cat.color}30`,
            }}
            className="min-h-12 flex-row items-center px-3.5 py-2 rounded-2xl border active:scale-95 shadow-sm"
          >
            <Text className="font-manrope text-sm mr-1.5">{cat.icon}</Text>
            <Text
              className={`text-sm font-manrope-bold ${
                isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
              }`}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
