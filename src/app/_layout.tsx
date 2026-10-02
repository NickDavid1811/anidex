import '@/global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FavoritesProvider } from '@/features/favorites';
import { ThemeProviderWrapper, useAppTheme } from '@/features/theme';

SplashScreen.preventAutoHideAsync();

function ThemeContent() {
  const { activeScheme } = useAppTheme();

  return (
    <ThemeProvider value={activeScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar hidden={true} />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: activeScheme === 'dark' ? '#141211' : '#FCF8F6',
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="anime/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProviderWrapper>
      <FavoritesProvider>
        <ThemeContent />
      </FavoritesProvider>
    </ThemeProviderWrapper>
  );
}
