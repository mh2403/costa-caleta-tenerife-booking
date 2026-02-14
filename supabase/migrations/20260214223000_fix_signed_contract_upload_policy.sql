-- Make guest signed-contract upload more tolerant for mobile file types and token formats.
-- Also ensure the target bucket always exists (fix for "Bucket not found" on older environments).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-signed-contracts',
  'booking-signed-contracts',
  false,
  26214400,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/heif',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Guests can upload signed contracts by booking token" ON storage.objects;

CREATE POLICY "Guests can upload signed contracts by booking token"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'booking-signed-contracts'
  AND name ~ '^guest-signed/[0-9a-z-]{16,80}/[0-9]{13}-[a-z0-9._-]+$'
);
