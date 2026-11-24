"""Registration profile API. Authentication cookies are read, never redefined."""

from flask import Blueprint, current_app, jsonify, request

from app import limiter
from app.registration.service import RegistrationError, get_profile, save_profile
from app.services import supabase_service

registration_bp = Blueprint("registration", __name__)


def _authenticated_user_id() -> str | None:
    access = request.cookies.get(current_app.config["ACCESS_COOKIE_NAME"])
    if not access:
        return None
    user = supabase_service.get_user_from_access_token(access)
    if not user or not user.get("id"):
        return None
    return user["id"]


def _error_response(error: RegistrationError):
    body = {"success": False, "error": error.error}
    if error.details:
        body["details"] = error.details
    return jsonify(body), error.status


@registration_bp.get("/profile")
@limiter.limit("60 per minute")
def read_profile():
    user_id = _authenticated_user_id()
    if not user_id:
        return jsonify({"success": False, "error": "Not authenticated."}), 401
    try:
        profile = get_profile(user_id)
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except RegistrationError as exc:
        return _error_response(exc)
    return jsonify({"success": True, "profile": profile}), 200


@registration_bp.post("/profile")
@limiter.limit("20 per minute")
def create_profile():
    user_id = _authenticated_user_id()
    if not user_id:
        return jsonify({"success": False, "error": "Not authenticated."}), 401
    payload = request.get_json(silent=True) or {}
    for_submit = payload.get("status") == "submitted"
    try:
        profile = save_profile(user_id, payload, mode="create", for_submit=for_submit)
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except RegistrationError as exc:
        return _error_response(exc)
    return jsonify({"success": True, "profile": profile}), 201


@registration_bp.put("/profile")
@limiter.limit("30 per minute")
def update_profile():
    user_id = _authenticated_user_id()
    if not user_id:
        return jsonify({"success": False, "error": "Not authenticated."}), 401
    payload = request.get_json(silent=True) or {}
    for_submit = payload.get("status") == "submitted"
    try:
        profile = save_profile(user_id, payload, mode="update", for_submit=for_submit)
    except RuntimeError as exc:
        return jsonify({"success": False, "error": str(exc)}), 503
    except RegistrationError as exc:
        return _error_response(exc)
    return jsonify({"success": True, "profile": profile}), 200
