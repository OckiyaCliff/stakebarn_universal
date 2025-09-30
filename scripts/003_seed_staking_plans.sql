-- Insert predefined staking plans
INSERT INTO public.staking_plans (currency, name, apy, lockup_days, min_stake, is_active)
VALUES
  ('ETH', 'Ethereum Flexible', 12.00, 0, 0.01, true),
  ('ETH', 'Ethereum 30-Day Lock', 15.00, 30, 0.01, true),
  ('ETH', 'Ethereum 90-Day Lock', 18.00, 90, 0.01, true),
  ('BTC', 'Bitcoin Flexible', 8.00, 0, 0.001, true),
  ('BTC', 'Bitcoin 30-Day Lock', 10.00, 30, 0.001, true),
  ('BTC', 'Bitcoin 90-Day Lock', 12.00, 90, 0.001, true),
  ('SOL', 'Solana Flexible', 15.00, 0, 1, true),
  ('SOL', 'Solana 30-Day Lock', 18.00, 30, 1, true),
  ('SOL', 'Solana 90-Day Lock', 22.00, 90, 1, true),
  ('XRP', 'Ripple Flexible', 10.00, 0, 10, true),
  ('XRP', 'Ripple 30-Day Lock', 13.00, 30, 10, true),
  ('XRP', 'Ripple 90-Day Lock', 16.00, 90, 10, true)
ON CONFLICT DO NOTHING;
