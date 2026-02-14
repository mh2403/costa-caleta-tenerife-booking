import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { contactInfo } from '@/lib/contactInfo';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg?v=20260214b`;

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-foreground text-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-6 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.9fr_1fr]">
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-3">
              <img src={logoUrl} alt="Costa Caleta" className="h-8 w-8 rounded-full border border-background/20" />
              <span className="font-heading text-2xl font-semibold">Costa Caleta</span>
            </Link>
            <p className="text-background/75 text-sm leading-relaxed max-w-md">
              {t.hero.subtitle}
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-background/75 transition-colors hover:text-background">{t.nav.home}</Link>
              <Link to="/booking" className="text-background/75 transition-colors hover:text-background">{t.nav.booking}</Link>
              <Link to="/contact" className="text-background/75 transition-colors hover:text-background">{t.nav.contact}</Link>
              <Link to="/instructions" className="text-background/75 transition-colors hover:text-background">{t.footer.instructions}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t.nav.contact}</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-background/20 bg-background/5 px-3 py-2 text-background/80 transition-colors hover:border-background/35 hover:text-background"
              >
                <Phone className="h-4 w-4" />
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-background/20 bg-background/5 px-3 py-2 text-background/80 transition-colors hover:border-background/35 hover:text-background"
              >
                <Mail className="h-4 w-4" />
                {contactInfo.email}
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-background/20 bg-background/5 px-3 py-2 text-background/80 transition-colors hover:border-background/35 hover:text-background"
              >
                <MessageCircle className="h-4 w-4" />
                {t.footer.whatsappLabel}: {contactInfo.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-background/20 pt-7 md:flex-row">
          <p className="text-background/60 text-sm">© {currentYear} Costa Caleta. {t.footer.rights}.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="text-background/60 transition-colors hover:text-background">{t.footer.privacy}</Link>
            <Link to="/terms" className="text-background/60 transition-colors hover:text-background">{t.footer.terms}</Link>
            <Link to="/admin" className="text-background/45 transition-colors hover:text-background/70">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
