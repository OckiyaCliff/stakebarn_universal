-- Create storage bucket for deposit proof images
INSERT INTO storage.buckets (id, name, public)
VALUES ('deposit-proofs', 'deposit-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own proof images
CREATE POLICY "Users can upload their own deposit proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'deposit-proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own proof images
CREATE POLICY "Users can view their own deposit proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'deposit-proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to view all proof images
CREATE POLICY "Admins can view all deposit proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'deposit-proofs' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.user_id = auth.uid()
  )
);
