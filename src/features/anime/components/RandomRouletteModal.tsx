import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GENRE_LABELS } from '../constants/genres';
import { AnimeMedia } from '../types/anime.types';

interface RandomRouletteModalProps {
  visible: boolean;
  onClose: () => void;
  animes: AnimeMedia[];
  isDark: boolean;
}

export function RandomRouletteModal({ visible, onClose, animes, isDark }: RandomRouletteModalProps) {
  const lastChoice = useRef<number | null>(null);
  const rememberChoice = useCallback((id: number) => { lastChoice.current = id; }, []);
  const getLastChoice = useCallback(() => lastChoice.current, []);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {visible && (
        <RandomChoiceContent animes={animes} isDark={isDark} onClose={onClose}
          getLastChoice={getLastChoice} rememberChoice={rememberChoice} />
      )}
    </Modal>
  );
}

interface RandomChoiceContentProps extends Omit<RandomRouletteModalProps, 'visible'> {
  getLastChoice: () => number | null;
  rememberChoice: (id: number) => void;
}

function RandomChoiceContent({ animes, isDark, onClose, getLastChoice, rememberChoice }: RandomChoiceContentProps) {
  const [selected, setSelected] = useState<AnimeMedia | null>(null);
  const [choosing, setChoosing] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const busy = useRef(false);
  const items = useRef(animes);
  const finishPending = useRef<(() => void) | null>(null);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const foreground = isDark ? '#EDE0DB' : '#201A17';
  const secondary = isDark ? '#D0C3BC' : '#53433C';
  const accent = isDark ? '#E09F7D' : '#8B4F26';

  useEffect(() => { items.current = animes; }, [animes]);

  const stop = useCallback(() => {
    generation.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    finishPending.current = null;
    busy.current = false;
  }, []);

  const choose = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    const run = ++generation.current;
    const pool = Array.from(new Map(items.current.map((anime) => [anime.id, anime])).values());
    if (!pool.length) {
      setSelected(null);
      setChoosing(false);
      busy.current = false;
      return;
    }
    setChoosing(true);
    const alternatives = pool.filter((anime) => anime.id !== getLastChoice());
    const candidates = alternatives.length ? alternatives : pool;
    const result = candidates[Math.floor(Math.random() * candidates.length)];
    const finish = () => {
      if (generation.current !== run) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      finishPending.current = null;
      setSelected(result);
      rememberChoice(result.id);
      setChoosing(false);
      busy.current = false;
    };
    const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled().catch(() => true);
    if (generation.current !== run) return;
    if (reduceMotion || pool.length === 1) {
      finish();
      return;
    }
    finishPending.current = finish;
    let step = 0;
    const offset = Math.floor(Math.random() * pool.length);
    const advance = () => {
      if (generation.current !== run) return;
      if (step === 6) { finish(); return; }
      setSelected(pool[(offset + step) % pool.length]);
      step += 1;
      // A brief sequence that slows down before revealing the result.
      timer.current = setTimeout(advance, 100 + step * 25);
    };
    advance();
  }, [getLastChoice, rememberChoice]);

  useEffect(() => {
    const initial = setTimeout(() => { void choose(); }, 0);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      if (enabled) finishPending.current?.();
    });
    return () => {
      clearTimeout(initial);
      subscription.remove();
      stop();
    };
  }, [choose, stop]);

  const close = () => { stop(); onClose(); };
  const title = selected?.title.english || selected?.title.userPreferred || selected?.title.romaji || 'Anime';
  const cover = selected?.coverImage.large || selected?.coverImage.extraLarge || selected?.coverImage.medium;
  const metadata = [
    selected?.averageScore != null ? `★ ${(selected.averageScore / 10).toFixed(1)}/10 · AniList` : null,
    selected?.seasonYear || selected?.startDate?.year,
  ].filter(Boolean).join(' · ');
  const genres = selected?.genres?.slice(0, 2).map((genre) => GENRE_LABELS[genre] ?? genre).join(' · ');
  const ready = !choosing && selected !== null;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16, backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <View accessibilityViewIsModal style={{ width: '100%', maxWidth: 380, height: Math.min(560, height - insets.top - insets.bottom - 32) }} className={`rounded-3xl p-4 border ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="dice-outline" size={24} color={accent} />
          <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={{ color: foreground }} className="flex-1 text-lg font-manrope-bold">
            {choosing ? 'Eligiendo un anime…' : 'Tu anime al azar'}
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar selección" onPress={close} style={{ width: 48, height: 48 }} className="items-center justify-center">
            <Ionicons name="close" size={24} color={foreground} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', gap: 16, paddingBottom: 4 }}>
          <View accessible={false} style={{ width: 132, height: 184, borderRadius: 16, overflow: 'hidden', backgroundColor: selected?.coverImage.color || (isDark ? '#2F241E' : '#EDE5DF') }}>
            {cover ? <Image source={{ uri: cover }} recyclingKey={String(selected?.id)} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={0} /> : <View className="flex-1 items-center justify-center"><Ionicons name="image-outline" size={40} color={secondary} /></View>}
          </View>
          <View style={{ minHeight: 116, width: '100%', gap: 8, justifyContent: 'center' }}>
            {ready ? (
              <>
                <Text numberOfLines={3} style={{ color: foreground, fontSize: 22, lineHeight: 28 }} className="text-center font-manrope-bold">{title}</Text>
                {metadata ? <Text style={{ color: secondary }} className="text-sm text-center font-manrope-medium">{metadata}</Text> : null}
                {genres ? <Text style={{ color: secondary }} className="text-sm text-center font-manrope">{genres}</Text> : null}
              </>
            ) : <Text style={{ color: secondary }} className="text-base text-center font-manrope">{choosing ? 'Una sorpresa entre las tendencias' : 'No hay animes disponibles. Vuelve a intentarlo desde Inicio.'}</Text>}
          </View>
          <View style={{ width: '100%', marginTop: 'auto', gap: 10 }}>
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: !ready }} disabled={!ready}
              onPress={() => { if (!selected) return; close(); router.push(`/anime/${selected.id}`); }}
              style={{ minHeight: 48, backgroundColor: accent, opacity: ready ? 1 : 0.45 }} className="flex-row items-center justify-center gap-2 px-4 py-3 rounded-2xl">
              <Text style={{ color: isDark ? '#201A17' : '#FFFFFF' }} className="text-base font-manrope-bold">Ver detalles</Text>
              <Ionicons name="arrow-forward" size={20} color={isDark ? '#201A17' : '#FFFFFF'} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: choosing || animes.length < 2, busy: choosing }} disabled={choosing || animes.length < 2}
              onPress={() => { void choose(); }} style={{ minHeight: 48, opacity: choosing || animes.length < 2 ? 0.45 : 1 }} className={`flex-row gap-2 items-center justify-center px-4 py-3 rounded-2xl border ${isDark ? 'border-[#776962]' : 'border-[#A89C94]'}`}>
              <Ionicons name="dice-outline" size={20} color={accent} />
              <Text style={{ color: foreground }} className="text-base font-manrope-semibold">Elegir otro</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
