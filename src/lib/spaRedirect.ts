export const SPA_REDIRECT_STORAGE_KEY = 'spa-redirect-path';
export const SPA_REDIRECT_QUERY_PARAM = 'spa-redirect';

type StorageLike = Pick<Storage, 'getItem' | 'removeItem'>;
type HistoryLike = Pick<History, 'replaceState'>;
type LocationLike = Pick<Location, 'pathname' | 'search'>;

const normalizeBasePath = (baseUrl: string) => {
  if (!baseUrl || baseUrl === '/') return '/';

  const withLeadingSlash = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const buildIndexPath = (baseUrl: string) => {
  const normalizedBasePath = normalizeBasePath(baseUrl);
  return normalizedBasePath === '/' ? '/index.html' : `${normalizedBasePath}index.html`;
};

export const isSafeSpaRedirectPath = (value: string) => value.startsWith('/') && !value.startsWith('//');

export const isAppEntryPath = (pathname: string, baseUrl: string) => {
  const normalizedBasePath = normalizeBasePath(baseUrl);
  const indexPath = buildIndexPath(baseUrl);

  return pathname === normalizedBasePath || pathname === indexPath;
};

const consumeSpaRedirect = (storage?: StorageLike | null) => {
  if (!storage) return null;

  try {
    const redirectPath = storage.getItem(SPA_REDIRECT_STORAGE_KEY);
    if (redirectPath) {
      storage.removeItem(SPA_REDIRECT_STORAGE_KEY);
      return redirectPath;
    }
  } catch {
    return null;
  }

  return null;
};

const readSpaRedirectFromSearch = (search: string) => {
  if (!search) return null;

  const params = new URLSearchParams(search);
  return params.get(SPA_REDIRECT_QUERY_PARAM);
};

export const restorePendingSpaRedirect = ({
  baseUrl = '/',
  storage,
  history,
  location,
}: {
  baseUrl?: string;
  storage?: StorageLike | null;
  history?: HistoryLike | null;
  location?: LocationLike | null;
} = {}) => {
  const redirectPath = consumeSpaRedirect(storage) ?? readSpaRedirectFromSearch(location?.search ?? '');

  if (!redirectPath || !history || !location) return false;
  if (!isSafeSpaRedirectPath(redirectPath)) return false;
  if (!isAppEntryPath(location.pathname, baseUrl)) return false;

  history.replaceState(null, '', redirectPath);
  return true;
};
