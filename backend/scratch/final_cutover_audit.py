"""
Final Cutover Audit Script
"""
import sys
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
FRONTEND_BUILD = ROOT_DIR.parent / "frontend" / "build"
FRONTEND_SRC = ROOT_DIR.parent / "frontend" / "src"
BACKEND_DIR = ROOT_DIR

def audit_codebase():
    print("==================================================")
    print("FINAL CODEBASE AUDIT")
    print("==================================================")

    # 1. Check frontend JS build bundle for secrets or localhost fallbacks
    bundle_leaks = []
    if FRONTEND_BUILD.exists():
        for root, dirs, files in os.walk(FRONTEND_BUILD):
            for f in files:
                if f.endswith(".js"):
                    fp = os.path.join(root, f)
                    txt = open(fp, encoding="utf-8", errors="ignore").read()
                    if "Vokata@12345#$" in txt:
                        bundle_leaks.append(f"DB_PASSWORD found in {f}")
                    if "u832178669_voktaa" in txt:
                        bundle_leaks.append(f"DB_USER found in {f}")
                    if "u832178669_voktaaProdu" in txt:
                        bundle_leaks.append(f"DB_NAME found in {f}")
                        
    print("1. Frontend JS Bundle Secret Audit:", "[OK] NO SECRETS LEAKED" if not bundle_leaks else f"[FAIL] LEAKS: {bundle_leaks}")

    # 2. Check for Appwrite Database CRUD calls in backend repositories and server
    appwrite_db_crud = []
    for root, dirs, files in os.walk(BACKEND_DIR):
        if "scratch" in root or "venv" in root or "scripts" in root:
            continue
        for f in files:
            if f.endswith(".py") and f != "appwrite_client.py":
                fp = os.path.join(root, f)
                rel_p = os.path.relpath(fp, BACKEND_DIR)
                txt = open(fp, encoding="utf-8", errors="ignore").read()
                for kw in ["create_document", "list_documents", "get_document", "update_document", "delete_document"]:
                    if kw in txt:
                        appwrite_db_crud.append(f"{kw} in {rel_p}")

    print("2. Backend Application Appwrite DB CRUD Audit:", "[OK] ZERO APPWRITE DB CALLS IN MAIN BACKEND CODE" if not appwrite_db_crud else f"[FAIL] FOUND: {appwrite_db_crud}")

    # 3. Check for DummySession or sqlite imports in backend repositories
    sqlite_or_dummy = []
    for root, dirs, files in os.walk(BACKEND_DIR / "repositories"):
        for f in files:
            if f.endswith(".py"):
                fp = os.path.join(root, f)
                txt = open(fp, encoding="utf-8", errors="ignore").read()
                if "DummySession" in txt:
                    sqlite_or_dummy.append(f"DummySession in {f}")
                if "sqlite" in txt and "sqlite+aiosqlite" not in txt:
                    sqlite_or_dummy.append(f"sqlite in {f}")

    print("3. Repositories Architecture Audit:", "[OK] NO DUMMYSESSION OR RAW SQLITE DEPRECATIONS" if not sqlite_or_dummy else f"[FAIL] FOUND: {sqlite_or_dummy}")

if __name__ == "__main__":
    audit_codebase()
