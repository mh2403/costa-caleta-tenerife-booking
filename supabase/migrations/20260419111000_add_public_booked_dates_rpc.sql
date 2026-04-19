-- Expose booked date ranges to the public booking calendar without exposing guest data.

CREATE OR REPLACE FUNCTION public.get_public_booked_dates()
RETURNS TABLE(check_in date, check_out date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.check_in, b.check_out
  FROM public.bookings b
  WHERE b.status IN ('pending'::public.booking_status, 'confirmed'::public.booking_status);
$$;

GRANT EXECUTE ON FUNCTION public.get_public_booked_dates() TO anon, authenticated;
