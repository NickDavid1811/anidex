import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemePreference, useAppTheme } from '@/context/theme-context';
import { useTheme } from '@/hooks/use-theme';

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Ajustes</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>
            Personaliza la apariencia y preferencias de Anidex
          </ThemedText>
        </View>

        <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.six + 50 }]}>
          {/* Card Material 3 de Tema */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(244, 117, 33, 0.15)' }]}>
                <Text style={styles.iconCircleText}>🎨</Text>
              </View>
              <View style={styles.sectionTitles}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Tema de la aplicación</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                  Material Design 3 & Crunchyroll Palette
                </Text>
              </View>
            </View>

            <View style={styles.optionsList}>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setPreference(opt.id)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(244, 117, 33, 0.12)'
                          : theme.backgroundSelected,
                        borderColor: isSelected ? '#F47521' : 'transparent',
                      },
                      pressed && styles.pressed,
                    ]}>
                    <Text style={styles.optionEmoji}>{opt.icon}</Text>
                    <View style={styles.optionInfo}>
                      <Text
                        style={[
                          styles.optionTitle,
                          { color: isSelected ? '#F47521' : theme.text },
                        ]}>
                        {opt.title}
                      </Text>
                      <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                        {opt.subtitle}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        { borderColor: isSelected ? '#F47521' : theme.textSecondary },
                      ]}>
                      {isSelected && <View style={styles.radioInnerCircle} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Información de la App */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}>
            <Text style={[styles.appName, { color: theme.text }]}>Anidex Mobile</Text>
            <Text style={[styles.appVersion, { color: theme.textSecondary }]}>
              Versión 1.0.0 • Impulsado por AniList GraphQL
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleText: {
    fontSize: 20,
  },
  sectionTitles: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 13,
  },
  optionsList: {
    gap: 10,
    marginTop: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionInfo: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F47521',
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
  },
  appVersion: {
    fontSize: 12,
  },
});
