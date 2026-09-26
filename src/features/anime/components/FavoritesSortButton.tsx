import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';

export type SortType = 'alphabetical' | 'ranking' | 'recent';

interface SortItemConfig {
  id: SortType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle: string;
}

export const SORT_CONFIGS: SortItemConfig[] = [
  {
    id: 'alphabetical',
    label: 'Alfabéticamente',
    icon: 'text',
    subtitle: 'Ordenar de la A a la Z por título',
  },
  {
    id: 'ranking',
    label: 'Por Ranking',
    icon: 'star',
    subtitle: 'Ordenar de mayor a menor puntuación',
  },
  {
    id: 'recent',
    label: 'Más Recientes',
    icon: 'time-outline',
    subtitle: 'Según fecha de guardado',
  },
];

interface FavoritesSortButtonProps {
  currentSort: SortType;
  onSortChange: (newSort: SortType) => void;
  isDark: boolean;
}

export function FavoritesSortButton({
  currentSort,
  onSortChange,
  isDark,
}: FavoritesSortButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<any>(null);

  const currentConfig =
    SORT_CONFIGS.find((c) => c.id === currentSort) || SORT_CONFIGS[0];

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });
  };

  const cycleSort = (direction: 'next' | 'prev') => {
    const currentIndex = SORT_CONFIGS.findIndex((c) => c.id === currentSort);
    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % SORT_CONFIGS.length;
    } else {
      nextIndex = (currentIndex - 1 + SORT_CONFIGS.length) % SORT_CONFIGS.length;
    }
    const nextSort = SORT_CONFIGS[nextIndex];

    // Animación pequeña al deslizar
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    onSortChange(nextSort.id);
    showToast(`Orden: ${nextSort.label}`);
  };

  // PanResponder para capturar tanto toque (tap) como deslizamiento con el dedo (swipe)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6;
      },
      onPanResponderRelease: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > 16;
        const isVerticalSwipe = Math.abs(gestureState.dy) > 16;

        if (isHorizontalSwipe || isVerticalSwipe) {
          // Deslizó con el dedo: alternar ordenamiento
          if (gestureState.dy > 16 || gestureState.dx > 16) {
            cycleSort('next');
          } else {
            cycleSort('prev');
          }
        } else {
          // Toque normal: abrir menú de opciones
          setModalVisible(true);
        }
      },
    })
  ).current;

  return (
    <>
      {/* Botón contraído interactivo (Tap o Deslizar con el dedo) */}
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }] }}
        {...panResponder.panHandlers}
        className={`w-12 h-12 rounded-2xl items-center justify-center border ${
          isDark
            ? 'bg-[#221A16] border-[#3E3028]'
            : 'bg-[#FFFFFF] border-[#D8CDC5] shadow-sm'
        }`}>
        <Ionicons
          name={currentConfig.icon}
          size={20}
          color={
            currentSort === 'ranking'
              ? '#F59E0B'
              : isDark
              ? '#EDE0DB'
              : '#351A08'
          }
        />

        {/* Indicador de gesto sutil abajo */}
        <View className="flex-row gap-0.5 mt-0.5">
          <View
            className={`w-1 h-1 rounded-full ${
              currentSort === 'alphabetical'
                ? isDark
                  ? 'bg-[#E09F7D]'
                  : 'bg-[#8B4F26]'
                : isDark
                ? 'bg-[#3E3028]'
                : 'bg-[#D8CDC5]'
            }`}
          />
          <View
            className={`w-1 h-1 rounded-full ${
              currentSort === 'ranking'
                ? '#F59E0B'
                : isDark
                ? 'bg-[#3E3028]'
                : 'bg-[#D8CDC5]'
            }`}
          />
          <View
            className={`w-1 h-1 rounded-full ${
              currentSort === 'recent'
                ? isDark
                  ? 'bg-[#E09F7D]'
                  : 'bg-[#8B4F26]'
                : isDark
                ? 'bg-[#3E3028]'
                : 'bg-[#D8CDC5]'
            }`}
          />
        </View>
      </Animated.View>

      {/* Toast informativo al deslizar */}
      {toastMessage && (
        <Animated.View
          pointerEvents="none"
          style={{
            opacity: toastOpacity,
            position: 'absolute',
            top: 60,
            right: 16,
            zIndex: 9999,
          }}
          className={`px-3 py-1.5 rounded-xl border shadow-lg ${
            isDark
              ? 'bg-[#2F241E] border-[#58392B]'
              : 'bg-[#FFFFFF] border-[#D8CDC5]'
          }`}>
          <Text
            className={`text-xs font-bold ${
              isDark ? 'text-[#FFDCC2]' : 'text-[#8B4F26]'
            }`}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      {/* Modal / Menú emergente de Opciones al tocar el botón */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/60 justify-center items-center p-4">
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl ${
              isDark
                ? 'bg-[#221A16] border-[#3E3028]'
                : 'bg-[#FFFFFF] border-[#D8CDC5]'
            }`}>
            {/* Header del modal */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="gap-0.5">
                <Text
                  className={`text-lg font-black ${
                    isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                  }`}>
                  Ordenar Favoritos
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                  }`}>
                  O desliza tu dedo sobre el botón para cambiarlo rápido
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                }`}>
                <Ionicons
                  name="close"
                  size={18}
                  color={isDark ? '#EDE0DB' : '#201A17'}
                />
              </Pressable>
            </View>

            {/* Lista de opciones con sus iconos */}
            <View className="gap-2.5">
              {SORT_CONFIGS.map((opt) => {
                const isSelected = currentSort === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => {
                      onSortChange(opt.id);
                      setModalVisible(false);
                      showToast(`Orden: ${opt.label}`);
                    }}
                    className={`flex-row items-center p-3.5 rounded-2xl border active:opacity-85 ${
                      isSelected
                        ? isDark
                          ? 'bg-[#58392B]/40 border-[#E09F7D]'
                          : 'bg-[#FFDCC2]/50 border-[#8B4F26]'
                        : isDark
                        ? 'bg-[#2F241E] border-transparent'
                        : 'bg-[#F5EFEA] border-transparent'
                    }`}>
                    {/* Icono de la opción */}
                    <View
                      className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                        isSelected
                          ? isDark
                            ? 'bg-[#E09F7D]/20'
                            : 'bg-[#8B4F26]/15'
                          : isDark
                          ? 'bg-[#221A16]'
                          : 'bg-[#FFFFFF]'
                      }`}>
                      <Ionicons
                        name={opt.icon}
                        size={20}
                        color={
                          isSelected
                            ? isDark
                              ? '#E09F7D'
                              : '#8B4F26'
                            : isDark
                            ? '#A89C94'
                            : '#776962'
                        }
                      />
                    </View>

                    {/* Texto y descripción */}
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
                        {opt.label}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                        }`}>
                        {opt.subtitle}
                      </Text>
                    </View>

                    {/* Check de seleccionado */}
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={isDark ? '#E09F7D' : '#8B4F26'}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
