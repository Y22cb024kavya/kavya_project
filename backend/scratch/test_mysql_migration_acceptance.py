import sys
import os
import unittest
import asyncio

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi.testclient import TestClient
from server import app, seed_admin
from database.connection import init_db

client = TestClient(app)


class TestMySQLMigrationAcceptance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        asyncio.run(init_db())
        asyncio.run(seed_admin())

    def test_01_health_check_endpoint(self):
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("database"), "connected")
        self.assertIn(data.get("provider"), ["mysql", "sqlite"])
        print("\n[TEST 1] /api/health returned healthy database status:", data)

    def test_02_admin_auth_flow(self):
        login_res = client.post("/api/auth/login", json={"email": "admin@voktaa.com", "password": "admin123"})
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json().get("access_token")
        self.assertTrue(token)
        print("[TEST 2] Admin login succeeded against database users table")

        me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.json()
        self.assertEqual(me_data.get("email"), "admin@voktaa.com")
        self.assertNotIn("password_hash", me_data)
        print("[TEST 2] GET /api/auth/me retrieved user without exposing password_hash:", me_data)

    def test_03_enquiry_creation_and_admin_read(self):
        payload = {
            "first_name": "Acceptance",
            "last_name": "Tester",
            "email": "enquiry@example.com",
            "phone": "+91 99999 88888",
            "program": "Campus Recruitment Training",
            "city": "Hyderabad",
            "message": "Interested in corporate training session",
            "timestamp": "2026-09-27T12:00:00Z"
        }
        res = client.post("/api/enquiries", json=payload)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json().get("ok"))
        print("[TEST 3] POST /api/enquiries created enquiry row in database")

        login_res = client.post("/api/auth/login", json={"email": "admin@voktaa.com", "password": "admin123"})
        token = login_res.json().get("access_token")

        admin_res = client.get("/api/admin/enquiries", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(admin_res.status_code, 200)
        items = admin_res.json()
        self.assertTrue(any(e.get("email") == "enquiry@example.com" for e in items))
        print("[TEST 3] GET /api/admin/enquiries retrieved created enquiry")

    def test_04_review_full_lifecycle(self):
        review_payload = {
            "name": "Ananya Sharma",
            "email": "ananya@example.com",
            "role": "Student",
            "organisation": "JNTU Hyderabad",
            "program": "Soft Skills Development",
            "rating": 5,
            "review": "The VOKTAA soft skills sessions helped me crack my placement interview with confidence!",
            "status": "approved"
        }
        create_res = client.post("/api/reviews", json=review_payload)
        self.assertEqual(create_res.status_code, 200)
        review_id = create_res.json().get("id")
        self.assertTrue(review_id)
        print(f"[TEST 4] Student review submitted and created with ID: {review_id}")

        pub_res = client.get("/api/reviews")
        self.assertEqual(pub_res.status_code, 200)
        pub_reviews = pub_res.json()
        self.assertTrue(any(r.get("id") == review_id for r in pub_reviews))
        print("[TEST 4] GET /api/reviews returned approved review globally")

        login_res = client.post("/api/auth/login", json={"email": "admin@voktaa.com", "password": "admin123"})
        token = login_res.json().get("access_token")

        del_unauth = client.delete(f"/api/admin/reviews/{review_id}")
        self.assertEqual(del_unauth.status_code, 401)
        print("[TEST 4] Unauthorized delete attempt rejected with 401 Unauthorized")

        del_res = client.delete(f"/api/admin/reviews/{review_id}", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(del_res.status_code, 200)

        pub_res_after = client.get("/api/reviews")
        self.assertFalse(any(r.get("id") == review_id for r in pub_res_after.json()))
        print("[TEST 4] Admin deletion removed review from database and public website")

    def test_05_analytics_tracking(self):
        track_payload = {
            "type": "visit",
            "category": "page_view",
            "label": "HomePage",
            "page": "/",
            "session_id": "sess_test_123"
        }
        res = client.post("/api/track", json=track_payload)
        self.assertEqual(res.status_code, 200)
        print("[TEST 5] POST /api/track successfully stored event in database")

    def test_06_settings_read_update(self):
        get_res = client.get("/api/settings")
        self.assertEqual(get_res.status_code, 200)

        login_res = client.post("/api/auth/login", json={"email": "admin@voktaa.com", "password": "admin123"})
        token = login_res.json().get("access_token")

        patch_res = client.patch("/api/admin/settings", json={"reviews_visible": True}, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(patch_res.status_code, 200)
        print("[TEST 6] Settings read and update succeeded against database")


if __name__ == "__main__":
    unittest.main()
