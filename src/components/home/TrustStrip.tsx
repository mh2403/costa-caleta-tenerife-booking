import { BedDouble, Mountain, UsersRound, Waves } from 'lucide-react';
import { useLanguage } from '@/i18n';

const icons = [BedDouble, UsersRound, Mountain, Waves];

export function TrustStrip() {
  const { t } = useLanguage();

  return (
    <section aria-label="Apartment highlights" className="relative z-20 -mt-8 px-4 sm:-mt-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-large backdrop-blur md:grid-cols-4">
        {t.hero.highlights.map((highlight, index) => {
          const Icon = icons[index] ?? Waves;

          return (
            <div
              key={highlight}
              className="flex min-w-0 flex-col items-center gap-2 border-b border-border/60 px-2 py-4 text-center last:border-b-0 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:text-left md:border-b-0 md:border-r md:last:border-r-0"
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 break-words text-[13px] font-medium leading-snug text-card-foreground sm:text-sm">
                {highlight}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
