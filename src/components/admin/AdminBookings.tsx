import { useEffect, useMemo, useState } from 'react';
import { translations } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Check, X, Eye, Loader2, Mail, Phone, User, MessageCircle, Trash2 } from 'lucide-react';
import { useBookings, useUpdateBooking, useDeleteBooking, Booking, BookingStatus } from '@/hooks/useBookings';
import { addDays, differenceInDays, format, isWithinInterval, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useBlockedDates } from '@/hooks/useBlockedDates';
import { usePricingRules } from '@/hooks/usePricing';
import { useSettings } from '@/hooks/useSettings';

export function AdminBookings() {
  const t = translations.nl;
  const { toast } = useToast();
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

  const basePrice = settings?.base_price?.amount ?? 85;
  const cleaningFee = settings?.cleaning_fee?.amount ?? 50;

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
    } else {
      setEditCheckIn('');
      setEditCheckOut('');
      setDeleteReason('');
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

  const getMinStayForDate = (date: Date) => {
    const rule = pricingRules.find((r) =>
      isWithinInterval(date, {
        start: new Date(r.start_date),
        end: new Date(r.end_date),
      })
    );
    return rule?.min_stay ? Number(rule.min_stay) : 1;
  };

  const getMinStayForRange = (start: Date, end: Date) => {
    const nightsCount = Math.max(differenceInDays(end, start), 0);
    const nightsToCheck = nightsCount > 0 ? nightsCount : 1;
    let minStay = 1;

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
    if (nights < 1) {
      toast({
        title: t.common.error,
        description: 'Minstens 1 nacht vereist.',
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
        id: selectedBooking.id,
        check_in: editCheckIn,
        check_out: editCheckOut,
        total_price: recalculated.total,
        cleaning_fee: cleaningFee,
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
    const confirmed = window.confirm('Weet u zeker dat u deze boeking definitief wilt verwijderen?');
    if (!confirmed) return;
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

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[160px]">
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
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'confirmed', 'declined', 'cancelled'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
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

      {/* Bookings Table */}
      <div className="bg-card rounded-xl shadow-soft overflow-hidden">
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
                  <TableCell className="font-semibold">€{Number(booking.total_price).toLocaleString()}</TableCell>
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
                        onClick={() => setSelectedBooking(booking)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.admin.guestDetails}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Inchecken</label>
                    <Input
                      type="date"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Uitchecken</label>
                    <Input
                      type="date"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      className="mt-1"
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

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span>Totaal</span>
                  <span className="text-xl font-bold text-primary">€{Number(selectedBooking.total_price).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="whatsapp"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={`https://wa.me/${selectedBooking.guest_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                      disabled={updateBooking.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Bevestigen
                    </Button>
                    <Button
                      variant="destructive"
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
                    variant="outline"
                    onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    disabled={updateBooking.isPending}
                  >
                    Annuleren
                  </Button>
                )}
              </div>

              {['declined', 'confirmed', 'cancelled'].includes(selectedBooking.status) && (
                <div className="space-y-2">
                  {selectedBooking.status === 'confirmed' && (
                    <div>
                      <label className="text-xs text-muted-foreground">Reden voor verwijderen (verplicht)</label>
                      <Input
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
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
                    Definitief verwijderen
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
