import React, { createContext, useCallback, useContext, useState } from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme } from 'react-native';

import { ThemeTransitionOverlay } from '@/components/ui/theme-transition-overlay';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface TouchCoords {
  x: number;
  y: number;
}

interface ThemeContextType {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference, coords?: TouchCoords) => void;
  activeScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  preference: 'system',
  setPreference: () => {},
  activeScheme: 'dark',
});

interface TransitionState {
  x: number;
  y: number;
  targetScheme: 'light' | 'dark';
}

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [transition, setTransition] = useState<TransitionState | null>(null);

  const activeScheme: 'light' | 'dark' =
    preference === 'system'
      ? deviceScheme === 'light'
        ? 'light'
        : 'dark'
      : preference;

  const setPreference = useCallback(
    (newPref: ThemePreference, coords?: TouchCoords) => {
      if (newPref === preference) return;

      const targetScheme: 'light' | 'dark' =
        newPref === 'system'
          ? (deviceScheme === 'light' ? 'light' : 'dark')
          : newPref;

      const schemeChanged = targetScheme !== activeScheme;

      // 1. Cambiar el tema e interfaz de forma INMEDIATA (0ms de retraso)
      setPreferenceState(newPref);
      if (newPref === 'system') {
        Appearance.setColorScheme('unspecified' as any);
      } else {
        Appearance.setColorScheme(newPref);
      }

      // 2. Si el esquema visual cambia y tenemos coordenadas, activar el barrido ultra rápido
      if (schemeChanged && coords) {
        setTransition({
          x: coords.x,
          y: coords.y,
          targetScheme,
        });
      }
    },
    [preference, activeScheme, deviceScheme]
  );

  const handleTransitionComplete = useCallback(() => {
    setTransition(null);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, setPreference, activeScheme }}>
      {children}
      {transition && (
        <ThemeTransitionOverlay
          x={transition.x}
          y={transition.y}
          targetScheme={transition.targetScheme}
          onComplete={handleTransitionComplete}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
