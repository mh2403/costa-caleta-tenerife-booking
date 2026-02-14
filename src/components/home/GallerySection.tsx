import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n';
import balconyMorningImage from '@/assets/CostaCaleta/BalconyView-Pic1.JPG';
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

type GalleryCategory = 'all' | 'apartment' | 'tenerife';

type GalleryImage = {
  src: string;
  category: Exclude<GalleryCategory, 'all'>;
};

const INITIAL_IMAGE_COUNT = 8;

const images: GalleryImage[] = [
  { src: balconyMorningImage, category: 'apartment' },
  { src: balconyMountainBreakfastImage, category: 'apartment' },
  { src: bedroomImage, category: 'apartment' },
  { src: livingroomImage, category: 'apartment' },
  { src: livingroomAltImage, category: 'apartment' },
  { src: bathroomImage, category: 'apartment' },
  { src: bathroomAltImage, category: 'apartment' },
  { src: diningImage, category: 'apartment' },
  { src: poolImage, category: 'apartment' },
  { src: poolAltImage, category: 'apartment' },
  { src: poolsideImage, category: 'apartment' },
  { src: poolsideSunsetImage, category: 'apartment' },
  { src: sunsetBeachImage, category: 'tenerife' },
  { src: coastalViewImage, category: 'tenerife' },
  { src: roadImage, category: 'tenerife' },
];

export function GallerySection() {
  const { t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_IMAGE_COUNT);

  const categoryLabels: Record<GalleryCategory, string> = {
    all: t.gallery.filterAll,
    apartment: t.gallery.filterApartment,
    tenerife: t.gallery.filterTenerife,
  };

  const visibleImages = useMemo(() => {
    if (category === 'all') return images;
    return images.filter((image) => image.category === category);
  }, [category]);

  const displayedImages = useMemo(
    () => visibleImages.slice(0, visibleCount),
    [visibleImages, visibleCount]
  );

  const canLoadMore = visibleCount < visibleImages.length;

  const getAltText = (index: number) =>
    t.gallery.imageAlts[index] ?? `Gallery image ${index + 1}`;

  useEffect(() => {
    setCurrentIndex(0);
    setLightboxOpen(false);
    setVisibleCount(INITIAL_IMAGE_COUNT);
  }, [category]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex rounded-full border border-border bg-background p-1 shadow-soft">
            {(Object.keys(categoryLabels) as GalleryCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedImages.map((image, index) => (
            <button
              key={`${image.category}-${index}`}
              onClick={() => openLightbox(index)}
              className={cn(
                'relative overflow-hidden rounded-lg group cursor-pointer',
                index === 0 ? 'col-span-2 row-span-2' : ''
              )}
            >
              <img
                src={image.src}
                alt={getAltText(index)}
                loading="lazy"
                decoding="async"
                sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                className={cn(
                  'w-full object-cover transition-transform duration-500 group-hover:scale-110',
                  index === 0 ? 'h-[400px] md:h-[500px]' : 'h-48 md:h-60'
                )}
              />
            </button>
          ))}
        </div>

        {canLoadMore && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_IMAGE_COUNT)}
            >
              {t.gallery.loadMore}
            </Button>
          </div>
        )}
      </div>

      {lightboxOpen && displayedImages.length > 0 && (
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
            src={displayedImages[currentIndex].src}
            alt={getAltText(currentIndex)}
            loading="eager"
            decoding="async"
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

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {displayedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-primary-foreground' : 'bg-primary-foreground/40'
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
