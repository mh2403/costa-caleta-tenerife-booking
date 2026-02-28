import type { Language } from '@/i18n';

type ConsentChoice = 'granted' | 'denied';

const CONSENT_STORAGE_KEY = 'cc-consent-choice-v1';
const ATTRIBUTION_STORAGE_KEY = 'cc-attribution-v1';

const MARKETING_QUERY_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'wbraid',
  'gbraid',
  'fbclid',
] as const;

const CONSENT_DENIED_PAYLOAD = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

const CONSENT_GRANTED_PAYLOAD = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const;

type AttributionState = Partial<Record<(typeof MARKETING_QUERY_KEYS)[number], string>> & {
  captured_at?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

const getTrackingConfig = () => {
  const gtmId = (import.meta.env.VITE_GTM_ID as string | undefined)?.trim();
  const gaMeasurementId = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim();
  return {
    gtmId,
    gaMeasurementId,
    enabled: Boolean(gtmId || gaMeasurementId),
  };
};

export const isTrackingConfigured = () => getTrackingConfig().enabled;

const ensureDataLayerAndGtag = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args as unknown as IArguments);
    });
};

const injectScript = (id: string, src: string) => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;

  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
};

const getStoredAttribution = (): AttributionState => {
  if (typeof window === 'undefined') return {};

  const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as AttributionState;
    return parsed ?? {};
  } catch {
    return {};
  }
};

const setStoredAttribution = (value: AttributionState) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value));
};

const buildEventPayload = (payload?: Record<string, unknown>) => ({
  ...getStoredAttribution(),
  ...(payload ?? {}),
});

export const getStoredConsentChoice = (): ConsentChoice | null => {
  if (typeof window === 'undefined') return null;
  const choice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return choice === 'granted' || choice === 'denied' ? choice : null;
};

export const initializeAnalytics = () => {
  if (typeof window === 'undefined' || initialized) return;

  const { gtmId, gaMeasurementId, enabled } = getTrackingConfig();
  if (!enabled) {
    initialized = true;
    return;
  }

  ensureDataLayerAndGtag();
  window.gtag?.('consent', 'default', CONSENT_DENIED_PAYLOAD);

  const storedConsent = getStoredConsentChoice();
  if (storedConsent === 'granted') {
    window.gtag?.('consent', 'update', CONSENT_GRANTED_PAYLOAD);
  }

  if (gtmId) {
    window.dataLayer?.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    injectScript('gtm-script', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
  } else if (gaMeasurementId) {
    injectScript(
      'ga4-script',
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`
    );
    window.gtag?.('js', new Date());
    window.gtag?.('config', gaMeasurementId, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }

  initialized = true;
};

export const captureMarketingParams = () => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const current = getStoredAttribution();
  let changed = false;

  MARKETING_QUERY_KEYS.forEach((key) => {
    const value = params.get(key);
    if (!value) return;
    current[key] = value;
    changed = true;
  });

  if (!changed) return;
  current.captured_at = new Date().toISOString();
  setStoredAttribution(current);
};

export const updateConsent = (choice: ConsentChoice) => {
  if (typeof window === 'undefined' || !isTrackingConfigured()) return;

  ensureDataLayerAndGtag();
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);

  window.gtag?.(
    'consent',
    'update',
    choice === 'granted' ? CONSENT_GRANTED_PAYLOAD : CONSENT_DENIED_PAYLOAD
  );

  window.dataLayer?.push({
    event: 'consent_update',
    consent_choice: choice,
  });
};

export const trackEvent = (name: string, payload?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !isTrackingConfigured()) return;

  const params = buildEventPayload(payload);
  window.dataLayer?.push({ event: name, ...params });
  window.gtag?.('event', name, params);
};

export const trackPageView = ({
  path,
  title,
  language,
}: {
  path: string;
  title: string;
  language: Language;
}) => {
  if (typeof window === 'undefined' || !isTrackingConfigured()) return;

  const payload = buildEventPayload({
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    language,
  });

  window.dataLayer?.push({ event: 'page_view', ...payload });
  window.gtag?.('event', 'page_view', payload);
};

export const trackBookingStepViewed = (step: number, language: Language) => {
  trackEvent('booking_step_viewed', { step, language });
};

export const trackBookingRequestSubmitted = ({
  value,
  currency,
  nights,
  guests,
  language,
}: {
  value: number;
  currency: string;
  nights: number;
  guests: number;
  language: Language;
}) => {
  trackEvent('booking_request_submitted', {
    value,
    currency,
    nights,
    guests,
    language,
  });

  trackEvent('generate_lead', {
    lead_type: 'booking_request',
    value,
    currency,
    language,
  });
};

export const trackContactClick = (
  method: 'whatsapp' | 'phone' | 'email' | 'map',
  source: string,
  language: Language
) => {
  trackEvent('contact_click', {
    contact_method: method,
    source,
    language,
  });
};
