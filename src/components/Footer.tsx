import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { contactInfo } from '@/lib/contactInfo';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">🌴</span>
              <span className="font-heading text-2xl font-semibold">Costa Caleta</span>
            </Link>
            <p className="text-background/75 text-sm leading-relaxed max-w-md">
              {t.hero.subtitle}
            </p>
            <div className="mt-5 inline-flex items-center rounded-full border border-background/25 bg-background/10 px-4 py-2 text-xs text-background/90">
              {t.footer.directBooking}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-background/75 hover:text-background transition-colors">{t.nav.home}</Link>
              <Link to="/booking" className="text-background/75 hover:text-background transition-colors">{t.nav.booking}</Link>
              <Link to="/contact" className="text-background/75 hover:text-background transition-colors">{t.nav.contact}</Link>
              <Link to="/instructions" className="text-background/75 hover:text-background transition-colors">{t.footer.instructions}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t.nav.contact}</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href={`tel:${contactInfo.phone}`} className="inline-flex items-center gap-2 text-background/75 hover:text-background transition-colors">
                <Phone className="h-4 w-4" />
                {contactInfo.phone}
              </a>
              <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 text-background/75 hover:text-background transition-colors">
                <Mail className="h-4 w-4" />
                {contactInfo.email}
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-background/75 hover:text-background transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {t.footer.whatsappLabel}: {contactInfo.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">© {currentYear} Costa Caleta. {t.footer.rights}.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="text-background/60 hover:text-background transition-colors">{t.footer.privacy}</Link>
            <Link to="/terms" className="text-background/60 hover:text-background transition-colors">{t.footer.terms}</Link>
            <Link to="/admin" className="text-background/45 hover:text-background/70 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
