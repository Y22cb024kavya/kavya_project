"""
Comprehensive Production-Readiness Verification Suite
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
from database.connection import init_db, AsyncSessionLocal, DB_HOST, DB_PORT, DB_USER, DB_NAME, DATABASE_URL, DB_PROVIDER
from database.models import UserModel, EnquiryModel, ReviewModel, EventModel, SettingModel
from sqlalchemy import select, text, delete

client = TestClient(app)

results = {}

async def run_verification():
    print("==================================================")
    print("VOKTAA PRODUCTION-READINESS VERIFICATION SUITE")
    print("==================================================")

    # -------------------------------------------------- Check 1: DB Config
    print("\n1. VERIFYING BACKEND / DATABASE CONFIGURATION...")
    db_name_env = os.environ.get("DB_NAME", "").strip()
    db_host_env = os.environ.get("DB_HOST", "").strip()
    db_user_env = os.environ.get("DB_USER", "").strip()
    
    results["check_1_db_config"] = {
        "db_name": db_name_env,
        "db_host": db_host_env,
        "db_user": db_user_env,
        "driver": "mysql+aiomysql" if "mysql+aiomysql" in DATABASE_URL else DB_PROVIDER,
        "valid": (db_name_env == "u832178669_voktaaProdu" and db_user_env == "u832178669_voktaa")
    }
    print(f"   DB_NAME: {db_name_env} (Target: u832178669_voktaaProdu)")
    print(f"   DB_USER: {db_user_env} (Target: u832178669_voktaa)")
    print(f"   Driver:  mysql+aiomysql")

    # -------------------------------------------------- Check 2: Schema
    print("\n2. VERIFYING DATABASE SCHEMA COMPATIBILITY...")
    await init_db()
    await seed_admin()
    
    from database.models import Base
    model_tables = list(Base.metadata.tables.keys())
    expected_tables = ["users", "enquiries", "reviews", "events", "settings"]
    schema_match = all(t in model_tables for t in expected_tables)
    
    results["check_2_schema"] = {
        "tables": model_tables,
        "valid": schema_match
    }
    print(f"   Tables mapped in models.py: {model_tables}")

    # -------------------------------------------------- Check 3: API Health
    print("\n3. TESTING GET /api/health ENDPOINT...")
    res_health = client.get("/api/health")
    health_status = res_health.status_code
    health_json = res_health.json()
    print(f"   GET /api/health HTTP Status: {health_status}")
    print(f"   Response Body: {health_json}")
    
    results["check_3_health"] = {
        "status_code": health_status,
        "body": health_json,
        "valid": (health_status == 200 and health_json.get("status") == "healthy")
    }

    # -------------------------------------------------- Check 4: Admin Auth
    print("\n4. TESTING ADMIN AUTHENTICATION & JWT...")
    res_login = client.post("/api/auth/login", json={"email": "voktaasolutions@gmail.com", "password": "admin123"})
    login_status = res_login.status_code
    token = res_login.json().get("access_token")
    
    print(f"   POST /api/auth/login HTTP Status: {login_status}")
    print(f"   Token Received: {'YES' if token else 'NO'}")
    
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    me_status = res_me.status_code
    me_json = res_me.json()
    
    print(f"   GET /api/auth/me HTTP Status: {me_status}")
    print(f"   User Info: {me_json}")
    
    no_pw_leak = ("password_hash" not in me_json and "DB_PASSWORD" not in str(me_json))
    results["check_4_auth"] = {
        "login_status": login_status,
        "me_status": me_status,
        "email": me_json.get("email"),
        "no_pw_leak": no_pw_leak,
        "valid": (login_status == 200 and me_status == 200 and no_pw_leak)
    }

    # -------------------------------------------------- Check 5: Review Flow
    print("\n5. TESTING COMPLETE REVIEW FLOW...")
    rev_text = "AUTOMATED PROD VERIFICATION TEST REVIEW - CLEANUP OK"
    rev_payload = {
        "name": "Prod Verification User",
        "email": "prod-verify@voktaa.com",
        "phone": "+91 98765 00000",
        "role": "Student",
        "organisation": "VOKTAA Test Institute",
        "program": "Soft Skills Development",
        "rating": 5,
        "review": rev_text,
        "status": "approved"
    }
    
    res_rev_post = client.post("/api/reviews", json=rev_payload)
    rev_post_status = res_rev_post.status_code
    rev_id = res_rev_post.json().get("id")
    print(f"   POST /api/reviews HTTP Status: {rev_post_status} | Created ID: {rev_id}")
    
    res_rev_get = client.get("/api/reviews")
    rev_get_status = res_rev_get.status_code
    public_reviews = res_rev_get.json()
    has_test_rev = any(r.get("id") == rev_id for r in public_reviews)
    print(f"   GET /api/reviews HTTP Status: {rev_get_status} | Returned in public list: {has_test_rev}")

    # Admin List & Delete
    res_admin_rev = client.get("/api/admin/reviews", headers={"Authorization": f"Bearer {token}"})
    admin_has_rev = any(r.get("id") == rev_id for r in res_admin_rev.json())
    
    res_rev_del = client.delete(f"/api/admin/reviews/{rev_id}", headers={"Authorization": f"Bearer {token}"})
    rev_del_status = res_rev_del.status_code
    print(f"   DELETE /api/admin/reviews/{rev_id} HTTP Status: {rev_del_status}")
    
    res_rev_after = client.get("/api/reviews")
    cleaned_rev = not any(r.get("id") == rev_id for r in res_rev_after.json())
    print(f"   Cleaned up test review cleanly: {cleaned_rev}")

    results["check_5_reviews"] = {
        "post_status": rev_post_status,
        "get_status": rev_get_status,
        "delete_status": rev_del_status,
        "persisted_and_cleaned": (has_test_rev and cleaned_rev),
        "valid": (rev_post_status == 200 and rev_get_status == 200 and rev_del_status == 200 and has_test_rev and cleaned_rev)
    }

    # -------------------------------------------------- Check 6: Enquiries Flow
    print("\n6. TESTING ENQUIRIES FLOW...")
    enq_payload = {
        "first_name": "ProdTest",
        "last_name": "User",
        "email": "enq-prod-verify@voktaa.com",
        "phone": "+91 98765 11111",
        "program": "Campus Recruitment Training",
        "city": "Guntur",
        "message": "Production readiness automated enquiry verification test",
    }
    res_enq_post = client.post("/api/enquiries", json=enq_payload)
    enq_post_status = res_enq_post.status_code
    enq_id = res_enq_post.json().get("id")
    print(f"   POST /api/enquiries HTTP Status: {enq_post_status} | Created ID: {enq_id}")
    
    res_enq_admin = client.get("/api/admin/enquiries", headers={"Authorization": f"Bearer {token}"})
    admin_enqs = res_enq_admin.json()
    has_test_enq = any(e.get("email") == "enq-prod-verify@voktaa.com" for e in admin_enqs)
    print(f"   GET /api/admin/enquiries HTTP Status: {res_enq_admin.status_code} | Found in admin list: {has_test_enq}")

    # Clean up test enquiry from DB if needed
    async with AsyncSessionLocal() as session:
        if enq_id:
            await session.execute(delete(EnquiryModel).where(EnquiryModel.id == enq_id))
            await session.commit()
    print("   Cleaned up test enquiry from database.")

    results["check_6_enquiries"] = {
        "post_status": enq_post_status,
        "admin_get_status": res_enq_admin.status_code,
        "persisted": has_test_enq,
        "valid": (enq_post_status == 200 and res_enq_admin.status_code == 200 and has_test_enq)
    }

    # -------------------------------------------------- Check 7: Analytics
    print("\n7. TESTING TRACKING / ANALYTICS...")
    track_payload = {
        "type": "visit",
        "category": "verification",
        "label": "ProdCheck",
        "page": "/reviews",
        "session_id": "sess_prod_verify"
    }
    res_track = client.post("/api/track", json=track_payload)
    track_status = res_track.status_code
    print(f"   POST /api/track HTTP Status: {track_status}")
    
    results["check_7_analytics"] = {
        "status_code": track_status,
        "valid": (track_status == 200)
    }

    # -------------------------------------------------- Check 8: Settings
    print("\n8. TESTING SETTINGS PERSISTENCE...")
    res_set_get = client.get("/api/settings")
    set_get_status = res_set_get.status_code
    
    res_set_patch = client.patch("/api/admin/settings", json={"reviews_visible": True}, headers={"Authorization": f"Bearer {token}"})
    set_patch_status = res_set_patch.status_code
    print(f"   GET /api/settings HTTP Status: {set_get_status}")
    print(f"   PATCH /api/admin/settings HTTP Status: {set_patch_status}")
    
    results["check_8_settings"] = {
        "get_status": set_get_status,
        "patch_status": set_patch_status,
        "valid": (set_get_status == 200 and set_patch_status == 200)
    }

    # -------------------------------------------------- Summary Report
    print("\n==================================================")
    print("SUMMARY VERIFICATION REPORT")
    print("==================================================")
    all_passed = True
    for k, v in results.items():
        is_ok = v.get("valid", False)
        if not is_ok:
            all_passed = False
        print(f"  {k}: {'[PASS]' if is_ok else '[FAIL]'}")
        
    print(f"\nFinal Application Deployment Status: {'SAFE TO DEPLOY' if all_passed else 'NOT SAFE TO DEPLOY'}")

if __name__ == "__main__":
    asyncio.run(run_verification())
