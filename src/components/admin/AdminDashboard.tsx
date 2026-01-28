import { useLanguage } from '@/i18n';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

// Mock data
const stats = {
  totalBookings: 24,
  pendingBookings: 3,
  revenue: 12450,
  occupancyRate: 72,
};

const recentBookings = [
  { id: 1, guest: 'Sophie van den Berg', dates: 'Feb 15 - Feb 22', status: 'confirmed', amount: 840 },
  { id: 2, guest: 'James Wilson', dates: 'Feb 28 - Mar 5', status: 'pending', amount: 700 },
  { id: 3, guest: 'Marie Dupont', dates: 'Mar 10 - Mar 15', status: 'pending', amount: 600 },
];

export function AdminDashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          {t.admin.dashboard}
        </h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
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
          <p className="text-sm text-muted-foreground">Total Bookings</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pendingBookings}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">€{stats.revenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Revenue</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.occupancyRate}%</p>
          <p className="text-sm text-muted-foreground">Occupancy</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-card rounded-xl shadow-soft">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-lg font-semibold">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-border">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{booking.guest}</p>
                <p className="text-sm text-muted-foreground">{booking.dates}</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/20 text-accent-foreground'
                  }`}
                >
                  {booking.status === 'confirmed' ? t.admin.confirmed : t.admin.pending}
                </span>
                <p className="text-sm font-semibold text-foreground mt-1">€{booking.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
