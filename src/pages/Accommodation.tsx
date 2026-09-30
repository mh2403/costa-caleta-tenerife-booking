import { SeoPageShell } from '@/components/seo/SeoPageShell';
import { accommodationCopy } from '@/content/seo-pages';
import { useLanguage } from '@/i18n';

const Accommodation = () => {
  const { language } = useLanguage();
  return <SeoPageShell copy={accommodationCopy[language]} secondaryPath="/la-caleta-tenerife" />;
};

export default Accommodation;
