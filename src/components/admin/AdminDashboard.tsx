import { useMemo, useState } from 'react';
import { translations } from '@/i18n';
import { Calendar, DollarSign, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AdminDashboard() {
  const t = translations.nl;
  const { data: bookings = [], isLoading } = useBookings();
  const [yearFilter, setYearFilter] = useState<string>('all');

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

  // Calculate stats from real data
  const stats = {
    totalBookings: bookingsByYear.length,
    pendingBookings: bookingsByYear.filter(b => b.status === 'pending').length,
    revenue: bookingsByYear
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.total_price), 0),
    confirmedBookings: bookingsByYear.filter(b => b.status === 'confirmed').length,
  };

  // Get recent bookings (last 5)
  const recentBookings = bookingsByYear.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {t.admin.dashboard}
          </h1>
          <p className="text-muted-foreground mt-1">Welkom terug! Hier is uw overzicht.</p>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
          <p className="text-sm text-muted-foreground">Totaal boekingen</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pendingBookings}</p>
          <p className="text-sm text-muted-foreground">In afwachting</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">€{stats.revenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Omzet</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.confirmedBookings}</p>
          <p className="text-sm text-muted-foreground">Bevestigd</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-card rounded-xl shadow-soft">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-lg font-semibold">Recente boekingen</h2>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Nog geen boekingen
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{booking.guest_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-primary/10 text-primary'
                        : booking.status === 'pending'
                        ? 'bg-accent/20 text-accent-foreground'
                        : booking.status === 'declined'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {t.admin[booking.status as keyof typeof t.admin] || booking.status}
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-1">€{Number(booking.total_price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
