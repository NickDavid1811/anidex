import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth';
import { LanguageSettingCard, useLocalization } from '@/features/localization';
import { ThemeSettingCard, useAppTheme } from '@/features/theme';
import { version } from '../../../package.json';

export default function SettingsScreen() {
  const { activeScheme } = useAppTheme();
  const { t } = useLocalization();
  const auth = useAuth();
  const [isDisconnecting, setDisconnecting] = useState(false);
  const isDark = activeScheme === 'dark';
  const busy = auth.isRestoring || auth.isConnecting || isDisconnecting;
  const foreground = isDark ? '#EDE0DB' : '#201A17';
  const secondary = isDark ? '#D0C3BC' : '#53433C';
  const accent = isDark ? '#E09F7D' : '#8B4F26';
  const avatar = auth.user?.avatar?.large || auth.user?.avatar?.medium;

  async function handleAccountPress() {
    if (busy) return;
    if (auth.user) {
      setDisconnecting(true);
      try { await auth.disconnect(); }
      finally { setDisconnecting(false); }
    } else {
      await auth.connect();
    }
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#141211]' : 'bg-[#FCF8F6]'}`}>
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center" edges={['top', 'left', 'right']}>
        <View className="px-4 pt-3 pb-4">
          <Text accessibilityRole="header" style={{ color: foreground }} className="text-2xl font-manrope-bold">{t('settings.title')}</Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 20,
            paddingBottom: 112,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className={`rounded-3xl border p-4 gap-4 ${isDark ? 'bg-[#221A16] border-[#3E3028]' : 'bg-white border-[#D8CDC5]'}`}>
            <Text accessibilityRole="header" style={{ color: foreground }} className="font-manrope-bold text-lg">{t('settings.account')}</Text>
            {auth.isRestoring ? (
              <View className="flex-row items-center gap-3">
                <ActivityIndicator color={accent} />
                <Text style={{ color: secondary }} className="font-manrope text-base">{t('settings.restoring')}</Text>
              </View>
            ) : auth.user ? (
              <View className="flex-row items-center gap-3">
                <View style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', backgroundColor: isDark ? '#2F241E' : '#EDE5DF', alignItems: 'center', justifyContent: 'center' }}>
                  {avatar ? <Image source={{ uri: avatar }} style={{ width: 56, height: 56 }} contentFit="cover" /> : <Ionicons name="person-outline" size={28} color={accent} />}
                </View>
                <View className="flex-1 gap-1">
                  <Text style={{ color: foreground }} className="font-manrope-bold text-lg">{auth.user.name}</Text>
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="checkmark-circle-outline" size={18} color={accent} />
                    <Text style={{ color: secondary }} className="font-manrope text-sm">{t('settings.connected')}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text style={{ color: secondary, lineHeight: 24 }} className="font-manrope text-base">
                {t('settings.connectHint')}
              </Text>
            )}
            <Text style={{ color: secondary, lineHeight: 22 }} className="font-manrope text-sm">
              {t('settings.localFavorites')}
            </Text>
            {auth.error && <Text accessibilityRole="alert" style={{ color: isDark ? '#FFB4AB' : '#B3261E' }} className="font-manrope text-sm">{auth.error}</Text>}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={auth.user ? t('settings.disconnectAccessibility') : t('settings.connectAccessibility')}
              accessibilityState={{ disabled: busy, busy }}
              disabled={busy}
              onPress={() => { void handleAccountPress(); }}
              style={{ minHeight: 48, borderColor: auth.user ? (isDark ? '#776962' : '#A89C94') : accent, backgroundColor: auth.user ? 'transparent' : accent, opacity: busy ? 0.7 : 1 }}
              className="rounded-2xl border flex-row gap-2 items-center justify-center px-4 py-3"
            >
              {busy && <ActivityIndicator color={auth.user ? accent : isDark ? '#201A17' : '#FFFFFF'} />}
              <Text style={{ color: auth.user ? foreground : isDark ? '#201A17' : '#FFFFFF' }} className="font-manrope-semibold text-base shrink text-center">
                {auth.isRestoring ? t('settings.restoringShort') : auth.isConnecting ? t('settings.connecting') : isDisconnecting ? t('settings.disconnecting') : auth.user ? t('settings.disconnect') : t('settings.connect')}
              </Text>
            </Pressable>
          </View>

          <ThemeSettingCard />
          <LanguageSettingCard isDark={isDark} />

          <View className="px-1 py-2 gap-2">
            <Text accessibilityRole="header" style={{ color: foreground }} className="font-manrope-semibold text-base">{t('settings.about')}</Text>
            <Text style={{ color: secondary }} className="font-manrope text-sm">{t('settings.version', { version })}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
