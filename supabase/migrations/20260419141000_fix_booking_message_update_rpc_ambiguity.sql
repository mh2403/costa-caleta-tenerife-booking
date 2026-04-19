-- Fix ambiguous updated_at reference in update_booking_message_by_token.

CREATE OR REPLACE FUNCTION public.update_booking_message_by_token(
  _token text,
  _message text
)
RETURNS TABLE(success boolean, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  saved_at timestamp with time zone;
BEGIN
  IF COALESCE(trim(_token), '') = '' THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  UPDATE public.bookings b
  SET
    message = NULLIF(trim(_message), ''),
    updated_at = now()
  WHERE b.public_token = _token
  RETURNING b.updated_at INTO saved_at;

  IF saved_at IS NULL THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, saved_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_booking_message_by_token(text, text) TO anon, authenticated;
