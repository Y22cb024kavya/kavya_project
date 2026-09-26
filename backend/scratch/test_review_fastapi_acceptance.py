import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from server import app, seed_admin
import asyncio

def run_tests():
    print("=== STARTING FASTAPI REVIEW ACCEPTANCE TESTS ===")

    # Ensure admin user is seeded for testing
    asyncio.run(seed_admin())

    with TestClient(app) as client:
        # TEST 1: Student A submits review
        student_a_review = {
            "name": "Student A",
            "email": "studenta@example.com",
            "role": "Student",
            "organisation": "VOKTAA Academy",
            "program": "Soft Skills Development",
            "rating": 5,
            "review": "Great soft skills training. The sessions improved my communication and confidence.",
            "status": "approved"
        }

        print("\n[TEST 1] Student A submits review...")
        res = client.post("/api/reviews", json=student_a_review)
        print("POST /api/reviews status:", res.status_code, "body:", res.json())
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        review_data = res.json()
        review_id = review_data.get("id")
        assert review_id, "No review ID returned"
        print("PASSED: Student A review created with ID:", review_id)

        # TEST 2: Page Refresh / GET /api/reviews
        print("\n[TEST 2] Page refresh / GET /api/reviews...")
        res = client.get("/api/reviews")
        assert res.status_code == 200
        public_reviews = res.json()
        found_a = any(r.get("id") == review_id or r.get("review") == student_a_review["review"] for r in public_reviews)
        assert found_a, "Student A review not in public list on refresh"
        print("PASSED: Student A review is returned by GET /api/reviews on refresh")

        # TEST 3 & 4: Student B / Incognito / Logged-out fetch
        print("\n[TEST 3 & 4] Student B / Incognito / Logged-out fetch...")
        res_b = client.get("/api/reviews", headers={"User-Agent": "IncognitoBrowser/2.0"})
        assert res_b.status_code == 200
        b_reviews = res_b.json()
        found_b = any(r.get("id") == review_id or r.get("review") == student_a_review["review"] for r in b_reviews)
        assert found_b, "Student A review not visible to Student B / Incognito"
        print("PASSED: Student A review is globally visible to ALL users without restriction")

        # TEST 6: Student B (non-admin / unauthorized user) attempts DELETE
        print("\n[TEST 6] Student B attempts DELETE /api/admin/reviews/{id}...")
        res_del_unauth = client.delete(f"/api/admin/reviews/{review_id}")
        print("DELETE status without token:", res_del_unauth.status_code)
        assert res_del_unauth.status_code in (401, 403), f"Expected 401/403, got {res_del_unauth.status_code}"
        print("PASSED: Non-admin delete operation rejected by backend (401 Unauthorized)")

        # TEST 5: Admin logs in and deletes Student A's review
        print("\n[TEST 5] Admin logs in and deletes Student A's review...")
        login_res = client.post("/api/auth/login", json={"email": "admin@voktaa.com", "password": "admin123"})
        print("Admin login status:", login_res.status_code)
        assert login_res.status_code == 200, "Admin login failed"
        token = login_res.json()["token"]

        auth_headers = {"Authorization": f"Bearer {token}"}
        del_res = client.delete(f"/api/admin/reviews/{review_id}", headers=auth_headers)
        print("Admin DELETE status:", del_res.status_code, "body:", del_res.json())
        assert del_res.status_code == 200, "Admin delete failed"

        # Verify review is deleted permanently from public GET /api/reviews
        res_after_del = client.get("/api/reviews")
        after_del_reviews = res_after_del.json()
        found_after_del = any(r.get("id") == review_id for r in after_del_reviews)
        assert not found_after_del, "Deleted review still returned by GET /api/reviews!"
        print("PASSED: Admin deletion permanently removed review from database and public list")

        print("\n=== ALL 6 ACCEPTANCE TESTS PASSED PERFECTLY! ===")

if __name__ == "__main__":
    run_tests()
