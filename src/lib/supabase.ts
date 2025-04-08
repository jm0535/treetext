import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in a .env file
// Adding fallback values for production deployment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zsronpdhtzzasrwawjto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzcm9ucGRodHp6YXNyd2F3anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwODU0NDAsImV4cCI6MjA1OTY2MTQ0MH0.0XQUR7QHbZP0p10a4uZ4o0Tuk4YPPBJrcUu-qVAVpBM';

// Log a warning if environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using fallback Supabase credentials. In production, set these via environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
