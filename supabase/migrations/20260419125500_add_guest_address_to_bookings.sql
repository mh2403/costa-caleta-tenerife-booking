-- Add guest address support to booking requests and booking dossier payloads.

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS guest_address text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_guest_address_not_blank'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_guest_address_not_blank
      CHECK (guest_address IS NULL OR length(trim(guest_address)) > 0);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_public_booking(
  _guest_name text,
  _guest_email text,
  _guest_phone text,
  _guest_address text,
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
  sanitized_address text := NULLIF(trim(_guest_address), '');
BEGIN
  IF _check_out <= _check_in THEN
    RAISE EXCEPTION 'check_out must be after check_in';
  END IF;

  IF (_check_out - _check_in) < minimum_nights THEN
    RAISE EXCEPTION 'minimum stay is % nights', minimum_nights;
  END IF;

  IF sanitized_address IS NULL THEN
    RAISE EXCEPTION 'guest_address is required';
  END IF;

  INSERT INTO public.bookings (
    guest_name,
    guest_email,
    guest_phone,
    guest_address,
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
    sanitized_address,
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

DROP FUNCTION IF EXISTS public.get_booking_dossier(text);

CREATE OR REPLACE FUNCTION public.get_booking_dossier(_token text)
RETURNS TABLE(
  id uuid,
  public_token text,
  guest_name text,
  guest_email text,
  guest_phone text,
  guest_address text,
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
    b.guest_address,
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

GRANT EXECUTE ON FUNCTION public.create_public_booking(text, text, text, text, date, date, integer, text, public.language, numeric, numeric) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_dossier(text) TO anon, authenticated;
