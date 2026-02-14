'use client';

import { useLocale } from '@/lib/locale';
import { Button } from '@arabiaaislamia/ui';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={locale === 'ur' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('ur')}
      >
        اردو
      </Button>
      <Button
        type="button"
        variant={locale === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('ar')}
      >
        العربية
      </Button>
    </div>
  );
}
