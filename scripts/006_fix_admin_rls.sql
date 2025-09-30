-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert admins" ON public.admins;

-- Allow users to check if they are an admin (view their own record only)
CREATE POLICY "Users can view their own admin record" ON public.admins
  FOR SELECT USING (user_id = auth.uid());

-- Only allow service role to insert admins (handled by API with service role key)
-- No INSERT policy needed as we use service role key in the API
