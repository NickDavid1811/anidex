import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemePreference, useAppTheme } from '@/context/theme-context';

interface OptionItem {
  id: ThemePreference;
  title: string;
  subtitle: string;
  icon: string;
}

const THEME_OPTIONS: OptionItem[] = [
  {
    id: 'system',
    title: 'Automático (Sistema)',
    subtitle: 'Sigue la configuración de tema de tu dispositivo móvil',
    icon: '⚙️',
  },
  {
    id: 'light',
    title: 'Modo Claro',
    subtitle: 'Fondos blancos y superficies limpias con toques naranja',
    icon: '☀️',
  },
  {
    id: 'dark',
    title: 'Modo Oscuro',
    subtitle: 'Fondo negro medianoche al estilo Crunchyroll',
    icon: '🌙',
  },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-crunchyroll-light-bg dark:bg-crunchyroll-dark-bg">
      <SafeAreaView className="flex-1 w-full max-w-[800px] self-center" edges={['top', 'left', 'right']}>
        <View className="px-4 pt-2 pb-3 gap-0.5">
          <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Ajustes
          </Text>
          <Text className="text-xs font-semibold text-crunchyroll-primary">
            Personaliza la apariencia y preferencias de Anidex
          </Text>
        </View>

        <View
          className="px-4 gap-4"
          style={{ paddingBottom: insets.bottom + 90 }}>
          {/* Card Material 3 de Tema */}
          <View className="rounded-3xl border border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface p-4 gap-3">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full items-center justify-center bg-orange-500/15">
                <Text className="text-xl">🎨</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-base font-bold text-slate-900 dark:text-white">
                  Tema de la aplicación
                </Text>
                <Text className="text-xs text-slate-500 dark:text-zinc-400">
                  Material Design 3 & Crunchyroll Palette
                </Text>
              </View>
            </View>

            <View className="gap-2.5 mt-1">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={(e) =>
                      setPreference(opt.id, {
                        x: e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY,
                      })
                    }
                    className={`flex-row items-center p-3.5 rounded-2xl border ${
                      isSelected
                        ? 'bg-orange-500/10 border-crunchyroll-primary'
                        : 'bg-crunchyroll-light-surface-high dark:bg-crunchyroll-dark-surface-high border-transparent'
                    } active:opacity-80`}>
                    <Text className="text-xl mr-3">{opt.icon}</Text>
                    <View className="flex-1 gap-0.5">
                      <Text
                        className={`text-sm font-bold ${
                          isSelected ? 'text-crunchyroll-primary' : 'text-slate-900 dark:text-white'
                        }`}>
                        {opt.title}
                      </Text>
                      <Text className="text-xs text-slate-500 dark:text-zinc-400">
                        {opt.subtitle}
                      </Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        isSelected ? 'border-crunchyroll-primary' : 'border-slate-400 dark:border-zinc-500'
                      }`}>
                      {isSelected && (
                        <View className="w-2.5 h-2.5 rounded-full bg-crunchyroll-primary" />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Información de la App */}
          <View className="rounded-2xl border border-crunchyroll-light-border dark:border-crunchyroll-dark-border bg-crunchyroll-light-surface dark:bg-crunchyroll-dark-surface p-4 items-center gap-1">
            <Text className="text-sm font-bold text-slate-900 dark:text-white">
              Anidex Mobile
            </Text>
            <Text className="text-xs text-slate-500 dark:text-zinc-400">
              Versión 1.0.0 • NativeWind v5 & Tailwind v4
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
