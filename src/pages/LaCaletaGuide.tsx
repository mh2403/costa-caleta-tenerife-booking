import { SeoPageShell } from '@/components/seo/SeoPageShell';
import { laCaletaGuideCopy } from '@/content/seo-pages';
import { useLanguage } from '@/i18n';

const LaCaletaGuide = () => {
  const { language } = useLanguage();
  return <SeoPageShell copy={laCaletaGuideCopy[language]} secondaryPath="/appartement-la-caleta" />;
};

export default LaCaletaGuide;
