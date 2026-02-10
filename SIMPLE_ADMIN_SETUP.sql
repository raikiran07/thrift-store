-- ============================================
-- SIMPLE ADMIN MANAGEMENT SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Make user_id nullable temporarily
ALTER TABLE admins ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Create a trigger to auto-fill user_id from email
CREATE OR REPLACE FUNCTION fill_admin_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If user_id is not provided, try to get it from auth.users using email
  IF NEW.user_id IS NULL AND NEW.email IS NOT NULL THEN
    SELECT id INTO NEW.user_id
    FROM auth.users
    WHERE email = NEW.email;
    
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'No user found with email: %. User must sign up first.', NEW.email;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger
DROP TRIGGER IF EXISTS trigger_fill_admin_user_id ON admins;
CREATE TRIGGER trigger_fill_admin_user_id
  BEFORE INSERT ON admins
  FOR EACH ROW
  EXECUTE FUNCTION fill_admin_user_id();

-- Step 4: Test it (replace with a real email from your auth.users)
-- INSERT INTO admins (email) VALUES ('test@example.com');
-- SELECT * FROM admins WHERE email = 'test@example.com';

-- Step 5: Verify setup
SELECT 'Setup complete! You can now add admins by email.' as status;
