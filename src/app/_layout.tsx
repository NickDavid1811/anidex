import '@/global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProviderWrapper, useAppTheme } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync();

function ThemeContent() {
  const { activeScheme } = useAppTheme();
  return (
    <ThemeProvider value={activeScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar hidden={true} />
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <ThemeProviderWrapper>
      <ThemeContent />
    </ThemeProviderWrapper>
  );
}
