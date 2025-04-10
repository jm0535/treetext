-- First, let's list all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

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

-- After running the above, you'll see a list of tables
-- For each table, you'll need to enable RLS and create policies
-- Example (replace 'table_name' with actual table names from your database):

/*
-- Enable RLS on the table
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (full access)
CREATE POLICY "Admins have full access to table_name"
ON public.table_name
USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'admin'
  )
);

-- Create policy for normal users (can only access their own data)
-- Note: Adjust the condition based on your table structure
CREATE POLICY "Users can only access their own data in table_name"
ON public.table_name
USING (
  auth.uid() = user_id  -- Replace 'user_id' with the actual column name in your table
);
*/
