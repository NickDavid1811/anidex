import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Appearance, Dimensions, useColorScheme as useDeviceColorScheme } from 'react-native';

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
  const isTransitioningRef = useRef(false);

  const activeScheme: 'light' | 'dark' =
    preference === 'system'
      ? deviceScheme === 'light'
        ? 'light'
        : 'dark'
      : preference;

  const setPreference = useCallback(
    (newPref: ThemePreference, coords?: TouchCoords) => {
      if (newPref === preference) return;
      if (isTransitioningRef.current) return;

      const targetScheme: 'light' | 'dark' =
        newPref === 'system'
          ? (deviceScheme === 'light' ? 'light' : 'dark')
          : newPref;

      // Si el esquema visual real cambia (light <-> dark), ejecutamos la animación de barrido circular
      if (targetScheme !== activeScheme) {
        isTransitioningRef.current = true;
        const { width, height } = Dimensions.get('screen');
        const originX = coords?.x ?? width / 2;
        const originY = coords?.y ?? height / 2;

        setTransition({
          x: originX,
          y: originY,
          targetScheme,
        });

        // Conmutar el tema en React Native a la mitad del barrido (180ms)
        // para que el redibujado ocurra cubierto por el círculo expansivo
        setTimeout(() => {
          setPreferenceState(newPref);
          if (newPref === 'system') {
            Appearance.setColorScheme('unspecified' as any);
          } else {
            Appearance.setColorScheme(newPref);
          }
        }, 180);
      } else {
        // Si el esquema visual no cambia (ej. de system-dark a dark explícito)
        setPreferenceState(newPref);
        if (newPref === 'system') {
          Appearance.setColorScheme('unspecified' as any);
        } else {
          Appearance.setColorScheme(newPref);
        }
      }
    },
    [preference, activeScheme, deviceScheme]
  );

  const handleTransitionComplete = useCallback(() => {
    setTransition(null);
    isTransitioningRef.current = false;
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
