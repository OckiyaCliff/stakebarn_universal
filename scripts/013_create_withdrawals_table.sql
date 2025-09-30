-- Create withdrawals table to track withdrawal requests
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  withdrawal_type TEXT NOT NULL CHECK (withdrawal_type IN ('balance', 'profit')),
  currency TEXT NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  wallet_address TEXT NOT NULL, -- user's wallet address to send funds to
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  approval_condition TEXT DEFAULT 'none' CHECK (approval_condition IN ('none', 'minimum_stake', 'minimum_deposits', 'account_age')),
  condition_met BOOLEAN DEFAULT false,
  admin_id UUID REFERENCES public.admins(id),
  admin_notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for withdrawals
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawals" ON public.withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending withdrawals" ON public.withdrawals
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admin policies (will be added via admin RLS)
CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all withdrawals" ON public.withdrawals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_admin_id ON public.withdrawals(admin_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON public.withdrawals(created_at DESC);

-- Create function to check withdrawal conditions
CREATE OR REPLACE FUNCTION check_withdrawal_conditions(
  p_user_id UUID,
  p_condition TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_condition_met BOOLEAN := false;
  v_total_staked DECIMAL;
  v_total_deposits DECIMAL;
  v_account_age_days INTEGER;
BEGIN
  CASE p_condition
    WHEN 'none' THEN
      v_condition_met := true;
    
    WHEN 'minimum_stake' THEN
      -- Check if user has at least $100 worth staked
      SELECT COALESCE(SUM(staked_balance), 0) INTO v_total_staked
      FROM public.balances
      WHERE user_id = p_user_id;
      
      v_condition_met := v_total_staked >= 100;
    
    WHEN 'minimum_deposits' THEN
      -- Check if user has made at least $500 in confirmed deposits
      SELECT COALESCE(SUM(amount), 0) INTO v_total_deposits
      FROM public.deposits
      WHERE user_id = p_user_id AND status = 'confirmed';
      
      v_condition_met := v_total_deposits >= 500;
    
    WHEN 'account_age' THEN
      -- Check if account is at least 30 days old
      SELECT EXTRACT(DAY FROM NOW() - created_at) INTO v_account_age_days
      FROM public.profiles
      WHERE id = p_user_id;
      
      v_condition_met := v_account_age_days >= 30;
    
    ELSE
      v_condition_met := false;
  END CASE;
  
  RETURN v_condition_met;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to process withdrawal (deduct from balance)
CREATE OR REPLACE FUNCTION process_withdrawal(
  p_withdrawal_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_withdrawal RECORD;
  v_current_balance DECIMAL;
BEGIN
  -- Get withdrawal details
  SELECT * INTO v_withdrawal
  FROM public.withdrawals
  WHERE id = p_withdrawal_id AND status = 'approved';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal not found or not approved';
  END IF;
  
  -- Get current balance
  IF v_withdrawal.withdrawal_type = 'balance' THEN
    SELECT available_balance INTO v_current_balance
    FROM public.balances
    WHERE user_id = v_withdrawal.user_id AND currency = v_withdrawal.currency;
  ELSE -- profit
    SELECT total_rewards INTO v_current_balance
    FROM public.balances
    WHERE user_id = v_withdrawal.user_id AND currency = v_withdrawal.currency;
  END IF;
  
  -- Check if sufficient balance
  IF v_current_balance < v_withdrawal.amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  -- Deduct from balance
  IF v_withdrawal.withdrawal_type = 'balance' THEN
    UPDATE public.balances
    SET available_balance = available_balance - v_withdrawal.amount,
        updated_at = NOW()
    WHERE user_id = v_withdrawal.user_id AND currency = v_withdrawal.currency;
  ELSE -- profit
    UPDATE public.balances
    SET total_rewards = total_rewards - v_withdrawal.amount,
        updated_at = NOW()
    WHERE user_id = v_withdrawal.user_id AND currency = v_withdrawal.currency;
  END IF;
  
  -- Update withdrawal status
  UPDATE public.withdrawals
  SET status = 'completed',
      processed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_withdrawal_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
