import * as SecureStore from 'expo-secure-store';
import { useLocales } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { translations } from '../translations';

export type LanguagePreference = 'system' | 'es' | 'en';
type ActiveLanguage = 'es' | 'en';

interface LocalizationContextValue {
  preference: LanguagePreference;
  language: ActiveLanguage;
  setPreference: (preference: LanguagePreference) => void;
  t: (key: string, options?: TranslateOptions) => string;
}

const STORAGE_KEY = 'anidex.language';
const LocalizationContext = createContext<LocalizationContextValue | null>(null);

async function readPreference() {
  const value = Platform.OS === 'web'
    ? globalThis.localStorage?.getItem(STORAGE_KEY)
    : await SecureStore.getItemAsync(STORAGE_KEY);
  return value === 'system' || value === 'es' || value === 'en' ? value : null;
}

async function savePreference(value: LanguagePreference) {
  if (Platform.OS === 'web') globalThis.localStorage?.setItem(STORAGE_KEY, value);
  else await SecureStore.setItemAsync(STORAGE_KEY, value);
}

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const locales = useLocales();
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');
  const systemLanguage: ActiveLanguage = locales[0]?.languageCode === 'es' ? 'es' : 'en';
  const language = preference === 'system' ? systemLanguage : preference;

  useEffect(() => {
    void readPreference().then((stored) => {
      if (stored) setPreferenceState(stored);
    });
  }, []);

  const setPreference = useCallback((value: LanguagePreference) => {
    setPreferenceState(value);
    void savePreference(value);
  }, []);

  const i18n = useMemo(() => {
    const instance = new I18n(translations);
    instance.enableFallback = true;
    instance.defaultLocale = 'en';
    instance.locale = language;
    return instance;
  }, [language]);
  const t = useCallback((key: string, options?: TranslateOptions) => i18n.t(key, options), [i18n]);
  const value = useMemo(() => ({ preference, language, setPreference, t }), [language, preference, setPreference, t]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider');
  return context;
}
