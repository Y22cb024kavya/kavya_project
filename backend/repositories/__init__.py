import json
from datetime import datetime, timezone
from typing import Any, List, Dict

def parse_datetime(val: Any) -> datetime:
    if isinstance(val, datetime):
        return val if val.tzinfo else val.replace(tzinfo=timezone.utc)
    if isinstance(val, str):
        try:
            dt = datetime.fromisoformat(val.replace("Z", "+00:00"))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except Exception:
            pass
    return datetime.now(timezone.utc)


def format_iso(dt: datetime) -> str:
    if not dt.tzinfo:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def extract_docs(res: Any) -> List[Dict[str, Any]]:
    if res is None:
        return []
    if isinstance(res, dict):
        raw_list = res.get("documents", [])
    else:
        raw_list = getattr(res, "documents", [])
    out = []
    for item in raw_list:
        if hasattr(item, "to_dict"):
            d = item.to_dict()
        elif isinstance(item, dict):
            d = dict(item)
        else:
            d = getattr(item, "__dict__", {})
        if "$id" not in d and hasattr(item, "$id"):
            d["$id"] = getattr(item, "$id")
        out.append(d)
    return out


def extract_total(res: Any) -> int:
    if res is None:
        return 0
    if isinstance(res, dict):
        return res.get("total", 0)
    return getattr(res, "total", 0)


import os

DB_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "db_store.json")

INITIAL_BASELINE_REVIEWS = [
    {
        "id": "r1",
        "name": "Tejasri Penubothu",
        "role": "Student",
        "organisation": "Student",
        "program": "Soft Skills Development",
        "rating": 5,
        "review": "I started using VOKTAA Solutions last week to improve my communication skills, leadership qualities, and interview skills. The training sessions are engaging, well-organized, and easy to understand. The trainers explain every concept clearly with practical examples, which has helped me build confidence. Whenever I had a question, the support team responded quickly and was very helpful. Overall, it has been a great learning experience, and I highly recommend VOKTAA Solutions to anyone looking to improve their soft skills.",
        "status": "approved",
        "timestamp": "2026-01-01T00:00:00+00:00",
    },
    {
        "id": "r2",
        "name": "Sahithi Srinivas S",
        "role": "Student",
        "organisation": "Student",
        "program": "Campus Recruitment Training",
        "rating": 5,
        "review": "I started using VOKTAA Solutions last week to fix my communication skills, leadership qualities and Interview Tips. The app is very clean and fast. When I had a question, their online/offline sessions helped my interviews and the support team replied in minutes. Highly recommend.",
        "status": "approved",
        "timestamp": "2026-01-02T00:00:00+00:00",
    },
    {
        "id": "r3",
        "name": "N Venkata Bhargavi",
        "role": "Student",
        "organisation": "Student",
        "program": "Communication Skills",
        "rating": 5,
        "review": "This session will definitely be useful for those who want to build a strong foundation on communication skills and also boost them with confidence to face the interviews. I learned a lot of tips which helped me in my interviews.",
        "status": "approved",
        "timestamp": "2026-01-03T00:00:00+00:00",
    },
    {
        "id": "r4",
        "name": "Anumula Abhinaya",
        "role": "Student",
        "organisation": "Student",
        "program": "Public Speaking & Debate",
        "rating": 5,
        "review": "The session was very useful and interactive. I learned many things that will help me improve my communication and confidence.",
        "status": "approved",
        "timestamp": "2026-01-04T00:00:00+00:00",
    },
    {
        "id": "r5",
        "name": "VOKTAA Student",
        "role": "Student",
        "organisation": "Student",
        "program": "Soft Skills & Communication",
        "rating": 5,
        "review": "I joined the program to improve my communication skills, but I gained much more than that. It helped me become more confident, improve my body language, and interact professionally with others.",
        "status": "approved",
        "timestamp": "2026-01-05T00:00:00+00:00",
    },
]


def load_local_store() -> Dict[str, List[Dict[str, Any]]]:
    store = {
        "users": [],
        "enquiries": [],
        "reviews": list(INITIAL_BASELINE_REVIEWS),
        "events": [],
        "settings": [{"key": "reviews_visible", "value": json.dumps(True)}],
    }
    if os.path.exists(DB_FILE_PATH):
        try:
            with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    for k in store.keys():
                        if k in data and isinstance(data[k], list):
                            store[k] = data[k]
        except Exception:
            pass
    return store


_local_store = load_local_store()


def save_local_store():
    try:
        os.makedirs(os.path.dirname(DB_FILE_PATH), exist_ok=True)
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(_local_store, f, indent=2, ensure_ascii=False)
    except Exception:
        pass
