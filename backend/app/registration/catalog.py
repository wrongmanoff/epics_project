"""Allowed registration values. Keep in sync with the frontend question config."""

OCCUPATIONS = (
    "farmer",
    "agricultural_labourer",
    "student",
    "teacher",
    "daily_wage",
    "private_employee",
    "government_employee",
    "business_owner",
    "self_employed",
    "artisan",
    "homemaker",
    "unemployed",
    "other",
)

YES_NO = ("yes", "no", "not_sure")

AGE_GROUPS = (
    "age_18_25",
    "age_26_35",
    "age_36_45",
    "age_46_59",
    "age_60_plus",
)
GENDERS = ("female", "male", "other", "prefer_not")
RESIDENCE_TYPES = ("rural", "urban")
INCOME_RANGES = (
    "income_below_1",
    "income_1_2_5",
    "income_2_5_5",
    "income_5_8",
    "income_above_8",
    "income_prefer_not",
)
MARITAL_STATUSES = (
    "marital_single",
    "marital_married",
    "marital_widowed",
    "marital_divorced",
    "marital_separated",
    "marital_prefer_not",
)

STATES = (
    "AP", "AR", "AS", "BR", "CG", "GA", "GJ", "HR", "HP", "JH", "KA", "KL",
    "MP", "MH", "MN", "ML", "MZ", "NL", "OD", "PB", "RJ", "SK", "TN", "TS",
    "TR", "UP", "UK", "WB", "AN", "CH", "DN", "DL", "JK", "LA", "LD", "PY",
)

# Districts are included where a short hierarchical list is maintained.
# Other states use a free-text district field.
DISTRICTS = {
    "MH": ("MH_PUNE", "MH_NASHIK", "MH_AHMEDNAGAR"),
    "UP": ("UP_LUCKNOW", "UP_VARANASI", "UP_PRAYAGRAJ"),
    "BR": ("BR_PATNA", "BR_GAYA", "BR_MUZAFFARPUR"),
    "RJ": ("RJ_JAIPUR", "RJ_JODHPUR", "RJ_UDAIPUR"),
    "MP": ("MP_BHOPAL", "MP_INDORE", "MP_JABALPUR"),
    "KA": ("KA_BENGALURU", "KA_MYSURU", "KA_BELAGAVI"),
    "TN": ("TN_CHENNAI", "TN_COIMBATORE", "TN_MADURAI"),
    "GJ": ("GJ_AHMEDABAD", "GJ_SURAT", "GJ_RAJKOT"),
}

BLOCKS = {
    "MH_PUNE": ("MH_PUNE_HAVELI", "MH_PUNE_MULSHI"),
    "MH_NASHIK": ("MH_NASHIK_NASHIK", "MH_NASHIK_DINDORI"),
    "MH_AHMEDNAGAR": ("MH_AHMEDNAGAR_NAGAR", "MH_AHMEDNAGAR_RAHURI"),
    "UP_LUCKNOW": ("UP_LUCKNOW_SAROJINI", "UP_LUCKNOW_MOHANLALGANJ"),
    "UP_VARANASI": ("UP_VARANASI_SADAR", "UP_VARANASI_PINDRA"),
    "UP_PRAYAGRAJ": ("UP_PRAYAGRAJ_SADAR", "UP_PRAYAGRAJ_PHULPUR"),
    "BR_PATNA": ("BR_PATNA_PATNA_SADAR", "BR_PATNA_DANAPUR"),
    "BR_GAYA": ("BR_GAYA_GAYA_SADAR", "BR_GAYA_BODH_GAYA"),
    "BR_MUZAFFARPUR": ("BR_MUZAFFARPUR_SADAR", "BR_MUZAFFARPUR_KURHANI"),
    "RJ_JAIPUR": ("RJ_JAIPUR_SANGANER", "RJ_JAIPUR_AMER"),
    "RJ_JODHPUR": ("RJ_JODHPUR_JODHPUR", "RJ_JODHPUR_LUNI"),
    "RJ_UDAIPUR": ("RJ_UDAIPUR_GIRWA", "RJ_UDAIPUR_MAVLI"),
    "MP_BHOPAL": ("MP_BHOPAL_BERASIA", "MP_BHOPAL_PHANDA"),
    "MP_INDORE": ("MP_INDORE_INDORE", "MP_INDORE_DEPALPUR"),
    "MP_JABALPUR": ("MP_JABALPUR_JABALPUR", "MP_JABALPUR_PANAGAR"),
    "KA_BENGALURU": ("KA_BENGALURU_NORTH", "KA_BENGALURU_SOUTH"),
    "KA_MYSURU": ("KA_MYSURU_MYSURU", "KA_MYSURU_NANJANGUD"),
    "KA_BELAGAVI": ("KA_BELAGAVI_BELAGAVI", "KA_BELAGAVI_HUKKERI"),
    "TN_CHENNAI": ("TN_CHENNAI_TONDIARPET", "TN_CHENNAI_AMBATTUR"),
    "TN_COIMBATORE": ("TN_COIMBATORE_COIMBATORE_NORTH", "TN_COIMBATORE_POLLACHI"),
    "TN_MADURAI": ("TN_MADURAI_MADURAI_WEST", "TN_MADURAI_MELUR"),
    "GJ_AHMEDABAD": ("GJ_AHMEDABAD_CITY", "GJ_AHMEDABAD_DASKROI"),
    "GJ_SURAT": ("GJ_SURAT_SURAT_CITY", "GJ_SURAT_OLPAD"),
    "GJ_RAJKOT": ("GJ_RAJKOT_RAJKOT", "GJ_RAJKOT_PADDHARI"),
}

EDUCATION_LEVELS = (
    "edu_primary",
    "edu_secondary",
    "edu_higher_secondary",
    "edu_diploma",
    "edu_undergraduate",
    "edu_postgraduate",
    "edu_other",
)
INSTITUTIONS = (
    "institution_school",
    "institution_college",
    "institution_university",
    "institution_iti",
    "institution_other",
)
STREAMS = (
    "stream_arts",
    "stream_science",
    "stream_commerce",
    "stream_vocational",
    "stream_other",
)
YEARS = ("year_1", "year_2", "year_3", "year_4", "year_5_plus")
MANAGEMENT = ("management_government", "management_private", "management_aided")
TEACHING_LEVELS = (
    "teach_primary",
    "teach_secondary",
    "teach_higher_secondary",
    "teach_college",
    "teach_other",
)
JOB_TYPES = ("job_permanent", "job_contract", "job_guest", "job_other")
QUALIFICATIONS = ("qual_dled", "qual_bed", "qual_med", "qual_net", "qual_other", "qual_none")
LANDHOLDING = (
    "land_marginal",
    "land_small",
    "land_semi_medium",
    "land_medium",
    "land_large",
    "land_none",
)
IRRIGATION = ("irrigation_full", "irrigation_partial", "irrigation_none")
CROPS = (
    "crop_cereals",
    "crop_pulses",
    "crop_oilseeds",
    "crop_vegetables",
    "crop_fruits",
    "crop_cash",
    "crop_other",
)
AGRI_WORK = ("agri_work_sowing", "agri_work_harvest", "agri_work_livestock", "agri_work_other")
PATTERNS = ("pattern_seasonal", "pattern_permanent", "pattern_occasional")
DURATIONS = ("duration_under_3m", "duration_3_6m", "duration_6_9m", "duration_year_round")
WAGE_INCOME = (
    "wage_under_5k",
    "wage_5_10k",
    "wage_10_20k",
    "wage_above_20k",
    "wage_prefer_not",
)
WAGE_TYPES = (
    "wage_construction",
    "wage_domestic",
    "wage_loading",
    "wage_sanitation",
    "wage_other",
)
FREQUENCIES = ("freq_daily", "freq_few_days", "freq_occasional")
DAILY_INCOME = (
    "daily_under_300",
    "daily_300_500",
    "daily_500_800",
    "daily_above_800",
    "daily_prefer_not",
)
INDUSTRIES = (
    "industry_manufacturing",
    "industry_services",
    "industry_it",
    "industry_retail",
    "industry_other",
)
MONTHLY_INCOME = (
    "monthly_under_10k",
    "monthly_10_20",
    "monthly_20_40",
    "monthly_above_40",
    "monthly_prefer_not",
)
GOV_LEVELS = ("gov_central", "gov_state", "gov_local")
SERVICE_YEARS = ("service_under_5", "service_5_15", "service_above_15")
ENTERPRISES = (
    "ent_trading",
    "ent_manufacturing",
    "ent_services",
    "ent_agri_business",
    "ent_other",
)
OWNERSHIP = ("own_sole", "own_partnership", "own_family")
SIZES = ("size_micro", "size_small", "size_medium", "size_not_sure")
TURNOVER = (
    "turn_under_10l",
    "turn_10_50l",
    "turn_50l_1cr",
    "turn_above_1cr",
    "turn_prefer_not",
)
SALES = ("sales_self", "sales_cooperative", "sales_market", "sales_online")
HOME_DUTIES = (
    "home_care",
    "home_cooking",
    "home_elder",
    "home_farm_support",
    "home_other",
)
SKILLS = (
    "skill_digital",
    "skill_tailoring",
    "skill_agriculture",
    "skill_construction",
    "skill_business",
    "skill_other",
)
DISABILITY_CATEGORIES = (
    "dis_locomotor",
    "dis_visual",
    "dis_hearing",
    "dis_intellectual",
    "dis_multiple",
    "dis_other",
    "dis_prefer_not",
)
DISABILITY_RANGES = ("dis_under_40", "dis_40_80", "dis_above_80", "dis_not_sure")

# type: single | multi | text
OCCUPATION_QUESTIONS = {
    "farmer": {
        "owns_land": ("single", YES_NO),
        "cultivates_leased": ("single", YES_NO),
        "landholding": ("single", LANDHOLDING),
        "irrigation": ("single", IRRIGATION),
        "crops": ("multi", CROPS),
        "farmer_schemes": ("single", YES_NO),
        "kcc": ("single", YES_NO),
        "agri_authority": ("single", YES_NO),
    },
    "student": {
        "education_level": ("single", EDUCATION_LEVELS),
        "institution_type": ("single", INSTITUTIONS),
        "stream": ("single", STREAMS),
        "academic_year": ("single", YEARS),
        "institution_management": ("single", MANAGEMENT),
        "scholarship_need": ("single", YES_NO),
        "hostel": ("single", YES_NO),
    },
    "teacher": {
        "institution_management": ("single", MANAGEMENT),
        "teaching_level": ("single", TEACHING_LEVELS),
        "employment_type": ("single", JOB_TYPES),
        "professional_qualification": ("multi", QUALIFICATIONS),
        "posting": ("single", RESIDENCE_TYPES),
    },
    "agricultural_labourer": {
        "work_nature": ("multi", AGRI_WORK),
        "employment_pattern": ("single", PATTERNS),
        "employment_duration": ("single", DURATIONS),
        "income_range": ("single", WAGE_INCOME),
        "labour_registration": ("single", YES_NO),
    },
    "daily_wage": {
        "work_type": ("multi", WAGE_TYPES),
        "frequency": ("single", FREQUENCIES),
        "daily_income": ("single", DAILY_INCOME),
        "work_location": ("single", RESIDENCE_TYPES),
        "labour_registration": ("single", YES_NO),
        "welfare_registration": ("single", YES_NO),
    },
    "private_employee": {
        "industry": ("single", INDUSTRIES),
        "employment_type": ("single", JOB_TYPES),
        "monthly_income": ("single", MONTHLY_INCOME),
    },
    "government_employee": {
        "gov_level": ("single", GOV_LEVELS),
        "employment_type": ("single", JOB_TYPES),
        "service_years": ("single", SERVICE_YEARS),
        "posting": ("single", RESIDENCE_TYPES),
    },
    "business_owner": {
        "enterprise_type": ("single", ENTERPRISES),
        "ownership": ("single", OWNERSHIP),
        "enterprise_size": ("single", SIZES),
        "business_location": ("single", RESIDENCE_TYPES),
        "turnover": ("single", TURNOVER),
        "udyam": ("single", YES_NO),
        "other_registration": ("single", YES_NO),
    },
    "self_employed": {
        "activity": ("text", 120),
        "registered": ("single", YES_NO),
        "workplace": ("single", RESIDENCE_TYPES),
        "monthly_income": ("single", MONTHLY_INCOME),
    },
    "artisan": {
        "craft": ("text", 120),
        "sales_channel": ("multi", SALES),
        "cluster_member": ("single", YES_NO),
    },
    "homemaker": {
        "responsibilities": ("multi", HOME_DUTIES),
        "shg_member": ("single", YES_NO),
        "livelihood": ("single", YES_NO),
        "women_welfare_interest": ("single", YES_NO),
    },
    "unemployed": {
        "seeking": ("single", YES_NO),
        "education_level": ("single", EDUCATION_LEVELS),
        "vocational_training": ("single", YES_NO),
        "employment_registered": ("single", YES_NO),
        "skill_interests": ("multi", SKILLS),
    },
    "other": {
        "description": ("text", 160),
    },
}

LABOUR_OCCUPATIONS = {
    "agricultural_labourer",
    "daily_wage",
    "unemployed",
    "private_employee",
    "government_employee",
    "self_employed",
    "artisan",
}
EDUCATION_OCCUPATIONS = {"student", "teacher", "unemployed"}
AGRI_OCCUPATIONS = {"farmer", "agricultural_labourer"}

DOCUMENT_CODES = (
    "aadhaar",
    "pan",
    "voter_id",
    "passport",
    "other_identity",
    "domicile",
    "residence_certificate",
    "ration_card",
    "other_residence",
    "income_certificate",
    "caste_sc",
    "caste_st",
    "caste_obc",
    "ews",
    "other_social",
    "land_records",
    "khasra_khatauni",
    "farmer_registration",
    "kisan_credit_card",
    "agri_insurance",
    "other_farmer",
    "labour_card",
    "mgnrega",
    "eshram",
    "employment_registration",
    "skill_certification",
    "school_certificate",
    "marksheet",
    "transfer_certificate",
    "graduation_certificate",
    "scholarship_documents",
    "other_education",
    "disability_certificate",
    "senior_citizen_id",
    "widow_certificate",
    "shg_document",
    "other_welfare",
)

ALWAYS_DOCUMENTS = {
    "aadhaar",
    "pan",
    "voter_id",
    "passport",
    "other_identity",
    "domicile",
    "residence_certificate",
    "ration_card",
    "other_residence",
    "income_certificate",
    "caste_sc",
    "caste_st",
    "caste_obc",
    "ews",
    "other_social",
}
AGRI_DOCUMENTS = {
    "land_records",
    "khasra_khatauni",
    "farmer_registration",
    "kisan_credit_card",
    "agri_insurance",
    "other_farmer",
}
EMPLOYMENT_DOCUMENTS = {
    "labour_card",
    "mgnrega",
    "eshram",
    "employment_registration",
    "skill_certification",
}
EDUCATION_DOCUMENTS = {
    "school_certificate",
    "marksheet",
    "transfer_certificate",
    "graduation_certificate",
    "scholarship_documents",
    "other_education",
}

AVAILABILITY = ("available", "not_available", "not_sure")

SCHEME_CATEGORIES = (
    "agriculture",
    "education",
    "healthcare",
    "housing",
    "employment",
    "women",
    "child",
    "pension",
    "social_security",
    "business",
    "financial",
    "other",
)

REQUIRED_BASIC_ON_SUBMIT = (
    "age_group",
    "gender",
    "state",
    "residence_type",
    "household_income_range",
)
