import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const { t } = useLanguage();
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

  return (
    <section className="relative overflow-hidden bg-gradient-sunset py-14 text-primary-foreground md:py-20">
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-foreground/18 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-3xl rounded-[1.9rem] border border-primary-foreground/28 bg-foreground/22 px-5 py-7 text-center shadow-[0_24px_62px_-26px_rgba(0,0,0,0.6)] md:px-8 md:py-9 md:backdrop-blur-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/95">
            <img
              src={logoUrl}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 rounded-full object-cover"
            />
            <span>{t.cta.eyebrow}</span>
          </div>

          <h2 className="mb-6 font-heading text-3xl font-bold text-balance md:text-4xl">
            {t.cta.title}
          </h2>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[190px] rounded-full bg-primary-foreground text-foreground shadow-large hover:bg-primary-foreground/90"
            >
              <Link to="/booking" className="flex items-center justify-center gap-2">
                {t.hero.bookNow}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="heroOutline"
              size="lg"
              className="min-w-[190px] rounded-full border-primary-foreground/70 bg-primary-foreground/6 hover:bg-primary-foreground/16"
            >
              <Link to="/contact">{t.nav.contact}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
