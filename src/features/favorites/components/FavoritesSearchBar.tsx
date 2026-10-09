import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

interface FavoritesSearchBarProps {
  filterText: string;
  onFilterTextChange: (text: string) => void;
  isDark: boolean;
}

export function FavoritesSearchBar({
  filterText,
  onFilterTextChange,
  isDark,
}: FavoritesSearchBarProps) {
  return (
    <View
      className={`flex-row items-center rounded-2xl pl-3.5 pr-1 min-h-14 border ${
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
        className={`flex-1 text-base font-manrope-medium ${
          isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
        }`}
        placeholder="Buscar en favoritos…"
        placeholderTextColor={isDark ? '#D0C3BC' : '#53433C'}
        value={filterText}
        onChangeText={onFilterTextChange}
        accessibilityLabel="Buscar favoritos por título"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="done"
      />
      {filterText.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          onPress={() => onFilterTextChange('')}
          style={{ width: 48, height: 48 }}
          className="items-center justify-center"
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
