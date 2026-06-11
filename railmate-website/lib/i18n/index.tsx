'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import en from './en.json';
import bn from './bn.json';

type Locale = 'en' | 'bn';
type Dictionary = typeof en;

interface I18nContextType {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const dictionaries = { en, bn } as const;

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // The URL param is the canonical source of truth — avoids localStorage
  // hydration mismatch and keeps locale consistent with the route segment.
  const params = useParams();
  const urlLocale = (params?.locale as Locale) ?? 'en';
  const validLocale = urlLocale === 'bn' ? 'bn' : 'en';

  const [locale, setLocaleState] = useState<Locale>(validLocale);

  // Keep in sync if the segment changes (e.g. after router.replace)
  useEffect(() => {
    setLocaleState(validLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = validLocale;
    }
  }, [validLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  };

  return (
    <I18nContext.Provider
      value={{ locale, t: dictionaries[locale], setLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
