"""Application configuration loaded from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-only-change-me")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    PASSWORD_RESET_REDIRECT_URL = os.getenv(
        "PASSWORD_RESET_REDIRECT_URL",
        "http://localhost:5173/login",
    )

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = FLASK_ENV == "production"

    ACCESS_COOKIE_NAME = "access_token"
    REFRESH_COOKIE_NAME = "refresh_token"
    # Access tokens are typically short-lived; refresh lasts longer.
    ACCESS_COOKIE_MAX_AGE = 60 * 60  # 1 hour
    REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days
    REFRESH_COOKIE_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30  # 30 days
