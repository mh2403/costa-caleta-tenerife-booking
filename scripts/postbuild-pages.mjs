import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

const BASE_ROUTES = [
  '/',
  '/booking',
  '/contact',
  '/appartement-la-caleta',
  '/la-caleta-tenerife',
  '/privacy',
  '/terms',
  '/instructions',
];
const LOCALES = ['nl', 'en', 'es'];

const siteUrl = (process.env.VITE_SITE_URL || 'https://www.costacaleta.eu').replace(/\/+$/, '');
const lastmod = new Date().toISOString().slice(0, 10);

const SEO_COPY = JSON.parse(
  await readFile(path.resolve(process.cwd(), 'src/content/seo-copy.json'), 'utf8'),
);

const normalizePath = (value) => {
  if (!value || value === '/') return '/';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const buildLocalizedPath = (route, locale) => {
  const normalizedRoute = normalizePath(route);
  if (locale === 'nl') return normalizedRoute;
  if (normalizedRoute === '/') return `/${locale}`;
  return `/${locale}${normalizedRoute}`;
};

const routeToDirectory = (route) => {
  const normalized = normalizePath(route);
  if (normalized === '/') return DIST_DIR;
  return path.join(DIST_DIR, normalized.replace(/^\/+/, ''));
};

const htmlEscape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const replaceOrInsert = (html, matcher, replacement) => {
  if (matcher.test(html)) return html.replace(matcher, replacement);
  return html.replace('</head>', `    ${replacement}\n  </head>`);
};

const routeMeta = (route, locale) => SEO_COPY[locale][normalizePath(route)] || SEO_COPY[locale]['/'];

const buildStaticSeoHtml = (indexHtml, route, locale) => {
  const normalizedRoute = normalizePath(route);
  const meta = routeMeta(normalizedRoute, locale);
  const canonicalPath = buildLocalizedPath(normalizedRoute, locale);
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const ogLocale = { nl: 'nl_NL', en: 'en_GB', es: 'es_ES' }[locale];
  const alternateTags = meta.indexable
    ? [
        ...LOCALES.map(
          (alternateLocale) =>
            `    <link rel="alternate" hreflang="${alternateLocale}" href="${htmlEscape(`${siteUrl}${buildLocalizedPath(normalizedRoute, alternateLocale)}`)}" data-route-seo="alternate" />`,
        ),
        `    <link rel="alternate" hreflang="x-default" href="${htmlEscape(`${siteUrl}${buildLocalizedPath(normalizedRoute, 'nl')}`)}" data-route-seo="alternate" />`,
      ].join('\n')
    : '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LodgingBusiness',
        name: 'Costa Caleta Tenerife',
        url: canonicalUrl,
        image: `${siteUrl}/og-image.jpeg`,
        inLanguage: locale,
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
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        url: canonicalUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'es' ? 'Inicio' : 'Home',
            item: `${siteUrl}${buildLocalizedPath('/', locale)}`,
          },
          ...(normalizedRoute === '/'
            ? []
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: meta.title,
                  item: canonicalUrl,
                },
              ]),
        ],
      },
    ],
  };
  const jsonLdScript = meta.indexable
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
    : '';

  let html = indexHtml;
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${locale}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlEscape(meta.title)}</title>`);
  html = replaceOrInsert(html, /<meta\s+name="description"[^>]*\/?\s*>/i, `<meta name="description" content="${htmlEscape(meta.description)}" />`);
  const robots = meta.indexable ? 'index, follow' : 'noindex, nofollow, noarchive';
  html = replaceOrInsert(html, /<meta\s+name="robots"[^>]*\/?\s*>/i, `<meta name="robots" content="${robots}" />`);
  html = replaceOrInsert(html, /<meta\s+name="googlebot"[^>]*\/?\s*>/i, `<meta name="googlebot" content="${robots}" />`);
  html = replaceOrInsert(html, /<link\s+rel="canonical"[^>]*\/?\s*>/i, `<link rel="canonical" href="${htmlEscape(canonicalUrl)}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:title"[^>]*\/?\s*>/i, `<meta property="og:title" content="${htmlEscape(meta.title)}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:description"[^>]*\/?\s*>/i, `<meta property="og:description" content="${htmlEscape(meta.description)}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:url"[^>]*\/?\s*>/i, `<meta property="og:url" content="${htmlEscape(canonicalUrl)}" />`);
  html = replaceOrInsert(html, /<meta\s+property="og:locale"[^>]*\/?\s*>/i, `<meta property="og:locale" content="${ogLocale}" />`);
  html = replaceOrInsert(html, /<meta\s+name="twitter:title"[^>]*\/?\s*>/i, `<meta name="twitter:title" content="${htmlEscape(meta.title)}" />`);
  html = replaceOrInsert(html, /<meta\s+name="twitter:description"[^>]*\/?\s*>/i, `<meta name="twitter:description" content="${htmlEscape(meta.description)}" />`);
  html = html.replace(/\s*<link\s+rel="alternate"[^>]*data-route-seo="alternate"[^>]*\/?\s*>/gi, '');
  html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdScript);
  html = html.replace('</head>', `${alternateTags}\n  </head>`);

  return html;
};

const ensureRouteHtmlCopies = async () => {
  const indexHtml = await readFile(INDEX_HTML_PATH, 'utf8');
  await writeFile(INDEX_HTML_PATH, buildStaticSeoHtml(indexHtml, '/', 'nl'), 'utf8');

  const deployableRoutes = LOCALES.flatMap((locale) =>
    BASE_ROUTES.map((route) => ({ route: buildLocalizedPath(route, locale), sourceRoute: route, locale })),
  );

  await Promise.all(
    deployableRoutes
      .filter(({ route }) => route !== '/')
      .map(async ({ route, sourceRoute, locale }) => {
        const routeDir = routeToDirectory(route);
        await mkdir(routeDir, { recursive: true });
        await writeFile(path.join(routeDir, 'index.html'), buildStaticSeoHtml(indexHtml, sourceRoute, locale), 'utf8');
      }),
  );
};

const xmlEscape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildSitemap = async () => {
  const indexableRoutes = BASE_ROUTES.filter((route) => SEO_COPY.nl[route]?.indexable);
  const routeEntries = indexableRoutes.flatMap((route) => {
    const localizedUrls = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${siteUrl}${buildLocalizedPath(route, locale)}`]),
    );
    const alternates = [
      ...LOCALES.map((locale) => ({ hreflang: locale, href: localizedUrls[locale] })),
      { hreflang: 'x-default', href: localizedUrls.nl },
    ];

    return LOCALES.map((locale) => {
      const alternateTags = alternates
        .map(
          ({ hreflang, href }) =>
            `    <xhtml:link rel="alternate" hreflang="${xmlEscape(hreflang)}" href="${xmlEscape(href)}" />`,
        )
        .join('\n');

      return [
        '  <url>',
        `    <loc>${xmlEscape(localizedUrls[locale])}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        alternateTags,
        '  </url>',
      ].join('\n');
    });
  });

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    routeEntries.join('\n'),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
};

const buildTextSitemap = async () => {
  const indexableRoutes = BASE_ROUTES.filter((route) => SEO_COPY.nl[route]?.indexable);
  const urls = indexableRoutes.flatMap((route) =>
    LOCALES.map((locale) => `${siteUrl}${buildLocalizedPath(route, locale)}`),
  );
  await writeFile(path.join(DIST_DIR, 'sitemap.txt'), `${Array.from(new Set(urls)).join('\n')}\n`, 'utf8');
};

const buildRobots = async () => {
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /booking/dossier/',
    'Disallow: /en/admin/',
    'Disallow: /es/admin/',
    'Disallow: /en/booking/dossier/',
    'Disallow: /es/booking/dossier/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Sitemap: ${siteUrl}/sitemap.txt`,
    '',
  ].join('\n');

  await writeFile(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
};

const run = async () => {
  await ensureRouteHtmlCopies();
  await buildSitemap();
  await buildTextSitemap();
  await buildRobots();
};

run().catch((error) => {
  console.error('[postbuild-pages] Failed:', error);
  process.exit(1);
});
