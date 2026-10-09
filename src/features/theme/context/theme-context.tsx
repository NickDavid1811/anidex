import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme } from 'react-native';

import { ThemeTransitionOverlay } from '../components/ThemeTransitionOverlay';

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
  covered: boolean;
}

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const pendingPreferenceRef = useRef<ThemePreference | null>(null);

  const activeScheme: 'light' | 'dark' =
    preference === 'system'
      ? deviceScheme === 'light'
        ? 'light'
        : 'dark'
      : preference;

  const applyPreference = useCallback((newPref: ThemePreference) => {
    setPreferenceState(newPref);
    Appearance.setColorScheme(
      newPref === 'system' ? 'unspecified' : newPref
    );
  }, []);

  const setPreference = useCallback(
    (newPref: ThemePreference, coords?: TouchCoords) => {
      if (newPref === preference || transition) return;

      const targetScheme: 'light' | 'dark' =
        newPref === 'system'
          ? (deviceScheme === 'light' ? 'light' : 'dark')
          : newPref;

      const schemeChanged = targetScheme !== activeScheme;

      if (schemeChanged && coords) {
        pendingPreferenceRef.current = newPref;
        setTransition({
          x: coords.x,
          y: coords.y,
          targetScheme,
          covered: false,
        });
        return;
      }

      applyPreference(newPref);
    },
    [activeScheme, applyPreference, deviceScheme, preference, transition]
  );

  const handleTransitionCovered = useCallback(() => {
    const pendingPreference = pendingPreferenceRef.current;
    if (!pendingPreference) return;

    applyPreference(pendingPreference);
    setTransition((current) =>
      current ? { ...current, covered: true } : null
    );
  }, [applyPreference]);

  const handleTransitionComplete = useCallback(() => {
    pendingPreferenceRef.current = null;
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
          covered={transition.covered}
          onCovered={handleTransitionCovered}
          onComplete={handleTransitionComplete}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
