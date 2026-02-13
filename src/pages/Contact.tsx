import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n';
import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import { contactInfo } from '@/lib/contactInfo';
import { MapConsentEmbed } from '@/components/MapConsentEmbed';

const Contact = () => {
  const { t } = useLanguage();

  const contactDetails = {
    ...contactInfo,
    address: t.contact.address,
  };

  const mapEmbedUrl = 'https://www.google.com/maps?q=C.%20las%20Artes%2C%2024%2C%2038679%20La%20Caleta%2C%20Santa%20Cruz%20de%20Tenerife%2C%20Spanje&z=18&output=embed';
  const mapExternalUrl = 'https://www.google.com/maps?q=C.%20las%20Artes%2C%2024%2C%2038679%20La%20Caleta%2C%20Santa%20Cruz%20de%20Tenerife';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-card pt-24 md:pt-28">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="max-w-2xl">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {t.contact.title}
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  {t.contact.subtitle}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] xl:gap-8">
                <div className="rounded-3xl border border-border/60 bg-background p-5 md:p-6 shadow-soft">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.contact.helperText}
                  </p>

                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/${contactDetails.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 transition-colors group-hover:bg-[#25D366]/20">
                        <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t.contact.whatsapp}
                        </p>
                        <p className="text-lg font-semibold text-foreground break-words">
                          {contactDetails.phone}
                        </p>
                      </div>
                    </a>

                    <a
                      href={`tel:${contactDetails.phone}`}
                      className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t.contact.phone}
                        </p>
                        <p className="text-lg font-semibold text-foreground break-words">
                          {contactDetails.phone}
                        </p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-secondary/40 hover:bg-secondary/5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                        <Mail className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t.contact.email}
                        </p>
                        <p className="text-lg font-semibold text-foreground break-words">
                          {contactDetails.email}
                        </p>
                      </div>
                    </a>

                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/50 p-4">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{t.contact.responseTime}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <MapConsentEmbed
                    className="h-[320px] md:h-[380px]"
                    title={t.contact.mapEmbedTitle}
                    embedUrl={mapEmbedUrl}
                    externalUrl={mapExternalUrl}
                    consentTitle={t.contact.mapCardTitle}
                    consentDescription={t.contact.mapCardDescription}
                    loadButtonLabel={t.contact.mapLoadButton}
                    externalButtonLabel={t.contact.mapOpenExternal}
                  />

                  <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-soft">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                        <MapPin className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{t.contact.locationLabel}</p>
                        <p className="text-muted-foreground">{contactDetails.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
