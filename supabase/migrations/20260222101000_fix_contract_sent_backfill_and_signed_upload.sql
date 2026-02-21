-- Backfill legacy dossiers where a contract file exists but contract_sent stayed false.
-- Also make signed-contract submission accept dossiers with an uploaded contract file.

UPDATE public.bookings
SET
  contract_sent = true,
  contract_sent_at = COALESCE(contract_sent_at, contract_uploaded_at, now()),
  updated_at = now()
WHERE contract_file_path IS NOT NULL
  AND COALESCE(contract_sent, false) = false;

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
    contract_sent = true,
    contract_sent_at = COALESCE(contract_sent_at, contract_uploaded_at, now()),
    guest_contract_signed = true,
    guest_contract_signed_at = now(),
    guest_contract_signed_name = COALESCE(NULLIF(guest_contract_signed_name, ''), guest_name),
    guest_signed_contract_file_path = _file_path,
    guest_signed_contract_uploaded_at = now(),
    updated_at = now()
  WHERE public_token = _token
    AND (contract_sent = true OR contract_file_path IS NOT NULL)
  RETURNING guest_signed_contract_uploaded_at INTO saved_at;

  IF saved_at IS NULL THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, saved_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_signed_contract(text, text) TO anon, authenticated;
