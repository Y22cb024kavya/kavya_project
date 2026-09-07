import os
import sys
import asyncio
import pytest
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))

from fastapi.testclient import TestClient
from server import app, seed_admin
from storage.storage_service import storage_service, StorageService

client = TestClient(app)

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@voktaa.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")


def test_storage_provider():
    # Test valid image upload
    test_bytes = b"fake image content"
    relative_path, public_url = asyncio.run(
        storage_service.upload_file(test_bytes, "test_logo.png", "image/png", folder="images")
    )
    assert relative_path.endswith(".png")
    assert "/uploads/" in public_url or "http" in public_url
    print("\n[OK] StorageService save_file passed:", public_url)

    # Test file deletion
    deleted = asyncio.run(storage_service.delete_file(relative_path))
    assert deleted is True
    print("   [OK] StorageService delete_file passed")


def test_invalid_file_type():
    try:
        asyncio.run(
            storage_service.upload_file(b"exec content", "malicious.exe", "application/x-msdownload")
        )
        assert False, "Should have raised ValueError for invalid file type"
    except ValueError:
        print("   [OK] File extension validation passed")


def test_admin_upload_endpoint():
    asyncio.run(seed_admin())
    # Login to get admin token
    r_login = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r_login.status_code == 200
    token = r_login.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload test image
    files = {"file": ("test_upload.jpg", b"sample image bytes", "image/jpeg")}
    r_upload = client.post("/api/admin/upload", files=files, headers=headers)
    assert r_upload.status_code == 200
    data = r_upload.json()
    assert data["ok"] is True
    assert "url" in data
    print("   [OK] POST /api/admin/upload endpoint passed:", data["url"])


if __name__ == "__main__":
    test_storage_provider()
    test_invalid_file_type()
    test_admin_upload_endpoint()
