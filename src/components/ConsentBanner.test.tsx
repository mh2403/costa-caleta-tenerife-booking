import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsentBanner } from '@/components/ConsentBanner';
import { LanguageProvider } from '@/i18n';

const analyticsMocks = vi.hoisted(() => ({
  getStoredConsentChoice: vi.fn(),
  isTrackingConfigured: vi.fn(),
  updateConsent: vi.fn(),
}));

vi.mock('@/lib/analytics', () => analyticsMocks);

const renderBanner = (pathname: string) => {
  window.history.replaceState({}, '', pathname);

  return render(
    <LanguageProvider>
      <ConsentBanner />
    </LanguageProvider>
  );
};

describe('ConsentBanner', () => {
  beforeEach(() => {
    analyticsMocks.isTrackingConfigured.mockReturnValue(true);
    analyticsMocks.getStoredConsentChoice.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it.each([
    ['/', 'We use cookies to give you a better user experience on this website.'],
    ['/nl', 'We gebruiken cookies om je een betere gebruikerservaring op deze website te bieden.'],
    ['/es', 'Usamos cookies para ofrecerte una mejor experiencia de usuario en este sitio web.'],
  ])('shows the updated copy for %s', (pathname, description) => {
    renderBanner(pathname);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('stays hidden when tracking is not configured', () => {
    analyticsMocks.isTrackingConfigured.mockReturnValue(false);

    renderBanner('/nl');

    expect(
      screen.queryByText('We gebruiken cookies om je een betere gebruikerservaring op deze website te bieden.')
    ).not.toBeInTheDocument();
  });
});
