import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';
import heroImage from '@/assets/CostaCaleta/BreakfastView-Pic2-hero.jpeg';

export function HeroSection() {
  const { t } = useLanguage();
  const { data: settings } = useSettings();
  const fromPrice = settings?.base_price?.amount ?? 85;
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

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

      <div className="relative z-10 container mx-auto px-4 pb-10 pt-24 md:pt-28">
        <div className="mx-auto max-w-4xl animate-fade-in-up">
          <div className="rounded-[2rem] border border-primary-foreground/28 bg-foreground/34 px-6 py-8 text-center shadow-[0_24px_64px_-24px_rgba(0,0,0,0.62)] md:px-10 md:py-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/95">
              <img src={logoUrl} alt="" aria-hidden="true" className="h-4 w-4 rounded-full" />
              <span>{t.cta.eyebrow}</span>
            </div>

            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-primary-foreground text-shadow-hero md:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90 text-shadow-hero md:text-xl">
              {t.hero.subtitle}
            </p>

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/12 px-6 py-3">
              <span className="text-primary-foreground/80">{t.hero.fromPrice}</span>
              <span className="text-2xl font-bold text-primary-foreground">€{fromPrice}</span>
              <span className="text-primary-foreground/80">{t.hero.perNight}</span>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="hero" size="xl" className="rounded-full">
                <Link to="/booking">{t.hero.bookNow}</Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl" className="rounded-full">
                <a href="#gallery">{t.hero.checkAvailability}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
