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

const Index = lazy(() => import('./pages/Index'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingDossier = lazy(() => import('./pages/BookingDossier'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Instructions = lazy(() => import('./pages/Instructions'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const LOCALIZED_PUBLIC_PREFIXES = ['nl', 'es'] as const;

type RouteSeoConfig = {
  title: string;
  description: string;
  robots: string;
  canonicalPath: string;
  locale: Language;
  indexable: boolean;
  alternatePaths: Record<'en' | 'nl' | 'es' | 'x-default', string> | null;
};

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

  const localized = {
    en: {
      homeTitle: 'Business Apartment Rental Tenerife | Costa Caleta La Caleta',
      homeDescription:
        'Business-friendly apartment rental in La Caleta, Adeje, Tenerife. Book direct with the owner at Costa Caleta and avoid platform fees.',
      bookingTitle: 'Book Apartment Rental Tenerife | Costa Caleta',
      bookingDescription:
        'Check live availability and book your Tenerife apartment rental directly in La Caleta, Adeje. Fast WhatsApp confirmation from the owner.',
      contactTitle: 'Contact for Tenerife Apartment Rental | Costa Caleta',
      contactDescription:
        'Contact Costa Caleta Tenerife for apartment availability, monthly stay questions and direct booking support in La Caleta, Adeje.',
      privacyTitle: 'Privacy policy | Costa Caleta Tenerife',
      privacyDescription:
        'Read how Costa Caleta Tenerife handles personal data, legal bases, retention periods, and your GDPR rights.',
      termsTitle: 'Terms & conditions | Costa Caleta Tenerife',
      termsDescription:
        'Review booking, payment, check-in/check-out, cancellation and liability terms for Costa Caleta Tenerife.',
      instructionsTitle: 'Guest instructions | Costa Caleta Tenerife',
      instructionsDescription:
        'Guest instructions for your Costa Caleta Tenerife stay, including the apartment TV video guide.',
      fallbackTitle: 'Page not found | Costa Caleta Tenerife',
    },
    nl: {
      homeTitle: 'Zakelijk appartement huren Tenerife | Costa Caleta La Caleta',
      homeDescription:
        'Zakelijk en comfortabel appartement huren in La Caleta, Adeje, Tenerife. Boek rechtstreeks bij de eigenaar en vermijd platformkosten.',
      bookingTitle: 'Appartement boeken Tenerife | Costa Caleta',
      bookingDescription:
        'Controleer beschikbaarheid en boek uw appartement in Tenerife rechtstreeks in La Caleta, Adeje, met snelle WhatsApp-bevestiging.',
      contactTitle: 'Contact voor appartement Tenerife | Costa Caleta',
      contactDescription:
        'Neem direct contact op over beschikbaarheid, langere verblijven en rechtstreekse boeking van ons appartement in La Caleta, Adeje.',
      privacyTitle: 'Privacybeleid | Costa Caleta Tenerife',
      privacyDescription:
        'Lees hoe Costa Caleta Tenerife persoonsgegevens verwerkt, bewaartermijnen hanteert en uw GDPR-rechten respecteert.',
      termsTitle: 'Voorwaarden | Costa Caleta Tenerife',
      termsDescription:
        'Bekijk de voorwaarden rond boeking, betaling, check-in/check-out, annulering en aansprakelijkheid.',
      instructionsTitle: 'Instructies | Costa Caleta Tenerife',
      instructionsDescription:
        'Gasteninstructies voor uw verblijf bij Costa Caleta Tenerife, inclusief videohandleiding voor de tv.',
      fallbackTitle: 'Pagina niet gevonden | Costa Caleta Tenerife',
    },
    es: {
      homeTitle: 'Alquiler apartamento Tenerife La Caleta | Costa Caleta',
      homeDescription:
        'Alquiler de apartamento en La Caleta, Adeje, Tenerife, ideal para vacaciones y estancias de trabajo. Reserva directa con la propietaria.',
      bookingTitle: 'Reservar apartamento Tenerife | Costa Caleta',
      bookingDescription:
        'Consulta disponibilidad en tiempo real y reserva tu apartamento en Tenerife en La Caleta, Adeje, con confirmacion rapida por WhatsApp.',
      contactTitle: 'Contacto alquiler apartamento Tenerife | Costa Caleta',
      contactDescription:
        'Contacta para disponibilidad, estancias largas y reserva directa de nuestro apartamento en La Caleta, Adeje, Tenerife.',
      privacyTitle: 'Politica de privacidad | Costa Caleta Tenerife',
      privacyDescription:
        'Consulta como Costa Caleta Tenerife gestiona datos personales, plazos de conservacion y tus derechos de privacidad.',
      termsTitle: 'Terminos y condiciones | Costa Caleta Tenerife',
      termsDescription:
        'Revisa condiciones de reserva, pago, check-in/check-out, cancelacion y responsabilidad para tu estancia.',
      instructionsTitle: 'Instrucciones | Costa Caleta Tenerife',
      instructionsDescription:
        'Instrucciones para huespedes de Costa Caleta Tenerife, incluida la guia en video para el televisor del apartamento.',
      fallbackTitle: 'Pagina no encontrada | Costa Caleta Tenerife',
    },
  }[locale];

  if (hasLocalePrefix && locale === 'en') {
    return {
      title: localized.fallbackTitle,
      description: localized.homeDescription,
      robots: 'noindex, nofollow',
      canonicalPath: buildLocalizedPath(normalizedRoutePath, 'en'),
      locale,
      indexable: false,
      alternatePaths: null,
    };
  }

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

  const alternatePaths: RouteSeoConfig['alternatePaths'] = {
    en: buildLocalizedPath(normalizedRoutePath, 'en'),
    nl: buildLocalizedPath(normalizedRoutePath, 'nl'),
    es: buildLocalizedPath(normalizedRoutePath, 'es'),
    'x-default': buildLocalizedPath(normalizedRoutePath, 'en'),
  };

  switch (normalizedRoutePath) {
    case '/':
      return {
        title: localized.homeTitle,
        description: localized.homeDescription,
        robots: 'index, follow',
        canonicalPath: buildLocalizedPath('/', locale),
        locale,
        indexable: true,
        alternatePaths,
      };
    case '/booking':
      return {
        title: localized.bookingTitle,
        description: localized.bookingDescription,
        robots: 'index, follow',
        canonicalPath: buildLocalizedPath('/booking', locale),
        locale,
        indexable: true,
        alternatePaths,
      };
    case '/contact':
      return {
        title: localized.contactTitle,
        description: localized.contactDescription,
        robots: 'index, follow',
        canonicalPath: buildLocalizedPath('/contact', locale),
        locale,
        indexable: true,
        alternatePaths,
      };
    case '/privacy':
      return {
        title: localized.privacyTitle,
        description: localized.privacyDescription,
        robots: 'index, follow',
        canonicalPath: buildLocalizedPath('/privacy', locale),
        locale,
        indexable: true,
        alternatePaths,
      };
    case '/terms':
      return {
        title: localized.termsTitle,
        description: localized.termsDescription,
        robots: 'index, follow',
        canonicalPath: buildLocalizedPath('/terms', locale),
        locale,
        indexable: true,
        alternatePaths,
      };
    case '/instructions':
      return {
        title: localized.instructionsTitle,
        description: localized.instructionsDescription,
        robots: 'index, follow',
        canonicalPath: buildLocalizedPath('/instructions', locale),
        locale,
        indexable: true,
        alternatePaths,
      };
    default:
      return {
        title: localized.fallbackTitle,
        description: localized.homeDescription,
        robots: 'noindex, nofollow',
        canonicalPath: normalizedOriginalPath,
        locale,
        indexable: false,
        alternatePaths: null,
      };
  }
};

const RouteLanguageSync = () => {
  const { pathname } = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const { locale } = extractLocaleFromPath(pathname);
    if (locale !== language) {
      setLanguage(locale);
    }
  }, [language, pathname, setLanguage]);

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
            priceRange: 'EUR',
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
