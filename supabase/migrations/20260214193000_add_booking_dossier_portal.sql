-- Public booking dossier support (tokenized guest access + contract/review flow)

CREATE OR REPLACE FUNCTION public.generate_booking_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated text;
BEGIN
  generated := lower(encode(gen_random_bytes(16), 'hex'));
  RETURN generated;
END;
$$;

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS public_token text,
ADD COLUMN IF NOT EXISTS contract_file_path text,
ADD COLUMN IF NOT EXISTS contract_uploaded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS guest_contract_signed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS guest_contract_signed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS guest_contract_signed_name text,
ADD COLUMN IF NOT EXISTS review_author text,
ADD COLUMN IF NOT EXISTS review_rating integer,
ADD COLUMN IF NOT EXISTS review_text text,
ADD COLUMN IF NOT EXISTS review_submitted_at timestamp with time zone;

ALTER TABLE public.bookings
ALTER COLUMN public_token SET DEFAULT public.generate_booking_token();

UPDATE public.bookings
SET public_token = public.generate_booking_token()
WHERE public_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_public_token_key
ON public.bookings(public_token);

ALTER TABLE public.bookings
ALTER COLUMN public_token SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_review_rating_range'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_review_rating_range
      CHECK (review_rating IS NULL OR (review_rating >= 1 AND review_rating <= 5));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_public_booking(
  _guest_name text,
  _guest_email text,
  _guest_phone text,
  _check_in date,
  _check_out date,
  _num_guests integer,
  _message text,
  _language public.language,
  _total_price numeric,
  _cleaning_fee numeric
)
RETURNS TABLE(id uuid, public_token text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_booking public.bookings;
BEGIN
  IF _check_out <= _check_in THEN
    RAISE EXCEPTION 'check_out must be after check_in';
  END IF;

  INSERT INTO public.bookings (
    guest_name,
    guest_email,
    guest_phone,
    check_in,
    check_out,
    num_guests,
    message,
    language,
    total_price,
    cleaning_fee,
    status
  )
  VALUES (
    trim(_guest_name),
    trim(_guest_email),
    trim(_guest_phone),
    _check_in,
    _check_out,
    GREATEST(_num_guests, 1),
    NULLIF(trim(_message), ''),
    _language,
    _total_price,
    COALESCE(_cleaning_fee, 0),
    'pending'
  )
  RETURNING * INTO created_booking;

  RETURN QUERY
  SELECT created_booking.id, created_booking.public_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_booking_dossier(_token text)
RETURNS TABLE(
  id uuid,
  public_token text,
  guest_name text,
  guest_email text,
  guest_phone text,
  check_in date,
  check_out date,
  num_guests integer,
  message text,
  language public.language,
  status public.booking_status,
  total_price numeric,
  cleaning_fee numeric,
  deposit_amount numeric,
  deposit_paid boolean,
  deposit_paid_at timestamp with time zone,
  whatsapp_notified boolean,
  whatsapp_notified_at timestamp with time zone,
  contract_sent boolean,
  contract_sent_at timestamp with time zone,
  contract_file_path text,
  contract_uploaded_at timestamp with time zone,
  guest_contract_signed boolean,
  guest_contract_signed_at timestamp with time zone,
  guest_contract_signed_name text,
  contract_signed boolean,
  contract_signed_at timestamp with time zone,
  remaining_paid boolean,
  remaining_paid_at timestamp with time zone,
  payment_notes text,
  review_author text,
  review_rating integer,
  review_text text,
  review_submitted_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    b.id,
    b.public_token,
    b.guest_name,
    b.guest_email,
    b.guest_phone,
    b.check_in,
    b.check_out,
    b.num_guests,
    b.message,
    b.language,
    b.status,
    b.total_price,
    b.cleaning_fee,
    b.deposit_amount,
    b.deposit_paid,
    b.deposit_paid_at,
    b.whatsapp_notified,
    b.whatsapp_notified_at,
    b.contract_sent,
    b.contract_sent_at,
    b.contract_file_path,
    b.contract_uploaded_at,
    b.guest_contract_signed,
    b.guest_contract_signed_at,
    b.guest_contract_signed_name,
    b.contract_signed,
    b.contract_signed_at,
    b.remaining_paid,
    b.remaining_paid_at,
    CASE
      WHEN public.has_role(auth.uid(), 'admin') THEN b.payment_notes
      ELSE NULL
    END AS payment_notes,
    b.review_author,
    b.review_rating,
    b.review_text,
    b.review_submitted_at,
    b.created_at,
    b.updated_at
  FROM public.bookings b
  WHERE b.public_token = _token
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.sign_booking_contract(
  _token text,
  _full_name text
)
RETURNS TABLE(success boolean, signed_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  signature_time timestamp with time zone;
BEGIN
  UPDATE public.bookings
  SET
    guest_contract_signed = true,
    guest_contract_signed_at = COALESCE(guest_contract_signed_at, now()),
    guest_contract_signed_name = NULLIF(trim(_full_name), ''),
    updated_at = now()
  WHERE public_token = _token
    AND contract_sent = true
  RETURNING guest_contract_signed_at INTO signature_time;

  IF signature_time IS NULL THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, signature_time;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_booking_review(
  _token text,
  _author text,
  _rating integer,
  _review text
)
RETURNS TABLE(success boolean, submitted_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  review_time timestamp with time zone;
BEGIN
  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;

  UPDATE public.bookings
  SET
    review_author = NULLIF(trim(_author), ''),
    review_rating = _rating,
    review_text = NULLIF(trim(_review), ''),
    review_submitted_at = now(),
    updated_at = now()
  WHERE public_token = _token
    AND status = 'confirmed'
    AND check_out <= CURRENT_DATE
  RETURNING review_submitted_at INTO review_time;

  IF review_time IS NULL THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, review_time;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_public_booking(text, text, text, date, date, integer, text, public.language, numeric, numeric) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_dossier(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sign_booking_contract(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_booking_review(text, text, integer, text) TO anon, authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('booking-contracts', 'booking-contracts', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Booking contracts are public'
  ) THEN
    CREATE POLICY "Booking contracts are public"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'booking-contracts');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload booking contracts'
  ) THEN
    CREATE POLICY "Admins can upload booking contracts"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'booking-contracts' AND public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can update booking contracts'
  ) THEN
    CREATE POLICY "Admins can update booking contracts"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'booking-contracts' AND public.has_role(auth.uid(), 'admin'))
    WITH CHECK (bucket_id = 'booking-contracts' AND public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete booking contracts'
  ) THEN
    CREATE POLICY "Admins can delete booking contracts"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'booking-contracts' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END;
$$;
