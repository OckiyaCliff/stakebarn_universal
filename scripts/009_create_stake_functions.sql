-- Function to return staked amount to available balance
CREATE OR REPLACE FUNCTION return_staked_amount(
  p_user_id uuid,
  p_amount numeric,
  p_currency text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update balance: decrease staked, increase available
  UPDATE public.balances
  SET
    available_balance = available_balance + p_amount,
    staked_balance = staked_balance - p_amount,
    updated_at = now()
  WHERE user_id = p_user_id AND currency = p_currency;
  
  -- If no balance record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.balances (user_id, currency, available_balance, staked_balance, total_rewards)
    VALUES (p_user_id, p_currency, p_amount, 0, 0);
  END IF;
END;
$$;
