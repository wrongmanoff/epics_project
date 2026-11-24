"""Flask application factory for JanSahayak authentication API."""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from app.config import Config


limiter = Limiter(key_func=get_remote_address, default_limits=[])


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(
        app,
        origins=[app.config["FRONTEND_URL"]],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    limiter.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.registration import registration_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(registration_bp, url_prefix="/api/registration")

    @app.get("/api/health")
    def health():
        return jsonify({"success": True, "message": "ok"}), 200

    @app.errorhandler(429)
    def ratelimit_handler(error):
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Too many requests. Please wait a moment and try again.",
                }
            ),
            429,
        )

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"success": False, "error": "Not found."}), 404

    @app.errorhandler(500)
    def server_error(_error):
        return (
            jsonify(
                {
                    "success": False,
                    "error": "An unexpected server error occurred.",
                }
            ),
            500,
        )

    return app
