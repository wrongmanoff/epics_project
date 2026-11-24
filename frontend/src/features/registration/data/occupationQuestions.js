/** Occupation questionnaires. Add an occupation by appending one entry here and in the backend catalog. */

const YES_NO = ['yes', 'no', 'not_sure'];

export const OCCUPATIONS = [
  'farmer',
  'agricultural_labourer',
  'student',
  'teacher',
  'daily_wage',
  'private_employee',
  'government_employee',
  'business_owner',
  'self_employed',
  'artisan',
  'homemaker',
  'unemployed',
  'other',
];

export const OCCUPATION_QUESTIONS = {
  farmer: [
    { key: 'owns_land', type: 'single', options: YES_NO },
    { key: 'cultivates_leased', type: 'single', options: YES_NO },
    {
      key: 'landholding',
      type: 'single',
      options: ['land_marginal', 'land_small', 'land_semi_medium', 'land_medium', 'land_large', 'land_none'],
    },
    { key: 'irrigation', type: 'single', options: ['irrigation_full', 'irrigation_partial', 'irrigation_none'] },
    {
      key: 'crops',
      type: 'multi',
      options: ['crop_cereals', 'crop_pulses', 'crop_oilseeds', 'crop_vegetables', 'crop_fruits', 'crop_cash', 'crop_other'],
    },
    { key: 'farmer_schemes', type: 'single', options: YES_NO },
    { key: 'kcc', type: 'single', options: YES_NO },
    { key: 'agri_authority', type: 'single', options: YES_NO },
  ],
  student: [
    {
      key: 'education_level',
      type: 'single',
      options: ['edu_primary', 'edu_secondary', 'edu_higher_secondary', 'edu_diploma', 'edu_undergraduate', 'edu_postgraduate', 'edu_other'],
    },
    {
      key: 'institution_type',
      type: 'single',
      options: ['institution_school', 'institution_college', 'institution_university', 'institution_iti', 'institution_other'],
    },
    { key: 'stream', type: 'single', options: ['stream_arts', 'stream_science', 'stream_commerce', 'stream_vocational', 'stream_other'] },
    { key: 'academic_year', type: 'single', options: ['year_1', 'year_2', 'year_3', 'year_4', 'year_5_plus'] },
    { key: 'institution_management', type: 'single', options: ['management_government', 'management_private', 'management_aided'] },
    { key: 'scholarship_need', type: 'single', options: YES_NO },
    { key: 'hostel', type: 'single', options: YES_NO },
  ],
  teacher: [
    { key: 'institution_management', type: 'single', options: ['management_government', 'management_private', 'management_aided'] },
    { key: 'teaching_level', type: 'single', options: ['teach_primary', 'teach_secondary', 'teach_higher_secondary', 'teach_college', 'teach_other'] },
    { key: 'employment_type', type: 'single', options: ['job_permanent', 'job_contract', 'job_guest', 'job_other'] },
    { key: 'professional_qualification', type: 'multi', options: ['qual_dled', 'qual_bed', 'qual_med', 'qual_net', 'qual_other', 'qual_none'] },
    { key: 'posting', type: 'single', options: ['rural', 'urban'] },
  ],
  agricultural_labourer: [
    { key: 'work_nature', type: 'multi', options: ['agri_work_sowing', 'agri_work_harvest', 'agri_work_livestock', 'agri_work_other'] },
    { key: 'employment_pattern', type: 'single', options: ['pattern_seasonal', 'pattern_permanent', 'pattern_occasional'] },
    { key: 'employment_duration', type: 'single', options: ['duration_under_3m', 'duration_3_6m', 'duration_6_9m', 'duration_year_round'] },
    { key: 'income_range', type: 'single', options: ['wage_under_5k', 'wage_5_10k', 'wage_10_20k', 'wage_above_20k', 'wage_prefer_not'] },
    { key: 'labour_registration', type: 'single', options: YES_NO },
  ],
  daily_wage: [
    { key: 'work_type', type: 'multi', options: ['wage_construction', 'wage_domestic', 'wage_loading', 'wage_sanitation', 'wage_other'] },
    { key: 'frequency', type: 'single', options: ['freq_daily', 'freq_few_days', 'freq_occasional'] },
    { key: 'daily_income', type: 'single', options: ['daily_under_300', 'daily_300_500', 'daily_500_800', 'daily_above_800', 'daily_prefer_not'] },
    { key: 'work_location', type: 'single', options: ['rural', 'urban'] },
    { key: 'labour_registration', type: 'single', options: YES_NO },
    { key: 'welfare_registration', type: 'single', options: YES_NO },
  ],
  private_employee: [
    { key: 'industry', type: 'single', options: ['industry_manufacturing', 'industry_services', 'industry_it', 'industry_retail', 'industry_other'] },
    { key: 'employment_type', type: 'single', options: ['job_permanent', 'job_contract', 'job_guest', 'job_other'] },
    { key: 'monthly_income', type: 'single', options: ['monthly_under_10k', 'monthly_10_20', 'monthly_20_40', 'monthly_above_40', 'monthly_prefer_not'] },
  ],
  government_employee: [
    { key: 'gov_level', type: 'single', options: ['gov_central', 'gov_state', 'gov_local'] },
    { key: 'employment_type', type: 'single', options: ['job_permanent', 'job_contract', 'job_guest', 'job_other'] },
    { key: 'service_years', type: 'single', options: ['service_under_5', 'service_5_15', 'service_above_15'] },
    { key: 'posting', type: 'single', options: ['rural', 'urban'] },
  ],
  business_owner: [
    { key: 'enterprise_type', type: 'single', options: ['ent_trading', 'ent_manufacturing', 'ent_services', 'ent_agri_business', 'ent_other'] },
    { key: 'ownership', type: 'single', options: ['own_sole', 'own_partnership', 'own_family'] },
    { key: 'enterprise_size', type: 'single', options: ['size_micro', 'size_small', 'size_medium', 'size_not_sure'] },
    { key: 'business_location', type: 'single', options: ['rural', 'urban'] },
    { key: 'turnover', type: 'single', options: ['turn_under_10l', 'turn_10_50l', 'turn_50l_1cr', 'turn_above_1cr', 'turn_prefer_not'] },
    { key: 'udyam', type: 'single', options: YES_NO },
    { key: 'other_registration', type: 'single', options: YES_NO },
  ],
  self_employed: [
    { key: 'activity', type: 'text', maxLength: 120 },
    { key: 'registered', type: 'single', options: YES_NO },
    { key: 'workplace', type: 'single', options: ['rural', 'urban'] },
    { key: 'monthly_income', type: 'single', options: ['monthly_under_10k', 'monthly_10_20', 'monthly_20_40', 'monthly_above_40', 'monthly_prefer_not'] },
  ],
  artisan: [
    { key: 'craft', type: 'text', maxLength: 120 },
    { key: 'sales_channel', type: 'multi', options: ['sales_self', 'sales_cooperative', 'sales_market', 'sales_online'] },
    { key: 'cluster_member', type: 'single', options: YES_NO },
  ],
  homemaker: [
    { key: 'responsibilities', type: 'multi', options: ['home_care', 'home_cooking', 'home_elder', 'home_farm_support', 'home_other'] },
    { key: 'shg_member', type: 'single', options: YES_NO },
    { key: 'livelihood', type: 'single', options: YES_NO },
    { key: 'women_welfare_interest', type: 'single', options: YES_NO },
  ],
  unemployed: [
    { key: 'seeking', type: 'single', options: YES_NO },
    {
      key: 'education_level',
      type: 'single',
      options: ['edu_primary', 'edu_secondary', 'edu_higher_secondary', 'edu_diploma', 'edu_undergraduate', 'edu_postgraduate', 'edu_other'],
    },
    { key: 'vocational_training', type: 'single', options: YES_NO },
    { key: 'employment_registered', type: 'single', options: YES_NO },
    { key: 'skill_interests', type: 'multi', options: ['skill_digital', 'skill_tailoring', 'skill_agriculture', 'skill_construction', 'skill_business', 'skill_other'] },
  ],
  other: [{ key: 'description', type: 'text', maxLength: 160 }],
};

export const STEPS = ['basic', 'occupation', 'family', 'documents', 'schemes', 'review'];
