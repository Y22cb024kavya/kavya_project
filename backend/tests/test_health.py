import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] in {"connected", "local_store"}
    assert data.get("provider") == "appwrite"
    print(f"\n[SUCCESS] Health check endpoint /api/health returns 200 OK with Appwrite provider status: {data['database']}!")


if __name__ == "__main__":
    test_health()
