import { useState, useMemo, useEffect } from 'react';
import { format, addDays, differenceInDays, isWithinInterval, isBefore, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage, Language } from '@/i18n';
import { Check, ChevronLeft, ChevronRight, MessageCircle, CalendarIcon, User, Mail, Phone, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateBooking, useBookedDates } from '@/hooks/useBookings';
import { usePricingRules } from '@/hooks/usePricing';
import { useSettings } from '@/hooks/useSettings';
import { useBlockedDates } from '@/hooks/useBlockedDates';
import { contactInfo } from '@/lib/contactInfo';

const Booking = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Fetch data from database
  const { data: bookedDates = [], isLoading: loadingBookings } = useBookedDates();
  const { data: pricingRules = [], isLoading: loadingPricing } = usePricingRules();
  const { data: blockedDates = [], isLoading: loadingBlocked } = useBlockedDates();
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const createBooking = useCreateBooking();

  const basePrice = settings?.base_price?.amount ?? 85;
  const cleaningFee = settings?.cleaning_fee?.amount ?? 50;
  const maxGuests = settings?.max_guests?.count ?? 6;
  const whatsappNumber = contactInfo.phone;
  const checkInTime = settings?.check_in_time?.time ?? '15:00';
  const checkOutTime = '12:00';
  const currencySymbol = settings?.currency?.symbol ?? '€';

  const isLoading = loadingBookings || loadingPricing || loadingBlocked || loadingSettings;

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booking =>
      isWithinInterval(date, { start: booking.start, end: addDays(booking.end, -1) })
    );
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked =>
      isWithinInterval(date, { start: blocked.start, end: blocked.end })
    );
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || isDateBooked(date) || isDateBlocked(date);
  };

  const isCheckOutDisabled = (date: Date) => {
    if (!checkIn) return isDateDisabled(date);
    if (isDateDisabled(date)) return true;
    if (isBefore(date, addDays(checkIn, 1))) return true;
    if (differenceInDays(date, checkIn) < minStayForCheckIn) return true;
    return !isRangeAvailable(checkIn, date);
  };

  const rangesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date) => {
    return startA <= endB && startB <= endA;
  };

  const hasUnavailableInRange = (start: Date, end: Date) => {
    const rangeStart = startOfDay(start);
    const rangeEnd = startOfDay(addDays(end, -1));

    if (isBefore(rangeEnd, rangeStart)) {
      return true;
    }

    const overlapsBooking = bookedDates.some(booking => {
      const bookingStart = startOfDay(booking.start);
      const bookingEnd = startOfDay(addDays(booking.end, -1));
      return rangesOverlap(rangeStart, rangeEnd, bookingStart, bookingEnd);
    });

    if (overlapsBooking) return true;

    return blockedDates.some(blocked => {
      const blockedStart = startOfDay(blocked.start);
      const blockedEnd = startOfDay(blocked.end);
      return rangesOverlap(rangeStart, rangeEnd, blockedStart, blockedEnd);
    });
  };

  const isRangeAvailable = (start: Date, end: Date) => !hasUnavailableInRange(start, end);

  const getPriceForDate = (date: Date) => {
    // Check seasonal pricing rules
    const rule = pricingRules.find(r =>
      isWithinInterval(date, {
        start: new Date(r.start_date),
        end: new Date(r.end_date),
      })
    );
    return rule ? Number(rule.price_per_night) : basePrice;
  };

  const getMinStayForDate = (date: Date) => {
    const rule = pricingRules.find(r =>
      isWithinInterval(date, {
        start: new Date(r.start_date),
        end: new Date(r.end_date),
      })
    );
    return rule?.min_stay ? Number(rule.min_stay) : 1;
  };

  const getMinStayForRange = (start: Date, end: Date) => {
    const nightsCount = differenceInDays(end, start);
    const nightsToCheck = nightsCount > 0 ? nightsCount : 1;
    let minStay = 1;

    for (let i = 0; i < nightsToCheck; i++) {
      const currentDate = addDays(start, i);
      minStay = Math.max(minStay, getMinStayForDate(currentDate));
    }

    return minStay;
  };

  const minStayForCheckIn = useMemo(() => {
    if (!checkIn) return 1;
    return getMinStayForDate(checkIn);
  }, [checkIn, pricingRules]);

  const minStayForSelection = useMemo(() => {
    if (!checkIn || !checkOut) return minStayForCheckIn;
    return getMinStayForRange(checkIn, checkOut);
  }, [checkIn, checkOut, minStayForCheckIn, pricingRules]);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    const nightsCount = differenceInDays(checkOut, checkIn);
    if (nightsCount < 1 || !isRangeAvailable(checkIn, checkOut)) {
      setCheckOut(undefined);
    }
  }, [checkIn, checkOut, bookedDates, blockedDates, isRangeAvailable]);

  const { nights, totalNightsCost, totalPrice } = useMemo(() => {
    if (!checkIn || !checkOut) {
      return { nights: 0, totalNightsCost: 0, totalPrice: 0 };
    }
    const nightCount = Math.max(differenceInDays(checkOut, checkIn), 0);
    let nightsCost = 0;
    for (let i = 0; i < nightCount; i++) {
      const currentDate = addDays(checkIn, i);
      nightsCost += getPriceForDate(currentDate);
    }
    return {
      nights: nightCount,
      totalNightsCost: nightsCost,
      totalPrice: nightsCost + cleaningFee,
    };
  }, [checkIn, checkOut, pricingRules, basePrice, cleaningFee]);

  const handleNext = () => {
    if (step === 1) {
      if (!checkIn || !checkOut) {
        toast({
          title: t.booking.selectDates,
          variant: 'destructive',
        });
        return;
      }
      if (nights < 1) {
        toast({
          title: t.booking.invalidDates,
          variant: 'destructive',
        });
        return;
      }
      if (!isRangeAvailable(checkIn, checkOut)) {
        toast({
          title: t.booking.unavailableRange,
          variant: 'destructive',
        });
        return;
      }
      if (nights < minStayForSelection) {
        toast({
          title: t.booking.minStayError.replace('{n}', String(minStayForSelection)),
          variant: 'destructive',
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: t.booking.requiredFields,
        variant: 'destructive',
      });
      return;
    }

    if (!checkIn || !checkOut) return;

    try {
      await createBooking.mutateAsync({
        guest_name: formData.fullName,
        guest_email: formData.email,
        guest_phone: formData.phone,
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        num_guests: parseInt(guests),
        message: formData.message || null,
        language: language as 'en' | 'nl' | 'es',
        total_price: totalPrice,
        cleaning_fee: cleaningFee,
        status: 'pending',
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: t.common.error,
        description: t.booking.submitError,
        variant: 'destructive',
      });
    }
  };

  const paymentDetails = (
    <div className="bg-card rounded-xl p-6 shadow-soft">
      <h3 className="font-heading text-lg font-semibold mb-2">
        {t.booking.paymentTitle}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t.booking.paymentIntro}
      </p>
      <ul className="space-y-1 text-sm">
        <li>{t.booking.paymentDetailAccount}</li>
        <li>{t.booking.paymentDetailIban}</li>
        <li>{t.booking.paymentDetailBic}</li>
        <li>{t.booking.paymentDetailReference}</li>
      </ul>
      <p className="text-xs text-muted-foreground mt-3">
        {t.booking.paymentNote}
      </p>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
                {t.booking.confirmationTitle}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t.booking.confirmationMessage}
              </p>
              <div className="bg-card rounded-xl p-6 shadow-soft mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t.booking.checkIn}</span>
                    <p className="font-semibold">{checkIn && format(checkIn, 'PPP')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.booking.checkOut}</span>
                    <p className="font-semibold">{checkOut && format(checkOut, 'PPP')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.booking.checkInTime}</span>
                    <p className="font-semibold">{checkInTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.booking.checkOutTime}</span>
                    <p className="font-semibold">{checkOutTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.booking.guests}</span>
                    <p className="font-semibold">{guests} {t.booking.guestsCount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.booking.total}</span>
                    <p className="font-semibold text-primary">{currencySymbol}{totalPrice}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {t.booking.disclaimer}
              </p>
              <div className="mb-6">
                {paymentDetails}
              </div>
              <Button variant="whatsapp" size="lg" asChild className="w-full">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center text-center px-2 whitespace-pre-line leading-tight"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t.booking.whatsappNote}
                </a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 md:pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.booking.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t.booking.subtitle}
            </p>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 rounded-full ${
                      s < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Step 1: Dates */}
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {t.booking.step1}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label>{t.booking.checkIn}</Label>
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={isDateDisabled}
                        className="rounded-md border pointer-events-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <Label>{t.booking.checkOut}</Label>
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={isCheckOutDisabled}
                      className="rounded-md border pointer-events-auto"
                    />
                  </div>

                  <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <Label>{t.booking.guests}</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {[1, 2].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} {t.booking.guestsCount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {checkIn && (
                      <p className="text-sm text-muted-foreground mt-3">
                        {t.booking.minStayNote.replace('{n}', String(checkOut ? minStayForSelection : minStayForCheckIn))}
                      </p>
                    )}
                  </div>

                  {checkIn && checkOut && nights > 0 && (
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                      <h4 className="font-semibold mb-4">{t.booking.priceBreakdown}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{nights} {t.booking.nights}</span>
                          <span>{currencySymbol}{totalNightsCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.booking.cleaningFee}</span>
                          <span>{currencySymbol}{cleaningFee}</span>
                        </div>
                        <div className="border-t border-primary/20 pt-2 mt-2 flex justify-between font-bold text-lg">
                          <span>{t.booking.total}</span>
                          <span className="text-primary">{currencySymbol}{totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="max-w-xl mx-auto animate-fade-in">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {t.booking.step2}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">{t.booking.fullName} *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t.booking.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.booking.phone} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">{t.booking.message}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t.booking.messagePlaceholder}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="max-w-xl mx-auto animate-fade-in">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    {t.booking.step3}
                  </h3>

                  <div className="space-y-6">
                    {/* Dates Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t.booking.checkIn}</p>
                        <p className="font-semibold">{checkIn && format(checkIn, 'PPP')}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t.booking.checkOut}</p>
                        <p className="font-semibold">{checkOut && format(checkOut, 'PPP')}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t.booking.checkInTime}</p>
                        <p className="font-semibold">{checkInTime}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t.booking.checkOutTime}</p>
                        <p className="font-semibold">{checkOutTime}</p>
                      </div>
                    </div>

                    {/* Guest Info */}
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.phone}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{t.booking.total}</span>
                        <span className="text-2xl font-bold text-primary">{currencySymbol}{totalPrice}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {nights} {t.booking.nights} + {t.booking.cleaningFee}
                      </p>
                    </div>

                    {paymentDetails}

                    <p className="text-sm text-muted-foreground text-center">
                      {t.booking.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {t.booking.back}
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button variant="hero" onClick={handleNext} className="flex items-center gap-2">
                  {t.booking.next}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  size="lg"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t.common.loading}
                    </>
                  ) : (
                    t.booking.submit
                  )}
                </Button>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <span>{t.booking.helpWhatsapp}</span>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                {whatsappNumber}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
