import { useMemo } from 'react';
import { useLanguage } from '@/i18n';
import { MapPin } from 'lucide-react';
import { MapConsentEmbed } from '@/components/MapConsentEmbed';

type ParsedDescriptionBlock =
  | { kind: 'text'; lines: string[] }
  | { kind: 'list'; title: string; items: string[] };

export function LocationSection() {
  const { t } = useLanguage();
  const mapEmbedUrl = 'https://www.google.com/maps?q=C.%20las%20Artes%2C%2024%2C%2038679%20La%20Caleta%2C%20Santa%20Cruz%20de%20Tenerife%2C%20Spanje&z=18&output=embed';
  const mapExternalUrl = 'https://www.google.com/maps?q=C.%20las%20Artes%2C%2024%2C%2038679%20La%20Caleta%2C%20Santa%20Cruz%20de%20Tenerife';
  const parsedDescriptionBlocks = useMemo<ParsedDescriptionBlock[]>(
    () =>
      t.location.description
        .split('\n\n')
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
          const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
          const hasList = lines.some((line) => line.startsWith('-'));

          if (hasList) {
            return {
              kind: 'list' as const,
              title: lines[0],
              items: lines
                .slice(1)
                .map((line) => line.replace(/^-+\s?/, '').trim())
                .filter(Boolean),
            };
          }

          return { kind: 'text' as const, lines };
        }),
    [t.location.description]
  );

  const textBlocks = parsedDescriptionBlocks.filter(
    (block): block is Extract<ParsedDescriptionBlock, { kind: 'text' }> => block.kind === 'text'
  );
  const listBlocks = parsedDescriptionBlocks.filter(
    (block): block is Extract<ParsedDescriptionBlock, { kind: 'list' }> => block.kind === 'list'
  );

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-primary mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                {t.location.region}
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.location.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {t.location.subtitle}
            </p>

            <div className="space-y-4">
              {textBlocks.map((block, index) => (
                <div key={`paragraph-${index}`} className="rounded-2xl border border-border/60 bg-background p-4 md:p-5 shadow-soft">
                  <div className="space-y-3 text-foreground leading-relaxed">
                    {block.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {listBlocks.length > 0 && (
                <div className={`grid gap-4 ${listBlocks.length > 1 ? 'md:grid-cols-2' : ''}`}>
                  {listBlocks.map((block, index) => (
                    <div key={`${block.title}-${index}`} className="rounded-2xl border border-border/60 bg-background p-4 md:p-5 shadow-soft">
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                        {block.title}
                      </h3>
                      <ul className="space-y-2">
                        {block.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-foreground leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/80 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {t.location.highlights.map((item, index) => (
                <div key={index} className="rounded-xl border border-border/60 bg-background p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary w-fit shrink-0">
                    {item.label}
                  </span>
                  <span className="text-foreground font-medium">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col gap-4 md:gap-5">
            <MapConsentEmbed
              className="h-[360px] md:min-h-[420px] md:flex-1"
              title={t.contact.mapEmbedTitle}
              embedUrl={mapEmbedUrl}
              externalUrl={mapExternalUrl}
              consentTitle={t.contact.mapCardTitle}
              consentDescription={t.contact.mapCardDescription}
              loadButtonLabel={t.contact.mapLoadButton}
              externalButtonLabel={t.contact.mapOpenExternal}
            />

            <div className="hidden md:grid md:grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-background p-4 md:p-5 shadow-soft">
              {t.location.highlights.map((item, index) => (
                <div key={index} className="rounded-xl border border-border/60 bg-card p-3 flex flex-col gap-2">
                  <span className="inline-flex items-center justify-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary w-fit">
                    {item.label}
                  </span>
                  <span className="text-foreground font-medium leading-snug">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
