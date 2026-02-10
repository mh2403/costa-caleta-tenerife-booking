import { useState } from 'react';
import { translations } from '@/i18n';
import { Button } from '@/components/ui/button';
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
import { Check, X, Eye, Loader2, Mail, Phone, User, MessageCircle } from 'lucide-react';
import { useBookings, useUpdateBooking, Booking, BookingStatus } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function AdminBookings() {
  const t = translations.nl;
  const { toast } = useToast();
  const { data: bookings = [], isLoading } = useBookings();
  const updateBooking = useUpdateBooking();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

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

  if (isLoading) {
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
                {bookings.filter(b => b.status === status).length}
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
