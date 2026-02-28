import { useCallback } from 'react';
import { useLanguage } from '@/i18n';
import { buildLocalizedPath } from '@/lib/localeRouting';

export function useLocalizedPath() {
  const { language } = useLanguage();

  return useCallback(
    (path: string) => buildLocalizedPath(path, language),
    [language]
  );
}
