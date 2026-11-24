"""Authentication API routes."""

from flask import Blueprint, current_app, jsonify, make_response, request

from app import limiter
from app.services import supabase_service
from app.utils.validators import (
    validate_email,
    validate_login_payload,
    validate_signup_payload,
)

auth_bp = Blueprint("auth", __name__)


def _cookie_kwargs(max_age: int) -> dict:
    return {
        "httponly": True,
        "secure": current_app.config["SESSION_COOKIE_SECURE"],
        "samesite": current_app.config["SESSION_COOKIE_SAMESITE"],
        "max_age": max_age,
        "path": "/",
    }


def _set_auth_cookies(
    response,
    access_token: str | None,
    refresh_token: str | None,
    *,
    remember_me: bool = False,
):
    refresh_max_age = (
        current_app.config["REFRESH_COOKIE_MAX_AGE_REMEMBER"]
        if remember_me
        else current_app.config["REFRESH_COOKIE_MAX_AGE"]
    )
    if access_token:
        response.set_cookie(
            current_app.config["ACCESS_COOKIE_NAME"],
            access_token,
            **_cookie_kwargs(current_app.config["ACCESS_COOKIE_MAX_AGE"]),
        )
    if refresh_token:
        response.set_cookie(
            current_app.config["REFRESH_COOKIE_NAME"],
            refresh_token,
            **_cookie_kwargs(refresh_max_age),
        )
    return response


def _clear_auth_cookies(response):
    for name in (
        current_app.config["ACCESS_COOKIE_NAME"],
        current_app.config["REFRESH_COOKIE_NAME"],
    ):
        response.set_cookie(
            name,
            "",
            expires=0,
            max_age=0,
            httponly=True,
            secure=current_app.config["SESSION_COOKIE_SECURE"],
            samesite=current_app.config["SESSION_COOKIE_SAMESITE"],
            path="/",
        )
    return response


def _tokens_from_request() -> tuple[str | None, str | None]:
    access = request.cookies.get(current_app.config["ACCESS_COOKIE_NAME"])
    refresh = request.cookies.get(current_app.config["REFRESH_COOKIE_NAME"])
    return access, refresh


@auth_bp.post("/signup")
@limiter.limit("5 per minute")
def signup():
    data = request.get_json(silent=True) or {}
    payload, error = validate_signup_payload(data)
    if error:
        return jsonify({"success": False, "error": error}), 400

    try:
        result = supabase_service.signup_user(
            email=payload["email"],
            password=payload["password"],
            full_name=payload["full_name"],
            mobile_number=payload["mobile_number"],
        )
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except Exception:  # noqa: BLE001
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Unable to create account. Please try again later.",
                }
            ),
            500,
        )

    if not result.get("ok"):
        return (
            jsonify({"success": False, "error": result.get("error")}),
            result.get("status", 400),
        )

    body = {
        "success": True,
        "message": (
            "Account created. Please check your email to verify your account."
            if result.get("email_confirmation_required")
            else "Account created successfully."
        ),
        "user": result.get("user"),
        "email_confirmation_required": result.get("email_confirmation_required", False),
    }
    response = make_response(jsonify(body), result.get("status", 201))
    if result.get("access_token"):
        _set_auth_cookies(
            response,
            result.get("access_token"),
            result.get("refresh_token"),
        )
    return response


@auth_bp.post("/login")
@limiter.limit("10 per minute")
def login():
    data = request.get_json(silent=True) or {}
    payload, error = validate_login_payload(data)
    if error:
        return jsonify({"success": False, "error": error}), 400

    try:
        result = supabase_service.login_user(payload["email"], payload["password"])
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except Exception:  # noqa: BLE001
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Unable to log in. Please try again later.",
                }
            ),
            500,
        )

    if not result.get("ok"):
        return (
            jsonify({"success": False, "error": result.get("error")}),
            result.get("status", 401),
        )

    remember_me = bool(data.get("remember_me"))

    body = {
        "success": True,
        "message": "Logged in successfully.",
        "user": result.get("user"),
    }
    response = make_response(jsonify(body), 200)
    _set_auth_cookies(
        response,
        result.get("access_token"),
        result.get("refresh_token"),
        remember_me=remember_me,
    )
    return response


@auth_bp.post("/logout")
@limiter.limit("30 per minute")
def logout():
    access, refresh = _tokens_from_request()
    try:
        supabase_service.logout_user(access, refresh)
    except Exception:  # noqa: BLE001
        pass
    response = make_response(
        jsonify({"success": True, "message": "Logged out successfully."}),
        200,
    )
    return _clear_auth_cookies(response)


@auth_bp.get("/me")
@limiter.limit("60 per minute")
def me():
    access, refresh = _tokens_from_request()

    user = supabase_service.get_user_from_access_token(access) if access else None

    if user is None and refresh:
        refreshed = supabase_service.refresh_session(refresh)
        if refreshed.get("ok"):
            profile = refreshed.get("user")
            if profile is None and refreshed.get("access_token"):
                user = supabase_service.get_user_from_access_token(
                    refreshed["access_token"]
                )
                if user:
                    profile = supabase_service.get_profile(user["id"])
            response = make_response(
                jsonify({"success": True, "user": profile}),
                200,
            )
            _set_auth_cookies(
                response,
                refreshed.get("access_token"),
                refreshed.get("refresh_token"),
            )
            return response

    if user is None:
        return (
            jsonify({"success": False, "error": "Not authenticated."}),
            401,
        )

    profile = supabase_service.get_profile(user["id"])
    if profile is None:
        profile = {
            "id": user["id"],
            "email": user.get("email"),
            "full_name": user.get("email", "").split("@")[0],
            "mobile_number": None,
        }

    return jsonify({"success": True, "user": profile}), 200


@auth_bp.post("/refresh")
@limiter.limit("30 per minute")
def refresh():
    _access, refresh_token = _tokens_from_request()
    result = supabase_service.refresh_session(refresh_token or "")
    if not result.get("ok"):
        response = make_response(
            jsonify({"success": False, "error": result.get("error")}),
            result.get("status", 401),
        )
        return _clear_auth_cookies(response)

    response = make_response(
        jsonify({"success": True, "user": result.get("user")}),
        200,
    )
    _set_auth_cookies(
        response,
        result.get("access_token"),
        result.get("refresh_token"),
    )
    return response


@auth_bp.post("/forgot-password")
@limiter.limit("5 per minute")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    error = validate_email(email)
    if error:
        return jsonify({"success": False, "error": error}), 400

    try:
        result = supabase_service.send_password_reset(email)
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except Exception:  # noqa: BLE001
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Unable to process request. Please try again later.",
                }
            ),
            500,
        )

    return (
        jsonify({"success": True, "message": result.get("message")}),
        result.get("status", 200),
    )
