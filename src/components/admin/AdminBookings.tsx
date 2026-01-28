import { useState } from 'react';
import { useLanguage } from '@/i18n';
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
import { Check, X, Eye, Mail, Phone, User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

// Mock bookings data
const initialBookings = [
  {
    id: 1,
    guestName: 'Sophie van den Berg',
    email: 'sophie@example.com',
    phone: '+31 6 12345678',
    checkIn: new Date(2026, 1, 15),
    checkOut: new Date(2026, 1, 22),
    guests: 2,
    totalPrice: 840,
    status: 'pending',
    message: 'Looking forward to our honeymoon!',
    language: 'nl',
  },
  {
    id: 2,
    guestName: 'James Wilson',
    email: 'james@example.com',
    phone: '+44 7911 123456',
    checkIn: new Date(2026, 1, 28),
    checkOut: new Date(2026, 2, 5),
    guests: 4,
    totalPrice: 700,
    status: 'confirmed',
    message: 'Family trip with kids',
    language: 'en',
  },
  {
    id: 3,
    guestName: 'Marie Dupont',
    email: 'marie@example.com',
    phone: '+33 6 12345678',
    checkIn: new Date(2026, 2, 10),
    checkOut: new Date(2026, 2, 15),
    guests: 2,
    totalPrice: 600,
    status: 'pending',
    message: '',
    language: 'fr',
  },
];

type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled';

export function AdminBookings() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<typeof initialBookings[0] | null>(null);

  const updateStatus = (id: number, status: BookingStatus) => {
    setBookings(bookings.map(b =>
      b.id === id ? { ...b, status } : b
    ));
    // In production, this would also send an email notification
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-accent/20 text-accent-foreground',
      confirmed: 'bg-primary/10 text-primary',
      declined: 'bg-destructive/10 text-destructive',
      cancelled: 'bg-muted text-muted-foreground',
    };
    const labels: Record<string, string> = {
      pending: t.admin.pending,
      confirmed: t.admin.confirmed,
      declined: t.admin.declined,
      cancelled: t.admin.cancelled,
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.bookings}
        </h1>
        <p className="text-muted-foreground mt-1">Manage all booking requests</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'declined'].map((filter) => (
          <Button
            key={filter}
            variant="outline"
            size="sm"
            className="capitalize"
          >
            {filter === 'all' ? 'All Bookings' : filter}
          </Button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-sm text-muted-foreground">{booking.guests} guests</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{format(booking.checkIn, 'MMM d')} - {format(booking.checkOut, 'MMM d, yyyy')}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">€{booking.totalPrice}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(booking.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:text-primary"
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => updateStatus(booking.id, 'declined')}
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
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.admin.guestDetails}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedBooking.guestName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.guests} guests
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${selectedBooking.email}`}
                  className="flex items-center gap-2 text-sm hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {selectedBooking.email}
                </a>
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  {selectedBooking.phone}
                </a>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium">{format(selectedBooking.checkIn, 'PPP')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">{format(selectedBooking.checkOut, 'PPP')}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-primary">€{selectedBooking.totalPrice}</span>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Message</p>
                  <p className="text-sm">{selectedBooking.message}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="whatsapp"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={`https://wa.me/${selectedBooking.phone.replace(/\D/g, '')}`}
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
                      variant="hero"
                      onClick={() => {
                        updateStatus(selectedBooking.id, 'confirmed');
                        setSelectedBooking(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
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
