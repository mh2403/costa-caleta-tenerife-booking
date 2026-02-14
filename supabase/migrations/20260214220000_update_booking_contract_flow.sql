-- Update booking contract/payment flow:
-- - manual signed contract upload by guest
-- - dossier fields for guest-uploaded signed contract
-- - secure RPC to bind guest upload to booking token
-- - storage bucket/policies for guest uploads

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS guest_signed_contract_file_path text,
ADD COLUMN IF NOT EXISTS guest_signed_contract_uploaded_at timestamp with time zone;

-- Make cleaning fee policy explicit for the new standard flow.
ALTER TABLE public.bookings
ALTER COLUMN cleaning_fee SET DEFAULT 140;

-- Keep legacy data consistent with current business rule.
UPDATE public.bookings
SET cleaning_fee = 140
WHERE cleaning_fee IS NULL OR cleaning_fee <> 140;

-- Keep deposit amount aligned to 30% of total for existing rows where needed.
UPDATE public.bookings
SET deposit_amount = ROUND((total_price * 0.30)::numeric, 2)
WHERE deposit_amount IS DISTINCT FROM ROUND((total_price * 0.30)::numeric, 2);

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
  minimum_nights integer := 6;
  effective_cleaning_fee numeric := 140;
BEGIN
  IF _check_out <= _check_in THEN
    RAISE EXCEPTION 'check_out must be after check_in';
  END IF;

  IF (_check_out - _check_in) < minimum_nights THEN
    RAISE EXCEPTION 'minimum stay is % nights', minimum_nights;
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
    deposit_amount,
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
    effective_cleaning_fee,
    ROUND((_total_price * 0.30)::numeric, 2),
    'pending'
  )
  RETURNING * INTO created_booking;

  RETURN QUERY
  SELECT created_booking.id, created_booking.public_token;
END;
$$;

-- Required because RETURN TABLE shape changed versus the older function definition.
DROP FUNCTION IF EXISTS public.get_booking_dossier(text);

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
  guest_signed_contract_file_path text,
  guest_signed_contract_uploaded_at timestamp with time zone,
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
    b.guest_signed_contract_file_path,
    b.guest_signed_contract_uploaded_at,
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

CREATE OR REPLACE FUNCTION public.submit_signed_contract(
  _token text,
  _file_path text
)
RETURNS TABLE(success boolean, uploaded_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  saved_at timestamp with time zone;
BEGIN
  IF COALESCE(trim(_token), '') = '' OR COALESCE(trim(_file_path), '') = '' THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  IF _file_path NOT LIKE format('guest-signed/%s/%%', _token) THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  UPDATE public.bookings
  SET
    guest_contract_signed = true,
    guest_contract_signed_at = now(),
    guest_contract_signed_name = COALESCE(NULLIF(guest_contract_signed_name, ''), guest_name),
    guest_signed_contract_file_path = _file_path,
    guest_signed_contract_uploaded_at = now(),
    updated_at = now()
  WHERE public_token = _token
    AND contract_sent = true
  RETURNING guest_signed_contract_uploaded_at INTO saved_at;

  IF saved_at IS NULL THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, saved_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_signed_contract(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_dossier(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_public_booking(text, text, text, date, date, integer, text, public.language, numeric, numeric) TO anon, authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-signed-contracts',
  'booking-signed-contracts',
  false,
  15728640,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Guests can upload signed contracts by booking token'
  ) THEN
    CREATE POLICY "Guests can upload signed contracts by booking token"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
      bucket_id = 'booking-signed-contracts'
      AND name ~ '^guest-signed/[0-9a-f]{32}/[0-9]{13}-[a-z0-9._-]+$'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can read signed contracts'
  ) THEN
    CREATE POLICY "Admins can read signed contracts"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'booking-signed-contracts' AND public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can update signed contracts'
  ) THEN
    CREATE POLICY "Admins can update signed contracts"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'booking-signed-contracts' AND public.has_role(auth.uid(), 'admin'))
    WITH CHECK (bucket_id = 'booking-signed-contracts' AND public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can delete signed contracts'
  ) THEN
    CREATE POLICY "Admins can delete signed contracts"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'booking-signed-contracts' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END;
$$;
