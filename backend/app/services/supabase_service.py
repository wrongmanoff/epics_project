"""Supabase Auth and profile operations."""

from __future__ import annotations

from typing import Any

from flask import current_app
from supabase import Client, create_client


_anon_client: Client | None = None
_service_client: Client | None = None


def _require_config() -> tuple[str, str, str]:
    url = current_app.config.get("SUPABASE_URL") or ""
    anon = current_app.config.get("SUPABASE_ANON_KEY") or ""
    service = current_app.config.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    if not url or not anon:
        raise RuntimeError("Supabase URL and anon key are not configured.")
    return url, anon, service


def get_anon_client() -> Client:
    global _anon_client
    if _anon_client is None:
        url, anon, _ = _require_config()
        if "YOUR_PROJECT" in url or anon.startswith("your-"):
            raise RuntimeError(
                "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env."
            )
        try:
            _anon_client = create_client(url, anon)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(
                "Unable to connect to Supabase. Check SUPABASE_URL and SUPABASE_ANON_KEY."
            ) from exc
    return _anon_client


def get_service_client() -> Client:
    global _service_client
    if _service_client is None:
        url, _, service = _require_config()
        if not service or service.startswith("your-"):
            raise RuntimeError("Supabase service role key is not configured.")
        try:
            _service_client = create_client(url, service)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(
                "Unable to connect to Supabase with the service role key."
            ) from exc
    return _service_client


def _user_to_dict(user: Any) -> dict:
    if user is None:
        return {}
    if isinstance(user, dict):
        return user
    metadata = getattr(user, "user_metadata", None) or {}
    return {
        "id": getattr(user, "id", None),
        "email": getattr(user, "email", None),
        "email_confirmed_at": getattr(user, "email_confirmed_at", None),
        "created_at": getattr(user, "created_at", None),
        "user_metadata": metadata if isinstance(metadata, dict) else {},
    }


def _session_tokens(session: Any) -> tuple[str | None, str | None]:
    if session is None:
        return None, None
    if isinstance(session, dict):
        return session.get("access_token"), session.get("refresh_token")
    return getattr(session, "access_token", None), getattr(session, "refresh_token", None)


def signup_user(
    email: str,
    password: str,
    full_name: str,
    mobile_number: str | None,
) -> dict:
    """Create Auth user and profile. Returns structured result."""
    client = get_anon_client()
    service = get_service_client()

    try:
        auth_response = client.auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "full_name": full_name,
                    }
                },
            }
        )
    except Exception as exc:
        current_app.logger.exception("SUPABASE AUTH SIGNUP ERROR")
    
        message = str(exc).lower()
    
        if "already" in message or "registered" in message or "exists" in message:
            return {
                "ok": False,
                "status": 409,
                "error": "An account with this email already exists."
            }
    
        return {
            "ok": False,
            "status": 400,
            "error": "Unable to create account. Please check your details and try again."
    }

    user = _user_to_dict(getattr(auth_response, "user", None))
    session = getattr(auth_response, "session", None)
    access_token, refresh_token = _session_tokens(session)

    if not user.get("id"):
        # Some Supabase configs return user identities empty when already registered.
        return {
            "ok": False,
            "status": 409,
            "error": "An account with this email already exists.",
        }

    user_id = user["id"]

    try:
        insert_payload = {
            "id": user_id,
            "full_name": full_name,
            "email": email,
            "mobile_number": mobile_number,
        }
        service.table("profiles").upsert(insert_payload).execute()
    except Exception:
        current_app.logger.exception(
            "PROFILE INSERT ERROR"
        )

        # Best-effort cleanup of orphan auth user
        try:
            service.auth.admin.delete_user(user_id)
        except Exception:
            current_app.logger.exception(
                "AUTH USER CLEANUP ERROR"
            )

        return {
            "ok": False,
            "status": 500,
            "error": "Account could not be completed. Please try again later.",
    }

    email_confirmation_required = access_token is None

    return {
        "ok": True,
        "status": 201,
        "user": {
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "mobile_number": mobile_number,
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "email_confirmation_required": email_confirmation_required,
    }


def login_user(email: str, password: str) -> dict:
    client = get_anon_client()
    try:
        response = client.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except Exception as exc:  # noqa: BLE001
        message = str(exc).lower()
        if "confirm" in message or "not confirmed" in message:
            return {
                "ok": False,
                "status": 403,
                "error": "Please verify your email before logging in.",
            }
        return {
            "ok": False,
            "status": 401,
            "error": "Invalid email or password.",
        }

    user = _user_to_dict(getattr(response, "user", None))
    access_token, refresh_token = _session_tokens(getattr(response, "session", None))

    if not user.get("id") or not access_token:
        return {
            "ok": False,
            "status": 401,
            "error": "Invalid email or password.",
        }

    profile = get_profile(user["id"])
    if profile is None:
        metadata = user.get("user_metadata") if isinstance(user.get("user_metadata"), dict) else {}
        profile = ensure_profile(
            user_id=user["id"],
            email=user.get("email") or email,
            full_name=metadata.get("full_name") or (user.get("email") or email).split("@")[0],
            mobile_number=None,
        )

    return {
        "ok": True,
        "status": 200,
        "user": profile,
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


def get_profile(user_id: str) -> dict | None:
    try:
        service = get_service_client()
        result = (
            service.table("profiles")
            .select("id, full_name, email, mobile_number, created_at, updated_at")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )
        rows = result.data or []
        return rows[0] if rows else None
    except Exception:  # noqa: BLE001
        return None


def ensure_profile(
    user_id: str,
    email: str,
    full_name: str,
    mobile_number: str | None,
) -> dict:
    service = get_service_client()
    payload = {
        "id": user_id,
        "email": email,
        "full_name": full_name or email.split("@")[0],
        "mobile_number": mobile_number,
    }
    service.table("profiles").upsert(payload).execute()
    profile = get_profile(user_id)
    return profile or payload


def get_user_from_access_token(access_token: str) -> dict | None:
    if not access_token:
        return None
    client = get_anon_client()
    try:
        response = client.auth.get_user(access_token)
        user = _user_to_dict(getattr(response, "user", None))
        if not user.get("id"):
            return None
        return user
    except Exception:  # noqa: BLE001
        return None


def refresh_session(refresh_token: str) -> dict:
    if not refresh_token:
        return {
            "ok": False,
            "status": 401,
            "error": "Session expired. Please log in again.",
        }
    client = get_anon_client()
    try:
        response = client.auth.refresh_session(refresh_token)
    except Exception:  # noqa: BLE001
        return {
            "ok": False,
            "status": 401,
            "error": "Session expired. Please log in again.",
        }

    access_token, new_refresh = _session_tokens(getattr(response, "session", None))
    user = _user_to_dict(getattr(response, "user", None))
    if not access_token or not user.get("id"):
        # Some client versions put user on session
        session = getattr(response, "session", None)
        if session is not None:
            user = _user_to_dict(getattr(session, "user", None))
        if not access_token or not user.get("id"):
            return {
                "ok": False,
                "status": 401,
                "error": "Session expired. Please log in again.",
            }

    profile = get_profile(user["id"])
    return {
        "ok": True,
        "status": 200,
        "user": profile,
        "access_token": access_token,
        "refresh_token": new_refresh or refresh_token,
    }


def logout_user(access_token: str | None, refresh_token: str | None = None) -> None:
    """Best-effort server-side sign-out. Cookies are always cleared by the route."""
    if not access_token:
        return
    client = get_anon_client()
    try:
        if refresh_token:
            client.auth.set_session(access_token, refresh_token)
        client.auth.sign_out()
    except Exception:  # noqa: BLE001
        pass


def send_password_reset(email: str) -> dict:
    client = get_anon_client()
    redirect_to = current_app.config.get("PASSWORD_RESET_REDIRECT_URL")
    try:
        client.auth.reset_password_email(email, {"redirect_to": redirect_to})
    except Exception:  # noqa: BLE001
        # Do not reveal whether the email exists
        pass
    return {
        "ok": True,
        "status": 200,
        "message": "If an account exists for that email, a reset link has been sent.",
    }
