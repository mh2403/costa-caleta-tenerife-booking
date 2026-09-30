-- Costa Caleta has one bedroom and a sofa bed, but the maximum occupancy is two guests.

UPDATE public.settings
SET value = jsonb_build_object('count', 2)
WHERE key = 'max_guests';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_num_guests_max_2'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_num_guests_max_2
      CHECK (num_guests <= 2)
      NOT VALID;
  END IF;
END;
$$;
