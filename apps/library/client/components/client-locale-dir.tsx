'use client';

import { useEffect } from 'react';
import { useLocale } from '@/lib/locale';

export function ClientLocaleDir() {
  const { dir, lang } = useLocale();
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [dir, lang]);
  return null;
}
