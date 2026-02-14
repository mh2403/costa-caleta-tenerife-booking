-- Fix booking token generation so it does not depend on pgcrypto functions.
CREATE OR REPLACE FUNCTION public.generate_booking_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN lower(md5(random()::text || clock_timestamp()::text || coalesce(auth.uid()::text, 'anon')));
END;
$$;
