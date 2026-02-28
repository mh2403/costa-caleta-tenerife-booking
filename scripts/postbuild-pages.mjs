import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

const BASE_ROUTES = ['/', '/booking', '/contact', '/privacy', '/terms', '/instructions'];
const LOCALES = ['en', 'nl', 'es'];
const LOCALIZED_PREFIX_LOCALES = ['nl', 'es'];

const siteUrl = (process.env.VITE_SITE_URL || 'https://www.costacaleta.eu').replace(/\/+$/, '');
const lastmod = new Date().toISOString().slice(0, 10);

const normalizePath = (value) => {
  if (!value || value === '/') return '/';
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const buildLocalizedPath = (route, locale) => {
  const normalizedRoute = normalizePath(route);
  if (locale === 'en') return normalizedRoute;
  if (normalizedRoute === '/') return `/${locale}`;
  return `/${locale}${normalizedRoute}`;
};

const routeToDirectory = (route) => {
  const normalized = normalizePath(route);
  if (normalized === '/') return DIST_DIR;
  return path.join(DIST_DIR, normalized.replace(/^\/+/, ''));
};

const ensureRouteHtmlCopies = async () => {
  const indexHtml = await readFile(INDEX_HTML_PATH, 'utf8');
  const deployableRoutes = new Set(BASE_ROUTES);

  BASE_ROUTES.forEach((route) => {
    LOCALIZED_PREFIX_LOCALES.forEach((locale) => {
      deployableRoutes.add(buildLocalizedPath(route, locale));
    });
  });

  await Promise.all(
    Array.from(deployableRoutes)
      .filter((route) => route !== '/')
      .map(async (route) => {
        const routeDir = routeToDirectory(route);
        await mkdir(routeDir, { recursive: true });
        await writeFile(path.join(routeDir, 'index.html'), indexHtml, 'utf8');
      })
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
  const routeEntries = BASE_ROUTES.flatMap((route) => {
    const localizedUrls = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${siteUrl}${buildLocalizedPath(route, locale)}`])
    );

    const alternates = [
      ...LOCALES.map((locale) => ({
        hreflang: locale,
        href: localizedUrls[locale],
      })),
      {
        hreflang: 'x-default',
        href: localizedUrls.en,
      },
    ];

    return LOCALES.map((locale) => {
      const loc = localizedUrls[locale];
      const alternateTags = alternates
        .map(
          ({ hreflang, href }) =>
            `    <xhtml:link rel="alternate" hreflang="${xmlEscape(hreflang)}" href="${xmlEscape(href)}" />`
        )
        .join('\n');

      return [
        '  <url>',
        `    <loc>${xmlEscape(loc)}</loc>`,
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
  const urls = BASE_ROUTES.flatMap((route) =>
    LOCALES.map((locale) => `${siteUrl}${buildLocalizedPath(route, locale)}`)
  );

  const uniqueUrls = Array.from(new Set(urls));
  const textSitemap = `${uniqueUrls.join('\n')}\n`;
  await writeFile(path.join(DIST_DIR, 'sitemap.txt'), textSitemap, 'utf8');
};

const buildRobots = async () => {
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /booking/dossier/',
    'Disallow: /nl/admin/',
    'Disallow: /es/admin/',
    'Disallow: /nl/booking/dossier/',
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
