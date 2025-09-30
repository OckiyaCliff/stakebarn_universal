-- Create users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deposits table to track blockchain deposits
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL, -- ETH, BTC, SOL, XRP
  amount DECIMAL(20, 8) NOT NULL,
  tx_hash TEXT, -- blockchain transaction hash
  wallet_address TEXT NOT NULL, -- the platform wallet address where user sent funds
  status TEXT DEFAULT 'pending', -- pending, confirmed, failed
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create balances table to track user balances per currency
CREATE TABLE IF NOT EXISTS public.balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  available_balance DECIMAL(20, 8) DEFAULT 0,
  staked_balance DECIMAL(20, 8) DEFAULT 0,
  total_rewards DECIMAL(20, 8) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

-- Create staking plans table (predefined plans)
CREATE TABLE IF NOT EXISTS public.staking_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency TEXT NOT NULL,
  name TEXT NOT NULL,
  apy DECIMAL(5, 2) NOT NULL, -- Annual Percentage Yield
  lockup_days INTEGER DEFAULT 0, -- 0 means flexible
  min_stake DECIMAL(20, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stakes table to track active stakes
CREATE TABLE IF NOT EXISTS public.stakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.staking_plans(id),
  currency TEXT NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  apy DECIMAL(5, 2) NOT NULL,
  lockup_days INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ, -- calculated based on lockup_days
  status TEXT DEFAULT 'active', -- active, completed, withdrawn
  rewards_earned DECIMAL(20, 8) DEFAULT 0,
  last_reward_calculation TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for deposits
CREATE POLICY "Users can view their own deposits" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deposits" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for balances
CREATE POLICY "Users can view their own balances" ON public.balances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balances" ON public.balances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own balances" ON public.balances
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for staking_plans (public read)
CREATE POLICY "Anyone can view active staking plans" ON public.staking_plans
  FOR SELECT USING (is_active = true);

-- RLS Policies for stakes
CREATE POLICY "Users can view their own stakes" ON public.stakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stakes" ON public.stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stakes" ON public.stakes
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_balances_user_id ON public.balances(user_id);
CREATE INDEX IF NOT EXISTS idx_stakes_user_id ON public.stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_stakes_status ON public.stakes(status);
