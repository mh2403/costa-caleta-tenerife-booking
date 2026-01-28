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
    { key: 'kitchen', label: t.facilities.kitchen },
    { key: 'aircon', label: t.facilities.aircon },
    { key: 'washing', label: t.facilities.washing },
    { key: 'tv', label: t.facilities.tv },
    { key: 'balcony', label: t.facilities.balcony },
    { key: 'parking', label: t.facilities.parking },
    { key: 'pool', label: t.facilities.pool },
    { key: 'beach', label: t.facilities.beach },
    { key: 'towels', label: t.facilities.towels },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.facilities.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.facilities.subtitle}
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {facilities.map((facility, index) => {
            const Icon = facilityIcons[facility.key];
            return (
              <div
                key={facility.key}
                className="flex flex-col items-center p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {facility.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
