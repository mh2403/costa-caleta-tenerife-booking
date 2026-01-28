import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-gradient-sunset text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          Ready for Your Tenerife Escape?
        </h2>
        <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
          Book directly with us for the best rates. No hidden fees, no middlemen — just your perfect vacation home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="heroOutline" size="xl">
            <Link to="/booking" className="flex items-center gap-2">
              {t.hero.bookNow}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="xl" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/contact">{t.nav.contact}</Link>
          </Button>
        </div>

        {/* Price reminder */}
        <div className="mt-8 inline-flex items-center gap-2 text-primary-foreground/80">
          <span>{t.hero.fromPrice}</span>
          <span className="text-2xl font-bold">€80</span>
          <span>{t.hero.perNight}</span>
        </div>
      </div>
    </section>
  );
}
