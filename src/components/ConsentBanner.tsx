import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n';
import { getStoredConsentChoice, isTrackingConfigured, updateConsent } from '@/lib/analytics';

export function ConsentBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const trackingEnabled = isTrackingConfigured();

  useEffect(() => {
    setVisible(trackingEnabled && getStoredConsentChoice() === null);
  }, [trackingEnabled]);

  const copy = useMemo(
    () =>
      ({
        en: {
          title: 'Cookies',
          description: 'Allow anonymous analytics and ad measurement?',
          accept: 'Allow',
          reject: 'Only essential',
        },
        nl: {
          title: 'Cookies',
          description: 'Anonieme analytics en advertentiemeting toestaan?',
          accept: 'Toestaan',
          reject: 'Alleen essentieel',
        },
        es: {
          title: 'Cookies',
          description: 'Permitir analitica anonima y medicion de anuncios?',
          accept: 'Permitir',
          reject: 'Solo esenciales',
        },
      })[language],
    [language]
  );

  const handleChoice = (choice: 'granted' | 'denied') => {
    updateConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 md:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border/70 bg-background/96 p-3 shadow-large backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{copy.title}</p>
          <p className="text-xs text-muted-foreground">{copy.description}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleChoice('denied')}>
            {copy.reject}
          </Button>
          <Button size="sm" onClick={() => handleChoice('granted')}>
            {copy.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
