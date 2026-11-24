"""Server-side validation for registration profiles.

The caller must pass the authenticated user id separately. Any user id inside
the request body is ignored and never returned.
"""

from __future__ import annotations

from app.registration.catalog import (
    AGE_GROUPS,
    AGRI_DOCUMENTS,
    AGRI_OCCUPATIONS,
    ALWAYS_DOCUMENTS,
    AVAILABILITY,
    BLOCKS,
    DISABILITY_CATEGORIES,
    DISABILITY_RANGES,
    DISTRICTS,
    DOCUMENT_CODES,
    EDUCATION_DOCUMENTS,
    EDUCATION_OCCUPATIONS,
    EMPLOYMENT_DOCUMENTS,
    GENDERS,
    INCOME_RANGES,
    LABOUR_OCCUPATIONS,
    MARITAL_STATUSES,
    OCCUPATION_QUESTIONS,
    OCCUPATIONS,
    REQUIRED_BASIC_ON_SUBMIT,
    RESIDENCE_TYPES,
    SCHEME_CATEGORIES,
    STATES,
)

OTHER = "other"
MAX_MULTI = 12


def _detail(field: str, code: str) -> dict:
    return {"field": field, "code": code}


def _is_blank(value) -> bool:
    return value is None or (isinstance(value, str) and value.strip() == "")


def _clean_text(value, max_len: int) -> str | None:
    if _is_blank(value):
        return None
    if not isinstance(value, str):
        return None
    text = " ".join(value.split())
    if any(ord(char) < 32 for char in text):
        return None
    if len(text) > max_len:
        return None
    return text


def visible_document_codes(occupations: list[str], circumstances: dict) -> set[str]:
    visible = set(ALWAYS_DOCUMENTS)
    selected = set(occupations)
    if selected & AGRI_OCCUPATIONS:
        visible |= AGRI_DOCUMENTS
    if selected & LABOUR_OCCUPATIONS:
        visible |= EMPLOYMENT_DOCUMENTS
    if selected & EDUCATION_OCCUPATIONS:
        visible |= EDUCATION_DOCUMENTS
    welfare = False
    if circumstances.get("disability_present") is True:
        visible.add("disability_certificate")
        welfare = True
    if circumstances.get("senior_citizens") is True:
        visible.add("senior_citizen_id")
        welfare = True
    if circumstances.get("widow_headed") is True:
        visible.add("widow_certificate")
        welfare = True
    if circumstances.get("shg_member") is True:
        visible.add("shg_document")
        welfare = True
    if welfare:
        visible.add("other_welfare")
    return visible


def _choice(value, allowed, field: str, errors: list) -> str | None:
    if _is_blank(value):
        return None
    if not isinstance(value, str) or value not in allowed:
        errors.append(_detail(field, "invalid"))
        return None
    return value


def _bool_flag(value, field: str, errors: list):
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return value
    errors.append(_detail(field, "invalid"))
    return None


def _clean_answer(occupation: str, key: str, raw, errors: list):
    spec = OCCUPATION_QUESTIONS[occupation].get(key)
    field = f"occupation_answers.{occupation}.{key}"
    if spec is None:
        errors.append(_detail(field, "invalid_question"))
        return None
    kind = spec[0]
    if kind == "text":
        if _is_blank(raw):
            return None
        if not isinstance(raw, str):
            errors.append(_detail(field, "invalid"))
            return None
        cleaned = _clean_text(raw, spec[1])
        if cleaned is None:
            errors.append(_detail(field, "invalid"))
        return cleaned
    if kind == "single":
        return _choice(raw, spec[1], field, errors)
    if kind == "multi":
        if raw is None or raw == [] or raw == "":
            return None
        if not isinstance(raw, list):
            errors.append(_detail(field, "invalid"))
            return None
        if len(raw) > MAX_MULTI:
            errors.append(_detail(field, "too_many"))
            return None
        selected = []
        for item in raw:
            if not isinstance(item, str) or item not in spec[1] or item in selected:
                errors.append(_detail(field, "invalid"))
                return None
            selected.append(item)
        return selected or None
    errors.append(_detail(field, "invalid"))
    return None


def _clean_basic(raw, errors: list, for_submit: bool) -> dict:
    source = raw if isinstance(raw, dict) else {}
    if raw is not None and not isinstance(raw, dict):
        errors.append(_detail("basic", "invalid"))
        return {}

    basic = {
        "age_group": _choice(source.get("age_group"), AGE_GROUPS, "basic.age_group", errors),
        "gender": _choice(source.get("gender"), GENDERS, "basic.gender", errors),
        "state": _choice(source.get("state"), STATES, "basic.state", errors),
        "residence_type": _choice(
            source.get("residence_type"),
            RESIDENCE_TYPES,
            "basic.residence_type",
            errors,
        ),
        "household_income_range": _choice(
            source.get("household_income_range"),
            INCOME_RANGES,
            "basic.household_income_range",
            errors,
        ),
        "marital_status": _choice(
            source.get("marital_status"),
            MARITAL_STATUSES,
            "basic.marital_status",
            errors,
        ),
    }

    state = basic["state"]
    district_raw = source.get("district")
    district_allowed = DISTRICTS.get(state, ())
    district = None
    if not _is_blank(district_raw):
        if state and district_raw in district_allowed:
            district = district_raw
        elif district_raw == OTHER and state:
            district = OTHER
        else:
            errors.append(_detail("basic.district", "invalid"))
    basic["district"] = district

    district_other = _clean_text(source.get("district_other"), 80)
    if source.get("district_other") not in (None, "") and district_other is None:
        errors.append(_detail("basic.district_other", "invalid"))
    if district != OTHER and not (state and state not in DISTRICTS):
        district_other = None
    if state in DISTRICTS and district != OTHER:
        district_other = None
    basic["district_other"] = district_other

    block_raw = source.get("block")
    block_allowed = BLOCKS.get(district, ()) if district and district != OTHER else ()
    block = None
    if not _is_blank(block_raw):
        if block_raw in block_allowed or (block_raw == OTHER and district and district != OTHER):
            block = block_raw
        else:
            errors.append(_detail("basic.block", "invalid"))
    basic["block"] = block

    block_other = _clean_text(source.get("block_other"), 80)
    if source.get("block_other") not in (None, "") and block_other is None:
        errors.append(_detail("basic.block_other", "invalid"))
    if block != OTHER and block_allowed:
        block_other = None
    basic["block_other"] = block_other

    village = _clean_text(source.get("village"), 80)
    if source.get("village") not in (None, "") and village is None:
        errors.append(_detail("basic.village", "invalid"))
    basic["village"] = village

    family_raw = source.get("family_size")
    family_size = None
    if family_raw not in (None, ""):
        if isinstance(family_raw, bool) or not isinstance(family_raw, int):
            errors.append(_detail("basic.family_size", "invalid"))
        elif not 1 <= family_raw <= 20:
            errors.append(_detail("basic.family_size", "invalid"))
        else:
            family_size = family_raw
    basic["family_size"] = family_size

    if for_submit:
        for field in REQUIRED_BASIC_ON_SUBMIT:
            if basic.get(field) is None:
                errors.append(_detail(f"basic.{field}", "required"))
    return basic


def _clean_occupations(raw, errors: list, for_submit: bool) -> list[str]:
    if raw is None:
        raw = []
    if not isinstance(raw, list):
        errors.append(_detail("occupations", "invalid"))
        return []
    selected = []
    for item in raw:
        if not isinstance(item, str) or item not in OCCUPATIONS or item in selected:
            errors.append(_detail("occupations", "invalid"))
            return []
        selected.append(item)
    if for_submit and not selected:
        errors.append(_detail("occupations", "required"))
    return selected


def _clean_answers(raw, occupations: list[str], errors: list) -> dict:
    """Keep answers only for occupations that are still selected."""
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        errors.append(_detail("occupation_answers", "invalid"))
        return {}
    cleaned = {}
    selected = set(occupations)
    for occupation, answers in raw.items():
        if occupation not in selected:
            continue
        if not isinstance(answers, dict):
            errors.append(_detail(f"occupation_answers.{occupation}", "invalid"))
            continue
        kept = {}
        for key, value in answers.items():
            parsed = _clean_answer(occupation, key, value, errors)
            if parsed is not None:
                kept[key] = parsed
        if kept:
            cleaned[occupation] = kept
    return cleaned


def _clean_circumstances(raw, errors: list) -> dict:
    source = raw if isinstance(raw, dict) else {}
    if raw is not None and not isinstance(raw, dict):
        errors.append(_detail("circumstances", "invalid"))
        source = {}

    disability = _bool_flag(source.get("disability_present"), "circumstances.disability_present", errors)
    senior = _bool_flag(source.get("senior_citizens"), "circumstances.senior_citizens", errors)
    widow = _bool_flag(source.get("widow_headed"), "circumstances.widow_headed", errors)
    single_parent = _bool_flag(source.get("single_parent"), "circumstances.single_parent", errors)
    women = _bool_flag(source.get("women_headed"), "circumstances.women_headed", errors)
    shg = _bool_flag(source.get("shg_member"), "circumstances.shg_member", errors)
    minority = _bool_flag(
        source.get("minority_welfare_interest"),
        "circumstances.minority_welfare_interest",
        errors,
    )

    category = None
    percentage = None
    if disability is True:
        category = _choice(
            source.get("disability_category"),
            DISABILITY_CATEGORIES,
            "circumstances.disability_category",
            errors,
        )
        percentage = _choice(
            source.get("disability_percentage"),
            DISABILITY_RANGES,
            "circumstances.disability_percentage",
            errors,
        )

    count = None
    count_raw = source.get("senior_citizen_count")
    if senior is True and count_raw not in (None, ""):
        if isinstance(count_raw, bool) or not isinstance(count_raw, int) or not 1 <= count_raw <= 10:
            errors.append(_detail("circumstances.senior_citizen_count", "invalid"))
        else:
            count = count_raw

    note = _clean_text(source.get("other_note"), 300)
    if source.get("other_note") not in (None, "") and note is None:
        errors.append(_detail("circumstances.other_note", "invalid"))

    return {
        "disability_present": disability,
        "disability_category": category,
        "disability_percentage": percentage,
        "senior_citizens": senior,
        "senior_citizen_count": count,
        "widow_headed": widow,
        "single_parent": single_parent,
        "women_headed": women,
        "shg_member": shg,
        "minority_welfare_interest": minority,
        "other_note": note,
    }


def _clean_documents(raw, occupations: list[str], circumstances: dict, errors: list) -> dict:
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        errors.append(_detail("documents", "invalid"))
        return {}
    visible = visible_document_codes(occupations, circumstances)
    cleaned = {}
    for code, availability in raw.items():
        if code not in DOCUMENT_CODES:
            errors.append(_detail(f"documents.{code}", "invalid"))
            continue
        if code not in visible:
            continue
        if _is_blank(availability):
            continue
        if not isinstance(availability, str) or availability not in AVAILABILITY:
            errors.append(_detail(f"documents.{code}", "invalid"))
            continue
        cleaned[code] = availability
    return cleaned


def _clean_preferences(raw, errors: list) -> list[str]:
    if raw is None:
        raw = []
    if not isinstance(raw, list):
        errors.append(_detail("scheme_preferences", "invalid"))
        return []
    selected = []
    for item in raw:
        if not isinstance(item, str) or item not in SCHEME_CATEGORIES or item in selected:
            errors.append(_detail("scheme_preferences", "invalid"))
            return []
        selected.append(item)
    return selected


def normalize_registration(payload, *, for_submit: bool) -> tuple[dict | None, list[dict]]:
    """Return a cleaned profile payload. User identifiers in the body are discarded."""
    errors: list[dict] = []
    if not isinstance(payload, dict):
        return None, [_detail("body", "invalid")]

    status = payload.get("status") or ("submitted" if for_submit else "draft")
    if status not in ("draft", "submitted"):
        errors.append(_detail("status", "invalid"))
        status = "draft"
    submit = for_submit or status == "submitted"

    step = payload.get("current_step", 1)
    if isinstance(step, bool) or not isinstance(step, int) or not 1 <= step <= 6:
        errors.append(_detail("current_step", "invalid"))
        step = 1

    basic = _clean_basic(payload.get("basic"), errors, submit)
    occupations = _clean_occupations(payload.get("occupations"), errors, submit)
    circumstances = _clean_circumstances(payload.get("circumstances"), errors)
    answers = _clean_answers(payload.get("occupation_answers"), occupations, errors)
    documents = _clean_documents(payload.get("documents"), occupations, circumstances, errors)
    preferences = _clean_preferences(payload.get("scheme_preferences"), errors)

    if errors:
        return None, errors

    return {
        "status": "submitted" if submit else "draft",
        "current_step": step,
        "basic": basic,
        "occupations": occupations,
        "occupation_answers": answers,
        "circumstances": circumstances,
        "documents": documents,
        "scheme_preferences": preferences,
    }, []
