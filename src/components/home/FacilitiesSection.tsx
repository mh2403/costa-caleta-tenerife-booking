import { useLanguage } from '@/i18n';
import {
  Wifi,
  ChefHat,
  Wind,
  WashingMachine,
  Tv,
  Home,
  Car,
  Waves,
  Umbrella,
  Bath,
} from 'lucide-react';

const facilityIcons = {
  wifi: Wifi,
  kitchen: ChefHat,
  aircon: Wind,
  washing: WashingMachine,
  tv: Tv,
  balcony: Home,
  parking: Car,
  pool: Waves,
  beach: Umbrella,
  towels: Bath,
};

type FacilityKey = keyof typeof facilityIcons;

export function FacilitiesSection() {
  const { t } = useLanguage();

  const facilities: { key: FacilityKey; label: string }[] = [
    { key: 'wifi', label: t.facilities.wifi },
    { key: 'tv', label: t.facilities.tv },
    { key: 'kitchen', label: t.facilities.kitchen },
    { key: 'aircon', label: t.facilities.aircon },
    { key: 'washing', label: t.facilities.washing },
    { key: 'balcony', label: t.facilities.balcony },
    { key: 'pool', label: t.facilities.pool },
    { key: 'towels', label: t.facilities.towels },
    { key: 'parking', label: t.facilities.parking },
    { key: 'beach', label: t.facilities.beach },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-warm py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute -top-20 left-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t.facilities.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.facilities.subtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {facilities.map((facility, index) => {
              const Icon = facilityIcons[facility.key];
              return (
                <article
                  key={facility.key}
                  className="group rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition-all duration-300 hover:border-primary/30 hover:shadow-medium"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/12 transition-colors group-hover:bg-primary/18">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="pt-1 text-sm font-medium leading-relaxed text-foreground md:text-base">
                      {facility.label}
                    </p>
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
