'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import urMessages from '@/messages/ur.json';
import arMessages from '@/messages/ar.json';

export type Locale = 'ur' | 'ar';

const LOCALE_KEY = 'library-locale';

const messages: Record<Locale, Record<string, unknown>> = {
  ur: urMessages as Record<string, unknown>,
  ar: arMessages as Record<string, unknown>,
};

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'ur';
  const s = localStorage.getItem(LOCALE_KEY);
  return (s === 'ar' ? 'ar' : 'ur') as Locale;
}

function setStoredLocale(locale: Locale) {
  if (typeof window !== 'undefined') localStorage.setItem(LOCALE_KEY, locale);
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
  lang: string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ur');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setStoredLocale(l);
  }, []);

  const t = useCallback(
    (key: string) => {
      const m = messages[locale] as Record<string, unknown>;
      const parts = key.split('.');
      let v: unknown = m;
      for (const p of parts) {
        v = (v as Record<string, unknown>)?.[p];
      }
      return typeof v === 'string' ? v : key;
    },
    [locale],
  );

  const value: LocaleContextValue = {
    locale: mounted ? locale : 'ur',
    setLocale,
    t,
    dir: 'rtl',
    lang: locale === 'ur' ? 'ur' : 'ar',
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
