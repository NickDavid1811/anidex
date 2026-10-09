import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useLocalization } from '@/features/localization';

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
  const { t } = useLocalization();
  return (
    <View
      className={`will-change-variable flex-row items-center rounded-2xl pl-4 pr-1 min-h-14 border ${
        isDark
          ? 'bg-[#221A16] border-[#776962]'
          : 'bg-[#FFFFFF] border-[#A89C94] shadow-sm'
      }`}
    >
      <Ionicons
        name="search"
        size={22}
        color={isDark ? '#D0C3BC' : '#53433C'}
        style={{ marginRight: 8 }}
      />
      <TextInput
        className={`flex-1 text-base font-manrope-medium ${
          isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
        }`}
        placeholder={t('explore.searchPlaceholder')}
        placeholderTextColor={isDark ? '#D0C3BC' : '#53433C'}
        value={searchTerm}
        onChangeText={onSearchChange}
        accessibilityLabel={t('explore.searchAccessibility')}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {searchTerm.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('explore.clearSearch')}
          onPress={() => onSearchChange('')}
          className="w-12 h-12 items-center justify-center"
        >
          <Ionicons
            name="close-circle"
            size={22}
            color={isDark ? '#D0C3BC' : '#53433C'}
          />
        </Pressable>
      )}
    </View>
  );
}
