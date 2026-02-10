import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import balconyMorningImage from '@/assets/CostaCaleta/BalconyView-Pic1.JPG';
import balconyBreakfastImage from '@/assets/CostaCaleta/BalconyView-pic4.jpg';
import balconyMountainBreakfastImage from '@/assets/CostaCaleta/BalconyView-pic5.jpg';
import bedroomImage from '@/assets/CostaCaleta/Bedroom-pic1.JPG';
import livingroomImage from '@/assets/CostaCaleta/Livingroom-pic1.JPG';
import livingroomAltImage from '@/assets/CostaCaleta/Livingroom-pic2.jpg';
import bathroomImage from '@/assets/CostaCaleta/Bathroom-pic1.JPG';
import bathroomAltImage from '@/assets/CostaCaleta/Bathroom-pic2.JPG';
import diningImage from '@/assets/CostaCaleta/DinnerTable-pic1.JPG';
import poolImage from '@/assets/CostaCaleta/Pool-pic3.jpg';
import poolAltImage from '@/assets/CostaCaleta/Pool-pic1.JPG';
import poolsideImage from '@/assets/CostaCaleta/Poolside-pic2-crop.jpg';
import poolsideSunsetImage from '@/assets/CostaCaleta/Poolside-pic3.jpg';
import sunsetBeachImage from '@/assets/CostaCaleta/Nature-pic13.jpg';
import coastalViewImage from '@/assets/CostaCaleta/Nature-pic3.JPG';
import roadImage from '@/assets/CostaCaleta/TenerifeRoad-pic1.jpg';

const images = [
  // Apartment photos
  { src: balconyMorningImage, alt: 'Balcony breakfast setup' },
  { src: balconyBreakfastImage, alt: 'Breakfast table on the terrace' },
  { src: balconyMountainBreakfastImage, alt: 'Breakfast with mountain view' },
  { src: bedroomImage, alt: 'Bedroom' },
  { src: livingroomImage, alt: 'Living room and kitchen' },
  { src: livingroomAltImage, alt: 'Living room view from the terrace' },
  { src: bathroomImage, alt: 'Bathroom with vanity' },
  { src: bathroomAltImage, alt: 'Bathroom with shower' },
  { src: diningImage, alt: 'Dining area' },
  { src: poolImage, alt: 'Pool' },
  { src: poolAltImage, alt: 'Pool view' },
  { src: poolsideImage, alt: 'Poolside at the residence' },
  { src: poolsideSunsetImage, alt: 'Pool terrace at sunset' },
  // Tenerife atmosphere photos
  { src: sunsetBeachImage, alt: 'Sunset at the beach' },
  { src: coastalViewImage, alt: 'Coastline view of Tenerife' },
  { src: roadImage, alt: 'Scenic road in Tenerife' },
];

export function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? 'h-[400px] md:h-[500px]' : 'h-48 md:h-60'
                }`}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain animate-scale-in"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary-foreground'
                    : 'bg-primary-foreground/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
