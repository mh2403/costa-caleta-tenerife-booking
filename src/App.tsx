import { Suspense, lazy, useEffect, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/i18n";

const Index = lazy(() => import("./pages/Index"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingDossier = lazy(() => import("./pages/BookingDossier"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Instructions = lazy(() => import("./pages/Instructions"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

type RouteSeoConfig = {
  title: string;
  description: string;
  robots: string;
  canonicalPath: string;
};

const RouteFallback = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      {t.common.loading}
    </div>
  );
};

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

const upsertMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag?.setAttribute(key, value);
  });
};

const upsertCanonicalTag = (href: string) => {
  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;
};

const getSeoConfig = (path: string, language: "en" | "nl" | "es"): RouteSeoConfig => {
  const normalizedPath = normalizePath(path);
  const isAdmin = normalizedPath.startsWith("/admin");
  const isDossier = normalizedPath.startsWith("/booking/dossier/");

  const localized = {
    en: {
      homeTitle: "Costa Caleta Tenerife | Apartment in La Caleta",
      homeDescription:
        "Book directly with the owner at Costa Caleta Tenerife. Check availability, view photos and reserve your stay in La Caleta.",
      bookingTitle: "Book your stay | Costa Caleta Tenerife",
      bookingDescription:
        "Check availability and submit your booking request directly with the owner. Transparent process and direct WhatsApp follow-up.",
      contactTitle: "Contact | Costa Caleta Tenerife",
      contactDescription:
        "Contact Costa Caleta Tenerife directly via phone, WhatsApp or email for availability and practical questions.",
      privacyTitle: "Privacy policy | Costa Caleta Tenerife",
      termsTitle: "Terms & conditions | Costa Caleta Tenerife",
      instructionsTitle: "Guest instructions | Costa Caleta Tenerife",
      fallbackTitle: "Page not found | Costa Caleta Tenerife",
    },
    nl: {
      homeTitle: "Costa Caleta Tenerife | Appartement in La Caleta",
      homeDescription:
        "Boek rechtstreeks bij de eigenaar van Costa Caleta Tenerife. Bekijk beschikbaarheid, foto's en reserveer uw verblijf in La Caleta.",
      bookingTitle: "Boek uw verblijf | Costa Caleta Tenerife",
      bookingDescription:
        "Controleer beschikbaarheid en verstuur uw boekingsaanvraag rechtstreeks bij de eigenaar. Transparante flow met directe WhatsApp-opvolging.",
      contactTitle: "Contact | Costa Caleta Tenerife",
      contactDescription:
        "Neem rechtstreeks contact op met Costa Caleta Tenerife via telefoon, WhatsApp of e-mail voor beschikbaarheid en praktische vragen.",
      privacyTitle: "Privacybeleid | Costa Caleta Tenerife",
      termsTitle: "Voorwaarden | Costa Caleta Tenerife",
      instructionsTitle: "Instructies | Costa Caleta Tenerife",
      fallbackTitle: "Pagina niet gevonden | Costa Caleta Tenerife",
    },
    es: {
      homeTitle: "Costa Caleta Tenerife | Apartamento en La Caleta",
      homeDescription:
        "Reserva directamente con la propietaria en Costa Caleta Tenerife. Consulta disponibilidad, fotos y reserva tu estancia en La Caleta.",
      bookingTitle: "Reserva tu estancia | Costa Caleta Tenerife",
      bookingDescription:
        "Consulta disponibilidad y envía tu solicitud de reserva directamente a la propietaria. Flujo claro con seguimiento por WhatsApp.",
      contactTitle: "Contacto | Costa Caleta Tenerife",
      contactDescription:
        "Contacta directamente con Costa Caleta Tenerife por teléfono, WhatsApp o correo para disponibilidad y dudas prácticas.",
      privacyTitle: "Política de privacidad | Costa Caleta Tenerife",
      termsTitle: "Términos y condiciones | Costa Caleta Tenerife",
      instructionsTitle: "Instrucciones | Costa Caleta Tenerife",
      fallbackTitle: "Página no encontrada | Costa Caleta Tenerife",
    },
  }[language];

  if (isAdmin) {
    return {
      title: "Admin | Costa Caleta Tenerife",
      description: "Private admin panel.",
      robots: "noindex, nofollow, noarchive",
      canonicalPath: normalizedPath,
    };
  }

  if (isDossier) {
    return {
      title: "Booking dossier | Costa Caleta Tenerife",
      description: "Private booking dossier page.",
      robots: "noindex, nofollow, noarchive",
      canonicalPath: normalizedPath,
    };
  }

  switch (normalizedPath) {
    case "/":
      return {
        title: localized.homeTitle,
        description: localized.homeDescription,
        robots: "index, follow",
        canonicalPath: "/",
      };
    case "/booking":
      return {
        title: localized.bookingTitle,
        description: localized.bookingDescription,
        robots: "index, follow",
        canonicalPath: "/booking",
      };
    case "/contact":
      return {
        title: localized.contactTitle,
        description: localized.contactDescription,
        robots: "index, follow",
        canonicalPath: "/contact",
      };
    case "/privacy":
      return {
        title: localized.privacyTitle,
        description: localized.homeDescription,
        robots: "index, follow",
        canonicalPath: "/privacy",
      };
    case "/terms":
      return {
        title: localized.termsTitle,
        description: localized.homeDescription,
        robots: "index, follow",
        canonicalPath: "/terms",
      };
    case "/instructions":
      return {
        title: localized.instructionsTitle,
        description: localized.homeDescription,
        robots: "index, follow",
        canonicalPath: "/instructions",
      };
    default:
      return {
        title: localized.fallbackTitle,
        description: localized.homeDescription,
        robots: "noindex, nofollow",
        canonicalPath: normalizedPath,
      };
  }
};

const RouteSeo = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  const seoConfig = useMemo(() => getSeoConfig(pathname, language), [pathname, language]);

  useEffect(() => {
    const configuredSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "");
    const siteUrl = configuredSiteUrl || window.location.origin;
    const canonicalUrl = `${siteUrl}${seoConfig.canonicalPath}`;
    const ogImageUrl = `${siteUrl}/og-image.jpeg`;

    document.title = seoConfig.title;
    upsertCanonicalTag(canonicalUrl);
    upsertMetaTag('meta[name="description"]', { name: "description", content: seoConfig.description });
    upsertMetaTag('meta[name="robots"]', { name: "robots", content: seoConfig.robots });
    upsertMetaTag('meta[name="googlebot"]', { name: "googlebot", content: seoConfig.robots });
    upsertMetaTag('meta[property="og:title"]', { property: "og:title", content: seoConfig.title });
    upsertMetaTag('meta[property="og:description"]', { property: "og:description", content: seoConfig.description });
    upsertMetaTag('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMetaTag('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMetaTag('meta[property="og:image"]', { property: "og:image", content: ogImageUrl });
    upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: seoConfig.title });
    upsertMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: seoConfig.description });
    upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: ogImageUrl });
  }, [seoConfig]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
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
