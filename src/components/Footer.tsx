import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/i18n';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Placeholder contact info - admin can customize
  const contactInfo = {
    phone: '+34 600 123 456',
    email: 'hello@casatenerife.com',
    whatsapp: '34600123456',
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌴</span>
              <span className="font-heading text-xl font-semibold">
                Costa Caleta
              </span>
            </Link>
            <p className="text-background/70 text-sm">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-background/70 hover:text-background transition-colors text-sm">
                {t.nav.home}
              </Link>
              <Link to="/booking" className="text-background/70 hover:text-background transition-colors text-sm">
                {t.nav.booking}
              </Link>
              <Link to="/contact" className="text-background/70 hover:text-background transition-colors text-sm">
                {t.nav.contact}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t.nav.contact}</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                {contactInfo.email}
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                {t.contact.whatsapp}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {currentYear} Costa Caleta. {t.footer.rights}.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-background/60 hover:text-background text-sm transition-colors">
              {t.footer.privacy}
            </Link>
            <Link to="/terms" className="text-background/60 hover:text-background text-sm transition-colors">
              {t.footer.terms}
            </Link>
            <Link to="/admin" className="text-background/40 hover:text-background/70 text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
