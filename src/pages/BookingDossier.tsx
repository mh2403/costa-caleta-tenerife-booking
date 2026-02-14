import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, addMonths, differenceInDays, format, isBefore, isWithinInterval, startOfDay } from 'date-fns';
import { enUS, es, nl } from 'date-fns/locale';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/i18n';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { contactInfo } from '@/lib/contactInfo';
import {
  useDeleteBooking,
  usePublicBookingDossier,
  useSubmitSignedBookingContractByToken,
  useSubmitBookingReviewByToken,
  useUpdateBooking,
} from '@/hooks/useBookings';
import type { BookingStatus, BookingUpdate } from '@/hooks/useBookings';
import { useBlockedDates } from '@/hooks/useBlockedDates';
import { usePricingRules } from '@/hooks/usePricing';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { bookingFlowConfig } from '@/lib/bookingFlowConfig';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Copy,
  FileText,
  Loader2,
  MessageCircle,
  Star,
  Upload,
} from 'lucide-react';

const BookingDossier = () => {
  const { token } = useParams();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  const {
    data: booking,
    isLoading: loadingBooking,
    error,
  } = usePublicBookingDossier(token ?? null);

  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const submitSignedContract = useSubmitSignedBookingContractByToken();
  const submitReview = useSubmitBookingReviewByToken();
  const { data: blockedDatesData = [] } = useBlockedDates();
  const { data: pricingRules = [] } = usePricingRules();
  const { data: settings } = useSettings();

  const [statusDraft, setStatusDraft] = useState<BookingStatus>('pending');
  const [paymentNotesDraft, setPaymentNotesDraft] = useState('');
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [cancelArmed, setCancelArmed] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [signedContractFile, setSignedContractFile] = useState<File | null>(null);
  const [uploadingSignedContract, setUploadingSignedContract] = useState(false);
  const [openingSignedContract, setOpeningSignedContract] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const dateLocale = useMemo(() => {
    if (language === 'nl') return nl;
    if (language === 'es') return es;
    return enUS;
  }, [language]);

  const formatLocalizedDate = useCallback((value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value);
    return format(date, 'PPP', { locale: dateLocale });
  }, [dateLocale]);

  useEffect(() => {
    if (!booking) return;
    setStatusDraft(booking.status as BookingStatus);
    setPaymentNotesDraft(booking.payment_notes ?? '');
    setEditCheckIn(format(new Date(booking.check_in), 'yyyy-MM-dd'));
    setEditCheckOut(format(new Date(booking.check_out), 'yyyy-MM-dd'));
    setDeleteReason('');
    setCancelArmed(false);
    setDeleteArmed(false);
    setReviewName(booking.review_author || booking.guest_name || '');
    setReviewRating(booking.review_rating ?? 5);
    setReviewText(booking.review_text ?? '');
  }, [booking]);

  useEffect(() => {
    if (statusDraft !== 'cancelled') {
      setCancelArmed(false);
    }
  }, [statusDraft]);

  const loading = loadingBooking || authLoading;

  const dossierFieldKeys = useMemo(() => {
    if (!booking) return new Set<string>();
    return new Set(Object.keys(booking));
  }, [booking]);

  const sanitizeBookingUpdatePayload = useCallback(
    (payload: Record<string, unknown>) => {
      const sanitized: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined) continue;
        if (key === 'id' || dossierFieldKeys.has(key)) {
          sanitized[key] = value;
        }
      }

      return sanitized;
    },
    [dossierFieldKeys]
  );

  const nights = useMemo(() => {
    if (!booking) return 0;
    return Math.max(differenceInDays(new Date(booking.check_out), new Date(booking.check_in)), 0);
  }, [booking]);

  const depositAmount = useMemo(() => {
    if (!booking) return 0;
    return Number((Number(booking.total_price) * bookingFlowConfig.depositRatio).toFixed(2));
  }, [booking]);

  const remainingAmount = useMemo(() => {
    if (!booking) return 0;
    return Math.max(Number((Number(booking.total_price) - depositAmount).toFixed(2)), 0);
  }, [booking, depositAmount]);

  const basePrice = settings?.base_price?.amount ?? 85;
  const cleaningFee = bookingFlowConfig.cleaningFee;
  const minStayNights = bookingFlowConfig.minStayNights;

  const rangeOverlaps = (startA: Date, endA: Date, startB: Date, endB: Date) => {
    return startA <= endB && startB <= endA;
  };

  const normalizeRange = (start: Date, end: Date) => {
    const rangeStart = startOfDay(start);
    const rangeEnd = startOfDay(addDays(end, -1));
    return { rangeStart, rangeEnd };
  };

  const hasOverlapWithBlocked = (start: Date, end: Date) => {
    const { rangeStart, rangeEnd } = normalizeRange(start, end);
    if (rangeEnd < rangeStart) return true;
    return blockedDatesData.some((blocked) => {
      const blockedStart = startOfDay(blocked.start);
      const blockedEnd = startOfDay(blocked.end);
      return rangeOverlaps(rangeStart, rangeEnd, blockedStart, blockedEnd);
    });
  };

  const getPriceForDate = (date: Date) => {
    const rule = pricingRules.find((r) =>
      isWithinInterval(date, {
        start: new Date(r.start_date),
        end: new Date(r.end_date),
      })
    );
    return rule ? Number(rule.price_per_night) : basePrice;
  };

  const getMinStayForDate = (_date: Date) => minStayNights;

  const getMinStayForRange = (start: Date, end: Date) => {
    const nightsCount = Math.max(differenceInDays(end, start), 0);
    const nightsToCheck = nightsCount > 0 ? nightsCount : 1;
    let minStay = minStayNights;

    for (let i = 0; i < nightsToCheck; i++) {
      const currentDate = addDays(start, i);
      minStay = Math.max(minStay, getMinStayForDate(currentDate));
    }

    return minStay;
  };

  const calculateTotalPrice = (start: Date, end: Date) => {
    const nightCount = Math.max(differenceInDays(end, start), 0);
    let nightsCost = 0;
    for (let i = 0; i < nightCount; i++) {
      nightsCost += getPriceForDate(addDays(start, i));
    }
    return {
      nights: nightCount,
      total: nightsCost + cleaningFee,
    };
  };

  const dossierUrl = useMemo(() => {
    if (!token || typeof window === 'undefined') return '';
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    return new URL(`${base}booking/dossier/${token}`, window.location.origin).toString();
  }, [token]);

  const contractUrl = useMemo(() => {
    if (!booking?.contract_file_path) return '';
    const { data } = supabase.storage.from('booking-contracts').getPublicUrl(booking.contract_file_path);
    return data.publicUrl;
  }, [booking?.contract_file_path]);

  const canSubmitReview = useMemo(() => {
    if (!booking) return false;
    if (booking.status !== 'confirmed') return false;
    const checkoutDay = startOfDay(new Date(booking.check_out));
    return !isBefore(startOfDay(new Date()), checkoutDay);
  }, [booking]);

  const remainingDueDate = useMemo(() => {
    if (!booking) return null;
    return addMonths(new Date(booking.check_in), -bookingFlowConfig.remainingDueMonthsBeforeCheckIn);
  }, [booking]);

  const whatsappHref = useMemo(() => {
    const number = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    if (!booking) return `https://wa.me/${number}`;
    const message = encodeURIComponent(
      t.booking.whatsappBookingMessage
        .replace('{name}', booking.guest_name || '-')
        .replace('{email}', booking.guest_email || '-')
        .replace('{phone}', booking.guest_phone || '-')
        .replace('{checkIn}', formatLocalizedDate(booking.check_in))
        .replace('{checkOut}', formatLocalizedDate(booking.check_out))
        .replace('{total}', `€${Number(booking.total_price ?? 0).toLocaleString()}`)
        .replace('{link}', dossierUrl || '-')
    );
    return `https://wa.me/${number}?text=${message}`;
  }, [booking, dossierUrl, t.booking.whatsappBookingMessage, formatLocalizedDate]);

  const copyLink = async () => {
    if (!dossierUrl) return;
    try {
      await navigator.clipboard.writeText(dossierUrl);
      toast({
        title: t.common.success,
        description: t.booking.dossierLinkCopied,
      });
    } catch (copyError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierCopyError,
        variant: 'destructive',
      });
    }
  };

  const formatDateTime = (value: string | null) =>
    value ? format(new Date(value), 'Pp', { locale: dateLocale }) : '-';

  const formatCurrency = (value: number) =>
    `€${value.toLocaleString(undefined, {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;

  const updateBookingFields = async (updates: Record<string, unknown>, successMessage: string) => {
    if (!booking || !isAdmin) return;

    try {
      await updateBooking.mutateAsync({
        ...(sanitizeBookingUpdatePayload({
          id: booking.id,
          ...updates,
        }) as BookingUpdate & { id: string }),
      });
      toast({
        title: t.common.success,
        description: successMessage,
      });
    } catch (updateError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierUpdateError,
        variant: 'destructive',
      });
    }
  };

  const handleAdminDateUpdate = async () => {
    if (!booking || !isAdmin) return;
    if (!editCheckIn || !editCheckOut) {
      toast({
        title: t.common.error,
        description: 'Selecteer een geldige in- en uitcheckdatum.',
        variant: 'destructive',
      });
      return;
    }

    const start = new Date(editCheckIn);
    const end = new Date(editCheckOut);
    if (end <= start) {
      toast({
        title: t.common.error,
        description: 'Uitcheckdatum moet na de incheckdatum liggen.',
        variant: 'destructive',
      });
      return;
    }

    const nightsCount = differenceInDays(end, start);
    if (nightsCount < minStayNights) {
      toast({
        title: t.common.error,
        description: `Minstens ${minStayNights} nachten vereist.`,
        variant: 'destructive',
      });
      return;
    }

    if (hasOverlapWithBlocked(start, end)) {
      toast({
        title: t.common.error,
        description: 'Deze data overlappen met geblokkeerde periodes.',
        variant: 'destructive',
      });
      return;
    }

    const { rangeStart, rangeEnd } = normalizeRange(start, end);
    const { data: otherBookings, error: overlapQueryError } = await supabase
      .from('bookings')
      .select('id, check_in, check_out')
      .in('status', ['pending', 'confirmed'])
      .neq('id', booking.id);

    if (overlapQueryError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierUpdateError,
        variant: 'destructive',
      });
      return;
    }

    const overlapsExistingBooking = (otherBookings ?? []).some((other) => {
      const otherStart = startOfDay(new Date(other.check_in));
      const otherEnd = startOfDay(addDays(new Date(other.check_out), -1));
      return rangeOverlaps(rangeStart, rangeEnd, otherStart, otherEnd);
    });

    if (overlapsExistingBooking) {
      toast({
        title: t.common.error,
        description: 'Deze data overlappen met een andere boeking.',
        variant: 'destructive',
      });
      return;
    }

    const minStay = getMinStayForRange(start, end);
    if (nightsCount < minStay) {
      toast({
        title: t.common.error,
        description: `Minimumverblijf voor deze periode is ${minStay} nacht(en).`,
        variant: 'destructive',
      });
      return;
    }

    const recalculated = calculateTotalPrice(start, end);

    try {
      await updateBooking.mutateAsync({
        ...(sanitizeBookingUpdatePayload({
          id: booking.id,
          check_in: editCheckIn,
          check_out: editCheckOut,
          total_price: recalculated.total,
          cleaning_fee: cleaningFee,
          deposit_amount: Number((recalculated.total * bookingFlowConfig.depositRatio).toFixed(2)),
        }) as BookingUpdate & { id: string }),
      });

      toast({
        title: t.common.success,
        description: 'Boekingsdata en prijs bijgewerkt.',
      });
    } catch (updateError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierUpdateError,
        variant: 'destructive',
      });
    }
  };

  const handleStatusSave = async () => {
    if (!booking || !isAdmin) return;
    const changingToCancelled = statusDraft === 'cancelled' && booking.status !== 'cancelled';
    if (changingToCancelled && !cancelArmed) {
      setCancelArmed(true);
      toast({
        title: t.common.error,
        description: 'Klik nogmaals op status opslaan om annuleren te bevestigen.',
      });
      return;
    }

    setCancelArmed(false);
    await updateBookingFields({ status: statusDraft }, t.booking.dossierStatusSaved);
  };

  const handleDeleteBooking = async () => {
    if (!booking || !isAdmin) return;

    if (booking.status === 'confirmed' && !deleteReason.trim()) {
      toast({
        title: t.common.error,
        description: 'Voeg een reden toe voor het verwijderen van een bevestigde boeking.',
        variant: 'destructive',
      });
      return;
    }

    if (!deleteArmed) {
      setDeleteArmed(true);
      toast({
        title: t.common.error,
        description: 'Klik nogmaals op verwijderen om definitief te bevestigen.',
      });
      return;
    }

    try {
      await deleteBooking.mutateAsync(booking.id);
      toast({
        title: t.common.success,
        description: 'Boeking definitief verwijderd.',
      });
      navigate('/admin/bookings');
    } catch (deleteError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierUpdateError,
        variant: 'destructive',
      });
    }
  };

  const handleContractUpload = async () => {
    if (!booking || !isAdmin || !contractFile) return;

    setUploadingContract(true);

    try {
      const safeName = contractFile.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const path = `${booking.id}/${Date.now()}-${safeName || 'contract.pdf'}`;

      const { error: uploadError } = await supabase.storage
        .from('booking-contracts')
        .upload(path, contractFile, {
          contentType: contractFile.type || 'application/pdf',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const baseUpdatePayload = {
        id: booking.id,
        contract_file_path: path,
        contract_uploaded_at: new Date().toISOString(),
        contract_sent: true,
        contract_sent_at: booking.contract_sent_at ?? new Date().toISOString(),
      };

      try {
        await updateBooking.mutateAsync(
          sanitizeBookingUpdatePayload({
            ...baseUpdatePayload,
            guest_contract_signed: false,
            guest_contract_signed_at: null,
            guest_contract_signed_name: null,
            guest_signed_contract_file_path: null,
            guest_signed_contract_uploaded_at: null,
            deposit_paid: false,
            deposit_paid_at: null,
            remaining_paid: false,
            remaining_paid_at: null,
            contract_signed: false,
            contract_signed_at: null,
          }) as BookingUpdate & { id: string }
        );
      } catch (updateError) {
        // Backward compatibility when new guest-signed columns are not yet migrated.
        await updateBooking.mutateAsync(
          sanitizeBookingUpdatePayload(baseUpdatePayload) as BookingUpdate & { id: string }
        );
      }

      setContractFile(null);
      toast({
        title: t.common.success,
        description: t.booking.dossierContractUploaded,
      });
    } catch (uploadError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierContractUploadError,
        variant: 'destructive',
      });
    } finally {
      setUploadingContract(false);
    }
  };

  const handleGuestSignedContractUpload = async () => {
    if (!booking || !token || !signedContractFile) return;
    if (!booking.contract_sent) {
      toast({
        title: t.common.error,
        description: t.booking.dossierContractWaiting,
        variant: 'destructive',
      });
      return;
    }

    setUploadingSignedContract(true);
    try {
      const safeName = signedContractFile.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const path = `guest-signed/${token}/${Date.now()}-${safeName || 'signed-contract.pdf'}`;
      const rawType = (signedContractFile.type || '').toLowerCase();
      const inferredType = (() => {
        if (rawType) return rawType;
        const lowerName = signedContractFile.name.toLowerCase();
        if (lowerName.endsWith('.pdf')) return 'application/pdf';
        if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) return 'image/jpeg';
        if (lowerName.endsWith('.png')) return 'image/png';
        if (lowerName.endsWith('.heic')) return 'image/heic';
        if (lowerName.endsWith('.heif')) return 'image/heif';
        return 'application/octet-stream';
      })();

      const { error: uploadError } = await supabase.storage
        .from('booking-signed-contracts')
        .upload(path, signedContractFile, {
          contentType: inferredType,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      await submitSignedContract.mutateAsync({
        token,
        filePath: path,
      });

      setSignedContractFile(null);
      toast({
        title: t.common.success,
        description: t.booking.dossierSignSuccess,
      });
    } catch (signError) {
      const errorMessage = signError instanceof Error ? signError.message : '';
      const setupLikelyMissing = /bucket|policy|row-level|permission|not found|404|submit_signed_contract|sign_booking_contract/i.test(errorMessage);
      console.error('Signed contract upload failed', signError);
      toast({
        title: t.common.error,
        description: setupLikelyMissing
          ? `${t.booking.dossierSignError} ${t.booking.dossierSignSetupHint}`
          : t.booking.dossierSignError,
        variant: 'destructive',
      });
    } finally {
      setUploadingSignedContract(false);
    }
  };

  const openGuestSignedContract = async () => {
    if (!booking?.guest_signed_contract_file_path || !isAdmin) return;
    setOpeningSignedContract(true);
    try {
      const { data, error: signedUrlError } = await supabase.storage
        .from('booking-signed-contracts')
        .createSignedUrl(booking.guest_signed_contract_file_path, 60 * 10);

      if (signedUrlError || !data?.signedUrl) {
        throw signedUrlError ?? new Error('signed url missing');
      }

      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (openError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierSignError,
        variant: 'destructive',
      });
    } finally {
      setOpeningSignedContract(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!token) return;

    if (!reviewText.trim()) {
      toast({
        title: t.common.error,
        description: t.booking.dossierReviewRequired,
        variant: 'destructive',
      });
      return;
    }

    try {
      await submitReview.mutateAsync({
        token,
        author: reviewName,
        rating: reviewRating,
        review: reviewText,
      });

      toast({
        title: t.common.success,
        description: t.booking.dossierReviewSuccess,
      });
    } catch (reviewError) {
      toast({
        title: t.common.error,
        description: t.booking.dossierReviewError,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
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

  if (!token || error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-xl mx-auto bg-card rounded-2xl border border-border shadow-soft p-8 text-center space-y-4">
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                {t.booking.dossierNotFoundTitle}
              </h1>
              <p className="text-muted-foreground">
                {t.booking.dossierNotFoundDescription}
              </p>
              <Button asChild variant="hero">
                <Link to="/">{t.notFound.backHome}</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progressItems = [
    {
      id: 'whatsapp',
      label: t.booking.dossierStepWhatsapp,
      done: booking.whatsapp_notified,
      date: booking.whatsapp_notified_at,
      disabled: false,
      onToggle: () => {
        const nextValue = !booking.whatsapp_notified;
        return updateBookingFields(
          {
            whatsapp_notified: nextValue,
            whatsapp_notified_at: nextValue ? booking.whatsapp_notified_at ?? new Date().toISOString() : null,
            status: nextValue ? booking.status : 'pending',
            contract_sent: nextValue ? booking.contract_sent : false,
            contract_sent_at: nextValue ? booking.contract_sent_at : null,
            guest_contract_signed: nextValue ? booking.guest_contract_signed : false,
            guest_contract_signed_at: nextValue ? booking.guest_contract_signed_at : null,
            guest_contract_signed_name: nextValue ? booking.guest_contract_signed_name : null,
            guest_signed_contract_file_path: nextValue ? booking.guest_signed_contract_file_path : null,
            guest_signed_contract_uploaded_at: nextValue ? booking.guest_signed_contract_uploaded_at : null,
            deposit_paid: nextValue ? booking.deposit_paid : false,
            deposit_paid_at: nextValue ? booking.deposit_paid_at : null,
            remaining_paid: nextValue ? booking.remaining_paid : false,
            remaining_paid_at: nextValue ? booking.remaining_paid_at : null,
            contract_signed: nextValue ? booking.contract_signed : false,
            contract_signed_at: nextValue ? booking.contract_signed_at : null,
          },
          nextValue ? t.booking.dossierStepSaved : t.booking.dossierStepReset
        );
      },
    },
    {
      id: 'owner_confirmed',
      label: t.booking.dossierStepOwnerSigned,
      done: booking.status === 'confirmed',
      date: booking.updated_at,
      disabled: !booking.whatsapp_notified,
      onToggle: () => {
        const nextValue = booking.status !== 'confirmed';
        return updateBookingFields(
          {
            status: nextValue ? 'confirmed' : 'pending',
            contract_sent: nextValue ? booking.contract_sent : false,
            contract_sent_at: nextValue ? booking.contract_sent_at : null,
            guest_contract_signed: nextValue ? booking.guest_contract_signed : false,
            guest_contract_signed_at: nextValue ? booking.guest_contract_signed_at : null,
            guest_contract_signed_name: nextValue ? booking.guest_contract_signed_name : null,
            guest_signed_contract_file_path: nextValue ? booking.guest_signed_contract_file_path : null,
            guest_signed_contract_uploaded_at: nextValue ? booking.guest_signed_contract_uploaded_at : null,
            deposit_paid: nextValue ? booking.deposit_paid : false,
            deposit_paid_at: nextValue ? booking.deposit_paid_at : null,
            remaining_paid: nextValue ? booking.remaining_paid : false,
            remaining_paid_at: nextValue ? booking.remaining_paid_at : null,
            contract_signed: nextValue ? booking.contract_signed : false,
            contract_signed_at: nextValue ? booking.contract_signed_at : null,
          },
          nextValue ? t.booking.dossierStepSaved : t.booking.dossierStepReset
        );
      },
    },
    {
      id: 'contract_sent',
      label: t.booking.dossierStepContractSent,
      done: booking.contract_sent,
      date: booking.contract_sent_at,
      disabled: booking.status !== 'confirmed' || !booking.whatsapp_notified,
      onToggle: () => updateBookingFields(
        {
          contract_sent: !booking.contract_sent,
          contract_sent_at: booking.contract_sent ? null : new Date().toISOString(),
          guest_contract_signed: booking.contract_sent ? false : booking.guest_contract_signed,
          guest_contract_signed_at: booking.contract_sent ? null : booking.guest_contract_signed_at,
          guest_contract_signed_name: booking.contract_sent ? null : booking.guest_contract_signed_name,
          guest_signed_contract_file_path: booking.contract_sent ? null : booking.guest_signed_contract_file_path,
          guest_signed_contract_uploaded_at: booking.contract_sent ? null : booking.guest_signed_contract_uploaded_at,
          deposit_paid: booking.contract_sent ? false : booking.deposit_paid,
          deposit_paid_at: booking.contract_sent ? null : booking.deposit_paid_at,
          remaining_paid: booking.contract_sent ? false : booking.remaining_paid,
          remaining_paid_at: booking.contract_sent ? null : booking.remaining_paid_at,
          contract_signed: booking.contract_sent ? false : booking.contract_signed,
          contract_signed_at: booking.contract_sent ? null : booking.contract_signed_at,
        },
        booking.contract_sent ? t.booking.dossierStepReset : t.booking.dossierStepSaved
      ),
    },
    {
      id: 'guest_signed',
      label: t.booking.dossierStepGuestSigned,
      done: booking.guest_contract_signed,
      date: booking.guest_signed_contract_uploaded_at ?? booking.guest_contract_signed_at,
      disabled: !booking.contract_sent,
      onToggle: () => updateBookingFields(
        {
          guest_contract_signed: !booking.guest_contract_signed,
          guest_contract_signed_at: booking.guest_contract_signed ? null : new Date().toISOString(),
          guest_contract_signed_name: booking.guest_contract_signed
            ? null
            : (booking.guest_contract_signed_name || booking.guest_name),
          guest_signed_contract_file_path: booking.guest_contract_signed ? null : booking.guest_signed_contract_file_path,
          guest_signed_contract_uploaded_at: booking.guest_contract_signed ? null : booking.guest_signed_contract_uploaded_at,
          deposit_paid: booking.guest_contract_signed ? false : booking.deposit_paid,
          deposit_paid_at: booking.guest_contract_signed ? null : booking.deposit_paid_at,
          remaining_paid: booking.guest_contract_signed ? false : booking.remaining_paid,
          remaining_paid_at: booking.guest_contract_signed ? null : booking.remaining_paid_at,
          contract_signed: booking.guest_contract_signed ? false : booking.contract_signed,
          contract_signed_at: booking.guest_contract_signed ? null : booking.contract_signed_at,
        },
        booking.guest_contract_signed ? t.booking.dossierStepReset : t.booking.dossierStepSaved
      ),
    },
    {
      id: 'deposit',
      label: t.booking.dossierStepDeposit,
      done: booking.deposit_paid,
      date: booking.deposit_paid_at,
      disabled: !booking.guest_contract_signed || booking.status !== 'confirmed',
      onToggle: () => updateBookingFields(
        {
          deposit_paid: !booking.deposit_paid,
          deposit_paid_at: booking.deposit_paid ? null : new Date().toISOString(),
          remaining_paid: booking.deposit_paid ? false : booking.remaining_paid,
          remaining_paid_at: booking.deposit_paid ? null : booking.remaining_paid_at,
          contract_signed: booking.deposit_paid ? false : booking.contract_signed,
          contract_signed_at: booking.deposit_paid ? null : booking.contract_signed_at,
        },
        booking.deposit_paid ? t.booking.dossierStepReset : t.booking.dossierStepSaved
      ),
    },
    {
      id: 'remaining',
      label: t.booking.dossierStepRemainingPaid,
      done: booking.remaining_paid,
      date: booking.remaining_paid_at,
      disabled: !booking.deposit_paid || !booking.guest_contract_signed || booking.status !== 'confirmed',
      onToggle: () => updateBookingFields(
        {
          remaining_paid: !booking.remaining_paid,
          remaining_paid_at: booking.remaining_paid ? null : new Date().toISOString(),
          contract_signed: booking.remaining_paid ? false : booking.contract_signed,
          contract_signed_at: booking.remaining_paid ? null : booking.contract_signed_at,
        },
        booking.remaining_paid ? t.booking.dossierStepReset : t.booking.dossierStepSaved
      ),
    },
    {
      id: 'owner_final',
      label: t.booking.dossierStepDepositWhatsapp,
      done: booking.contract_signed,
      date: booking.contract_signed_at,
      disabled: !booking.deposit_paid || !booking.remaining_paid || !booking.guest_contract_signed || booking.status !== 'confirmed',
      onToggle: () => updateBookingFields(
        {
          contract_signed: !booking.contract_signed,
          contract_signed_at: booking.contract_signed ? null : new Date().toISOString(),
        },
        booking.contract_signed ? t.booking.dossierStepReset : t.booking.dossierStepSaved
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 md:py-14 space-y-6">
          <section className="bg-card rounded-2xl border border-border shadow-soft p-5 md:p-8 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  {t.booking.dossierTitle}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {t.booking.dossierSubtitle}
                </p>
              </div>
              <Badge
                className="h-fit self-center md:self-auto min-w-[110px] justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm"
                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-primary-foreground/90' : 'bg-muted-foreground/70'}`} />
                {t.admin[booking.status as keyof typeof t.admin] || booking.status}
              </Badge>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4 md:p-5 space-y-3">
              <p className="text-sm text-muted-foreground">{t.booking.dossierLinkLabel}</p>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <code className="flex-1 rounded-md bg-background px-3 py-2 text-xs md:text-sm break-all">
                  {dossierUrl}
                </code>
                <Button type="button" variant="outline" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                  {t.booking.dossierCopyLink}
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="bg-card rounded-2xl border border-border shadow-soft p-5 space-y-4">
              <h2 className="font-heading text-2xl font-semibold text-foreground">{t.booking.step3}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{t.booking.checkIn}</p>
                  <p className="font-semibold">{formatLocalizedDate(booking.check_in)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{t.booking.checkOut}</p>
                  <p className="font-semibold">{formatLocalizedDate(booking.check_out)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{t.booking.guests}</p>
                  <p className="font-semibold">{booking.num_guests} {t.booking.guestsCount}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{t.booking.nights}</p>
                  <p className="font-semibold">{nights}</p>
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span>{t.booking.total}</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(Number(booking.total_price))}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t.booking.paymentDepositLabel}</span>
                  <span className="font-medium text-foreground">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t.booking.remainingBalanceLabel}</span>
                  <span className="font-medium text-foreground">{formatCurrency(remainingAmount)}</span>
                </div>
                {remainingDueDate && (
                  <p className="text-xs text-muted-foreground pt-1">
                    {t.booking.remainingBalanceLabel}: {formatLocalizedDate(remainingDueDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-soft p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-semibold text-foreground">{t.booking.paymentFlowTitle}</h2>
              </div>

              <div className="space-y-2">
                {progressItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-muted/25 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-2">
                      {item.done ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{index + 1}. {item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.done
                            ? `${t.booking.dossierDone}: ${formatDateTime(item.date)}`
                            : t.booking.dossierPending}
                        </p>
                      </div>
                    </div>

                    {isAdmin && (
                      <Button
                        type="button"
                        size="sm"
                        variant={item.done ? 'outline' : 'default'}
                        onClick={item.onToggle}
                        disabled={updateBooking.isPending || (!item.done && item.disabled)}
                      >
                        {item.done ? t.booking.dossierUndo : t.booking.dossierMark}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="bg-card rounded-2xl border border-border shadow-soft p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-xl font-semibold text-foreground">{t.booking.dossierContractTitle}</h3>
                {booking.contract_file_path ? (
                  <Badge variant="secondary">{t.booking.dossierContractAvailable}</Badge>
                ) : (
                  <Badge variant="outline">{t.booking.dossierContractMissing}</Badge>
                )}
              </div>

              {booking.contract_file_path ? (
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a href={contractUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      {t.booking.dossierOpenContract}
                    </a>
                  </Button>
                  {booking.contract_uploaded_at && (
                    <p className="text-xs text-muted-foreground">
                      {t.booking.dossierContractUploadedAt}: {formatDateTime(booking.contract_uploaded_at)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.booking.dossierContractWaiting}</p>
              )}

              {booking.contract_file_path && (
                <div className="rounded-lg border border-border bg-muted/25 p-4 space-y-3">
                  <h4 className="font-medium text-foreground">{t.booking.dossierGuestSignTitle}</h4>
                  {booking.guest_contract_signed ? (
                    <div className="space-y-2">
                      <p className="text-sm text-primary">
                        {t.booking.dossierGuestSignedAt}: {formatDateTime(
                          booking.guest_signed_contract_uploaded_at ?? booking.guest_contract_signed_at
                        )}
                      </p>
                      {isAdmin && booking.guest_signed_contract_file_path && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openGuestSignedContract}
                          disabled={openingSignedContract}
                        >
                          {openingSignedContract ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t.common.loading}
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />
                              {t.booking.dossierOpenContract}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">{t.booking.dossierSignConsent}</p>
                      <Input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png,image/heic,image/heif"
                        onChange={(event) => setSignedContractFile(event.target.files?.[0] ?? null)}
                      />
                      <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={handleGuestSignedContractUpload}
                        disabled={!signedContractFile || uploadingSignedContract}
                      >
                        {uploadingSignedContract ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t.common.loading}
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            {t.booking.dossierSignAction}
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-soft p-5 space-y-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">{t.booking.dossierReviewTitle}</h3>

              {booking.review_rating ? (
                <div className="rounded-lg border border-border bg-muted/25 p-4 space-y-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={`review-star-${index}`}
                        className={`h-4 w-4 ${index < Number(booking.review_rating) ? 'text-primary fill-primary' : 'text-muted-foreground/40'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{booking.review_text}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.review_author || booking.guest_name}
                    {booking.review_submitted_at && ` • ${formatDateTime(booking.review_submitted_at)}`}
                  </p>
                </div>
              ) : canSubmitReview ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="review-name">{t.booking.fullName}</Label>
                    <Input
                      id="review-name"
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>{t.booking.dossierReviewRatingLabel}</Label>
                    <div className="mt-2 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={`rating-${value}`}
                          type="button"
                          onClick={() => setReviewRating(value)}
                          className="transition-transform hover:scale-105"
                          aria-label={`Rate ${value}`}
                        >
                          <Star className={`h-6 w-6 ${value <= reviewRating ? 'text-primary fill-primary' : 'text-muted-foreground/35'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review-text">{t.booking.message}</Label>
                    <Textarea
                      id="review-text"
                      rows={4}
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={handleReviewSubmit}
                    disabled={submitReview.isPending}
                  >
                    {submitReview.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.common.loading}
                      </>
                    ) : (
                      t.booking.dossierReviewAction
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.booking.dossierReviewNotReady}</p>
              )}
            </div>
          </section>

          {isAdmin && (
            <section className="bg-card rounded-2xl border border-border shadow-soft p-5 space-y-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">{t.booking.dossierAdminTitle}</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>{t.booking.dossierStatusLabel}</Label>
                  <Select value={statusDraft} onValueChange={(value) => setStatusDraft(value as BookingStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t.admin.pending}</SelectItem>
                      <SelectItem value="confirmed">{t.admin.confirmed}</SelectItem>
                      <SelectItem value="declined">{t.admin.declined}</SelectItem>
                      <SelectItem value="cancelled">{t.admin.cancelled}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="contract-file">{t.booking.dossierUploadContractLabel}</Label>
                  <Input
                    id="contract-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setContractFile(event.target.files?.[0] ?? null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleContractUpload}
                    disabled={!contractFile || uploadingContract}
                  >
                    {uploadingContract ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.common.loading}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {t.booking.dossierUploadContractAction}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/25 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">Boekingsdata aanpassen</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="edit-checkin" className="text-xs text-muted-foreground">Inchecken</Label>
                    <Input
                      id="edit-checkin"
                      type="date"
                      value={editCheckIn}
                      onChange={(event) => setEditCheckIn(event.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-checkout" className="text-xs text-muted-foreground">Uitchecken</Label>
                    <Input
                      id="edit-checkout"
                      type="date"
                      value={editCheckOut}
                      onChange={(event) => setEditCheckOut(event.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                {editCheckIn && editCheckOut && differenceInDays(new Date(editCheckOut), new Date(editCheckIn)) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nieuwe prijs: €{Number(calculateTotalPrice(new Date(editCheckIn), new Date(editCheckOut)).total).toLocaleString()}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAdminDateUpdate}
                  disabled={updateBooking.isPending}
                >
                  Boekingsdata opslaan
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">{t.booking.dossierAdminNotesLabel}</Label>
                <Textarea
                  id="admin-notes"
                  rows={4}
                  value={paymentNotesDraft}
                  onChange={(event) => setPaymentNotesDraft(event.target.value)}
                  placeholder={t.booking.dossierAdminNotesPlaceholder}
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={handleStatusSave}
                  disabled={updateBooking.isPending}
                >
                  {statusDraft === 'cancelled' && booking.status !== 'cancelled' && cancelArmed
                    ? 'Bevestig annuleren'
                    : t.booking.dossierSaveStatus}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateBookingFields({ payment_notes: paymentNotesDraft.trim() || null }, t.booking.dossierNotesSaved)}
                  disabled={updateBooking.isPending}
                >
                  {t.booking.dossierSaveNotes}
                </Button>
              </div>

              {['pending', 'declined', 'confirmed', 'cancelled'].includes(booking.status) && (
                <div className="space-y-2">
                  {booking.status === 'confirmed' && (
                    <div>
                      <Label htmlFor="delete-reason" className="text-xs text-muted-foreground">
                        Reden voor verwijderen (verplicht)
                      </Label>
                      <Input
                        id="delete-reason"
                        value={deleteReason}
                        onChange={(event) => {
                          setDeleteReason(event.target.value);
                          setDeleteArmed(false);
                        }}
                        className="mt-1"
                        placeholder="Bijv. annulering door gast"
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteBooking}
                    disabled={deleteBooking.isPending}
                  >
                    {deleteArmed ? 'Bevestig definitief verwijderen' : 'Definitief verwijderen (2-staps)'}
                  </Button>
                </div>
              )}
            </section>
          )}

          {!booking.whatsapp_notified && (
            <section className="bg-card rounded-2xl border border-border shadow-soft p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{t.booking.helpWhatsapp}</h3>
                <p className="text-sm text-muted-foreground">{t.booking.dossierWhatsappHint}</p>
              </div>
              <Button variant="whatsapp" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDossier;
