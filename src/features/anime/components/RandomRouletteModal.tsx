import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

import { AnimeMedia } from '../types/anime.types';

interface RandomRouletteModalProps {
  visible: boolean;
  onClose: () => void;
  animes: AnimeMedia[];
  isDark: boolean;
}

export function RandomRouletteModal({
  visible,
  onClose,
  animes,
  isDark,
}: RandomRouletteModalProps) {
  const [selectedAnime, setSelectedAnime] = useState<AnimeMedia | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const modalWidth = Math.min(screenWidth - 48, 380);

  const startSpin = useCallback(() => {
    if (animes.length === 0) return;
    setIsSpinning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Reset scale animation
    scaleAnim.setValue(0.9);

    const totalSteps = 14;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const randomIndex = Math.floor(Math.random() * animes.length);
      setSelectedAnime(animes[randomIndex]);

      try {
        Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch(
          () => {}
        );
      } catch {}

      if (step >= totalSteps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        // Elige el anime final
        const finalAnime = animes[Math.floor(Math.random() * animes.length)];
        setSelectedAnime(finalAnime);
        setIsSpinning(false);

        try {
          Haptics?.notificationAsync?.(
            Haptics.NotificationFeedbackType.Success
          ).catch(() => {});
        } catch {}

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }).start();
      }
    }, 85);
  }, [animes, scaleAnim]);

  useEffect(() => {
    const timer = visible ? setTimeout(startSpin, 0) : null;
    return () => {
      if (timer) clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      scaleAnim.stopAnimation();
    };
  }, [visible, startSpin, scaleAnim]);

  if (!visible) return null;

  const title =
    selectedAnime?.title.english ||
    selectedAnime?.title.userPreferred ||
    selectedAnime?.title.romaji ||
    'Anime';
  const coverUrl =
    selectedAnime?.coverImage.large ||
    selectedAnime?.coverImage.extraLarge ||
    selectedAnime?.coverImage.medium;
  const score = selectedAnime?.averageScore
    ? `${(selectedAnime.averageScore / 10).toFixed(1)}/10`
    : 'Sin puntuación';
  const genre =
    selectedAnime?.genres && selectedAnime.genres.length > 0
      ? selectedAnime.genres.slice(0, 2).join(' • ')
      : 'Anime';
  const year =
    selectedAnime?.seasonYear || selectedAnime?.startDate?.year || '';

  const cleanDescription = selectedAnime?.description
    ? selectedAnime.description.replace(/<[^>]*>?/gm, '').trim()
    : 'Descubre esta increíble recomendación aleatoria de la comunidad.';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 justify-center items-center p-4">
        <Animated.View
          style={{
            width: modalWidth,
            transform: [{ scale: scaleAnim }],
          }}
          className={`will-change-variable rounded-3xl p-5 border shadow-2xl ${
            isDark
              ? 'bg-[#221A16] border-[#F59E0B]/50'
              : 'bg-[#FFFFFF] border-[#8B4F26]/30'
          }`}
        >
          {/* Header Modal */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-xl">🎲</Text>
              <Text
                className={`text-base font-black ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {isSpinning ? '¡Girando la ruleta...!' : '¡Anime Elegido! 🎉'}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar recomendación"
              hitSlop={8}
              className="w-8 h-8 rounded-full items-center justify-center bg-black/10 dark:bg-white/10"
            >
              <Ionicons
                name="close"
                size={18}
                color={isDark ? '#A89C94' : '#776962'}
              />
            </Pressable>
          </View>

          {/* Anime Preview Card */}
          {selectedAnime && (
            <View className="items-center">
              {/* Cover Image */}
              <View
                className="w-32 h-44 rounded-2xl overflow-hidden shadow-xl mb-3 border border-white/10"
                style={{ elevation: 8 }}
              >
                {coverUrl ? (
                  <Image
                    source={{ uri: coverUrl }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={150}
                  />
                ) : (
                  <View
                    className="w-full h-full"
                    style={{
                      backgroundColor: selectedAnime.coverImage.color || '#333',
                    }}
                  />
                )}
              </View>

              {/* Badges: Score & Genre */}
              <View className="flex-row items-center gap-2 mb-2">
                <View className="flex-row items-center px-2.5 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40">
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text className="text-xs font-black text-[#F59E0B] ml-1">
                    {score}
                  </Text>
                </View>
                {year ? (
                  <View
                    className={`px-2.5 py-0.5 rounded-full ${
                      isDark ? 'bg-[#2F241E]' : 'bg-[#EDE5DF]'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                      }`}
                    >
                      {year}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Title */}
              <Text
                numberOfLines={2}
                className={`text-base font-black text-center mb-1 ${
                  isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                }`}
              >
                {title}
              </Text>

              {/* Genre line */}
              <Text
                className={`text-xs font-semibold mb-2.5 ${
                  isDark ? 'text-[#E09F7D]' : 'text-[#8B4F26]'
                }`}
              >
                {genre}
              </Text>

              {/* Synopsis preview */}
              <Text
                numberOfLines={2}
                className={`text-xs text-center leading-4 mb-4 ${
                  isDark ? 'text-[#A89C94]' : 'text-[#776962]'
                }`}
              >
                {cleanDescription}
              </Text>

              {/* Action Buttons */}
              <View className="w-full gap-2.5">
                <Pressable
                  disabled={isSpinning}
                  onPress={() => {
                    onClose();
                    router.push(`/anime/${selectedAnime.id}` as any);
                  }}
                  className={`will-change-variable w-full py-3 rounded-2xl flex-row items-center justify-center gap-2 active:scale-98 shadow-md ${
                    isDark ? 'bg-[#E09F7D]' : 'bg-[#8B4F26]'
                  }`}
                >
                  <Text
                    className={`text-sm font-black ${
                      isDark ? 'text-[#351A08]' : 'text-white'
                    }`}
                  >
                    Ver detalles del anime
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={isDark ? '#351A08' : '#FFFFFF'}
                  />
                </Pressable>

                <Pressable
                  disabled={isSpinning}
                  onPress={startSpin}
                  className={`w-full py-2.5 rounded-2xl flex-row items-center justify-center gap-2 border active:scale-98 ${
                    isDark
                      ? 'border-[#3E3028] bg-[#2F241E]/50'
                      : 'border-[#D8CDC5] bg-[#EDE5DF]/50'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'
                    }`}
                  >
                    Girar de nuevo 🎲
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
