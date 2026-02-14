import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { JourneySection } from '@/components/home/JourneySection';
import { GallerySection } from '@/components/home/GallerySection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { LocationSection } from '@/components/home/LocationSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <div className="content-auto">
          <JourneySection />
        </div>
        <div className="content-auto">
          <GallerySection />
        </div>
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
