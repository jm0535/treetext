-- 1. Update Jimmy Moses to have admin role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'jimmy.moses@pnguot.ac.pg';

-- 2. Create function to automatically assign 'user' role to new sign-ups
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

-- 3. Create a trigger to run this function when new users are created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create RLS function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT 
      raw_user_meta_data->>'role' = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create RLS function to check if user is the owner of a record
CREATE OR REPLACE FUNCTION public.is_owner(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN auth.uid() = user_id OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: You'll need to enable RLS on each table and create appropriate policies
-- For example, when you create a new table:
/*
CREATE TABLE IF NOT EXISTS public.user_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins have full access to user_documents" 
ON public.user_documents
USING (public.is_admin());

CREATE POLICY "Users can only access their own documents" 
ON public.user_documents
USING (public.is_owner(user_id));
*/
