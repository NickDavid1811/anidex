/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

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

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
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
