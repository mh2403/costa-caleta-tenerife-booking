-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'declined', 'cancelled');

-- Create enum for supported languages
CREATE TYPE public.language AS ENUM ('en', 'nl', 'es', 'fr');

-- Create enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table for secure admin authentication
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    num_guests INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    language language NOT NULL DEFAULT 'en',
    status booking_status NOT NULL DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Seasonal pricing rules table
CREATE TABLE public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    min_stay INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pricing_rules
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- Base pricing / settings table
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Blocked dates table (for personal use / maintenance)
CREATE TABLE public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blocked_dates
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Translations table for admin-editable content
CREATE TABLE public.translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    language language NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (key, language)
);

-- Enable RLS on translations
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles: only admins can view/manage roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookings: public can insert, admins can view/manage
CREATE POLICY "Anyone can create booking requests"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Pricing rules: public can read, admins can manage
CREATE POLICY "Anyone can view pricing rules"
ON public.pricing_rules FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage pricing rules"
ON public.pricing_rules FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Settings: public can read, admins can manage
CREATE POLICY "Anyone can view settings"
ON public.settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage settings"
ON public.settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Blocked dates: public can read (for availability), admins can manage
CREATE POLICY "Anyone can view blocked dates"
ON public.blocked_dates FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage blocked dates"
ON public.blocked_dates FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Translations: public can read, admins can manage
CREATE POLICY "Anyone can view translations"
ON public.translations FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage translations"
ON public.translations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
    BEFORE UPDATE ON public.pricing_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON public.translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
    ('base_price', '{"amount": 85}'),
    ('cleaning_fee', '{"amount": 50}'),
    ('check_in_time', '{"time": "15:00"}'),
    ('check_out_time', '{"time": "10:00"}'),
    ('max_guests', '{"count": 4}'),
    ('owner_email', '{"email": "owner@example.com"}'),
    ('owner_phone', '{"phone": "+34 XXX XXX XXX"}'),
    ('whatsapp_number', '{"number": "+34XXXXXXXXX"}'),
    ('currency', '{"code": "EUR", "symbol": "€"}');