import { describe, expect, it, vi } from 'vitest';
import {
  SPA_REDIRECT_QUERY_PARAM,
  SPA_REDIRECT_STORAGE_KEY,
  restorePendingSpaRedirect,
} from '@/lib/spaRedirect';

const createStorage = (value: string | null) => {
  const values = new Map<string, string>();

  if (value !== null) {
    values.set(SPA_REDIRECT_STORAGE_KEY, value);
  }

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
};

describe('restorePendingSpaRedirect', () => {
  it('restores the original route when the app re-enters through the root page', () => {
    const history = { replaceState: vi.fn() };
    const storage = createStorage('/admin/bookings?status=pending#booking-1');

    const restored = restorePendingSpaRedirect({
      baseUrl: '/',
      storage,
      history,
      location: { pathname: '/', search: '' },
    });

    expect(restored).toBe(true);
    expect(history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/admin/bookings?status=pending#booking-1'
    );
    expect(storage.getItem(SPA_REDIRECT_STORAGE_KEY)).toBeNull();
  });

  it('supports restoring routes when the app entry is served as index.html', () => {
    const history = { replaceState: vi.fn() };
    const storage = createStorage('/booking/dossier/test-token');

    const restored = restorePendingSpaRedirect({
      baseUrl: '/',
      storage,
      history,
      location: { pathname: '/index.html', search: '' },
    });

    expect(restored).toBe(true);
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/booking/dossier/test-token');
  });

  it('supports non-root base paths', () => {
    const history = { replaceState: vi.fn() };
    const storage = createStorage('/preview/admin');

    const restored = restorePendingSpaRedirect({
      baseUrl: '/preview/',
      storage,
      history,
      location: { pathname: '/preview/', search: '' },
    });

    expect(restored).toBe(true);
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/preview/admin');
  });

  it('ignores unsafe redirect targets', () => {
    const history = { replaceState: vi.fn() };
    const storage = createStorage('//example.com/admin');

    const restored = restorePendingSpaRedirect({
      baseUrl: '/',
      storage,
      history,
      location: { pathname: '/', search: '' },
    });

    expect(restored).toBe(false);
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it('does not restore when the app is already on a non-entry path', () => {
    const history = { replaceState: vi.fn() };
    const storage = createStorage('/admin');

    const restored = restorePendingSpaRedirect({
      baseUrl: '/',
      storage,
      history,
      location: { pathname: '/contact', search: '' },
    });

    expect(restored).toBe(false);
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it('restores from the query string when storage is unavailable', () => {
    const history = { replaceState: vi.fn() };

    const restored = restorePendingSpaRedirect({
      baseUrl: '/',
      history,
      location: {
        pathname: '/',
        search: `?${SPA_REDIRECT_QUERY_PARAM}=${encodeURIComponent('/admin/pricing')}`,
      },
    });

    expect(restored).toBe(true);
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/admin/pricing');
  });
});
