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

  const normalizePath = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);
  const isActive = (path: string) => normalizePath(location.pathname) === normalizePath(path);
  const isHomeHero = location.pathname === '/' && !isScrolled;
  const useHeroHeaderStyle = isHomeHero && !mobileMenuOpen;

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
            useHeroHeaderStyle
              ? 'border-primary-foreground/30 bg-foreground/55 md:bg-foreground/28 md:backdrop-blur-2xl shadow-[0_16px_45px_-18px_rgba(0,0,0,0.7)]'
              : 'border-border/80 bg-card md:bg-card/92 md:backdrop-blur-2xl shadow-medium'
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
                  useHeroHeaderStyle ? 'text-primary-foreground' : 'text-foreground'
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
                    'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                    isActive(link.path)
                      ? useHeroHeaderStyle
                        ? 'border-primary/80 bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_hsl(var(--primary)/0.9)]'
                        : 'border-primary/60 bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_hsl(var(--primary)/0.78)]'
                      : useHeroHeaderStyle
                      ? 'border-transparent text-primary-foreground/85 hover:border-primary-foreground/25 hover:bg-primary-foreground/12 hover:text-primary-foreground'
                      : 'border-transparent text-foreground/80 hover:border-border hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <LanguageSwitcher
                className={cn(
                  'ml-2 transition-colors',
                  useHeroHeaderStyle
                    ? 'border-primary-foreground/45 bg-primary-foreground/12 text-primary-foreground hover:bg-primary-foreground/22'
                    : 'border-border bg-background/90 text-foreground hover:bg-muted'
                )}
              />

              <Button asChild variant={useHeroHeaderStyle ? 'heroOutline' : 'hero'} size="sm" className="ml-2 rounded-full px-5">
                <Link to="/booking">{t.hero.bookNow}</Link>
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher
                variant="minimal"
                className={cn(
                  'transition-colors',
                  useHeroHeaderStyle
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
                  useHeroHeaderStyle
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
              <div className="rounded-xl border border-border/75 bg-card p-2 shadow-soft">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive(link.path)
                        ? 'border border-primary/45 bg-primary/14 font-semibold text-primary'
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
