import type { ReactNode } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import type { SeoPageCopy } from '@/content/seo-pages';

type SeoPageShellProps = {
  copy: SeoPageCopy;
  children?: ReactNode;
  secondaryPath?: string;
};

export function SeoPageShell({ copy, secondaryPath = '/booking' }: SeoPageShellProps) {
  const localizedPath = useLocalizedPath();

  return (
    <div className="min-h-screen bg-card">
      <Header />
      <main className="pt-24 md:pt-28">
        <section className="relative overflow-hidden bg-gradient-warm py-14 md:py-20">
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>{copy.eyebrow}</span>
              </div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
                {copy.title}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {copy.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {copy.sections.map((section) => (
                <article key={section.title} className="rounded-3xl border border-border/70 bg-background p-6 shadow-soft md:p-8">
                  <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-5 space-y-3 text-foreground">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 leading-relaxed">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] bg-gradient-sunset p-7 text-center text-primary-foreground shadow-large md:p-10">
              <h2 className="font-heading text-3xl font-bold md:text-4xl">{copy.ctaTitle}</h2>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
                  <Link to={localizedPath('/booking')} className="flex items-center justify-center gap-2">
                    {copy.ctaLabel}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="lg" className="rounded-full border-primary-foreground/70">
                  <Link to={localizedPath(secondaryPath)}>{copy.secondaryLabel}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
