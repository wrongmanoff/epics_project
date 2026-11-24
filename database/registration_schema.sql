-- JanSahayak registration / profile completion
-- Run after database/schema.sql and database/policies.sql.
-- Does not alter public.profiles or authentication policies.
-- Apply database/registration_policies.sql immediately after this file.
--
-- Identity numbers are intentionally not stored. Document rows record only
-- whether a document is available, not available, or unknown.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.registration_occupation_catalog (
  code TEXT PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.registration_document_catalog (
  code TEXT PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.registration_scheme_catalog (
  code TEXT PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO public.registration_occupation_catalog (code) VALUES
  ('farmer'),
  ('agricultural_labourer'),
  ('student'),
  ('teacher'),
  ('daily_wage'),
  ('private_employee'),
  ('government_employee'),
  ('business_owner'),
  ('self_employed'),
  ('artisan'),
  ('homemaker'),
  ('unemployed'),
  ('other')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.registration_document_catalog (code) VALUES
  ('aadhaar'),
  ('pan'),
  ('voter_id'),
  ('passport'),
  ('other_identity'),
  ('domicile'),
  ('residence_certificate'),
  ('ration_card'),
  ('other_residence'),
  ('income_certificate'),
  ('caste_sc'),
  ('caste_st'),
  ('caste_obc'),
  ('ews'),
  ('other_social'),
  ('land_records'),
  ('khasra_khatauni'),
  ('farmer_registration'),
  ('kisan_credit_card'),
  ('agri_insurance'),
  ('other_farmer'),
  ('labour_card'),
  ('mgnrega'),
  ('eshram'),
  ('employment_registration'),
  ('skill_certification'),
  ('school_certificate'),
  ('marksheet'),
  ('transfer_certificate'),
  ('graduation_certificate'),
  ('scholarship_documents'),
  ('other_education'),
  ('disability_certificate'),
  ('senior_citizen_id'),
  ('widow_certificate'),
  ('shg_document'),
  ('other_welfare')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.registration_scheme_catalog (code) VALUES
  ('agriculture'),
  ('education'),
  ('healthcare'),
  ('housing'),
  ('employment'),
  ('women'),
  ('child'),
  ('pension'),
  ('social_security'),
  ('business'),
  ('financial'),
  ('other')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.registration_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  age_group TEXT,
  gender TEXT,
  state TEXT,
  district TEXT,
  district_other TEXT,
  block TEXT,
  block_other TEXT,
  village TEXT,
  residence_type TEXT,
  family_size INTEGER,
  household_income_range TEXT,
  marital_status TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  current_step INTEGER NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registration_status_chk CHECK (status IN ('draft', 'submitted')),
  CONSTRAINT registration_step_chk CHECK (current_step BETWEEN 1 AND 6),
  CONSTRAINT registration_family_chk CHECK (family_size IS NULL OR family_size BETWEEN 1 AND 20),
  CONSTRAINT registration_residence_chk CHECK (residence_type IS NULL OR residence_type IN ('rural', 'urban')),
  CONSTRAINT registration_age_chk CHECK (
    age_group IS NULL OR age_group IN (
      'age_18_25', 'age_26_35', 'age_36_45', 'age_46_59', 'age_60_plus'
    )
  ),
  CONSTRAINT registration_gender_chk CHECK (
    gender IS NULL OR gender IN ('female', 'male', 'other', 'prefer_not')
  ),
  CONSTRAINT registration_income_chk CHECK (
    household_income_range IS NULL OR household_income_range IN (
      'income_below_1', 'income_1_2_5', 'income_2_5_5', 'income_5_8',
      'income_above_8', 'income_prefer_not'
    )
  ),
  CONSTRAINT registration_text_len_chk CHECK (
    (state IS NULL OR char_length(state) <= 8)
    AND (district IS NULL OR char_length(district) <= 40)
    AND (district_other IS NULL OR char_length(district_other) <= 80)
    AND (block IS NULL OR char_length(block) <= 64)
    AND (block_other IS NULL OR char_length(block_other) <= 80)
    AND (village IS NULL OR char_length(village) <= 80)
  )
);

CREATE TABLE IF NOT EXISTS public.registration_occupations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.registration_profiles (user_id) ON DELETE CASCADE,
  occupation_code TEXT NOT NULL REFERENCES public.registration_occupation_catalog (code),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registration_occupations_unique UNIQUE (user_id, occupation_code)
);

CREATE INDEX IF NOT EXISTS registration_occupations_user_idx
  ON public.registration_occupations (user_id);

CREATE TABLE IF NOT EXISTS public.registration_occupation_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.registration_profiles (user_id) ON DELETE CASCADE,
  occupation_code TEXT NOT NULL REFERENCES public.registration_occupation_catalog (code),
  question_key TEXT NOT NULL,
  answer JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registration_answers_unique UNIQUE (user_id, occupation_code, question_key),
  CONSTRAINT registration_answer_key_len CHECK (char_length(question_key) BETWEEN 1 AND 64),
  CONSTRAINT registration_answer_type_chk CHECK (
    jsonb_typeof(answer) IN ('string', 'boolean', 'number', 'array')
  )
);

CREATE INDEX IF NOT EXISTS registration_answers_user_idx
  ON public.registration_occupation_answers (user_id, occupation_code);

CREATE TABLE IF NOT EXISTS public.registration_circumstances (
  user_id UUID PRIMARY KEY REFERENCES public.registration_profiles (user_id) ON DELETE CASCADE,
  disability_present BOOLEAN,
  disability_category TEXT,
  disability_percentage TEXT,
  senior_citizens BOOLEAN,
  senior_citizen_count INTEGER,
  widow_headed BOOLEAN,
  single_parent BOOLEAN,
  women_headed BOOLEAN,
  shg_member BOOLEAN,
  minority_welfare_interest BOOLEAN,
  other_note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registration_senior_count_chk CHECK (
    senior_citizen_count IS NULL OR senior_citizen_count BETWEEN 1 AND 10
  ),
  CONSTRAINT registration_note_len_chk CHECK (
    other_note IS NULL OR char_length(other_note) <= 300
  )
);

CREATE TABLE IF NOT EXISTS public.registration_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.registration_profiles (user_id) ON DELETE CASCADE,
  document_code TEXT NOT NULL REFERENCES public.registration_document_catalog (code),
  availability TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registration_documents_unique UNIQUE (user_id, document_code),
  CONSTRAINT registration_availability_chk CHECK (
    availability IN ('available', 'not_available', 'not_sure')
  )
);

CREATE INDEX IF NOT EXISTS registration_documents_user_idx
  ON public.registration_documents (user_id);

CREATE TABLE IF NOT EXISTS public.registration_scheme_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.registration_profiles (user_id) ON DELETE CASCADE,
  category_code TEXT NOT NULL REFERENCES public.registration_scheme_catalog (code),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registration_preferences_unique UNIQUE (user_id, category_code)
);

CREATE INDEX IF NOT EXISTS registration_preferences_user_idx
  ON public.registration_scheme_preferences (user_id);

DROP TRIGGER IF EXISTS registration_profiles_set_updated_at ON public.registration_profiles;
CREATE TRIGGER registration_profiles_set_updated_at
  BEFORE UPDATE ON public.registration_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_row_updated_at();

DROP TRIGGER IF EXISTS registration_circumstances_set_updated_at ON public.registration_circumstances;
CREATE TRIGGER registration_circumstances_set_updated_at
  BEFORE UPDATE ON public.registration_circumstances
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_row_updated_at();

COMMENT ON TABLE public.registration_profiles IS
  'Eligibility-related household profile for one authenticated user. Not an auth record.';
COMMENT ON TABLE public.registration_documents IS
  'Document availability only. Never store document numbers, images, or identifiers.';
COMMENT ON TABLE public.registration_scheme_preferences IS
  'User interests. These are not eligibility decisions.';

CREATE OR REPLACE FUNCTION public.get_registration_profile(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'missing_user';
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.registration_profiles WHERE user_id = p_user_id
  ) THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'status', rp.status,
    'current_step', rp.current_step,
    'submitted_at', rp.submitted_at,
    'updated_at', rp.updated_at,
    'basic', jsonb_build_object(
      'age_group', rp.age_group,
      'gender', rp.gender,
      'state', rp.state,
      'district', rp.district,
      'district_other', rp.district_other,
      'block', rp.block,
      'block_other', rp.block_other,
      'village', rp.village,
      'residence_type', rp.residence_type,
      'family_size', rp.family_size,
      'household_income_range', rp.household_income_range,
      'marital_status', rp.marital_status
    ),
    'occupations', COALESCE((
      SELECT jsonb_agg(ro.occupation_code ORDER BY ro.created_at)
      FROM public.registration_occupations ro
      WHERE ro.user_id = rp.user_id
    ), '[]'::jsonb),
    'occupation_answers', COALESCE((
      SELECT jsonb_object_agg(grouped.occupation_code, grouped.answers)
      FROM (
        SELECT
          ra.occupation_code,
          jsonb_object_agg(ra.question_key, ra.answer) AS answers
        FROM public.registration_occupation_answers ra
        WHERE ra.user_id = rp.user_id
        GROUP BY ra.occupation_code
      ) AS grouped
    ), '{}'::jsonb),
    'circumstances', jsonb_build_object(
      'disability_present', rc.disability_present,
      'disability_category', rc.disability_category,
      'disability_percentage', rc.disability_percentage,
      'senior_citizens', rc.senior_citizens,
      'senior_citizen_count', rc.senior_citizen_count,
      'widow_headed', rc.widow_headed,
      'single_parent', rc.single_parent,
      'women_headed', rc.women_headed,
      'shg_member', rc.shg_member,
      'minority_welfare_interest', rc.minority_welfare_interest,
      'other_note', rc.other_note
    ),
    'documents', COALESCE((
      SELECT jsonb_object_agg(rd.document_code, rd.availability)
      FROM public.registration_documents rd
      WHERE rd.user_id = rp.user_id
    ), '{}'::jsonb),
    'scheme_preferences', COALESCE((
      SELECT jsonb_agg(sp.category_code ORDER BY sp.created_at)
      FROM public.registration_scheme_preferences sp
      WHERE sp.user_id = rp.user_id
    ), '[]'::jsonb)
  )
  INTO result
  FROM public.registration_profiles rp
  LEFT JOIN public.registration_circumstances rc ON rc.user_id = rp.user_id
  WHERE rp.user_id = p_user_id;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_registration_profile(
  p_user_id UUID,
  p_mode TEXT,
  p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists BOOLEAN;
  v_status TEXT;
  v_basic JSONB;
  v_circumstances JSONB;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'missing_user';
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF p_mode NOT IN ('create', 'update') THEN
    RAISE EXCEPTION 'invalid_mode';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'account_profile_missing';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.registration_profiles WHERE user_id = p_user_id
  ) INTO v_exists;

  IF p_mode = 'create' AND v_exists THEN
    RAISE EXCEPTION 'registration_exists';
  END IF;

  IF p_mode = 'update' AND NOT v_exists THEN
    RAISE EXCEPTION 'registration_missing';
  END IF;

  v_status := p_payload->>'status';
  v_basic := p_payload->'basic';
  v_circumstances := p_payload->'circumstances';

  INSERT INTO public.registration_profiles (
    user_id,
    age_group,
    gender,
    state,
    district,
    district_other,
    block,
    block_other,
    village,
    residence_type,
    family_size,
    household_income_range,
    marital_status,
    status,
    current_step,
    submitted_at
  ) VALUES (
    p_user_id,
    v_basic->>'age_group',
    v_basic->>'gender',
    v_basic->>'state',
    v_basic->>'district',
    v_basic->>'district_other',
    v_basic->>'block',
    v_basic->>'block_other',
    v_basic->>'village',
    v_basic->>'residence_type',
    NULLIF(v_basic->>'family_size', '')::INTEGER,
    v_basic->>'household_income_range',
    v_basic->>'marital_status',
    v_status,
    (p_payload->>'current_step')::INTEGER,
    CASE WHEN v_status = 'submitted' THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    age_group = EXCLUDED.age_group,
    gender = EXCLUDED.gender,
    state = EXCLUDED.state,
    district = EXCLUDED.district,
    district_other = EXCLUDED.district_other,
    block = EXCLUDED.block,
    block_other = EXCLUDED.block_other,
    village = EXCLUDED.village,
    residence_type = EXCLUDED.residence_type,
    family_size = EXCLUDED.family_size,
    household_income_range = EXCLUDED.household_income_range,
    marital_status = EXCLUDED.marital_status,
    status = EXCLUDED.status,
    current_step = EXCLUDED.current_step,
    submitted_at = CASE
      WHEN EXCLUDED.status = 'submitted' THEN COALESCE(
        public.registration_profiles.submitted_at,
        NOW()
      )
      ELSE NULL
    END;

  DELETE FROM public.registration_occupation_answers WHERE user_id = p_user_id;
  DELETE FROM public.registration_occupations WHERE user_id = p_user_id;

  INSERT INTO public.registration_occupations (user_id, occupation_code)
  SELECT p_user_id, value
  FROM jsonb_array_elements_text(COALESCE(p_payload->'occupations', '[]'::jsonb));

  INSERT INTO public.registration_occupation_answers (
    user_id, occupation_code, question_key, answer
  )
  SELECT p_user_id, occupation.key, question.key, question.value
  FROM jsonb_each(COALESCE(p_payload->'occupation_answers', '{}'::jsonb)) AS occupation
  CROSS JOIN LATERAL jsonb_each(occupation.value) AS question;

  INSERT INTO public.registration_circumstances (
    user_id,
    disability_present,
    disability_category,
    disability_percentage,
    senior_citizens,
    senior_citizen_count,
    widow_headed,
    single_parent,
    women_headed,
    shg_member,
    minority_welfare_interest,
    other_note
  ) VALUES (
    p_user_id,
    NULLIF(v_circumstances->>'disability_present', '')::BOOLEAN,
    v_circumstances->>'disability_category',
    v_circumstances->>'disability_percentage',
    NULLIF(v_circumstances->>'senior_citizens', '')::BOOLEAN,
    NULLIF(v_circumstances->>'senior_citizen_count', '')::INTEGER,
    NULLIF(v_circumstances->>'widow_headed', '')::BOOLEAN,
    NULLIF(v_circumstances->>'single_parent', '')::BOOLEAN,
    NULLIF(v_circumstances->>'women_headed', '')::BOOLEAN,
    NULLIF(v_circumstances->>'shg_member', '')::BOOLEAN,
    NULLIF(v_circumstances->>'minority_welfare_interest', '')::BOOLEAN,
    v_circumstances->>'other_note'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    disability_present = EXCLUDED.disability_present,
    disability_category = EXCLUDED.disability_category,
    disability_percentage = EXCLUDED.disability_percentage,
    senior_citizens = EXCLUDED.senior_citizens,
    senior_citizen_count = EXCLUDED.senior_citizen_count,
    widow_headed = EXCLUDED.widow_headed,
    single_parent = EXCLUDED.single_parent,
    women_headed = EXCLUDED.women_headed,
    shg_member = EXCLUDED.shg_member,
    minority_welfare_interest = EXCLUDED.minority_welfare_interest,
    other_note = EXCLUDED.other_note;

  DELETE FROM public.registration_documents WHERE user_id = p_user_id;
  INSERT INTO public.registration_documents (user_id, document_code, availability)
  SELECT p_user_id, document.key, document.value #>> '{}'
  FROM jsonb_each(COALESCE(p_payload->'documents', '{}'::jsonb)) AS document;

  DELETE FROM public.registration_scheme_preferences WHERE user_id = p_user_id;
  INSERT INTO public.registration_scheme_preferences (user_id, category_code)
  SELECT p_user_id, value
  FROM jsonb_array_elements_text(COALESCE(p_payload->'scheme_preferences', '[]'::jsonb));

  RETURN public.get_registration_profile(p_user_id);
END;
$$;

REVOKE ALL ON FUNCTION public.get_registration_profile(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_registration_profile(UUID, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_registration_profile(UUID) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.save_registration_profile(UUID, TEXT, JSONB) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_registration_profile(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.save_registration_profile(UUID, TEXT, JSONB) TO service_role;
