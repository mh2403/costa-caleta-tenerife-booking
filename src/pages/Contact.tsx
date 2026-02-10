import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n';
import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import { contactInfo } from '@/lib/contactInfo';

const Contact = () => {
  const { t } = useLanguage();

  const contactDetails = {
    ...contactInfo,
    address: 'Costa Adeje, Tenerife, Canary Islands',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-gradient-sunset py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t.contact.title}
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                {t.contact.title}
              </h2>

              <div className="space-y-6">
                {/* Phone */}
                <a
                  href={`tel:${contactDetails.phone}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.contact.phone}</p>
                    <p className="text-primary text-lg">{contactDetails.phone}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.contact.email}</p>
                    <p className="text-secondary text-lg">{contactDetails.email}</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${contactDetails.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.contact.whatsapp}</p>
                    <p className="text-[#25D366] text-lg">{contactDetails.phone}</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground">{contactDetails.address}</p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-8 flex items-center gap-3 p-4 bg-muted rounded-xl">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t.contact.responseTime}</span>
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
