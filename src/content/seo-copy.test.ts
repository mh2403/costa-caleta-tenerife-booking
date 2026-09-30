import seoCopy from './seo-copy.json';

const locales = ['nl', 'en', 'es'] as const;
const commercialRoutes = ['/', '/booking', '/contact', '/appartement-la-caleta', '/la-caleta-tenerife'] as const;
const accommodationRoutes = ['/', '/booking', '/appartement-la-caleta'] as const;
const utilityRoutes = ['/privacy', '/terms', '/instructions'] as const;

describe('SEO copy coverage', () => {
  it('keeps every commercial route complete in all supported languages', () => {
    for (const locale of locales) {
      for (const route of commercialRoutes) {
        const metadata = seoCopy[locale][route];

        expect(metadata.indexable).toBe(true);
        expect(metadata.title.length).toBeGreaterThanOrEqual(30);
        expect(metadata.title.length).toBeLessThanOrEqual(60);
        expect(metadata.description.length).toBeGreaterThanOrEqual(120);
        expect(metadata.description.length).toBeLessThanOrEqual(170);
      }
    }
  });

  it('keeps legal and guest-information routes out of the index', () => {
    for (const locale of locales) {
      for (const route of utilityRoutes) {
        expect(seoCopy[locale][route].indexable).toBe(false);
      }
    }
  });

  it('states the actual accommodation capacity consistently', () => {
    const capacityPhrase = {
      nl: 'tot 2 personen',
      en: 'up to 2 people',
      es: 'hasta 2 personas',
    } as const;

    for (const locale of locales) {
      for (const route of accommodationRoutes) {
        expect(seoCopy[locale][route].description.toLowerCase()).toContain(capacityPhrase[locale]);
      }
    }
  });
});
