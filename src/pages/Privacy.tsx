import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n';
import { contactInfo } from '@/lib/contactInfo';

const interpolate = (text: string) =>
  text
    .replace('{email}', contactInfo.email)
    .replace('{phone}', contactInfo.phone);

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <section className="bg-gradient-warm py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3">
              {t.privacy.title}
            </h1>
            <p className="text-muted-foreground">{t.privacy.updated}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-foreground text-lg mb-8">
              {t.privacy.intro}
            </p>

            <div className="space-y-8">
              {t.privacy.sections.map((section, index) => (
                <div key={`${section.title}-${index}`}>
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
                    {section.title}
                  </h2>
                  {section.body && (
                    <p className="text-foreground leading-relaxed">
                      {interpolate(section.body)}
                    </p>
                  )}
                  {section.list && (
                    <ul className="mt-3 space-y-2 text-foreground list-disc pl-5">
                      {section.list.map((item, itemIndex) => (
                        <li key={`${section.title}-item-${itemIndex}`}>
                          {interpolate(item)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
