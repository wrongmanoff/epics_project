"""Persistence for registration profiles.

The user id always comes from the verified session. Request bodies are validated
before they reach the database, and profile contents are not written to logs.
"""

from __future__ import annotations

from flask import current_app

from app.registration.validators import normalize_registration
from app.services.supabase_service import get_service_client


class RegistrationError(Exception):
    def __init__(self, error: str, status: int, details=None):
        super().__init__(error)
        self.error = error
        self.status = status
        self.details = details or []


def _raise_from_database(exc: Exception) -> None:
    message = str(exc).lower()
    if "registration_exists" in message:
        raise RegistrationError("registration_exists", 409) from exc
    if "registration_missing" in message:
        raise RegistrationError("registration_missing", 404) from exc
    if "account_profile_missing" in message:
        raise RegistrationError("account_profile_missing", 409) from exc
    if "forbidden" in message:
        raise RegistrationError("forbidden", 403) from exc
    current_app.logger.exception("Registration database error")
    raise RegistrationError("registration_unavailable", 503) from exc


def get_profile(user_id: str) -> dict | None:
    try:
        result = (
            get_service_client()
            .rpc("get_registration_profile", {"p_user_id": user_id})
            .execute()
        )
    except RuntimeError:
        raise
    except Exception as exc:  # noqa: BLE001
        _raise_from_database(exc)
    data = result.data
    if data in (None, "null"):
        return None
    return data


def save_profile(user_id: str, payload: dict, *, mode: str, for_submit: bool) -> dict:
    cleaned, details = normalize_registration(payload, for_submit=for_submit)
    if details:
        raise RegistrationError("validation_failed", 400, details)

    current_app.logger.info(
        "Saving registration profile user_id=%s mode=%s status=%s",
        user_id,
        mode,
        cleaned["status"],
    )

    try:
        result = (
            get_service_client()
            .rpc(
                "save_registration_profile",
                {
                    "p_user_id": user_id,
                    "p_mode": mode,
                    "p_payload": cleaned,
                },
            )
            .execute()
        )
    except RuntimeError:
        raise
    except Exception as exc:  # noqa: BLE001
        _raise_from_database(exc)

    saved = result.data
    if not saved:
        current_app.logger.error(
            "Registration save returned an empty profile user_id=%s", user_id
        )
        raise RegistrationError("registration_unavailable", 503)
    return saved
