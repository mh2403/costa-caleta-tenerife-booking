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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/booking', label: t.nav.booking },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌴</span>
            <span className={cn(
              'font-heading text-xl font-semibold transition-colors',
              isScrolled ? 'text-foreground' : 'text-foreground'
            )}>
              Costa Caleta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive(link.path)
                    ? 'text-primary'
                    : isScrolled
                    ? 'text-foreground'
                    : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher
              className={cn(
                'transition-colors',
                isScrolled
                  ? 'bg-background/90 border-border text-foreground hover:bg-muted'
                  : 'bg-primary-foreground/10 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/20'
              )}
            />
            <Button asChild variant="hero" size="sm">
              <Link to="/booking">{t.hero.bookNow}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher
              variant="minimal"
              className={cn(
                'transition-colors',
                isScrolled
                  ? 'bg-background/90 text-foreground hover:bg-muted'
                  : 'bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20'
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md shadow-medium animate-fade-in-down">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="hero" className="mt-2">
                <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                  {t.hero.bookNow}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
