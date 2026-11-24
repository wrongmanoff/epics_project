"""Integration tests for registration API routes."""

import unittest
from unittest.mock import patch

from app import create_app


class RegistrationRouteTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_unauthenticated_requests_rejected(self):
        for method in ("get", "post", "put"):
            resp = getattr(self.client, method)("/api/registration/profile")
            self.assertEqual(resp.status_code, 401)
            data = resp.get_json()
            self.assertFalse(data["success"])

    @patch("app.routes.registration.get_profile", return_value=None)
    @patch(
        "app.routes.registration.supabase_service.get_user_from_access_token",
        return_value={"id": "user-123"},
    )
    def test_get_profile_uses_session_user_id(self, mock_auth, mock_get_profile):
        self.client.set_cookie("access_token", "valid-token")
        resp = self.client.get("/api/registration/profile")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json(), {"success": True, "profile": None})
        mock_auth.assert_called_once_with("valid-token")
        mock_get_profile.assert_called_once_with("user-123")

    @patch("app.routes.registration.save_profile")
    @patch(
        "app.routes.registration.supabase_service.get_user_from_access_token",
        return_value={"id": "user-123"},
    )
    def test_post_profile_ignores_body_user_id(self, _mock_auth, mock_save):
        mock_save.return_value = {"status": "draft", "current_step": 1}
        self.client.set_cookie("access_token", "valid-token")
        resp = self.client.post(
            "/api/registration/profile",
            json={"status": "draft", "current_step": 1, "user_id": "attacker-id"},
        )
        self.assertEqual(resp.status_code, 201)
        mock_save.assert_called_once()
        self.assertEqual(mock_save.call_args.args[0], "user-123")


if __name__ == "__main__":
    unittest.main()
