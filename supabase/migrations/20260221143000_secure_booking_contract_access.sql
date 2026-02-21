-- Harden owner contract access:
-- - Make booking contracts bucket private
-- - Remove legacy public-read policy
-- - Allow reads only via known contract object paths (and full read for admins)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-contracts',
  'booking-contracts',
  false,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Booking contracts are public" ON storage.objects;
DROP POLICY IF EXISTS "Booking contracts readable by dossier path" ON storage.objects;

CREATE POLICY "Booking contracts readable by dossier path"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'booking-contracts'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR name ~ '^[0-9a-f-]{36}/[0-9]{13}-[a-z0-9._-]+$'
  )
);
