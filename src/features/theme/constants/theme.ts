import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#8B4F26',
    primaryContainer: '#FFDCC2',
    onPrimaryContainer: '#351A08',
    secondary: '#D97706',
    text: '#201A17',
    textSecondary: '#53433C',
    background: '#FCF8F6',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EDE5DF',
    border: '#D8CDC5',
    favorite: '#D32F2F',
    deleteContainer: '#FFDAD6',
  },
  dark: {
    primary: '#E09F7D',
    primaryContainer: '#58392B',
    onPrimaryContainer: '#FFDCC2',
    secondary: '#F59E0B',
    text: '#EDE0DB',
    textSecondary: '#A89C94',
    background: '#141211',
    backgroundElement: '#221A16',
    backgroundSelected: '#2F241E',
    border: '#3E3028',
    favorite: '#E53935',
    deleteContainer: '#B3261E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Typography = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'Manrope_400Regular',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Manrope_400Regular',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'Manrope_400Regular',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
