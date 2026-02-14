import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, X, Eye, Loader2, Mail, Phone, User, Trash2 } from 'lucide-react';
import { useBookings, useUpdateBooking, useDeleteBooking, Booking, BookingStatus, BookingUpdate } from '@/hooks/useBookings';
import { addDays, differenceInDays, format, isWithinInterval, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useBlockedDates } from '@/hooks/useBlockedDates';
import { usePricingRules } from '@/hooks/usePricing';
import { useSettings } from '@/hooks/useSettings';
import { bookingFlowConfig } from '@/lib/bookingFlowConfig';

export function AdminBookings() {
  const t = translations.nl;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useBookings();
  const { data: blockedDatesData = [], isLoading: loadingBlocked } = useBlockedDates();
  const { data: pricingRules = [], isLoading: loadingPricing } = usePricingRules();
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [paymentNotesDraft, setPaymentNotesDraft] = useState('');
  const [cancelArmed, setCancelArmed] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);

  const basePrice = settings?.base_price?.amount ?? 85;
  const cleaningFee = bookingFlowConfig.cleaningFee;
  const minStayNights = bookingFlowConfig.minStayNights;
  const selectedBookingFieldKeys = useMemo(
    () => new Set(Object.keys(selectedBooking ?? {})),
    [selectedBooking]
  );

  const sanitizeBookingUpdatePayload = (payload: Record<string, unknown>) => {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined) continue;
      if (key === 'id' || selectedBookingFieldKeys.has(key)) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(bookings.map((b) => new Date(b.check_in).getFullYear()))
    );
    return uniqueYears.sort((a, b) => b - a);
  }, [bookings]);

  const bookingsByYear = useMemo(() => {
    if (yearFilter === 'all') return bookings;
    const targetYear = Number(yearFilter);
    return bookings.filter((b) => new Date(b.check_in).getFullYear() === targetYear);
  }, [bookings, yearFilter]);

  const filteredBookings = filter === 'all'
    ? bookingsByYear
    : bookingsByYear.filter(b => b.status === filter);

  const isLoadingAll = isLoading || loadingBlocked || loadingPricing || loadingSettings;

  useEffect(() => {
    if (selectedBooking) {
      setEditCheckIn(format(new Date(selectedBooking.check_in), 'yyyy-MM-dd'));
      setEditCheckOut(format(new Date(selectedBooking.check_out), 'yyyy-MM-dd'));
      setDeleteReason('');
      setPaymentNotesDraft(selectedBooking.payment_notes ?? '');
      setCancelArmed(false);
      setDeleteArmed(false);
    } else {
      setEditCheckIn('');
      setEditCheckOut('');
      setDeleteReason('');
      setPaymentNotesDraft('');
      setCancelArmed(false);
      setDeleteArmed(false);
    }
  }, [selectedBooking]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await updateBooking.mutateAsync({ id, status });
      toast({
        title: t.common.success,
        description: `Boeking ${t.admin[status] ?? status}`,
      });
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: t.common.error,
        description: 'Boeking bijwerken mislukt',
        variant: 'destructive',
      });
    }
  };

  const openBookingDossier = (booking: Booking) => {
    if (booking.public_token) {
      navigate(`/booking/dossier/${booking.public_token}`);
      return;
    }

    toast({
      title: t.common.error,
      description: 'Geen dossierlink beschikbaar voor deze boeking. Open details via popup.',
      variant: 'destructive',
    });
    setSelectedBooking(booking);
  };

  const rangeOverlaps = (startA: Date, endA: Date, startB: Date, endB: Date) => {
    return startA <= endB && startB <= endA;
  };

  const normalizeRange = (start: Date, end: Date) => {
    const rangeStart = startOfDay(start);
    const rangeEnd = startOfDay(addDays(end, -1));
    return { rangeStart, rangeEnd };
  };

  const hasOverlapWithBookings = (start: Date, end: Date, excludeId: string) => {
    const { rangeStart, rangeEnd } = normalizeRange(start, end);
    if (rangeEnd < rangeStart) return true;
    return bookings.some((booking) => {
      if (booking.id === excludeId) return false;
      if (!['pending', 'confirmed'].includes(booking.status)) return false;
      const bookingStart = startOfDay(new Date(booking.check_in));
      const bookingEnd = startOfDay(addDays(new Date(booking.check_out), -1));
      return rangeOverlaps(rangeStart, rangeEnd, bookingStart, bookingEnd);
    });
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

  const handleDateUpdate = async () => {
    if (!selectedBooking) return;
    if (!editCheckIn || !editCheckOut) {
      toast({
        title: t.common.error,
        description: 'Selecteer een geldige in- en uitcheckdatum.',
        variant: 'destructive',
      });
      return;
    }
    if (new Date(editCheckOut) <= new Date(editCheckIn)) {
      toast({
        title: t.common.error,
        description: 'Uitcheckdatum moet na de incheckdatum liggen.',
        variant: 'destructive',
      });
      return;
    }

    const start = new Date(editCheckIn);
    const end = new Date(editCheckOut);
    const nights = differenceInDays(end, start);
    if (nights < minStayNights) {
      toast({
        title: t.common.error,
        description: `Minstens ${minStayNights} nachten vereist.`,
        variant: 'destructive',
      });
      return;
    }

    if (hasOverlapWithBookings(start, end, selectedBooking.id)) {
      toast({
        title: t.common.error,
        description: 'Deze data overlappen met een andere boeking.',
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

    const minStay = getMinStayForRange(start, end);
    if (nights < minStay) {
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
          id: selectedBooking.id,
          check_in: editCheckIn,
          check_out: editCheckOut,
          total_price: recalculated.total,
          cleaning_fee: cleaningFee,
          deposit_amount: Number((recalculated.total * bookingFlowConfig.depositRatio).toFixed(2)),
        }) as BookingUpdate & { id: string }),
      });
      toast({
        title: t.common.success,
        description: 'Boekingsdata en prijs bijgewerkt',
      });
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: t.common.error,
        description: 'Boekingsdata bijwerken mislukt',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;
    if (selectedBooking.status === 'confirmed' && !deleteReason.trim()) {
      toast({
        title: t.common.error,
        description: 'Geef een reden op voor het verwijderen van een bevestigde boeking.',
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
      await deleteBooking.mutateAsync(selectedBooking.id);
      toast({
        title: t.common.success,
        description: 'Boeking verwijderd',
      });
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: t.common.error,
        description: 'Boeking verwijderen mislukt',
        variant: 'destructive',
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || selectedBooking.status !== 'confirmed') return;

    if (!cancelArmed) {
      setCancelArmed(true);
      toast({
        title: t.common.error,
        description: 'Klik nogmaals op annuleren om te bevestigen.',
      });
      return;
    }

    await handleStatusChange(selectedBooking.id, 'cancelled');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary/10 text-primary';
      case 'pending':
        return 'bg-accent/20 text-accent-foreground';
      case 'declined':
        return 'bg-destructive/10 text-destructive';
      case 'cancelled':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => `€${Number(amount).toLocaleString()}`;

  const getDepositAmount = (booking: Booking) =>
    Number((Number(booking.total_price ?? 0) * bookingFlowConfig.depositRatio).toFixed(2));

  const getRemainingAmount = (booking: Booking) => {
    const total = Number(booking.total_price ?? 0);
    const deposit = getDepositAmount(booking);
    return Math.max(total - deposit, 0);
  };

  const getPaymentSummary = (booking: Booking) => {
    if (booking.status === 'cancelled') {
      return {
        label: 'Geannuleerd',
        className: 'bg-muted text-muted-foreground',
      };
    }
    if (booking.status === 'declined') {
      return {
        label: 'Afgewezen',
        className: 'bg-destructive/10 text-destructive',
      };
    }
    if (booking.remaining_paid) {
      return {
        label: 'Volledig afgerond',
        className: 'bg-primary/10 text-primary',
      };
    }
    if (booking.deposit_paid) {
      return {
        label: '30% voorschot ontvangen',
        className: 'bg-secondary/15 text-secondary',
      };
    }
    if (booking.contract_sent && !booking.guest_contract_signed) {
      return {
        label: 'Wacht op ondertekend contract',
        className: 'bg-accent/20 text-accent-foreground',
      };
    }
    if (booking.status === 'confirmed') {
      return {
        label: 'Bevestigd, wacht op contractfase',
        className: 'bg-accent/20 text-accent-foreground',
      };
    }
    return {
      label: 'Wacht op bevestiging',
      className: 'bg-accent/20 text-accent-foreground',
    };
  };

  const getContractSummary = (booking: Booking) => {
    if (booking.contract_signed) return 'Dossier finaal bevestigd';
    if (booking.remaining_paid) return '70% restbedrag ontvangen';
    if (booking.deposit_paid) return '30% voorschot ontvangen';
    if (booking.guest_contract_signed) return 'Ondertekend contract ontvangen';
    if (booking.contract_sent) return 'Contract verzonden';
    if (booking.status === 'confirmed') return 'Boeking bevestigd';
    if (booking.whatsapp_notified) return 'WhatsApp melding ontvangen';
    return 'Nog niet opgestart';
  };

  const formatDateTime = (value: string | null) =>
    value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '-';

  const handleProgressUpdate = async (updates: Partial<Booking>, successMessage: string) => {
    if (!selectedBooking) return;

    try {
      const updated = await updateBooking.mutateAsync({
        ...(sanitizeBookingUpdatePayload({
          id: selectedBooking.id,
          ...updates,
        }) as BookingUpdate & { id: string }),
      });
      setSelectedBooking(updated);
      toast({
        title: t.common.success,
        description: successMessage,
      });
    } catch (error) {
      toast({
        title: t.common.error,
        description: 'Betalings- of contractstatus bijwerken mislukt',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingAll) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.bookings}
        </h1>
        <p className="text-muted-foreground mt-1">Beheer alle boekingsaanvragen</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Alle jaren" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Alle jaren</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {(['all', 'pending', 'confirmed', 'declined', 'cancelled'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className="w-full sm:w-auto"
          >
            {status === 'all' ? 'Alle' : t.admin[status]}
            {status !== 'all' && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-background/20 text-xs">
                {bookingsByYear.filter(b => b.status === status).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground bg-card rounded-xl shadow-soft">
            {t.common.noResults}
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const isPending = booking.status === 'pending';
            return (
              <div key={booking.id} className="bg-card rounded-xl shadow-soft p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{booking.guest_name}</p>
                  <p className="text-xs text-muted-foreground">{booking.guest_email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {t.admin[booking.status as keyof typeof t.admin] || booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gasten</p>
                  <p className="font-medium">{booking.num_guests}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Totaal</p>
                  <p className="font-medium">{formatCurrency(Number(booking.total_price))}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Betaling</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentSummary(booking).className}`}>
                      {getPaymentSummary(booking).label}
                    </span>
                    <span className="text-xs text-muted-foreground">{getContractSummary(booking)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openBookingDossier(booking)}
                  className="col-span-2"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open dossier
                </Button>
                {isPending && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      disabled={updateBooking.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Bevestig
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(booking.id, 'declined')}
                      disabled={updateBooking.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Afwijs
                    </Button>
                  </>
                )}
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card rounded-xl shadow-soft overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t.common.noResults}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gast</TableHead>
                <TableHead>Data</TableHead>
              <TableHead>Gasten</TableHead>
              <TableHead>Totaal</TableHead>
              <TableHead>Betaling</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d, yyyy')}
                    </p>
                  </TableCell>
                  <TableCell>{booking.num_guests}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(Number(booking.total_price))}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentSummary(booking).className}`}>
                        {getPaymentSummary(booking).label}
                      </span>
                      <p className="text-xs text-muted-foreground">{getContractSummary(booking)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {t.admin[booking.status as keyof typeof t.admin] || booking.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openBookingDossier(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            disabled={updateBooking.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleStatusChange(booking.id, 'declined')}
                            disabled={updateBooking.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent
          className="w-[94vw] max-w-[94vw] p-4 sm:w-full sm:max-w-lg sm:p-6 max-h-[88vh] overflow-y-auto overflow-x-hidden"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t.admin.guestDetails}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Inchecken</p>
                  <p className="font-semibold">{format(new Date(selectedBooking.check_in), 'PPP')}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Uitchecken</p>
                  <p className="font-semibold">{format(new Date(selectedBooking.check_out), 'PPP')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedBooking.guest_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedBooking.guest_email}`} className="text-primary hover:underline">
                    {selectedBooking.guest_email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedBooking.guest_phone}`} className="text-primary hover:underline">
                    {selectedBooking.guest_phone}
                  </a>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">Bericht</p>
                  <p>{selectedBooking.message}</p>
                </div>
              )}

              <div className="bg-muted rounded-lg p-3 space-y-3">
                <p className="text-sm text-muted-foreground">Boekingsdata aanpassen</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Inchecken</label>
                    <Input
                      type="date"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Uitchecken</label>
                    <Input
                      type="date"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      className="mt-1 text-base"
                    />
                  </div>
                </div>
                {editCheckIn && editCheckOut && differenceInDays(new Date(editCheckOut), new Date(editCheckIn)) > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Nieuwe prijs: €{Number(calculateTotalPrice(new Date(editCheckIn), new Date(editCheckOut)).total).toLocaleString()}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDateUpdate}
                  disabled={updateBooking.isPending}
                >
                  Boekingsdata opslaan
                </Button>
              </div>

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Totaal</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(Number(selectedBooking.total_price))}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">30% voorschot</span>
                  <span className="font-medium">{formatCurrency(getDepositAmount(selectedBooking))}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">70% restbedrag</span>
                  <span className="font-medium">{formatCurrency(getRemainingAmount(selectedBooking))}</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-foreground">Betaling & contract opvolging</h4>
                  <span
                    className={`shrink-0 whitespace-nowrap px-2.5 py-1 text-center text-xs font-medium leading-none rounded-full ${getPaymentSummary(selectedBooking).className}`}
                  >
                    {getPaymentSummary(selectedBooking).label}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">1. WhatsApp melding ontvangen</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.whatsapp_notified
                          ? `Afgerond op ${formatDateTime(selectedBooking.whatsapp_notified_at)}`
                          : 'Nog niet gemeld'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.whatsapp_notified ? 'outline' : 'default'}
                      disabled={updateBooking.isPending}
                      onClick={() => {
                        const nextValue = !selectedBooking.whatsapp_notified;
                        handleProgressUpdate(
                          {
                            whatsapp_notified: nextValue,
                            whatsapp_notified_at: nextValue ? new Date().toISOString() : null,
                            status: nextValue ? selectedBooking.status : 'pending',
                            contract_sent: nextValue ? selectedBooking.contract_sent : false,
                            contract_sent_at: nextValue ? selectedBooking.contract_sent_at : null,
                            guest_contract_signed: nextValue ? selectedBooking.guest_contract_signed : false,
                            guest_contract_signed_at: nextValue ? selectedBooking.guest_contract_signed_at : null,
                            guest_contract_signed_name: nextValue ? selectedBooking.guest_contract_signed_name : null,
                            guest_signed_contract_file_path: nextValue ? selectedBooking.guest_signed_contract_file_path : null,
                            guest_signed_contract_uploaded_at: nextValue ? selectedBooking.guest_signed_contract_uploaded_at : null,
                            deposit_paid: nextValue ? selectedBooking.deposit_paid : false,
                            deposit_paid_at: nextValue ? selectedBooking.deposit_paid_at : null,
                            remaining_paid: nextValue ? selectedBooking.remaining_paid : false,
                            remaining_paid_at: nextValue ? selectedBooking.remaining_paid_at : null,
                            contract_signed: nextValue ? selectedBooking.contract_signed : false,
                            contract_signed_at: nextValue ? selectedBooking.contract_signed_at : null,
                          },
                          nextValue ? 'WhatsApp melding gemarkeerd' : 'WhatsApp-status teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.whatsapp_notified ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">2. Boeking bevestigd door eigenaar</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.status === 'confirmed'
                          ? `Afgerond op ${formatDateTime(selectedBooking.updated_at)}`
                          : 'Nog niet bevestigd'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.status === 'confirmed' ? 'outline' : 'default'}
                      disabled={updateBooking.isPending || !selectedBooking.whatsapp_notified}
                      onClick={() => {
                        const nextValue = selectedBooking.status !== 'confirmed';
                        handleProgressUpdate(
                          {
                            status: nextValue ? 'confirmed' : 'pending',
                            contract_sent: nextValue ? selectedBooking.contract_sent : false,
                            contract_sent_at: nextValue ? selectedBooking.contract_sent_at : null,
                            guest_contract_signed: nextValue ? selectedBooking.guest_contract_signed : false,
                            guest_contract_signed_at: nextValue ? selectedBooking.guest_contract_signed_at : null,
                            guest_contract_signed_name: nextValue ? selectedBooking.guest_contract_signed_name : null,
                            guest_signed_contract_file_path: nextValue ? selectedBooking.guest_signed_contract_file_path : null,
                            guest_signed_contract_uploaded_at: nextValue ? selectedBooking.guest_signed_contract_uploaded_at : null,
                            deposit_paid: nextValue ? selectedBooking.deposit_paid : false,
                            deposit_paid_at: nextValue ? selectedBooking.deposit_paid_at : null,
                            remaining_paid: nextValue ? selectedBooking.remaining_paid : false,
                            remaining_paid_at: nextValue ? selectedBooking.remaining_paid_at : null,
                            contract_signed: nextValue ? selectedBooking.contract_signed : false,
                            contract_signed_at: nextValue ? selectedBooking.contract_signed_at : null,
                          },
                          nextValue ? 'Boeking bevestigd' : 'Bevestiging teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.status === 'confirmed' ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">3. Contract verzonden</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.contract_sent
                          ? `Verzonden op ${formatDateTime(selectedBooking.contract_sent_at)}`
                          : 'Nog niet verzonden'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.contract_sent ? 'outline' : 'default'}
                      disabled={updateBooking.isPending || selectedBooking.status !== 'confirmed'}
                      onClick={() => {
                        const nextValue = !selectedBooking.contract_sent;
                        handleProgressUpdate(
                          {
                            contract_sent: nextValue,
                            contract_sent_at: nextValue ? new Date().toISOString() : null,
                            guest_contract_signed: nextValue ? selectedBooking.guest_contract_signed : false,
                            guest_contract_signed_at: nextValue ? selectedBooking.guest_contract_signed_at : null,
                            guest_contract_signed_name: nextValue ? selectedBooking.guest_contract_signed_name : null,
                            guest_signed_contract_file_path: nextValue ? selectedBooking.guest_signed_contract_file_path : null,
                            guest_signed_contract_uploaded_at: nextValue ? selectedBooking.guest_signed_contract_uploaded_at : null,
                            deposit_paid: nextValue ? selectedBooking.deposit_paid : false,
                            deposit_paid_at: nextValue ? selectedBooking.deposit_paid_at : null,
                            remaining_paid: nextValue ? selectedBooking.remaining_paid : false,
                            remaining_paid_at: nextValue ? selectedBooking.remaining_paid_at : null,
                            contract_signed: nextValue ? selectedBooking.contract_signed : false,
                            contract_signed_at: nextValue ? selectedBooking.contract_signed_at : null,
                          },
                          nextValue ? 'Contract gemarkeerd als verzonden' : 'Contract verzendstatus teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.contract_sent ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">4. Ondertekend contract ontvangen van gast</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.guest_contract_signed
                          ? `Ontvangen op ${formatDateTime(selectedBooking.guest_signed_contract_uploaded_at ?? selectedBooking.guest_contract_signed_at)}`
                          : 'Nog niet ontvangen'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.guest_contract_signed ? 'outline' : 'default'}
                      disabled={updateBooking.isPending || !selectedBooking.contract_sent}
                      onClick={() => {
                        const nextValue = !selectedBooking.guest_contract_signed;
                        handleProgressUpdate(
                          {
                            guest_contract_signed: nextValue,
                            guest_contract_signed_at: nextValue ? new Date().toISOString() : null,
                            guest_signed_contract_file_path: nextValue ? selectedBooking.guest_signed_contract_file_path : null,
                            guest_signed_contract_uploaded_at: nextValue ? selectedBooking.guest_signed_contract_uploaded_at : null,
                            deposit_paid: nextValue ? selectedBooking.deposit_paid : false,
                            deposit_paid_at: nextValue ? selectedBooking.deposit_paid_at : null,
                            remaining_paid: nextValue ? selectedBooking.remaining_paid : false,
                            remaining_paid_at: nextValue ? selectedBooking.remaining_paid_at : null,
                            contract_signed: nextValue ? selectedBooking.contract_signed : false,
                            contract_signed_at: nextValue ? selectedBooking.contract_signed_at : null,
                          },
                          nextValue ? 'Ondertekend contract gemarkeerd als ontvangen' : 'Ondertekend contract-status teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.guest_contract_signed ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">5. 30% voorschot ontvangen</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.deposit_paid
                          ? `Ontvangen op ${formatDateTime(selectedBooking.deposit_paid_at)}`
                          : 'Nog niet ontvangen'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.deposit_paid ? 'outline' : 'default'}
                      disabled={updateBooking.isPending || !selectedBooking.guest_contract_signed}
                      onClick={() => {
                        const nextValue = !selectedBooking.deposit_paid;
                        handleProgressUpdate(
                          {
                            deposit_paid: nextValue,
                            deposit_paid_at: nextValue ? new Date().toISOString() : null,
                            remaining_paid: nextValue ? selectedBooking.remaining_paid : false,
                            remaining_paid_at: nextValue ? selectedBooking.remaining_paid_at : null,
                            contract_signed: nextValue ? selectedBooking.contract_signed : false,
                            contract_signed_at: nextValue ? selectedBooking.contract_signed_at : null,
                          },
                          nextValue ? 'Voorschot gemarkeerd als ontvangen' : 'Voorschot-status teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.deposit_paid ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">6. 70% restbedrag ontvangen</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.remaining_paid
                          ? `Ontvangen op ${formatDateTime(selectedBooking.remaining_paid_at)}`
                          : 'Nog niet ontvangen'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.remaining_paid ? 'outline' : 'default'}
                      disabled={updateBooking.isPending || !selectedBooking.deposit_paid}
                      onClick={() => {
                        const nextValue = !selectedBooking.remaining_paid;
                        handleProgressUpdate(
                          {
                            remaining_paid: nextValue,
                            remaining_paid_at: nextValue ? new Date().toISOString() : null,
                            contract_signed: nextValue ? selectedBooking.contract_signed : false,
                            contract_signed_at: nextValue ? selectedBooking.contract_signed_at : null,
                          },
                          nextValue ? 'Resterend bedrag gemarkeerd als ontvangen' : 'Restsaldo-status teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.remaining_paid ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                    <div>
                      <p className="text-sm font-medium">7. Boeking volledig afgehandeld</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.contract_signed
                          ? `Afgerond op ${formatDateTime(selectedBooking.contract_signed_at)}`
                          : 'Nog niet afgerond'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={selectedBooking.contract_signed ? 'outline' : 'default'}
                      disabled={updateBooking.isPending || !selectedBooking.deposit_paid || !selectedBooking.remaining_paid}
                      onClick={() => {
                        const nextValue = !selectedBooking.contract_signed;
                        handleProgressUpdate(
                          {
                            contract_signed: nextValue,
                            contract_signed_at: nextValue ? new Date().toISOString() : null,
                          },
                          nextValue ? 'Boeking gemarkeerd als volledig afgehandeld' : 'Finale status teruggezet'
                        );
                      }}
                    >
                      {selectedBooking.contract_signed ? 'Terugzetten' : 'Markeer'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Interne notities (betalingen/contract)</label>
                  <Textarea
                    value={paymentNotesDraft}
                    onChange={(e) => setPaymentNotesDraft(e.target.value)}
                    rows={3}
                    placeholder="Bijv. voorschot ontvangen op 14/02, contract verzonden op 15/02..."
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleProgressUpdate({ payment_notes: paymentNotesDraft.trim() || null }, 'Notities opgeslagen')}
                    disabled={updateBooking.isPending}
                  >
                    Notities opslaan
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      className="w-full sm:flex-1"
                      onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                      disabled={updateBooking.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Bevestigen
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full sm:flex-1"
                      onClick={() => handleStatusChange(selectedBooking.id, 'declined')}
                      disabled={updateBooking.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Afwijzen
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <Button
                    variant={cancelArmed ? 'destructive' : 'outline'}
                    className="w-full sm:flex-1"
                    onClick={handleCancelBooking}
                    disabled={updateBooking.isPending}
                  >
                    {cancelArmed ? 'Bevestig annuleren' : 'Annuleren (2-staps)'}
                  </Button>
                )}
              </div>

              {['pending', 'declined', 'confirmed', 'cancelled'].includes(selectedBooking.status) && (
                <div className="space-y-2">
                  {selectedBooking.status === 'confirmed' && (
                    <div>
                      <label className="text-xs text-muted-foreground">Reden voor verwijderen (verplicht)</label>
                      <Input
                        value={deleteReason}
                        onChange={(e) => {
                          setDeleteReason(e.target.value);
                          setDeleteArmed(false);
                        }}
                        className="mt-1"
                        placeholder="Bijv. annulering door gast"
                      />
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDelete}
                    disabled={deleteBooking.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteArmed ? 'Bevestig definitief verwijderen' : 'Definitief verwijderen (2-staps)'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
