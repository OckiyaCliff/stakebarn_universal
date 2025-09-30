-- Ensure all required columns exist for deposit review functionality
-- This script is idempotent and can be run multiple times safely

-- Add reviewed_at if it doesn't exist (script 007 adds this, but script 010 doesn't)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'deposits' 
    AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE public.deposits ADD COLUMN reviewed_at TIMESTAMPTZ;
    RAISE NOTICE 'Added reviewed_at column to deposits table';
  ELSE
    RAISE NOTICE 'reviewed_at column already exists';
  END IF;
END $$;

-- Ensure admin_id exists (should be added by scripts 007 or 010)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'deposits' 
    AND column_name = 'admin_id'
  ) THEN
    ALTER TABLE public.deposits ADD COLUMN admin_id UUID REFERENCES public.admins(id);
    RAISE NOTICE 'Added admin_id column to deposits table';
  ELSE
    RAISE NOTICE 'admin_id column already exists';
  END IF;
END $$;

-- Ensure admin_notes exists (should be added by scripts 007 or 010)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'deposits' 
    AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE public.deposits ADD COLUMN admin_notes TEXT;
    RAISE NOTICE 'Added admin_notes column to deposits table';
  ELSE
    RAISE NOTICE 'admin_notes column already exists';
  END IF;
END $$;

-- Ensure proof_image_url exists (should be added by scripts 007 or 010)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'deposits' 
    AND column_name = 'proof_image_url'
  ) THEN
    ALTER TABLE public.deposits ADD COLUMN proof_image_url TEXT;
    RAISE NOTICE 'Added proof_image_url column to deposits table';
  ELSE
    RAISE NOTICE 'proof_image_url column already exists';
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN public.deposits.reviewed_at IS 'Timestamp when admin reviewed the deposit';
COMMENT ON COLUMN public.deposits.admin_id IS 'Admin who reviewed the deposit';
COMMENT ON COLUMN public.deposits.admin_notes IS 'Admin notes about the review decision';
COMMENT ON COLUMN public.deposits.proof_image_url IS 'URL to uploaded payment proof image';
