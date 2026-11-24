-- Row Level Security for registration tables.
-- Run after database/registration_schema.sql.
-- Service-role API calls bypass RLS. These policies protect direct
-- Supabase access so a user can only touch their own rows.
-- Do not disable RLS.

ALTER TABLE public.registration_occupation_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_document_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_scheme_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_occupations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_occupation_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_circumstances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_scheme_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read occupation catalog" ON public.registration_occupation_catalog;
CREATE POLICY "Authenticated can read occupation catalog"
  ON public.registration_occupation_catalog
  FOR SELECT TO authenticated
  USING (active = TRUE);

DROP POLICY IF EXISTS "Authenticated can read document catalog" ON public.registration_document_catalog;
CREATE POLICY "Authenticated can read document catalog"
  ON public.registration_document_catalog
  FOR SELECT TO authenticated
  USING (active = TRUE);

DROP POLICY IF EXISTS "Authenticated can read scheme catalog" ON public.registration_scheme_catalog;
CREATE POLICY "Authenticated can read scheme catalog"
  ON public.registration_scheme_catalog
  FOR SELECT TO authenticated
  USING (active = TRUE);

DROP POLICY IF EXISTS "Users can view own registration profile" ON public.registration_profiles;
CREATE POLICY "Users can view own registration profile"
  ON public.registration_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own registration profile" ON public.registration_profiles;
CREATE POLICY "Users can insert own registration profile"
  ON public.registration_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own registration profile" ON public.registration_profiles;
CREATE POLICY "Users can update own registration profile"
  ON public.registration_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own occupations" ON public.registration_occupations;
CREATE POLICY "Users can view own occupations"
  ON public.registration_occupations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own occupations" ON public.registration_occupations;
CREATE POLICY "Users can insert own occupations"
  ON public.registration_occupations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own occupations" ON public.registration_occupations;
CREATE POLICY "Users can delete own occupations"
  ON public.registration_occupations
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own occupation answers" ON public.registration_occupation_answers;
CREATE POLICY "Users can view own occupation answers"
  ON public.registration_occupation_answers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own occupation answers" ON public.registration_occupation_answers;
CREATE POLICY "Users can insert own occupation answers"
  ON public.registration_occupation_answers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own occupation answers" ON public.registration_occupation_answers;
CREATE POLICY "Users can delete own occupation answers"
  ON public.registration_occupation_answers
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own circumstances" ON public.registration_circumstances;
CREATE POLICY "Users can view own circumstances"
  ON public.registration_circumstances
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own circumstances" ON public.registration_circumstances;
CREATE POLICY "Users can insert own circumstances"
  ON public.registration_circumstances
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own circumstances" ON public.registration_circumstances;
CREATE POLICY "Users can update own circumstances"
  ON public.registration_circumstances
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own documents" ON public.registration_documents;
CREATE POLICY "Users can view own documents"
  ON public.registration_documents
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own documents" ON public.registration_documents;
CREATE POLICY "Users can insert own documents"
  ON public.registration_documents
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON public.registration_documents;
CREATE POLICY "Users can delete own documents"
  ON public.registration_documents
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own scheme preferences" ON public.registration_scheme_preferences;
CREATE POLICY "Users can view own scheme preferences"
  ON public.registration_scheme_preferences
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scheme preferences" ON public.registration_scheme_preferences;
CREATE POLICY "Users can insert own scheme preferences"
  ON public.registration_scheme_preferences
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own scheme preferences" ON public.registration_scheme_preferences;
CREATE POLICY "Users can delete own scheme preferences"
  ON public.registration_scheme_preferences
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
