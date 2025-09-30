-- Function to calculate and update rewards for all active stakes
CREATE OR REPLACE FUNCTION public.calculate_stake_rewards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stake_record RECORD;
  days_elapsed NUMERIC;
  new_rewards NUMERIC;
BEGIN
  -- Loop through all active stakes
  FOR stake_record IN 
    SELECT * FROM public.stakes WHERE status = 'active'
  LOOP
    -- Calculate days elapsed since last reward calculation
    days_elapsed := EXTRACT(EPOCH FROM (NOW() - stake_record.last_reward_calculation)) / 86400;
    
    -- Calculate new rewards: (amount * apy / 100) * (days_elapsed / 365)
    new_rewards := (stake_record.amount * stake_record.apy / 100) * (days_elapsed / 365);
    
    -- Update stake with new rewards
    UPDATE public.stakes
    SET 
      rewards_earned = rewards_earned + new_rewards,
      last_reward_calculation = NOW()
    WHERE id = stake_record.id;
    
    -- Update user's total rewards in balances table
    UPDATE public.balances
    SET 
      total_rewards = total_rewards + new_rewards,
      updated_at = NOW()
    WHERE user_id = stake_record.user_id AND currency = stake_record.currency;
  END LOOP;
END;
$$;

-- Create a function to check and complete stakes that have reached their end date
CREATE OR REPLACE FUNCTION public.complete_expired_stakes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stake_record RECORD;
BEGIN
  -- Find all active stakes that have passed their end date
  FOR stake_record IN 
    SELECT * FROM public.stakes 
    WHERE status = 'active' 
    AND end_date IS NOT NULL 
    AND end_date <= NOW()
  LOOP
    -- Mark stake as completed
    UPDATE public.stakes
    SET status = 'completed'
    WHERE id = stake_record.id;
    
    -- Move staked balance back to available balance
    UPDATE public.balances
    SET 
      available_balance = available_balance + stake_record.amount,
      staked_balance = staked_balance - stake_record.amount,
      updated_at = NOW()
    WHERE user_id = stake_record.user_id AND currency = stake_record.currency;
  END LOOP;
END;
$$;
