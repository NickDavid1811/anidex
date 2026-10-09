import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { SplashOverlay } from '@/components/splash-overlay';
import { AuthProvider } from '@/features/auth';
import { FavoritesProvider } from '@/features/favorites';
import { LocalizationProvider } from '@/features/localization';
import { ThemeProviderWrapper, useAppTheme } from '@/features/theme';

SplashScreen.preventAutoHideAsync();

function ThemeContent() {
  const { activeScheme } = useAppTheme();

  return (
    <ThemeProvider value={activeScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar hidden={true} />
      <SplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: activeScheme === 'dark' ? '#141211' : '#FCF8F6',
          },
        }}
      >
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
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular: require('@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf'),
    Manrope_500Medium: require('@expo-google-fonts/manrope/500Medium/Manrope_500Medium.ttf'),
    Manrope_600SemiBold: require('@expo-google-fonts/manrope/600SemiBold/Manrope_600SemiBold.ttf'),
    Manrope_700Bold: require('@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf'),
  });
  useEffect(() => {
    if (fontError) console.warn('No se pudo cargar Manrope:', fontError);
  }, [fontError]);
  if (!fontsLoaded && !fontError) return null;

  return (
    <LocalizationProvider>
      <ThemeProviderWrapper>
        <AuthProvider>
          <FavoritesProvider>
            <ThemeContent />
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProviderWrapper>
    </LocalizationProvider>
  );
}
