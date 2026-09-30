import { Suspense, lazy, useEffect, useMemo } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage, type Language } from '@/i18n';
import { ConsentBanner } from '@/components/ConsentBanner';
import {
  buildLocalizedPath,
  extractLocaleFromPath,
  normalizePath,
} from '@/lib/localeRouting';
import { captureMarketingParams, initializeAnalytics, trackPageView } from '@/lib/analytics';
import seoCopy from '@/content/seo-copy.json';

const Index = lazy(() => import('./pages/Index'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingDossier = lazy(() => import('./pages/BookingDossier'));
const Contact = lazy(() => import('./pages/Contact'));
const Accommodation = lazy(() => import('./pages/Accommodation'));
const LaCaletaGuide = lazy(() => import('./pages/LaCaletaGuide'));
const Admin = lazy(() => import('./pages/Admin'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Instructions = lazy(() => import('./pages/Instructions'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const LOCALIZED_PUBLIC_PREFIXES = ['en', 'nl', 'es'] as const;

type RouteSeoConfig = {
  title: string;
  description: string;
  robots: string;
  canonicalPath: string;
  locale: Language;
  indexable: boolean;
  alternatePaths: Record<'en' | 'nl' | 'es' | 'x-default', string> | null;
};

type SeoMetadata = {
  title: string;
  description: string;
  indexable: boolean;
};

const localizedSeoCopy = seoCopy as Record<Language, Record<string, SeoMetadata>>;

const RouteFallback = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      {t.common.loading}
    </div>
  );
};

const upsertMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag?.setAttribute(key, value);
  });
};

const upsertCanonicalTag = (href: string) => {
  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = href;
};

const syncAlternateTags = (alternatePaths: RouteSeoConfig['alternatePaths'], siteUrl: string) => {
  const previous = document.head.querySelectorAll('link[data-route-seo="alternate"]');
  previous.forEach((tag) => tag.parentElement?.removeChild(tag));

  if (!alternatePaths) return;

  Object.entries(alternatePaths).forEach(([hreflang, path]) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = `${siteUrl}${path}`;
    link.setAttribute('data-route-seo', 'alternate');
    document.head.appendChild(link);
  });
};

const upsertStructuredData = (data: Record<string, unknown> | null) => {
  const scriptId = 'route-seo-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!data) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};

const localeToOgLocale: Record<Language, string> = {
  en: 'en_GB',
  nl: 'nl_NL',
  es: 'es_ES',
};

const getSeoConfig = (pathname: string): RouteSeoConfig => {
  const normalizedOriginalPath = normalizePath(pathname);
  const { locale, path: routePath, hasLocalePrefix } = extractLocaleFromPath(pathname);
  const normalizedRoutePath = normalizePath(routePath);

  const isAdmin = normalizedRoutePath.startsWith('/admin');
  const isDossier = normalizedRoutePath.startsWith('/booking/dossier/');

  const localized = localizedSeoCopy[locale];
  const routeMeta = localized[normalizedRoutePath];
  const fallbackMeta: SeoMetadata = {
    title: locale === 'nl' ? 'Pagina niet gevonden | Costa Caleta Tenerife' : locale === 'es' ? 'Página no encontrada | Costa Caleta Tenerife' : 'Page not found | Costa Caleta Tenerife',
    description: localized['/'].description,
    indexable: false,
  };

  if (isAdmin) {
    return {
      title: 'Admin | Costa Caleta Tenerife',
      description: 'Private admin panel.',
      robots: 'noindex, nofollow, noarchive',
      canonicalPath: normalizedOriginalPath,
      locale,
      indexable: false,
      alternatePaths: null,
    };
  }

  if (isDossier) {
    return {
      title: 'Booking dossier | Costa Caleta Tenerife',
      description: 'Private booking dossier page.',
      robots: 'noindex, nofollow, noarchive',
      canonicalPath: normalizedOriginalPath,
      locale,
      indexable: false,
      alternatePaths: null,
    };
  }

  if (hasLocalePrefix && locale === 'nl') {
    return {
      title: fallbackMeta.title,
      description: fallbackMeta.description,
      robots: 'noindex, nofollow',
      canonicalPath: buildLocalizedPath(normalizedRoutePath, 'nl'),
      locale,
      indexable: false,
      alternatePaths: null,
    };
  }

  const alternatePaths: RouteSeoConfig['alternatePaths'] = {
    en: buildLocalizedPath(normalizedRoutePath, 'en'),
    nl: buildLocalizedPath(normalizedRoutePath, 'nl'),
    es: buildLocalizedPath(normalizedRoutePath, 'es'),
    'x-default': buildLocalizedPath(normalizedRoutePath, 'nl'),
  };

  const metadata = routeMeta ?? fallbackMeta;
  const indexable = Boolean(routeMeta?.indexable);

  return {
    title: metadata.title,
    description: metadata.description,
    robots: indexable ? 'index, follow' : 'noindex, nofollow',
    canonicalPath: routeMeta ? buildLocalizedPath(normalizedRoutePath, locale) : normalizedOriginalPath,
    locale,
    indexable,
    alternatePaths: indexable ? alternatePaths : null,
  };
};

const RouteLanguageSync = () => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const { locale } = extractLocaleFromPath(location.pathname);
    if (locale !== language) {
      setLanguage(locale);
    }
  }, [language, location.pathname, setLanguage]);

  return null;
};

const RouteSeo = () => {
  const { pathname } = useLocation();

  const seoConfig = useMemo(() => getSeoConfig(pathname), [pathname]);

  useEffect(() => {
    initializeAnalytics();
    captureMarketingParams();
  }, []);

  useEffect(() => {
    const configuredSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '');
    const siteUrl = configuredSiteUrl || window.location.origin;
    const canonicalUrl = `${siteUrl}${seoConfig.canonicalPath}`;
    const ogImageUrl = `${siteUrl}/og-image.jpeg`;
    const ogLocale = localeToOgLocale[seoConfig.locale];

    document.title = seoConfig.title;
    upsertCanonicalTag(canonicalUrl);
    upsertMetaTag('meta[name="description"]', { name: 'description', content: seoConfig.description });
    upsertMetaTag('meta[name="robots"]', { name: 'robots', content: seoConfig.robots });
    upsertMetaTag('meta[name="googlebot"]', { name: 'googlebot', content: seoConfig.robots });
    upsertMetaTag('meta[name="language"]', { name: 'language', content: seoConfig.locale });
    upsertMetaTag('meta[property="og:title"]', { property: 'og:title', content: seoConfig.title });
    upsertMetaTag('meta[property="og:description"]', { property: 'og:description', content: seoConfig.description });
    upsertMetaTag('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMetaTag('meta[property="og:image"]', { property: 'og:image', content: ogImageUrl });
    upsertMetaTag('meta[property="og:locale"]', { property: 'og:locale', content: ogLocale });
    upsertMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: seoConfig.title });
    upsertMetaTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: seoConfig.description,
    });
    upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImageUrl });

    syncAlternateTags(seoConfig.alternatePaths, siteUrl);

    if (seoConfig.indexable) {
      upsertStructuredData({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'LodgingBusiness',
            name: 'Costa Caleta Tenerife',
            url: canonicalUrl,
            image: ogImageUrl,
            inLanguage: seoConfig.locale,
            telephone: '+32475965141',
            priceRange: '€€',
            numberOfRooms: 1,
            checkinTime: '15:00',
            checkoutTime: '12:00',
            amenityFeature: [
              { '@type': 'LocationFeatureSpecification', name: 'Sunny terrace', value: true },
              { '@type': 'LocationFeatureSpecification', name: 'Shared swimming pool', value: true },
              { '@type': 'LocationFeatureSpecification', name: 'Sea view', value: true },
              { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
            ],
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'Guest capacity', value: 2 },
              { '@type': 'PropertyValue', name: 'Bedrooms', value: 1 },
            ],
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Calle Las Artes 24, Appartement 404',
              addressLocality: 'La Caleta, Adeje',
              postalCode: '38679',
              addressCountry: 'ES',
            },
            sameAs: ['https://wa.me/32475965141'],
          },
          {
            '@type': 'WebPage',
            name: seoConfig.title,
            description: seoConfig.description,
            inLanguage: seoConfig.locale,
            url: canonicalUrl,
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: seoConfig.locale === 'nl' ? 'Home' : seoConfig.locale === 'es' ? 'Inicio' : 'Home',
                item: `${siteUrl}${buildLocalizedPath('/', seoConfig.locale)}`,
              },
              ...(seoConfig.canonicalPath === buildLocalizedPath('/', seoConfig.locale)
                ? []
                : [
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: seoConfig.title,
                      item: canonicalUrl,
                    },
                  ]),
            ],
          },
        ],
      });
    } else {
      upsertStructuredData(null);
    }

    trackPageView({
      path: seoConfig.canonicalPath,
      title: seoConfig.title,
      language: seoConfig.locale,
    });
  }, [seoConfig]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ConsentBanner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <RouteLanguageSync />
          <RouteSeo />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/dossier/:token" element={<BookingDossier />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/appartement-la-caleta" element={<Accommodation />} />
              <Route path="/la-caleta-tenerife" element={<LaCaletaGuide />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/admin/*" element={<Admin />} />

              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-home`} path={`/${prefix}`} element={<Index />} />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-booking`} path={`/${prefix}/booking`} element={<Booking />} />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-contact`} path={`/${prefix}/contact`} element={<Contact />} />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route
                  key={`${prefix}-accommodation`}
                  path={`/${prefix}/appartement-la-caleta`}
                  element={<Accommodation />}
                />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route
                  key={`${prefix}-la-caleta-guide`}
                  path={`/${prefix}/la-caleta-tenerife`}
                  element={<LaCaletaGuide />}
                />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-privacy`} path={`/${prefix}/privacy`} element={<Privacy />} />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-terms`} path={`/${prefix}/terms`} element={<Terms />} />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route
                  key={`${prefix}-instructions`}
                  path={`/${prefix}/instructions`}
                  element={<Instructions />}
                />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-booking-dossier`} path={`/${prefix}/booking/dossier/:token`} element={<BookingDossier />} />
              ))}
              {LOCALIZED_PUBLIC_PREFIXES.map((prefix) => (
                <Route key={`${prefix}-admin`} path={`/${prefix}/admin/*`} element={<Admin />} />
              ))}

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
