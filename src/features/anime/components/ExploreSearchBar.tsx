import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

interface ExploreSearchBarProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  isDark: boolean;
}

export function ExploreSearchBar({
  searchTerm,
  onSearchChange,
  isDark,
}: ExploreSearchBarProps) {
  return (
    <View
      className={`will-change-variable flex-row items-center rounded-2xl px-3.5 h-12 border ${
        isDark
          ? 'bg-[#221A16] border-[#3E3028]'
          : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
      }`}
    >
      <Ionicons
        name="search"
        size={18}
        color={isDark ? '#A89C94' : '#776962'}
        style={{ marginRight: 8 }}
      />
      <TextInput
        className={`flex-1 text-sm font-medium ${
          isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
        }`}
        placeholder="Buscar animes..."
        placeholderTextColor={isDark ? '#7E736C' : '#9E928B'}
        value={searchTerm}
        onChangeText={onSearchChange}
        accessibilityLabel="Buscar anime por título"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {searchTerm.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          onPress={() => onSearchChange('')}
          className="w-12 h-12 items-center justify-center"
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={isDark ? '#A89C94' : '#776962'}
          />
        </Pressable>
      )}
    </View>
  );
}
