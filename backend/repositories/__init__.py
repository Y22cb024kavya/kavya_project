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


# Shared local fallback store for testing / offline mode
_local_store = {
    "users": [],
    "enquiries": [],
    "reviews": [],
    "events": [],
    "settings": [{"key": "reviews_visible", "value": json.dumps(True)}],
}
