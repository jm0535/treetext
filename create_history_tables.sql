-- Create tables for storing user analysis history

-- Table for text analysis history
CREATE TABLE IF NOT EXISTS public.text_analysis_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  text_content text NOT NULL,
  title text,
  plagiarism_score numeric,
  grammar_score numeric,
  readability_score numeric,
  analysis_settings jsonb,
  results jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table for file upload history
CREATE TABLE IF NOT EXISTS public.file_upload_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  file_content text,
  file_url text,
  plagiarism_score numeric,
  grammar_score numeric,
  readability_score numeric,
  analysis_settings jsonb,
  results jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on both tables
ALTER TABLE public.text_analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_upload_history ENABLE ROW LEVEL SECURITY;

-- Create policies for text_analysis_history
-- Admin can see all entries
CREATE POLICY "Admins have full access to text_analysis_history" 
ON public.text_analysis_history
USING (public.is_admin());

-- Users can only see their own entries
CREATE POLICY "Users can only access their own text analysis history" 
ON public.text_analysis_history
USING (public.is_owner(user_id));

-- Create policies for file_upload_history
-- Admin can see all entries
CREATE POLICY "Admins have full access to file_upload_history" 
ON public.file_upload_history
USING (public.is_admin());

-- Users can only see their own entries
CREATE POLICY "Users can only access their own file upload history" 
ON public.file_upload_history
USING (public.is_owner(user_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS text_analysis_history_user_id_idx ON public.text_analysis_history(user_id);
CREATE INDEX IF NOT EXISTS file_upload_history_user_id_idx ON public.file_upload_history(user_id);
