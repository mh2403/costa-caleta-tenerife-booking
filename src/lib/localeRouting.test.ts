import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  buildLocalizedPath,
  extractLocaleFromPath,
  switchPathLocale,
} from '@/lib/localeRouting';

describe('localeRouting', () => {
  it('defaults non-prefixed routes to Dutch', () => {
    expect(DEFAULT_LANGUAGE).toBe('nl');
    expect(extractLocaleFromPath('/contact')).toEqual({
      locale: 'nl',
      path: '/contact',
      hasLocalePrefix: false,
    });
  });

  it('still detects legacy locale prefixes', () => {
    expect(extractLocaleFromPath('/es/contact')).toEqual({
      locale: 'es',
      path: '/contact',
      hasLocalePrefix: true,
    });
  });

  it('builds the Dutch canonical path for every locale', () => {
    expect(buildLocalizedPath('/', 'nl')).toBe('/');
    expect(buildLocalizedPath('/contact', 'nl')).toBe('/contact');
    expect(buildLocalizedPath('/contact', 'en')).toBe('/en/contact');
    expect(buildLocalizedPath('/contact', 'es')).toBe('/es/contact');
  });

  it('switches between Dutch canonical and localized paths', () => {
    expect(switchPathLocale('/es/contact', 'nl')).toBe('/contact');
    expect(switchPathLocale('/en/booking', 'es')).toBe('/es/booking');
    expect(switchPathLocale('/nl', 'en')).toBe('/en');
  });
});
