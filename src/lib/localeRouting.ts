import type { Language } from '@/i18n';

export const DEFAULT_LANGUAGE: Language = 'en';
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'nl', 'es'] as const;

const SUPPORTED_LANGUAGE_SET = new Set<Language>(SUPPORTED_LANGUAGES);

export const normalizePath = (path: string) => {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

export const isLanguage = (value: string): value is Language =>
  SUPPORTED_LANGUAGE_SET.has(value as Language);

export const extractLocaleFromPath = (pathname: string) => {
  const normalized = normalizePath(pathname);
  const segments = normalized.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isLanguage(firstSegment)) {
    const remaining = segments.slice(1);
    return {
      locale: firstSegment,
      path: remaining.length ? `/${remaining.join('/')}` : '/',
      hasLocalePrefix: true,
    };
  }

  return {
    locale: DEFAULT_LANGUAGE,
    path: normalized,
    hasLocalePrefix: false,
  };
};

export const buildLocalizedPath = (path: string, locale: Language) => {
  const normalized = normalizePath(path);

  if (locale === DEFAULT_LANGUAGE) {
    return normalized;
  }

  if (normalized === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
};

export const switchPathLocale = (pathname: string, targetLocale: Language) => {
  const { path } = extractLocaleFromPath(pathname);
  return buildLocalizedPath(path, targetLocale);
};
