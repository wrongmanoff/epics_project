/** Document checklist visibility. Availability only — never document numbers. */

const IDENTITY = ['aadhaar', 'pan', 'voter_id', 'passport', 'other_identity'];
const RESIDENCE = ['domicile', 'residence_certificate', 'ration_card', 'other_residence'];
const SOCIAL = ['income_certificate', 'caste_sc', 'caste_st', 'caste_obc', 'ews', 'other_social'];
const AGRICULTURE = ['land_records', 'khasra_khatauni', 'farmer_registration', 'kisan_credit_card', 'agri_insurance', 'other_farmer'];
const EMPLOYMENT = ['labour_card', 'mgnrega', 'eshram', 'employment_registration', 'skill_certification'];
const EDUCATION = ['school_certificate', 'marksheet', 'transfer_certificate', 'graduation_certificate', 'scholarship_documents', 'other_education'];

const LABOUR_OCCUPATIONS = new Set([
  'agricultural_labourer',
  'daily_wage',
  'unemployed',
  'private_employee',
  'government_employee',
  'self_employed',
  'artisan',
]);

export const SCHEME_CATEGORIES = [
  'agriculture',
  'education',
  'healthcare',
  'housing',
  'employment',
  'women',
  'child',
  'pension',
  'social_security',
  'business',
  'financial',
  'other',
];

export const AVAILABILITY = ['available', 'not_available', 'not_sure'];

export function visibleDocumentCategories(occupations, circumstances) {
  const selected = new Set(occupations || []);
  const categories = [
    { id: 'identity', documents: IDENTITY },
    { id: 'residence', documents: RESIDENCE },
    { id: 'social', documents: SOCIAL },
  ];

  if (selected.has('farmer') || selected.has('agricultural_labourer')) {
    categories.push({ id: 'agriculture', documents: AGRICULTURE });
  }
  if ([...selected].some((code) => LABOUR_OCCUPATIONS.has(code))) {
    categories.push({ id: 'employment', documents: EMPLOYMENT });
  }
  if (selected.has('student') || selected.has('teacher') || selected.has('unemployed')) {
    categories.push({ id: 'education', documents: EDUCATION });
  }

  const welfare = [];
  if (circumstances?.disability_present === true) welfare.push('disability_certificate');
  if (circumstances?.senior_citizens === true) welfare.push('senior_citizen_id');
  if (circumstances?.widow_headed === true) welfare.push('widow_certificate');
  if (circumstances?.shg_member === true) welfare.push('shg_document');
  if (welfare.length) {
    welfare.push('other_welfare');
    categories.push({ id: 'welfare', documents: welfare });
  }
  return categories;
}
