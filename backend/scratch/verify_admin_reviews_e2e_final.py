"""
Final Real End-to-End Verification Suite: Admin Panel + Reviews Workflow
"""
import sys
import os
import asyncio
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))

from dotenv import load_dotenv
load_dotenv(ROOT_DIR / ".env")

from fastapi.testclient import TestClient
from server import app, seed_admin
from database.connection import init_db, AsyncSessionLocal, DB_PROVIDER
from database.models import ReviewModel
from sqlalchemy import select

client = TestClient(app)

results = {}

async def run_final_admin_review_tests():
    print("==================================================")
    print("FINAL REAL END-TO-END VERIFICATION: ADMIN & REVIEWS")
    print("==================================================")

    await init_db()
    await seed_admin()

    # -------------------------------------------------- TEST 1: Admin Login & JWT
    print("\n--- TEST 1: ADMIN LOGIN & JWT ---")
    login_res = client.post("/api/auth/login", json={"email": "voktaasolutions@gmail.com", "password": "admin123"})
    login_status = login_res.status_code
    login_ct = login_res.headers.get("content-type", "")
    token = login_res.json().get("access_token")
    
    print(f"1. POST /api/auth/login -> Status: {login_status}, Content-Type: {login_ct}")
    print(f"2. JWT Received: {'YES' if token else 'NO'}")
    
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    me_status = me_res.status_code
    me_json = me_res.json()
    print(f"3. GET /api/auth/me -> Status: {me_status}, Email: {me_json.get('email')}")
    
    no_pw_leak = ("password_hash" not in me_json and "DB_PASSWORD" not in str(me_json))
    results["admin_login"] = login_status == 200 and "json" in login_ct
    results["jwt_auth"] = me_status == 200 and no_pw_leak

    # -------------------------------------------------- TEST 2: User Review Submission & MySQL Persistence
    print("\n--- TEST 2: USER REVIEW SUBMISSION & MYSQL PERSISTENCE ---")
    unique_text = "TEMPORARY PRODUCTION REVIEW TEST - DELETE AFTER VERIFICATION - 998877"
    review_payload = {
        "name": "Production Review Flow Test",
        "email": "production-review-test@example.com",
        "phone": "+91 98765 43210",
        "role": "Student",
        "organisation": "VOKTAA Test",
        "program": "Interview Skills",
        "rating": 5,
        "review": unique_text,
        "status": "approved",
    }
    
    post_rev_res = client.post("/api/reviews", json=review_payload)
    post_rev_status = post_rev_res.status_code
    post_rev_ct = post_rev_res.headers.get("content-type", "")
    rev_id = post_rev_res.json().get("id")
    
    print(f"1. POST /api/reviews -> Status: {post_rev_status}, Content-Type: {post_rev_ct}")
    print(f"2. Created Review ID: {rev_id}")
    
    # Query MySQL database directly
    db_row = None
    async with AsyncSessionLocal() as session:
        stmt = select(ReviewModel).where(ReviewModel.id == rev_id).limit(1)
        db_row = (await session.execute(stmt)).scalar_one_or_none()
        
    mysql_persisted = (db_row is not None and db_row.name == "Production Review Flow Test" and db_row.review == unique_text)
    print(f"3. Hostinger MySQL Record Found: {mysql_persisted}")
    if db_row:
        print(f"   Stored Name: {db_row.name} | Role: {db_row.role} | Status: {db_row.status}")
        
    results["user_review_submission"] = post_rev_status == 200 and rev_id is not None
    results["mysql_review_persistence"] = mysql_persisted

    # -------------------------------------------------- TEST 3: Public Website Display & Refresh Persistence
    print("\n--- TEST 3: PUBLIC WEBSITE DISPLAY & REFRESH PERSISTENCE ---")
    get_pub_1 = client.get("/api/reviews")
    get_pub_1_status = get_pub_1.status_code
    get_pub_1_ct = get_pub_1.headers.get("content-type", "")
    pub_list_1 = get_pub_1.json()
    in_pub_1 = any(r.get("id") == rev_id for r in pub_list_1)
    
    print(f"1. GET /api/reviews (Pass 1) -> Status: {get_pub_1_status}, Returned Review: {in_pub_1}")
    
    # Simulate page refresh
    get_pub_2 = client.get("/api/reviews")
    in_pub_2 = any(r.get("id") == rev_id for r in get_pub_2.json())
    print(f"2. GET /api/reviews (Pass 2 / Page Refresh) -> Returned Review: {in_pub_2}")

    results["public_review_display"] = get_pub_1_status == 200 and in_pub_1
    results["review_persistence_after_refresh"] = in_pub_2

    # -------------------------------------------------- TEST 4: Admin Review Listing & Moderation
    print("\n--- TEST 4: ADMIN REVIEW LISTING ---")
    admin_rev_res = client.get("/api/admin/reviews", headers=headers)
    admin_rev_status = admin_rev_res.status_code
    admin_rev_ct = admin_rev_res.headers.get("content-type", "")
    admin_list = admin_rev_res.json()
    in_admin_list = any(r.get("id") == rev_id for r in admin_list)
    
    print(f"1. GET /api/admin/reviews -> Status: {admin_rev_status}, Found Test Review: {in_admin_list}")
    
    results["admin_review_listing"] = admin_rev_status == 200 and in_admin_list

    # -------------------------------------------------- TEST 5: Admin Review Deletion & Verification
    print("\n--- TEST 5: ADMIN REVIEW DELETION ---")
    # Get pre-existing reviews count before deletion
    real_reviews_before = [r for r in pub_list_1 if r.get("id") != rev_id]
    
    del_res = client.delete(f"/api/admin/reviews/{rev_id}", headers=headers)
    del_status = del_res.status_code
    del_ct = del_res.headers.get("content-type", "")
    print(f"1. DELETE /api/admin/reviews/{rev_id} -> Status: {del_status}, Content-Type: {del_ct}")

    # MySQL verification
    async with AsyncSessionLocal() as session:
        stmt_del = select(ReviewModel).where(ReviewModel.id == rev_id).limit(1)
        deleted_row = (await session.execute(stmt_del)).scalar_one_or_none()
        
    mysql_deleted = (deleted_row is None)
    print(f"2. Hostinger MySQL Deletion Confirmed (Row Removed): {mysql_deleted}")

    # Public API verification
    get_pub_3 = client.get("/api/reviews")
    pub_list_3 = get_pub_3.json()
    in_pub_3 = any(r.get("id") == rev_id for r in pub_list_3)
    real_reviews_after = [r for r in pub_list_3 if r.get("id") != rev_id]
    
    print(f"3. GET /api/reviews after deletion -> Returned Review: {in_pub_3} (Expected: False)")
    
    real_preserved = (len(real_reviews_before) == len(real_reviews_after))
    print(f"4. Real baseline reviews preserved untouched: {real_preserved} ({len(real_reviews_after)} real reviews)")

    results["admin_review_deletion"] = del_status == 200
    results["mysql_deletion_verification"] = mysql_deleted
    results["public_review_disappearance"] = (not in_pub_3)
    results["existing_real_reviews_preserved"] = real_preserved

    # -------------------------------------------------- TEST 7: API Routing & Content-Types
    print("\n--- TEST 7: API ROUTING & CONTENT-TYPE AUDIT ---")
    endpoints = [
        ("POST", "/api/auth/login", login_ct),
        ("GET", "/api/auth/me", me_res.headers.get("content-type", "")),
        ("POST", "/api/reviews", post_rev_ct),
        ("GET", "/api/reviews", get_pub_1_ct),
        ("GET", "/api/admin/reviews", admin_rev_ct),
        ("DELETE", f"/api/admin/reviews/{rev_id}", del_ct),
    ]
    
    routing_ok = True
    for method, path, ct in endpoints:
        is_json = "json" in ct.lower()
        if not is_json:
            routing_ok = False
        print(f"  {method} {path} -> Content-Type: {ct} [{'OK' if is_json else 'FAIL'}]")

    results["api_routing"] = routing_ok

    # -------------------------------------------------- Summary Table Output
    print("\n==================================================")
    print("FINAL EVALUATION TABLE")
    print("==================================================")
    
    table_items = [
        ("1. Admin login", results["admin_login"]),
        ("2. JWT authentication", results["jwt_auth"]),
        ("3. User review submission", results["user_review_submission"]),
        ("4. MySQL review persistence", results["mysql_review_persistence"]),
        ("5. Public review display", results["public_review_display"]),
        ("6. Review persistence after refresh", results["review_persistence_after_refresh"]),
        ("7. Admin review listing", results["admin_review_listing"]),
        ("8. Admin review deletion", results["admin_review_deletion"]),
        ("9. MySQL deletion verification", results["mysql_deletion_verification"]),
        ("10. Public review disappearance after deletion", results["public_review_disappearance"]),
        ("11. Existing real reviews preserved", results["existing_real_reviews_preserved"]),
        ("12. API routing", results["api_routing"]),
    ]
    
    all_passed = True
    for label, ok in table_items:
        if not ok:
            all_passed = False
        print(f"  {label:<45} | {'PASS' if ok else 'FAIL'}")

    print("\nFINAL VERDICT:")
    print("SAFE TO DEPLOY" if all_passed else "NOT SAFE TO DEPLOY")

if __name__ == "__main__":
    asyncio.run(run_final_admin_review_tests())
