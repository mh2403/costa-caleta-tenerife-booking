import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Reveal } from '@/components/home/Reveal';
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
          'group fixed bottom-5 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/30 bg-primary text-primary-foreground shadow-[0_22px_42px_-20px_hsl(var(--primary)/0.95)] transition-all duration-300 md:bottom-6 md:right-6',
          showBackToHero ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        ].join(' ')}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
      <main>
        <HeroSection />
        <TrustStrip />
        <Reveal className="content-auto">
          <JourneySection />
        </Reveal>
        <Reveal>
          <GallerySection />
        </Reveal>
        <Reveal className="content-auto">
          <FacilitiesSection />
        </Reveal>
        <Reveal className="content-auto">
          <LocationSection />
        </Reveal>
        <Reveal className="content-auto">
          <TestimonialsSection />
        </Reveal>
        <Reveal className="content-auto">
          <CTASection />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
