-- Add missing fields to deposits table for admin management
ALTER TABLE deposits 
ADD COLUMN IF NOT EXISTS proof_image_url TEXT,
ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES admins(id),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all deposits" ON deposits;
DROP POLICY IF EXISTS "Admins can update deposits" ON deposits;
DROP POLICY IF EXISTS "Users can view own deposits" ON deposits;
DROP POLICY IF EXISTS "Users can create deposits" ON deposits;

-- Recreate RLS policies
CREATE POLICY "Admins can view all deposits" ON deposits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update deposits" ON deposits
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own deposits" ON deposits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create deposits" ON deposits
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
