-- StakeBarn v2.0 Database Update Script
-- This script adds the necessary columns and tables for the new features:
-- 1. $15 Sign-in Bonus
-- 2. Token Swap Functionality

-- 1. Update profiles table to track if the welcome bonus has been claimed
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bonus_claimed BOOLEAN DEFAULT FALSE;

-- 2. Update balances table to track the bonus portion of the balance
-- This helps in enforcing withdrawal restrictions
ALTER TABLE balances 
ADD COLUMN IF NOT EXISTS bonus_balance NUMERIC DEFAULT 0;

-- 3. Create swaps table to keep a history of token exchanges
CREATE TABLE IF NOT EXISTS swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  amount_sent NUMERIC NOT NULL,
  amount_received NUMERIC NOT NULL,
  fee_usd NUMERIC NOT NULL,
  exchange_rate NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security on the swaps table
ALTER TABLE swaps ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for the swaps table
-- Users should only be able to see and create their own swap records
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'swaps' AND policyname = 'Users can view their own swaps'
  ) THEN
    CREATE POLICY "Users can view their own swaps" 
    ON swaps FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'swaps' AND policyname = 'Users can insert their own swaps'
  ) THEN
    CREATE POLICY "Users can insert their own swaps" 
    ON swaps FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 6. Add index for performance
CREATE INDEX IF NOT EXISTS idx_swaps_user_id ON swaps(user_id);
