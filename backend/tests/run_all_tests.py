import sys
import uuid
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))

from fastapi.testclient import TestClient
from server import app, seed_admin
from services.auth_service import hash_password
from repositories.user_repository import UserRepository
import asyncio

client = TestClient(app)

ADMIN_EMAIL = "admin@voktaa.com"
ADMIN_PASSWORD = "admin123"


def test_api_suite():
    print("[TEST] STARTING FULL BACKEND API REGRESSION TEST SUITE...")
    asyncio.run(seed_admin())

    # 1. Health check
    r = client.get("/api/health")
    assert r.status_code == 200
    res_data = r.json()
    assert res_data["status"] == "healthy"
    assert res_data.get("provider") == "appwrite"
    print("   [OK] GET /api/health passed")

    # 2. Tracking
    r = client.post("/api/track", json={"type": "visit", "page": "/", "session_id": f"TEST_{uuid.uuid4()}"})
    assert r.status_code == 200
    assert r.json().get("ok") is True
    print("   [OK] POST /api/track passed")

    # 3. Create Enquiry
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": "testuser@example.com",
        "phone": "9999999999",
        "program": "CRT",
        "city": "Guntur",
        "message": "Automated regression test enquiry",
    }
    r = client.post("/api/enquiries", json=payload)
    assert r.status_code == 200
    assert r.json().get("ok") is True
    assert "id" in r.json()
    print("   [OK] POST /api/enquiries passed")

    # 4. Auth Login
    r = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    login_data = r.json()
    assert "token" in login_data
    token = login_data["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   [OK] POST /api/auth/login passed")

    # 5. Auth /me
    r = client.get("/api/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL
    print("   [OK] GET /api/auth/me passed")

    # 6. Public Reviews & Submit Review
    rev_payload = {
        "name": "Regression Tester",
        "email": "tester@example.com",
        "role": "Educator",
        "organisation": "VOKTAA College",
        "program": "Soft Skills Development",
        "rating": 5,
        "review": "Comprehensive and well-structured curriculum!",
    }
    r = client.post("/api/reviews", json=rev_payload)
    assert r.status_code == 200
    assert r.json().get("ok") is True
    print("   [OK] POST /api/reviews passed")

    r = client.get("/api/reviews")
    assert r.status_code == 200
    reviews = r.json()
    assert isinstance(reviews, list)
    print("   [OK] GET /api/reviews passed")

    # 7. Admin Enquiries
    r = client.get("/api/admin/enquiries", headers=headers)
    assert r.status_code == 200
    enquiries = r.json()
    assert isinstance(enquiries, list)
    print("   [OK] GET /api/admin/enquiries passed")

    # 8. Admin Reviews & Status Update / Delete
    r = client.get("/api/admin/reviews", headers=headers)
    assert r.status_code == 200
    admin_revs = r.json()
    assert isinstance(admin_revs, list)
    if admin_revs:
        target_id = admin_revs[0]["id"]
        # Update status
        r_patch = client.patch(f"/api/admin/reviews/{target_id}", json={"status": "approved"}, headers=headers)
        assert r_patch.status_code == 200
        # Delete
        r_del = client.delete(f"/api/admin/reviews/{target_id}", headers=headers)
        assert r_del.status_code == 200
    print("   [OK] Admin reviews moderation passed")

    # 9. Admin Analytics
    r = client.get("/api/admin/analytics", headers=headers)
    assert r.status_code == 200
    analytics = r.json()
    assert "totals" in analytics
    assert "visits_over_time" in analytics
    assert len(analytics["visits_over_time"]) == 14
    print("   [OK] GET /api/admin/analytics passed")

    # 10. Settings API
    r = client.get("/api/settings")
    assert r.status_code == 200
    print("   [OK] GET /api/settings passed")

    print("\n[SUCCESS] ALL BACKEND REGRESSION TESTS COMPLETED SUCCESSFULLY WITH ZERO ERRORS!")


if __name__ == "__main__":
    test_api_suite()
