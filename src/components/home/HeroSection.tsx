import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-tenerife.jpg';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury apartment terrace with ocean view in Tenerife"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Price Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-primary-foreground/20">
            <span className="text-primary-foreground/80">{t.hero.fromPrice}</span>
            <span className="text-2xl font-bold text-primary-foreground">€80</span>
            <span className="text-primary-foreground/80">{t.hero.perNight}</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/booking">{t.hero.bookNow}</Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <a href="#gallery">{t.hero.checkAvailability}</a>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
