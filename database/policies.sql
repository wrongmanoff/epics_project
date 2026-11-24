-- Row Level Security for public.profiles
-- Run after schema.sql in the Supabase SQL Editor.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if re-running this script
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Authenticated users can read only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Authenticated users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow insert of own profile (e.g. client-side fallback).
-- Server signup typically uses the service role, which bypasses RLS.
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Optional: prevent authenticated users from deleting profiles via client.
-- Service role can still delete when cascading from auth.users.
DROP POLICY IF EXISTS "Users cannot delete profiles" ON public.profiles;
