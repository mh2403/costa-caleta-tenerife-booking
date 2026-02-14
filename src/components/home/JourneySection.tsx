import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck2, KeyRound, MessageSquareMore } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';

const stepIcons = [CalendarCheck2, MessageSquareMore, KeyRound];

export function JourneySection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-8 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-6 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-soft md:p-8">
            <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {t.journey.eyebrow}
            </span>

            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t.journey.title}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.journey.subtitle}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/booking" className="inline-flex items-center gap-2">
                  {t.journey.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/contact">{t.journey.secondaryCta}</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {t.journey.steps.map((step, index) => {
              const Icon = stepIcons[index] ?? KeyRound;
              const stepNumber = String(index + 1).padStart(2, '0');

              return (
                <article
                  key={step.title}
                  className="group rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-medium md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                      {stepNumber}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="mt-2 pl-11 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
