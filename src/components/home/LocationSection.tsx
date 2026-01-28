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
                Tenerife, Canary Islands
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.location.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {t.location.subtitle}
            </p>
            <p className="text-foreground leading-relaxed">
              {t.location.description}
            </p>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: '5 min', desc: 'Beach' },
                { label: '10 min', desc: 'Restaurants' },
                { label: '15 min', desc: 'Airport' },
                { label: '30 min', desc: 'Mount Teide' },
              ].map((item, index) => (
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
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive map coming soon
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Costa Adeje, Tenerife
                </p>
              </div>
            </div>
            {/* When you have a Google Maps API key, replace with actual map */}
          </div>
        </div>
      </div>
    </section>
  );
}
