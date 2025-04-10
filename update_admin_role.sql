-- Update Jimmy Moses to have admin role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'jimmy.moses@pnguot.ac.pg';

-- Create function to automatically assign 'user' role to new sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Set default role to 'user' for everyone except jimmy.moses@pnguot.ac.pg
  UPDATE auth.users
  SET raw_user_meta_data = 
    raw_user_meta_data || 
    CASE 
      WHEN NEW.email = 'jimmy.moses@pnguot.ac.pg' THEN '{"role": "admin"}'::jsonb
      ELSE '{"role": "user"}'::jsonb
    END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run this function when new users are created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- List all tables in the public schema to set up RLS
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
