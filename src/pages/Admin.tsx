import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  CalendarX,
  LogOut,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminPricing } from '@/components/admin/AdminPricing';
import { AdminAvailability } from '@/components/admin/AdminAvailability';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message || t.admin.invalidCredentials);
      }
    } catch (err) {
      setError(t.admin.invalidCredentials);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin');
  };

  const navItems = [
    { path: '/admin', label: t.admin.dashboard, icon: LayoutDashboard, exact: true },
    { path: '/admin/bookings', label: t.admin.bookings, icon: Calendar },
    { path: '/admin/pricing', label: t.admin.pricing, icon: DollarSign },
    { path: '/admin/availability', label: t.admin.availability, icon: CalendarX },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login form if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl p-8 shadow-medium">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌴</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {t.admin.login}
              </h1>
              {user && !isAdmin && (
                <p className="text-sm text-muted-foreground mt-2">
                  You don't have admin access. Please contact the owner.
                </p>
              )}
            </div>

            {!user ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t.admin.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button variant="hero" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t.common.loading}
                    </>
                  ) : (
                    t.admin.login
                  )}
                </Button>
              </form>
            ) : (
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                {t.admin.logout}
              </Button>
            )}

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-soft"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform md:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌴</span>
              <span className="font-heading text-xl font-semibold">Casa Tenerife</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.path, item.exact)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 truncate">
              {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {t.admin.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-0 pt-16 md:pt-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/bookings" element={<AdminBookings />} />
          <Route path="/pricing" element={<AdminPricing />} />
          <Route path="/availability" element={<AdminAvailability />} />
        </Routes>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
