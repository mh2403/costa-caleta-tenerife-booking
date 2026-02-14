import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
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
  const touchStartX = useRef<number | null>(null);

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

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
        return;
      }
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? displayedImages.length - 1 : prev - 1));
      }
      if (event.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === displayedImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, displayedImages.length]);

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

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;
    if (startX === null || endX === null) return;

    const distance = endX - startX;
    if (Math.abs(distance) < 40) return;
    if (distance > 0) {
      goToPrevious();
    } else {
      goToNext();
    }
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
        <div className="fixed inset-0 z-[70] bg-foreground/95 animate-fade-in">
          <div
            className="relative flex h-full w-full items-center justify-center p-4 md:p-8"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10 text-primary-foreground hover:bg-primary-foreground/12"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 hidden h-12 w-12 text-primary-foreground hover:bg-primary-foreground/12 md:flex"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <button
              type="button"
              onClick={goToPrevious}
              className="absolute inset-y-0 left-0 w-1/3 md:hidden"
              aria-label="Previous photo"
            />
            <img
              src={displayedImages[currentIndex].src}
              alt={getAltText(currentIndex)}
              loading="eager"
              decoding="async"
              className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-large animate-scale-in"
            />
            <button
              type="button"
              onClick={goToNext}
              className="absolute inset-y-0 right-0 w-1/3 md:hidden"
              aria-label="Next photo"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 hidden h-12 w-12 text-primary-foreground hover:bg-primary-foreground/12 md:flex"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-primary-foreground/20 bg-foreground/45 px-3 py-2 md:hidden">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="min-w-[72px] text-center text-sm font-medium text-primary-foreground">
                  {currentIndex + 1} / {displayedImages.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 gap-2 md:flex">
              {displayedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    index === currentIndex ? 'bg-primary-foreground' : 'bg-primary-foreground/40'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
