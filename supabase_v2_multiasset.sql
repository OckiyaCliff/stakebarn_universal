-- ==============================================================================
-- StakeBarn Universal v2.0 - Multi-Asset & Yield Expansion
-- ==============================================================================

-- 1. Add asset_type and reward_frequency to staking_plans
ALTER TABLE staking_plans 
ADD COLUMN IF NOT EXISTS asset_type TEXT DEFAULT 'staking' CHECK (asset_type IN ('staking', 'earn'));

ALTER TABLE staking_plans
ADD COLUMN IF NOT EXISTS reward_frequency TEXT DEFAULT 'daily' CHECK (reward_frequency IN ('hourly', 'daily', 'weekly'));

ALTER TABLE staking_plans
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- 2. Seed new staking plans for the new assets
-- (ATOM, DOT, AVAX staking plans + XLM, USDT, USDC earn plans)
INSERT INTO staking_plans (currency, name, apy, lockup_days, min_stake, is_active, asset_type, reward_frequency, description)
VALUES
  -- ATOM Staking
  ('ATOM', 'ATOM Flexible', 14, 0, 5, true, 'staking', 'daily', 'Flexible Cosmos staking'),
  ('ATOM', 'ATOM 30-Day', 18, 30, 10, true, 'staking', 'daily', '30-day locked Cosmos staking'),
  
  -- DOT Staking  
  ('DOT', 'DOT Flexible', 12, 0, 10, true, 'staking', 'daily', 'Flexible Polkadot staking'),
  ('DOT', 'DOT 60-Day', 16, 60, 20, true, 'staking', 'daily', '60-day locked Polkadot staking'),
  
  -- AVAX Staking
  ('AVAX', 'AVAX Flexible', 15, 0, 5, true, 'staking', 'daily', 'Flexible Avalanche staking'),
  ('AVAX', 'AVAX 30-Day', 20, 30, 10, true, 'staking', 'daily', '30-day locked Avalanche staking'),
  
  -- XLM Earn
  ('XLM', 'XLM Flexible Yield', 8, 0, 100, true, 'earn', 'daily', 'Flexible Stellar yield product'),
  ('XLM', 'XLM 30-Day Yield', 12, 30, 200, true, 'earn', 'daily', '30-day locked Stellar yield'),
  
  -- USDT Earn
  ('USDT', 'USDT Flexible Yield', 6, 0, 50, true, 'earn', 'daily', 'Flexible stablecoin yield'),
  ('USDT', 'USDT 90-Day Yield', 10, 90, 100, true, 'earn', 'daily', '90-day locked stablecoin yield'),
  
  -- USDC Earn
  ('USDC', 'USDC Flexible Yield', 5.5, 0, 50, true, 'earn', 'daily', 'Flexible stablecoin yield'),
  ('USDC', 'USDC 60-Day Yield', 9, 60, 100, true, 'earn', 'daily', '60-day locked stablecoin yield')
ON CONFLICT DO NOTHING;
