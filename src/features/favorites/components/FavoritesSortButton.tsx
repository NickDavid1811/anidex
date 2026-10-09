import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from '@/features/localization';

export type SortType = 'alphabetical' | 'ranking' | 'recent';

export const SORT_IDS: SortType[] = ['alphabetical', 'ranking', 'recent'];

interface FavoritesSortButtonProps {
  currentSort: SortType;
  onSortChange: (newSort: SortType) => void;
  isDark: boolean;
}

export function FavoritesSortButton({ currentSort, onSortChange, isDark }: FavoritesSortButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const accent = isDark ? '#E09F7D' : '#8B4F26';
  const foreground = isDark ? '#EDE0DB' : '#201A17';
  const secondary = isDark ? '#D0C3BC' : '#53433C';
  const configs = SORT_IDS.map((id) => ({ id, label: t(`sort.${id}`), shortLabel: t(`sort.${id}Short`), subtitle: t(`sort.${id}Hint`) }));
  const currentConfig = configs.find((option) => option.id === currentSort)!;
  // Capture only deliberate horizontal swipes; vertical scrolling and taps stay available.
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_, { dx, dy }) =>
      Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy) * 1.5,
    onPanResponderRelease: (_, { dx, dy }) => {
      if (Math.abs(dx) <= 24 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
      const index = SORT_IDS.indexOf(currentSort);
      onSortChange(SORT_IDS[(index + (dx > 0 ? 1 : -1) + SORT_IDS.length) % SORT_IDS.length]);
    },
  }), [currentSort, onSortChange]);

  return (
    <>
      <View {...panResponder.panHandlers}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('sort.accessibility', { sort: currentConfig.label })}
          accessibilityHint={t('sort.hint')}
          onPress={() => setModalVisible(true)}
          style={{ minHeight: 48, borderColor: accent }}
          className={`flex-row items-center gap-2 px-3 py-2 rounded-2xl border ${isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'}`}
        >
          <Ionicons name="swap-vertical" size={20} color={accent} />
          <Text accessibilityLiveRegion="polite" style={{ color: foreground }} className="text-sm font-manrope-semibold">{currentConfig.shortLabel}</Text>
          <Ionicons name="chevron-down" size={16} color={accent} />
        </Pressable>
      </View>
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <Pressable accessible={false} onPress={() => setModalVisible(false)} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
          <View accessibilityViewIsModal style={{ maxHeight: '100%', width: '100%', maxWidth: 420, alignSelf: 'center' }} className={`rounded-3xl p-4 border ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
            <View className="flex-row items-center gap-2 mb-2">
              <Text accessibilityRole="header" style={{ color: foreground }} className="flex-1 text-lg font-manrope-bold">{t('sort.title')}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={t('sort.close')} onPress={() => setModalVisible(false)} style={{ width: 48, height: 48 }} className="items-center justify-center">
                <Ionicons name="close" size={24} color={foreground} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              {configs.map((option) => (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: currentSort === option.id }}
                  onPress={() => { onSortChange(option.id); setModalVisible(false); }}
                  style={{ minHeight: 72, borderColor: currentSort === option.id ? accent : 'transparent' }}
                  className={`flex-row items-center gap-3 p-3 rounded-2xl border ${isDark ? 'bg-[#2F241E]' : 'bg-[#F5EFEA]'}`}
                >
                  <View className="flex-1 gap-1">
                    <Text style={{ color: foreground }} className="text-base font-manrope-bold">{option.label}</Text>
                    <Text style={{ color: secondary }} className="text-sm font-manrope">{option.subtitle}</Text>
                  </View>
                  {currentSort === option.id && <Ionicons name="checkmark-circle" size={24} color={accent} />}
                </Pressable>
              ))}
              <Text style={{ color: secondary }} className="text-sm font-manrope pt-2">{t('sort.swipeHint')}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
