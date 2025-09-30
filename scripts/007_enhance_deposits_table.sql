-- Add fields for deposit proof and admin approval tracking
ALTER TABLE public.deposits
ADD COLUMN IF NOT EXISTS proof_image_url text,
ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Update the status check constraint if it exists
ALTER TABLE public.deposits DROP CONSTRAINT IF EXISTS deposits_status_check;
ALTER TABLE public.deposits ADD CONSTRAINT deposits_status_check 
  CHECK (status IN ('pending', 'approved', 'declined', 'processing'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);

-- RLS Policies for deposits
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Users can view their own deposits
CREATE POLICY "Users can view own deposits" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own deposits
CREATE POLICY "Users can create own deposits" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all deposits (using service role key, so this is just for documentation)
CREATE POLICY "Admins can view all deposits" ON public.deposits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Admins can update deposits (using service role key, so this is just for documentation)
CREATE POLICY "Admins can update deposits" ON public.deposits
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

COMMENT ON COLUMN public.deposits.proof_image_url IS 'URL to uploaded receipt/proof image';
COMMENT ON COLUMN public.deposits.admin_id IS 'Admin who reviewed the deposit';
COMMENT ON COLUMN public.deposits.admin_notes IS 'Admin notes about approval/decline';
COMMENT ON COLUMN public.deposits.reviewed_at IS 'When the deposit was reviewed';
