-- Harden public booking inserts and enforce basic booking data integrity.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_check_out_after_check_in'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_check_out_after_check_in
      CHECK (check_out > check_in);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_num_guests_min_1'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_num_guests_min_1
      CHECK (num_guests >= 1);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_amounts_non_negative'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_amounts_non_negative
      CHECK (
        total_price >= 0
        AND COALESCE(cleaning_fee, 0) >= 0
        AND COALESCE(deposit_amount, 0) >= 0
      );
  END IF;
END;
$$;

DROP POLICY IF EXISTS "Anyone can create booking requests" ON public.bookings;

CREATE POLICY "Anyone can create booking requests"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'::public.booking_status
  AND COALESCE(deposit_paid, false) = false
  AND deposit_paid_at IS NULL
  AND COALESCE(whatsapp_notified, false) = false
  AND whatsapp_notified_at IS NULL
  AND COALESCE(contract_sent, false) = false
  AND contract_sent_at IS NULL
  AND COALESCE(guest_contract_signed, false) = false
  AND guest_contract_signed_at IS NULL
  AND guest_contract_signed_name IS NULL
  AND COALESCE(contract_signed, false) = false
  AND contract_signed_at IS NULL
  AND COALESCE(remaining_paid, false) = false
  AND remaining_paid_at IS NULL
  AND payment_notes IS NULL
  AND contract_file_path IS NULL
  AND contract_uploaded_at IS NULL
  AND review_author IS NULL
  AND review_rating IS NULL
  AND review_text IS NULL
  AND review_submitted_at IS NULL
);
