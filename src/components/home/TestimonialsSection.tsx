import { useLanguage } from '@/i18n';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sophie van den Berg',
    location: 'Amsterdam, NL',
    rating: 5,
    text: {
      en: 'Absolutely stunning apartment with breathtaking views. The direct booking was so easy and personal. Will definitely return!',
      nl: 'Absoluut prachtig appartement met adembenemend uitzicht. Direct boeken was zo makkelijk en persoonlijk. Komen zeker terug!',
      es: 'Apartamento absolutamente impresionante con vistas impresionantes. La reserva directa fue muy fácil y personal. ¡Volveremos!',
      fr: 'Appartement absolument magnifique avec des vues à couper le souffle. La réservation directe était si facile et personnelle. On reviendra !',
    },
  },
  {
    name: 'James & Emma Wilson',
    location: 'London, UK',
    rating: 5,
    text: {
      en: 'Perfect holiday escape! The apartment was spotless, and the hosts were incredibly helpful. The terrace views at sunset are unforgettable.',
      nl: 'Perfecte vakantie-escape! Het appartement was brandschoon en de hosts waren ongelooflijk behulpzaam. Het uitzicht vanaf het terras bij zonsondergang is onvergetelijk.',
      es: 'Escapada de vacaciones perfecta. El apartamento estaba impecable y los anfitriones fueron increíblemente serviciales. Las vistas de la terraza al atardecer son inolvidables.',
      fr: 'Parfaite escapade de vacances ! L\'appartement était impeccable et les hôtes incroyablement serviables. Les vues de la terrasse au coucher du soleil sont inoubliables.',
    },
  },
  {
    name: 'Marie Dupont',
    location: 'Paris, FR',
    rating: 5,
    text: {
      en: 'A hidden gem in Tenerife! We loved every moment of our stay. The apartment has everything you need and more. Highly recommended!',
      nl: 'Een verborgen parel op Tenerife! We genoten van elk moment van ons verblijf. Het appartement heeft alles wat je nodig hebt en meer. Sterk aanbevolen!',
      es: '¡Una joya escondida en Tenerife! Disfrutamos cada momento de nuestra estancia. El apartamento tiene todo lo que necesitas y más. ¡Muy recomendable!',
      fr: 'Un joyau caché à Tenerife ! Nous avons adoré chaque instant de notre séjour. L\'appartement a tout ce dont vous avez besoin et plus encore. Hautement recommandé !',
    },
  },
];

export function TestimonialsSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text[language]}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
