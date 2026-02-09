import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = {
    phone: '+32 475 96 51 41',
    email: 'martine.govaert@gmail.com',
    whatsapp: '32475965141',
    address: 'Costa Adeje, Tenerife, Canary Islands',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // In production, this would send an email
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
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
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Info */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                  {t.contact.title}
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t.contact.phone}</p>
                      <p className="text-primary text-lg">{contactInfo.phone}</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t.contact.email}</p>
                      <p className="text-secondary text-lg">{contactInfo.email}</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t.contact.whatsapp}</p>
                      <p className="text-[#25D366] text-lg">{contactInfo.phone}</p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-muted-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="mt-8 flex items-center gap-3 p-4 bg-muted rounded-xl">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t.contact.responseTime}</span>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                  {t.contact.sendMessage}
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-scale-in">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t.contact.yourName}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t.contact.yourEmail}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">{t.contact.yourMessage}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="mt-1"
                        rows={5}
                      />
                    </div>
                    <Button variant="hero" size="lg" className="w-full flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {t.contact.send}
                    </Button>
                  </form>
                )}
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
