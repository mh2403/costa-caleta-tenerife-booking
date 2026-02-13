import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const { t } = useLanguage();
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

  return (
    <section className="relative overflow-hidden py-14 md:py-20 bg-gradient-sunset text-primary-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-foreground/20 blur-3xl" />
        <div className="absolute bottom-0 -left-12 h-60 w-60 rounded-full bg-foreground/20 blur-3xl" />
        <div className="absolute top-1/3 -right-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-3xl rounded-[1.75rem] border border-primary-foreground/25 bg-foreground/20 px-5 py-7 md:px-8 md:py-9 text-center backdrop-blur-xl shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/95 mb-4">
            <img
              src={logoUrl}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 rounded-full object-cover"
            />
            <span>{t.cta.eyebrow}</span>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-balance">
            {t.cta.title}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="min-w-[190px] rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90 shadow-large"
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
              className="min-w-[190px] rounded-full border-primary-foreground/70 bg-primary-foreground/5 hover:bg-primary-foreground/15"
            >
              <Link to="/contact">{t.nav.contact}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
