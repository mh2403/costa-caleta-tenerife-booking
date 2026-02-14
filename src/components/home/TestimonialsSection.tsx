import { useLanguage } from '@/i18n';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'J.P.',
    rating: 5,
    text: {
      en: 'Nice, calm apartment in La Caleta. Everything was clean, the kitchen had what we needed, and the terrace is great for breakfast.',
      nl: 'Mooi en rustig appartement in La Caleta. Alles was netjes, de keuken had wat we nodig hadden en het terras is fijn voor ontbijt.',
      es: 'Apartamento agradable y tranquilo en La Caleta. Todo estaba limpio, la cocina tenía lo necesario y la terraza es ideal para desayunar.',
    },
  },
  {
    name: 'M.H.',
    rating: 5,
    text: {
      en: 'Good value and smooth communication. Check-in via meet & greet was easy. Handy to have street/lot parking and a shared pool.',
      nl: 'Goede prijs-kwaliteit en vlotte communicatie. Check-in via meet & greet verliep soepel. Handig met parkeren op straat/plein en het gedeelde zwembad.',
      es: 'Buena relación calidad-precio y comunicación fluida. El check-in con meet & greet fue sencillo. Útil tener parking en la calle/plaza y piscina comunitaria.',
    },
  },
  {
    name: 'B.d.S.',
    rating: 5,
    text: {
      en: 'Practical, well-located apartment close to restaurants and the promenade. Sea and mountain views are a nice bonus.',
      nl: 'Praktisch ingericht en goed gelegen, dicht bij restaurants en de promenade. Zee- en bergzicht zijn een mooie extra.',
      es: 'Apartamento práctico y bien ubicado, cerca de restaurantes y del paseo. Las vistas al mar y a la montaña son un plus.',
    },
  },
];

export function TestimonialsSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-medium"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-sunset opacity-80" />
              <Quote className="mb-4 h-8 w-8 text-primary/25" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary/25 text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text[language]}"
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <span className="font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
