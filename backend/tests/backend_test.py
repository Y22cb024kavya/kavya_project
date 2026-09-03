"""VOKTAA Solutions backend API tests"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fall back to reading frontend/.env
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

ADMIN_EMAIL = "voktaasolutions@gmail.com"
ADMIN_PASSWORD = "Voktaa@2025"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ------------------ tracking
def test_track_visit(api):
    r = api.post(f"{BASE_URL}/api/track", json={
        "type": "visit", "page": "/", "session_id": f"TEST_{uuid.uuid4()}",
    })
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_track_click(api):
    r = api.post(f"{BASE_URL}/api/track", json={
        "type": "click", "category": "contact", "label": "whatsapp",
        "page": "/", "session_id": f"TEST_{uuid.uuid4()}",
    })
    assert r.status_code == 200


# ------------------ enquiries
def test_create_enquiry(api):
    payload = {
        "first_name": "TEST_User", "last_name": "Auto", "email": "test_auto@example.com",
        "phone": "9999999999", "program": "Little Voices", "city": "Vijayawada",
        "message": "automated test",
    }
    r = api.post(f"{BASE_URL}/api/enquiries", json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("ok") is True
    assert "id" in body


# ------------------ auth
def test_login_success(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    d = r.json()
    assert "token" in d and isinstance(d["token"], str) and len(d["token"]) > 20
    assert d["user"]["email"] == ADMIN_EMAIL
    assert d["user"]["role"] == "admin"


def test_login_wrong_password(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


# ------------------ admin protected
def test_analytics_no_token(api):
    r = api.get(f"{BASE_URL}/api/admin/analytics")
    assert r.status_code == 401


def test_enquiries_no_token(api):
    r = api.get(f"{BASE_URL}/api/admin/enquiries")
    assert r.status_code == 401


def test_analytics_with_token(api, auth_headers):
    r = api.get(f"{BASE_URL}/api/admin/analytics", headers=auth_headers)
    assert r.status_code == 200
    d = r.json()
    for k in ("totals", "program_breakdown", "program_clicks", "visits_over_time", "page_views", "recent_enquiries"):
        assert k in d
    for k in ("visits", "unique_visitors", "submissions", "contact_clicks", "total_clicks"):
        assert k in d["totals"]
    assert len(d["visits_over_time"]) == 14
    # ObjectId should not leak
    if d["recent_enquiries"]:
        assert "_id" not in d["recent_enquiries"][0]
        assert "id" in d["recent_enquiries"][0]


def test_admin_enquiries_list(api, auth_headers):
    r = api.get(f"{BASE_URL}/api/admin/enquiries", headers=auth_headers)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    if items:
        assert "_id" not in items[0]
        assert "id" in items[0]


def test_me_endpoint(api, auth_headers):
    r = api.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ------------------ reviews
def _make_review(suffix=""):
    return {
        "name": f"TEST_Reviewer{suffix}",
        "email": f"test_review{suffix}@example.com",
        "phone": "9999999999",
        "role": "Parent",
        "organisation": "TEST_Org",
        "program": "Little Voices",
        "rating": 5,
        "review": f"This is an automated test review {suffix} with enough length.",
    }


def test_submit_review_ok(api):
    r = api.post(f"{BASE_URL}/api/reviews", json=_make_review("_ok"))
    assert r.status_code == 200, r.text
    assert r.json().get("ok") is True


def test_submit_review_too_short(api):
    payload = _make_review("_short")
    payload["review"] = "hi"
    r = api.post(f"{BASE_URL}/api/reviews", json=payload)
    assert r.status_code == 400


def test_public_reviews_only_approved_and_scrubbed(api, auth_headers):
    # submit a fresh pending review
    payload = _make_review("_pub")
    sr = api.post(f"{BASE_URL}/api/reviews", json=payload)
    assert sr.status_code == 200

    # public list must NOT contain the pending one and must NOT expose email/phone/ip
    pr = api.get(f"{BASE_URL}/api/reviews")
    assert pr.status_code == 200
    items = pr.json()
    assert isinstance(items, list)
    for it in items:
        assert it.get("status") == "approved" or it.get("status") is None or it.get("status") == "approved"
        # scrubbed fields
        assert "email" not in it
        assert "phone" not in it
        assert "ip" not in it
    # our fresh pending review email must not leak
    emails = [it.get("email") for it in items]
    assert payload["email"] not in emails


def test_admin_reviews_requires_auth(api):
    r = api.get(f"{BASE_URL}/api/admin/reviews")
    assert r.status_code == 401


def test_admin_review_approve_flow(api, auth_headers):
    # create review
    payload = _make_review("_approve")
    r = api.post(f"{BASE_URL}/api/reviews", json=payload)
    assert r.status_code == 200

    # list via admin: find it
    lr = api.get(f"{BASE_URL}/api/admin/reviews", headers=auth_headers)
    assert lr.status_code == 200
    items = lr.json()
    assert isinstance(items, list) and len(items) > 0
    mine = next((x for x in items if x.get("email") == payload["email"]), None)
    assert mine is not None, "submitted review not visible to admin"
    assert mine["status"] == "pending"
    rid = mine["id"]
    assert "_id" not in mine

    # approve
    pr = api.patch(f"{BASE_URL}/api/admin/reviews/{rid}", json={"status": "approved"}, headers=auth_headers)
    assert pr.status_code == 200

    # appears in public list now (by name: email is scrubbed)
    public = api.get(f"{BASE_URL}/api/reviews").json()
    assert any(x.get("name") == payload["name"] and x.get("id") == rid for x in public)

    # cleanup
    dr = api.delete(f"{BASE_URL}/api/admin/reviews/{rid}", headers=auth_headers)
    assert dr.status_code == 200

    # gone from public list
    public2 = api.get(f"{BASE_URL}/api/reviews").json()
    assert not any(x.get("id") == rid for x in public2)


def test_admin_review_invalid_status(api, auth_headers):
    payload = _make_review("_invstat")
    api.post(f"{BASE_URL}/api/reviews", json=payload)
    items = api.get(f"{BASE_URL}/api/admin/reviews", headers=auth_headers).json()
    mine = next((x for x in items if x.get("email") == payload["email"]), None)
    assert mine
    r = api.patch(f"{BASE_URL}/api/admin/reviews/{mine['id']}", json={"status": "bogus"}, headers=auth_headers)
    assert r.status_code == 400
    # cleanup
    api.delete(f"{BASE_URL}/api/admin/reviews/{mine['id']}", headers=auth_headers)


def test_admin_review_delete_no_token(api):
    r = api.delete(f"{BASE_URL}/api/admin/reviews/507f1f77bcf86cd799439011")
    assert r.status_code == 401
