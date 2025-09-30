-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins (only admins can view admin table)
CREATE POLICY "Admins can view all admins" ON public.admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert admins" ON public.admins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Update RLS policies to allow admins to view all data
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all deposits" ON public.deposits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all deposits" ON public.deposits
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all balances" ON public.balances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all balances" ON public.balances
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all staking plans" ON public.staking_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert staking plans" ON public.staking_plans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update staking plans" ON public.staking_plans
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete staking plans" ON public.staking_plans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all stakes" ON public.stakes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all stakes" ON public.stakes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE admins.user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
