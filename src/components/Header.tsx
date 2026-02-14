import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isHomeHero = location.pathname === '/' && !isScrolled;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/booking', label: t.nav.booking },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="fixed left-0 right-0 top-3 z-50 px-3 md:top-4 md:px-4">
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            'relative rounded-2xl border px-4 transition-all duration-300 md:px-6',
            isHomeHero
              ? 'border-primary-foreground/30 bg-foreground/28 backdrop-blur-2xl shadow-[0_16px_45px_-18px_rgba(0,0,0,0.7)]'
              : 'border-border/80 bg-card/92 backdrop-blur-2xl shadow-medium'
          )}
        >
          <nav className="flex h-14 items-center justify-between md:h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logoUrl}
                alt="Costa Caleta"
                className="h-8 w-8 rounded-full border border-primary-foreground/20 shadow-soft"
              />
              <span
                className={cn(
                  'font-heading text-lg font-semibold tracking-tight transition-colors md:text-xl',
                  isHomeHero ? 'text-primary-foreground' : 'text-foreground'
                )}
              >
                Costa Caleta
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                    isActive(link.path)
                      ? isHomeHero
                        ? 'bg-primary-foreground/18 text-primary-foreground shadow-inner'
                        : 'border border-primary/20 bg-primary/12 text-primary'
                      : isHomeHero
                      ? 'text-primary-foreground/85 hover:bg-primary-foreground/12 hover:text-primary-foreground'
                      : 'text-foreground/80 hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <LanguageSwitcher
                className={cn(
                  'ml-2 transition-colors',
                  isHomeHero
                    ? 'border-primary-foreground/45 bg-primary-foreground/12 text-primary-foreground hover:bg-primary-foreground/22'
                    : 'border-border bg-background/90 text-foreground hover:bg-muted'
                )}
              />

              <Button asChild variant={isHomeHero ? 'heroOutline' : 'hero'} size="sm" className="ml-2 rounded-full px-5">
                <Link to="/booking">{t.hero.bookNow}</Link>
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher
                variant="minimal"
                className={cn(
                  'transition-colors',
                  isHomeHero
                    ? 'bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20'
                    : 'bg-background/90 text-foreground hover:bg-muted'
                )}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  'rounded-full',
                  isHomeHero
                    ? 'text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground'
                    : 'text-foreground'
                )}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>

          {mobileMenuOpen && (
            <div className="md:hidden pb-3 animate-fade-in-down">
              <div className="rounded-xl border border-border/75 bg-card/92 p-2 shadow-soft">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild variant="hero" className="mt-2 w-full">
                  <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                    {t.hero.bookNow}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
