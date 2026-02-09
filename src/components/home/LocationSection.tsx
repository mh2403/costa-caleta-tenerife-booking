import { useLanguage } from '@/i18n';
import { MapPin } from 'lucide-react';

export function LocationSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-2 text-primary mb-4">
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
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {t.location.description}
            </p>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {t.location.highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-secondary">{item.label}</span>
                  </div>
                  <span className="text-foreground font-medium">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-medium">
            <iframe
              title="Costa Caleta map"
              src="https://www.google.com/maps?q=C.%20las%20Artes%2C%2024%2C%2038679%20La%20Caleta%2C%20Santa%20Cruz%20de%20Tenerife%2C%20Spanje&z=18&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
