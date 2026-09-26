import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextType {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  activeScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  preference: 'system',
  setPreference: () => {},
  activeScheme: 'dark',
});

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  const setPreference = (newPref: ThemePreference) => {
    setPreferenceState(newPref);
    if (newPref === 'system') {
      Appearance.setColorScheme('unspecified' as any);
    } else {
      Appearance.setColorScheme(newPref);
    }
  };

  const activeScheme: 'light' | 'dark' =
    preference === 'system'
      ? deviceScheme === 'light'
        ? 'light'
        : 'dark'
      : preference;

  return (
    <ThemeContext.Provider value={{ preference, setPreference, activeScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
