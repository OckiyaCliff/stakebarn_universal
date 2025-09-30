-- Function to increment user balance
CREATE OR REPLACE FUNCTION increment_balance(
  p_user_id uuid,
  p_amount numeric,
  p_currency text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update balance
  INSERT INTO public.balances (user_id, currency, available_balance, staked_balance, total_rewards)
  VALUES (p_user_id, p_currency, p_amount, 0, 0)
  ON CONFLICT (user_id, currency)
  DO UPDATE SET
    available_balance = balances.available_balance + p_amount,
    updated_at = now();
END;
$$;

-- Function to update user balance (for admin edits)
CREATE OR REPLACE FUNCTION update_user_balance(
  p_user_id uuid,
  p_currency text,
  p_available_balance numeric,
  p_staked_balance numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.balances (user_id, currency, available_balance, staked_balance, total_rewards)
  VALUES (p_user_id, p_currency, p_available_balance, p_staked_balance, 0)
  ON CONFLICT (user_id, currency)
  DO UPDATE SET
    available_balance = p_available_balance,
    staked_balance = p_staked_balance,
    updated_at = now();
END;
$$;

-- Add unique constraint if not exists
ALTER TABLE public.balances DROP CONSTRAINT IF EXISTS balances_user_currency_unique;
ALTER TABLE public.balances ADD CONSTRAINT balances_user_currency_unique UNIQUE (user_id, currency);
