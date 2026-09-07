import os
import json
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any

from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_ENQUIRIES_COLLECTION_ID,
    APPWRITE_REVIEWS_COLLECTION_ID,
    APPWRITE_EVENTS_COLLECTION_ID,
    APPWRITE_SETTINGS_COLLECTION_ID,
    APPWRITE_USERS_COLLECTION_ID,
)

logger = logging.getLogger("voktaa.repositories")

try:
    from appwrite.query import Query
    from appwrite.id import ID
except ImportError:
    Query = None
    ID = None


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


class UserObj:
    def __init__(self, doc_id: str, email: str, password_hash: str, name: str = "Admin", role: str = "admin", legacy_id: Optional[str] = None, created_at: Optional[str] = None):
        self.id = doc_id
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.role = role
        self.legacy_id = legacy_id
        self.created_at = created_at or now_iso()


# Local In-Memory Fallback Storage for offline unit testing / development
_local_store: Dict[str, List[Dict[str, Any]]] = {
    "users": [],
    "enquiries": [],
    "reviews": [],
    "events": [],
    "settings": [{"key": "reviews_visible", "value": json.dumps(True)}],
}


# ------------------------------------------------------------------ User Repository
class UserRepository:
    @staticmethod
    async def get_by_email(session: Any, email: str) -> Optional[UserObj]:
        clean_email = email.lower().strip()
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_USERS_COLLECTION_ID,
                    queries=[Query.equal("email", clean_email), Query.limit(1)]
                )
                docs = res.get("documents", [])
                if docs:
                    d = docs[0]
                    return UserObj(
                        doc_id=d["$id"],
                        email=d.get("email", ""),
                        password_hash=d.get("password_hash", ""),
                        name=d.get("name", "Admin"),
                        role=d.get("role", "admin"),
                        legacy_id=d.get("legacy_id"),
                        created_at=d.get("created_at"),
                    )
            except Exception as e:
                logger.warning("Appwrite get_by_email error: %s", e)

        # Local fallback
        for u in _local_store["users"]:
            if u["email"].lower().strip() == clean_email:
                return UserObj(
                    doc_id=u["id"],
                    email=u["email"],
                    password_hash=u["password_hash"],
                    name=u.get("name", "Admin"),
                    role=u.get("role", "admin"),
                    legacy_id=u.get("legacy_id"),
                    created_at=u.get("created_at"),
                )
        return None

    @staticmethod
    async def get_by_id(session: Any, user_id: str) -> Optional[UserObj]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                d = appwrite_manager.databases.get_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_USERS_COLLECTION_ID,
                    document_id=user_id
                )
                return UserObj(
                    doc_id=d["$id"],
                    email=d.get("email", ""),
                    password_hash=d.get("password_hash", ""),
                    name=d.get("name", "Admin"),
                    role=d.get("role", "admin"),
                    legacy_id=d.get("legacy_id"),
                    created_at=d.get("created_at"),
                )
            except Exception as e:
                logger.warning("Appwrite get_by_id error: %s", e)

        for u in _local_store["users"]:
            if u["id"] == user_id:
                return UserObj(
                    doc_id=u["id"],
                    email=u["email"],
                    password_hash=u["password_hash"],
                    name=u.get("name", "Admin"),
                    role=u.get("role", "admin"),
                    legacy_id=u.get("legacy_id"),
                    created_at=u.get("created_at"),
                )
        return None

    @staticmethod
    async def create(session: Any, email: str, password_hash: str, name: str = "Admin", role: str = "admin", legacy_mongo_id: Optional[str] = None) -> UserObj:
        clean_email = email.lower().strip()
        doc_id = str(uuid.uuid4())
        ts = now_iso()
        data = {
            "email": clean_email,
            "password_hash": password_hash,
            "name": name,
            "role": role,
            "legacy_id": legacy_mongo_id or "",
            "created_at": ts,
        }

        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_USERS_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=data
                )
                return UserObj(
                    doc_id=res["$id"],
                    email=res.get("email", clean_email),
                    password_hash=res.get("password_hash", password_hash),
                    name=res.get("name", name),
                    role=res.get("role", role),
                    legacy_id=res.get("legacy_id"),
                    created_at=res.get("created_at", ts),
                )
            except Exception as e:
                logger.warning("Appwrite create user error: %s", e)

        user_dict = {"id": doc_id, **data}
        # Avoid duplicate in local store
        _local_store["users"] = [u for u in _local_store["users"] if u["email"].lower().strip() != clean_email]
        _local_store["users"].append(user_dict)
        return UserObj(doc_id=doc_id, email=clean_email, password_hash=password_hash, name=name, role=role, legacy_id=legacy_mongo_id, created_at=ts)

    @staticmethod
    async def update_password(session: Any, email: str, new_password_hash: str) -> None:
        clean_email = email.lower().strip()
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_USERS_COLLECTION_ID,
                    queries=[Query.equal("email", clean_email), Query.limit(1)]
                )
                docs = res.get("documents", [])
                if docs:
                    appwrite_manager.databases.update_document(
                        database_id=APPWRITE_DATABASE_ID,
                        collection_id=APPWRITE_USERS_COLLECTION_ID,
                        document_id=docs[0]["$id"],
                        data={"password_hash": new_password_hash}
                    )
                    return
            except Exception as e:
                logger.warning("Appwrite update_password error: %s", e)

        for u in _local_store["users"]:
            if u["email"].lower().strip() == clean_email:
                u["password_hash"] = new_password_hash


# ------------------------------------------------------------------ Enquiry Repository
class EnquiryObj:
    def __init__(self, doc_id: str):
        self.id = doc_id


class EnquiryRepository:
    @staticmethod
    async def create(session: Any, data: Dict[str, Any], legacy_mongo_id: Optional[str] = None) -> EnquiryObj:
        doc_id = str(uuid.uuid4())
        ts = format_iso(parse_datetime(data.get("timestamp")))
        payload = {
            "first_name": data.get("first_name", ""),
            "last_name": data.get("last_name", ""),
            "email": data.get("email", ""),
            "phone": data.get("phone", ""),
            "program": data.get("program", ""),
            "city": data.get("city", ""),
            "message": data.get("message", ""),
            "timestamp": ts,
            "ip": data.get("ip", ""),
            "legacy_id": legacy_mongo_id or "",
        }

        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_ENQUIRIES_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=payload
                )
                return EnquiryObj(res["$id"])
            except Exception as e:
                logger.warning("Appwrite create enquiry error: %s", e)

        _local_store["enquiries"].append({"id": doc_id, **payload})
        return EnquiryObj(doc_id)

    @staticmethod
    async def list_all(session: Any, limit: int = 500) -> List[Dict[str, Any]]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_ENQUIRIES_COLLECTION_ID,
                    queries=[Query.order_desc("timestamp"), Query.limit(limit)]
                )
                return [
                    {
                        "id": d["$id"],
                        "first_name": d.get("first_name", ""),
                        "last_name": d.get("last_name", ""),
                        "email": d.get("email", ""),
                        "phone": d.get("phone", ""),
                        "program": d.get("program", ""),
                        "city": d.get("city", ""),
                        "message": d.get("message", ""),
                        "timestamp": d.get("timestamp", ""),
                        "ip": d.get("ip", ""),
                    }
                    for d in res.get("documents", [])
                ]
            except Exception as e:
                logger.warning("Appwrite list_all enquiries error: %s", e)

        sorted_items = sorted(_local_store["enquiries"], key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]
        return [
            {
                "id": e["id"],
                "first_name": e.get("first_name", ""),
                "last_name": e.get("last_name", ""),
                "email": e.get("email", ""),
                "phone": e.get("phone", ""),
                "program": e.get("program", ""),
                "city": e.get("city", ""),
                "message": e.get("message", ""),
                "timestamp": e.get("timestamp", ""),
                "ip": e.get("ip", ""),
            }
            for e in sorted_items
        ]

    @staticmethod
    async def count_all(session: Any) -> int:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_ENQUIRIES_COLLECTION_ID,
                    queries=[Query.limit(1)]
                )
                return res.get("total", 0)
            except Exception as e:
                logger.warning("Appwrite count_all enquiries error: %s", e)

        return len(_local_store["enquiries"])

    @staticmethod
    async def program_breakdown(session: Any, limit: int = 50) -> List[Dict[str, Any]]:
        enquiries = await EnquiryRepository.list_all(session, limit=1000)
        counts: Dict[str, int] = {}
        for e in enquiries:
            prog = (e.get("program") or "").strip()
            if prog:
                counts[prog] = counts.get(prog, 0) + 1
        sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
        return [{"program": prog, "count": cnt} for prog, cnt in sorted_counts]


# ------------------------------------------------------------------ Review Repository
class ReviewRepository:
    @staticmethod
    async def create(session: Any, data: Dict[str, Any], legacy_mongo_id: Optional[str] = None) -> Dict[str, Any]:
        doc_id = str(uuid.uuid4())
        ts = format_iso(parse_datetime(data.get("timestamp")))
        payload = {
            "name": data.get("name", ""),
            "email": data.get("email", ""),
            "phone": data.get("phone", ""),
            "role": data.get("role", ""),
            "organisation": data.get("organisation", ""),
            "program": data.get("program", ""),
            "rating": max(1, min(5, int(data.get("rating") or 5))),
            "review": data.get("review", ""),
            "status": data.get("status", "approved"),
            "timestamp": ts,
            "ip": data.get("ip", ""),
            "legacy_id": legacy_mongo_id or "",
        }

        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_REVIEWS_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=payload
                )
                return {"id": res["$id"], **payload}
            except Exception as e:
                logger.warning("Appwrite create review error: %s", e)

        item = {"id": doc_id, **payload}
        _local_store["reviews"].append(item)
        return item

    @staticmethod
    async def list_public(session: Any, limit: int = 100) -> List[Dict[str, Any]]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_REVIEWS_COLLECTION_ID,
                    queries=[Query.equal("status", "approved"), Query.order_desc("timestamp"), Query.limit(limit)]
                )
                return [
                    {
                        "id": d["$id"],
                        "name": d.get("name", ""),
                        "role": d.get("role", ""),
                        "organisation": d.get("organisation", ""),
                        "program": d.get("program", ""),
                        "rating": d.get("rating", 5),
                        "review": d.get("review", ""),
                        "status": d.get("status", "approved"),
                        "timestamp": d.get("timestamp", ""),
                    }
                    for d in res.get("documents", [])
                ]
            except Exception as e:
                logger.warning("Appwrite list_public reviews error: %s", e)

        filtered = [r for r in _local_store["reviews"] if r.get("status") == "approved"]
        sorted_revs = sorted(filtered, key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]
        return [
            {
                "id": r["id"],
                "name": r.get("name", ""),
                "role": r.get("role", ""),
                "organisation": r.get("organisation", ""),
                "program": r.get("program", ""),
                "rating": r.get("rating", 5),
                "review": r.get("review", ""),
                "status": r.get("status", "approved"),
                "timestamp": r.get("timestamp", ""),
            }
            for r in sorted_revs
        ]

    @staticmethod
    async def list_all(session: Any, limit: int = 500) -> List[Dict[str, Any]]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_REVIEWS_COLLECTION_ID,
                    queries=[Query.order_desc("timestamp"), Query.limit(limit)]
                )
                return [
                    {
                        "id": d["$id"],
                        "name": d.get("name", ""),
                        "email": d.get("email", ""),
                        "phone": d.get("phone", ""),
                        "role": d.get("role", ""),
                        "organisation": d.get("organisation", ""),
                        "program": d.get("program", ""),
                        "rating": d.get("rating", 5),
                        "review": d.get("review", ""),
                        "status": d.get("status", "approved"),
                        "timestamp": d.get("timestamp", ""),
                        "ip": d.get("ip", ""),
                    }
                    for d in res.get("documents", [])
                ]
            except Exception as e:
                logger.warning("Appwrite list_all reviews error: %s", e)

        sorted_revs = sorted(_local_store["reviews"], key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]
        return [
            {
                "id": r["id"],
                "name": r.get("name", ""),
                "email": r.get("email", ""),
                "phone": r.get("phone", ""),
                "role": r.get("role", ""),
                "organisation": r.get("organisation", ""),
                "program": r.get("program", ""),
                "rating": r.get("rating", 5),
                "review": r.get("review", ""),
                "status": r.get("status", "approved"),
                "timestamp": r.get("timestamp", ""),
                "ip": r.get("ip", ""),
            }
            for r in sorted_revs
        ]

    @staticmethod
    async def update_status(session: Any, review_id: str, status: str) -> bool:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                appwrite_manager.databases.update_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_REVIEWS_COLLECTION_ID,
                    document_id=review_id,
                    data={"status": status}
                )
                return True
            except Exception as e:
                logger.warning("Appwrite update_status review error: %s", e)

        for r in _local_store["reviews"]:
            if r["id"] == review_id:
                r["status"] = status
                return True
        return False

    @staticmethod
    async def delete(session: Any, review_id: str) -> bool:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                appwrite_manager.databases.delete_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_REVIEWS_COLLECTION_ID,
                    document_id=review_id
                )
                return True
            except Exception as e:
                logger.warning("Appwrite delete review error: %s", e)

        initial_len = len(_local_store["reviews"])
        _local_store["reviews"] = [r for r in _local_store["reviews"] if r["id"] != review_id]
        return len(_local_store["reviews"]) < initial_len


# ------------------------------------------------------------------ Event Repository
class EventRepository:
    @staticmethod
    async def create(session: Any, data: Dict[str, Any], legacy_mongo_id: Optional[str] = None) -> Dict[str, Any]:
        doc_id = str(uuid.uuid4())
        ts = format_iso(parse_datetime(data.get("timestamp")))
        payload = {
            "type": data.get("type", "visit"),
            "category": data.get("category", ""),
            "label": data.get("label", ""),
            "page": data.get("page", ""),
            "session_id": data.get("session_id", ""),
            "timestamp": ts,
            "ip": data.get("ip", ""),
            "legacy_id": legacy_mongo_id or "",
        }

        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_EVENTS_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=payload
                )
                return {"id": res["$id"], **payload}
            except Exception as e:
                logger.warning("Appwrite create event error: %s", e)

        item = {"id": doc_id, **payload}
        _local_store["events"].append(item)
        return item

    @staticmethod
    async def list_events(session: Any, limit: int = 1000) -> List[Dict[str, Any]]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_EVENTS_COLLECTION_ID,
                    queries=[Query.order_desc("timestamp"), Query.limit(limit)]
                )
                return [
                    {
                        "id": d["$id"],
                        "type": d.get("type", "visit"),
                        "category": d.get("category", ""),
                        "label": d.get("label", ""),
                        "page": d.get("page", ""),
                        "session_id": d.get("session_id", ""),
                        "timestamp": d.get("timestamp", ""),
                        "ip": d.get("ip", ""),
                    }
                    for d in res.get("documents", [])
                ]
            except Exception as e:
                logger.warning("Appwrite list_events error: %s", e)

        return _local_store["events"]

    @staticmethod
    async def count_by_type(session: Any, event_type: str) -> int:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_EVENTS_COLLECTION_ID,
                    queries=[Query.equal("type", event_type), Query.limit(1)]
                )
                return res.get("total", 0)
            except Exception as e:
                logger.warning("Appwrite count_by_type event error: %s", e)

        return len([ev for ev in _local_store["events"] if ev.get("type") == event_type])

    @staticmethod
    async def count_by_type_category(session: Any, event_type: str, category: str) -> int:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_EVENTS_COLLECTION_ID,
                    queries=[Query.equal("type", event_type), Query.equal("category", category), Query.limit(1)]
                )
                return res.get("total", 0)
            except Exception as e:
                logger.warning("Appwrite count_by_type_category event error: %s", e)

        return len([ev for ev in _local_store["events"] if ev.get("type") == event_type and ev.get("category") == category])

    @staticmethod
    async def distinct_session_visitors(session: Any) -> int:
        events = await EventRepository.list_events(session, limit=1000)
        sessions = {ev["session_id"] for ev in events if ev.get("type") == "visit" and ev.get("session_id")}
        return len(sessions)

    @staticmethod
    async def click_label_breakdown(session: Any, limit: int = 50) -> List[Dict[str, Any]]:
        events = await EventRepository.list_events(session, limit=1000)
        counts: Dict[str, int] = {}
        for ev in events:
            if ev.get("type") == "click" and ev.get("category") == "program":
                lbl = (ev.get("label") or "").strip()
                if lbl:
                    counts[lbl] = counts.get(lbl, 0) + 1
        sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
        return [{"program": lbl, "count": cnt} for lbl, cnt in sorted_counts]

    @staticmethod
    async def page_view_breakdown(session: Any, limit: int = 50) -> List[Dict[str, Any]]:
        events = await EventRepository.list_events(session, limit=1000)
        counts: Dict[str, int] = {}
        for ev in events:
            if ev.get("type") == "visit":
                page = (ev.get("page") or "/").strip()
                counts[page] = counts.get(page, 0) + 1
        sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
        return [{"page": page, "count": cnt} for page, cnt in sorted_counts]

    @staticmethod
    async def daily_visits_last_14_days(session: Any) -> List[Dict[str, Any]]:
        events = await EventRepository.list_events(session, limit=2000)
        today = datetime.now(timezone.utc).date()
        days = []
        for i in range(13, -1, -1):
            d = today - timedelta(days=i)
            day_str = d.strftime("%b %d")
            count = 0
            for ev in events:
                if ev.get("type") == "visit":
                    ev_dt = parse_datetime(ev.get("timestamp"))
                    if ev_dt.date() == d:
                        count += 1
            days.append({"date": day_str, "visits": count})
        return days


# ------------------------------------------------------------------ Setting Repository
DEFAULT_SETTINGS = {"reviews_visible": True}


class SettingsRepository:
    @staticmethod
    async def get_settings(session: Any) -> Dict[str, Any]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_SETTINGS_COLLECTION_ID
                )
                out = dict(DEFAULT_SETTINGS)
                for d in res.get("documents", []):
                    k = d.get("key")
                    v_raw = d.get("value")
                    if k:
                        try:
                            out[k] = json.loads(v_raw)
                        except Exception:
                            out[k] = v_raw
                return out
            except Exception as e:
                logger.warning("Appwrite get_settings error: %s", e)

        out = dict(DEFAULT_SETTINGS)
        for s in _local_store["settings"]:
            k = s.get("key")
            v_raw = s.get("value")
            if k:
                try:
                    out[k] = json.loads(v_raw)
                except Exception:
                    out[k] = v_raw
        return out

    @staticmethod
    async def update_settings(session: Any, settings_dict: Dict[str, Any]) -> Dict[str, Any]:
        for k, v in settings_dict.items():
            if k in DEFAULT_SETTINGS:
                val_json = json.dumps(v)
                if appwrite_manager.is_configured and appwrite_manager.databases:
                    try:
                        res = appwrite_manager.databases.list_documents(
                            database_id=APPWRITE_DATABASE_ID,
                            collection_id=APPWRITE_SETTINGS_COLLECTION_ID,
                            queries=[Query.equal("key", k), Query.limit(1)]
                        )
                        docs = res.get("documents", [])
                        if docs:
                            appwrite_manager.databases.update_document(
                                database_id=APPWRITE_DATABASE_ID,
                                collection_id=APPWRITE_SETTINGS_COLLECTION_ID,
                                document_id=docs[0]["$id"],
                                data={"value": val_json}
                            )
                        else:
                            appwrite_manager.databases.create_document(
                                database_id=APPWRITE_DATABASE_ID,
                                collection_id=APPWRITE_SETTINGS_COLLECTION_ID,
                                document_id=ID.unique() if ID else str(uuid.uuid4()),
                                data={"key": k, "value": val_json}
                            )
                    except Exception as e:
                        logger.warning("Appwrite update_settings error for key %s: %s", k, e)

                # Local update
                found = False
                for s in _local_store["settings"]:
                    if s.get("key") == k:
                        s["value"] = val_json
                        found = True
                        break
                if not found:
                    _local_store["settings"].append({"key": k, "value": val_json})

        return await SettingsRepository.get_settings(session)
