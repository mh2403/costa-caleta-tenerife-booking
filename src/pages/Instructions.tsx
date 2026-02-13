import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n';
import tvVideo from '@/assets/CostaCaleta/TvInstructionVideo.MOV';

const Instructions = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <section className="bg-gradient-warm py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3">
              {t.instructions.title}
            </h1>
            <p className="text-muted-foreground">{t.instructions.subtitle}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-card rounded-2xl shadow-medium overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {t.instructions.videoLabel}
                </h2>
                <video
                  src={tvVideo}
                  controls
                  playsInline
                  preload="none"
                  className="w-full rounded-xl shadow-soft bg-black"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Instructions;
