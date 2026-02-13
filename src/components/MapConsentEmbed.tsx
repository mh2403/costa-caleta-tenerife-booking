import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MapConsentEmbedProps = {
  title: string;
  embedUrl: string;
  externalUrl: string;
  consentTitle: string;
  consentDescription: string;
  loadButtonLabel: string;
  externalButtonLabel: string;
  className?: string;
};

export function MapConsentEmbed({
  title,
  embedUrl,
  externalUrl,
  consentTitle,
  consentDescription,
  loadButtonLabel,
  externalButtonLabel,
  className,
}: MapConsentEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-border/60 shadow-medium', className)}>
      {isLoaded ? (
        <iframe
          title={title}
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-gradient-warm px-6 py-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">{consentTitle}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{consentDescription}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setIsLoaded(true)}>{loadButtonLabel}</Button>
            <Button asChild variant="outline">
              <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                {externalButtonLabel}
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
