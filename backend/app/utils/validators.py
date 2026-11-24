"""Input validation helpers for authentication endpoints."""

import re

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MOBILE_RE = re.compile(r"^[6-9]\d{9}$")


def validate_email(email: str) -> str | None:
    if not email or not isinstance(email, str):
        return "Email is required."
    email = email.strip().lower()
    if not EMAIL_RE.match(email):
        return "Please enter a valid email address."
    if len(email) > 255:
        return "Email address is too long."
    return None


def validate_password(password: str, *, for_signup: bool = False) -> str | None:
    if not password or not isinstance(password, str):
        return "Password is required."
    if for_signup:
        if len(password) < 8:
            return "Password must be at least 8 characters."
        if len(password) > 128:
            return "Password is too long."
        if not re.search(r"[A-Za-z]", password):
            return "Password must include at least one letter."
        if not re.search(r"\d", password):
            return "Password must include at least one number."
    return None


def validate_full_name(name: str) -> str | None:
    if not name or not isinstance(name, str) or not name.strip():
        return "Full name is required."
    name = name.strip()
    if len(name) < 2:
        return "Full name must be at least 2 characters."
    if len(name) > 120:
        return "Full name is too long."
    return None


def validate_mobile(mobile: str | None) -> str | None:
    if mobile is None or mobile == "":
        return None
    if not isinstance(mobile, str):
        return "Mobile number is invalid."
    cleaned = re.sub(r"[\s\-]", "", mobile.strip())
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    if cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    if not MOBILE_RE.match(cleaned):
        return "Enter a valid 10-digit Indian mobile number."
    return None


def normalize_mobile(mobile: str | None) -> str | None:
    if not mobile:
        return None
    cleaned = re.sub(r"[\s\-]", "", mobile.strip())
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    if cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    return cleaned or None


def validate_signup_payload(data: dict) -> tuple[dict | None, str | None]:
    if not isinstance(data, dict):
        return None, "Invalid request body."

    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    confirm_password = data.get("confirm_password") or ""
    mobile_number = data.get("mobile_number")
    accept_terms = data.get("accept_terms")

    for err in (
        validate_full_name(full_name),
        validate_email(email),
        validate_password(password, for_signup=True),
        validate_mobile(mobile_number),
    ):
        if err:
            return None, err

    if password != confirm_password:
        return None, "Passwords do not match."

    if accept_terms is not True:
        return None, "You must accept the terms and privacy policy."

    return {
        "full_name": full_name,
        "email": email,
        "password": password,
        "mobile_number": normalize_mobile(mobile_number),
    }, None


def validate_login_payload(data: dict) -> tuple[dict | None, str | None]:
    if not isinstance(data, dict):
        return None, "Invalid request body."

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    err = validate_email(email)
    if err:
        return None, err
    err = validate_password(password, for_signup=False)
    if err:
        return None, err

    return {"email": email, "password": password}, None
