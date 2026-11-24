"""Validation tests for the registration profile payload."""

import unittest

from app.registration.validators import normalize_registration, visible_document_codes


def _submitted(**overrides):
    payload = {
        "status": "submitted",
        "current_step": 6,
        "basic": {
            "age_group": "age_26_35",
            "gender": "female",
            "state": "MH",
            "district": "MH_PUNE",
            "block": "MH_PUNE_HAVELI",
            "village": "Wagholi",
            "residence_type": "rural",
            "family_size": 4,
            "household_income_range": "income_1_2_5",
            "marital_status": "marital_married",
        },
        "occupations": ["farmer", "business_owner"],
        "occupation_answers": {
            "farmer": {"owns_land": "yes", "crops": ["crop_cereals", "crop_pulses"]},
            "business_owner": {"udyam": "not_sure", "enterprise_size": "size_micro"},
            "student": {"education_level": "edu_undergraduate"},
        },
        "circumstances": {
            "disability_present": True,
            "disability_category": "dis_visual",
            "disability_percentage": "dis_40_80",
            "senior_citizens": False,
            "widow_headed": False,
            "single_parent": False,
            "women_headed": True,
            "shg_member": False,
            "minority_welfare_interest": True,
        },
        "documents": {
            "aadhaar": "available",
            "land_records": "not_sure",
            "school_certificate": "available",
            "disability_certificate": "not_available",
        },
        "scheme_preferences": ["agriculture", "women"],
        "user_id": "00000000-0000-0000-0000-000000000000",
    }
    payload.update(overrides)
    return payload


class RegistrationValidatorTests(unittest.TestCase):
    def test_submit_keeps_selected_occupations_only(self):
        cleaned, errors = normalize_registration(_submitted(), for_submit=True)
        self.assertEqual(errors, [])
        self.assertNotIn("user_id", cleaned)
        self.assertEqual(cleaned["occupations"], ["farmer", "business_owner"])
        self.assertIn("farmer", cleaned["occupation_answers"])
        self.assertNotIn("student", cleaned["occupation_answers"])
        self.assertEqual(cleaned["documents"]["aadhaar"], "available")
        self.assertEqual(cleaned["documents"]["land_records"], "not_sure")
        self.assertNotIn("school_certificate", cleaned["documents"])
        self.assertEqual(cleaned["documents"]["disability_certificate"], "not_available")

    def test_draft_allows_empty_optional_profile(self):
        cleaned, errors = normalize_registration(
            {"status": "draft", "current_step": 1},
            for_submit=False,
        )
        self.assertEqual(errors, [])
        self.assertEqual(cleaned["status"], "draft")
        self.assertEqual(cleaned["occupations"], [])

    def test_submit_requires_basic_fields_and_occupation(self):
        _, errors = normalize_registration({"status": "submitted"}, for_submit=True)
        fields = {item["field"] for item in errors}
        self.assertIn("basic.age_group", fields)
        self.assertIn("basic.gender", fields)
        self.assertIn("basic.state", fields)
        self.assertIn("basic.residence_type", fields)
        self.assertIn("basic.household_income_range", fields)
        self.assertIn("occupations", fields)

    def test_invalid_occupation_rejected(self):
        _, errors = normalize_registration(
            {"occupations": ["astronaut"]},
            for_submit=False,
        )
        self.assertTrue(any(item["field"] == "occupations" for item in errors))

    def test_district_must_belong_to_state(self):
        _, errors = normalize_registration(
            {"basic": {"state": "MH", "district": "UP_LUCKNOW"}},
            for_submit=False,
        )
        self.assertTrue(any(item["field"] == "basic.district" for item in errors))

    def test_disability_follow_up_removed_when_not_present(self):
        cleaned, errors = normalize_registration(
            {
                "circumstances": {
                    "disability_present": False,
                    "disability_category": "dis_visual",
                    "senior_citizens": True,
                    "senior_citizen_count": 2,
                }
            },
            for_submit=False,
        )
        self.assertEqual(errors, [])
        self.assertIsNone(cleaned["circumstances"]["disability_category"])
        self.assertEqual(cleaned["circumstances"]["senior_citizen_count"], 2)

    def test_hidden_documents_follow_visibility_rules(self):
        visible = visible_document_codes(
            ["student"],
            {"disability_present": False, "shg_member": True},
        )
        self.assertIn("school_certificate", visible)
        self.assertNotIn("land_records", visible)
        self.assertIn("shg_document", visible)
        self.assertNotIn("disability_certificate", visible)

    def test_text_answer_length_and_unknown_question(self):
        _, errors = normalize_registration(
            {
                "occupations": ["other"],
                "occupation_answers": {
                    "other": {"description": "x" * 200, "secret": "no"}
                },
            },
            for_submit=False,
        )
        fields = {item["field"] for item in errors}
        self.assertIn("occupation_answers.other.description", fields)
        self.assertIn("occupation_answers.other.secret", fields)

    def test_free_text_location_for_state_without_district_list(self):
        cleaned, errors = normalize_registration(
            {
                "basic": {
                    "state": "GA",
                    "district_other": "North Goa",
                    "block_other": "Bardez",
                    "village": "Mapusa",
                }
            },
            for_submit=False,
        )
        self.assertEqual(errors, [])
        self.assertEqual(cleaned["basic"]["district_other"], "North Goa")
        self.assertEqual(cleaned["basic"]["village"], "Mapusa")


if __name__ == "__main__":
    unittest.main()
