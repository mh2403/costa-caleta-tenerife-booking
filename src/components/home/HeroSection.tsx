import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';
import heroImage from '@/assets/CostaCaleta/BreakfastView-Pic2-hero.jpeg';

export function HeroSection() {
  const { t } = useLanguage();
  const { data: settings } = useSettings();
  const fromPrice = settings?.base_price?.amount ?? 85;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={t.hero.imageAlt}
          className="w-full h-full object-cover object-[center_60%]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/55 via-foreground/30 to-foreground/75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight text-shadow-hero">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-shadow-hero">
            {t.hero.subtitle}
          </p>

          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-primary-foreground/20">
            <span className="text-primary-foreground/80">{t.hero.fromPrice}</span>
            <span className="text-2xl font-bold text-primary-foreground">€{fromPrice}</span>
            <span className="text-primary-foreground/80">{t.hero.perNight}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/booking">{t.hero.bookNow}</Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <a href="#gallery">{t.hero.checkAvailability}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
