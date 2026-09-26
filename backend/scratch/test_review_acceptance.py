import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def make_request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, method=method, headers=headers)
    if data:
        req.add_header("Content-Type", "application/json")
        encoded_data = json.dumps(data).encode("utf-8")
    else:
        encoded_data = None
    
    try:
        with urllib.request.urlopen(req, data=encoded_data) as response:
            body = response.read().decode("utf-8")
            return response.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body) if body else {}
    except Exception as e:
        print(f"Error making request to {url}: {e}")
        return 500, {}

def run_tests():
    print("--- STARTING ACCEPTANCE TESTS FOR REVIEWS ---")

    # TEST 1: Student A submits a review
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
    status, res = make_request(f"{BASE_URL}/api/reviews", method="POST", data=student_a_review)
    print(f"POST /api/reviews status: {status}, response: {res}")
    assert status == 200, "Failed to submit review"
    review_id = res.get("id")
    assert review_id, "Review ID was not returned"
    print("SUCCESS: Student A review saved with ID:", review_id)

    # TEST 2: Refresh / Fetch public reviews
    print("\n[TEST 2] Page refresh / Public fetch...")
    status, public_reviews = make_request(f"{BASE_URL}/api/reviews")
    print(f"GET /api/reviews status: {status}, count: {len(public_reviews)}")
    found_a = any(r.get("id") == review_id or r.get("review") == student_a_review["review"] for r in public_reviews)
    assert found_a, "Student A review not found in public list"
    print("SUCCESS: Student A review found in public list after refresh")

    # TEST 3 & 4: Student B / Incognito (Unauthenticated) fetch
    print("\n[TEST 3 & 4] Student B / Incognito mode fetch...")
    status, incognito_reviews = make_request(f"{BASE_URL}/api/reviews", headers={"User-Agent": "IncognitoBrowser/1.0"})
    found_incognito = any(r.get("id") == review_id or r.get("review") == student_a_review["review"] for r in incognito_reviews)
    assert found_incognito, "Student A review not visible in incognito mode"
    print("SUCCESS: Student A review is globally visible to all visitors/incognito mode")

    # TEST 6: Student B (unauthenticated / non-admin) tries to delete Student A's review
    print("\n[TEST 6] Student B (unauthenticated) attempts DELETE /api/admin/reviews/{id}...")
    status, del_res = make_request(f"{BASE_URL}/api/admin/reviews/{review_id}", method="DELETE")
    print(f"DELETE status (unauthenticated): {status}, response: {del_res}")
    assert status in (401, 403), f"Expected 401/403 for unauthorized delete, got {status}"
    print("SUCCESS: Non-admin delete operation rejected by backend authorization")

    # TEST 5: Admin logs in and deletes Student A's review
    print("\n[TEST 5] Admin logs in and deletes Student A's review...")
    # Admin login
    admin_creds = {"username": "admin@voktaa.com", "password": "AdminPassword123!"}
    status, login_res = make_request(f"{BASE_URL}/api/admin/login", method="POST", data=admin_creds)
    print(f"Admin login status: {status}")
    if status != 200:
        # Create admin user if first run
        status, _ = make_request(f"{BASE_URL}/api/admin/seed", method="POST")
        status, login_res = make_request(f"{BASE_URL}/api/admin/login", method="POST", data=admin_creds)
    
    token = login_res.get("token") or login_res.get("access_token")
    assert token, "Admin login failed to return token"

    auth_headers = {"Authorization": f"Bearer {token}"}
    status, del_admin_res = make_request(f"{BASE_URL}/api/admin/reviews/{review_id}", method="DELETE", headers=auth_headers)
    print(f"Admin DELETE status: {status}, response: {del_admin_res}")
    assert status == 200, "Admin delete failed"

    # Verify review is gone from public GET /api/reviews for ALL users
    status, after_del_reviews = make_request(f"{BASE_URL}/api/reviews")
    found_after_del = any(r.get("id") == review_id for r in after_del_reviews)
    assert not found_after_del, "Deleted review still present in public reviews!"
    print("SUCCESS: Admin deleted review permanently; no longer visible to any visitor")

    print("\n--- ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    run_tests()
