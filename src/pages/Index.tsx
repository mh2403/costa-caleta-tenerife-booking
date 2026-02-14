import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { JourneySection } from '@/components/home/JourneySection';
import { GallerySection } from '@/components/home/GallerySection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { LocationSection } from '@/components/home/LocationSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { useLanguage } from '@/i18n';

const backToHeroLabel = {
  en: 'Back to hero',
  nl: 'Terug naar hero',
  es: 'Volver al hero',
} as const;

const Index = () => {
  const { language } = useLanguage();
  const [showBackToHero, setShowBackToHero] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setShowBackToHero(window.scrollY > window.innerHeight * 0.82);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <button
        type="button"
        aria-label={backToHeroLabel[language]}
        onClick={scrollToHero}
        className={[
          'group fixed left-4 top-24 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/30 bg-primary text-primary-foreground shadow-[0_22px_42px_-20px_hsl(var(--primary)/0.95)] transition-all duration-300 md:left-6 md:top-28',
          showBackToHero ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0',
        ].join(' ')}
      >
        <ArrowUp className="h-5 w-5 motion-safe:animate-[bounce_2.1s_ease-in-out_infinite] transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>
      <main>
        <HeroSection />
        <div className="content-auto">
          <JourneySection />
        </div>
        <GallerySection />
        <div className="content-auto">
          <FacilitiesSection />
        </div>
        <div className="content-auto">
          <LocationSection />
        </div>
        <div className="content-auto">
          <TestimonialsSection />
        </div>
        <div className="content-auto">
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
