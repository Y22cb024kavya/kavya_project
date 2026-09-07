import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_EVENTS_COLLECTION_ID,
)
from repositories import parse_datetime, format_iso, extract_docs, extract_total, _local_store

logger = logging.getLogger("voktaa.repositories.events")

try:
    from appwrite.query import Query
    from appwrite.id import ID
except ImportError:
    Query = None
    ID = None


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
                res_raw = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_EVENTS_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=payload
                )
                res = res_raw.to_dict() if hasattr(res_raw, "to_dict") else dict(res_raw)
                return {"id": res.get("$id") or res.get("id", doc_id), **payload}
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
                docs = extract_docs(res)
                return [
                    {
                        "id": d.get("$id") or d.get("id", ""),
                        "type": d.get("type", "visit"),
                        "category": d.get("category", ""),
                        "label": d.get("label", ""),
                        "page": d.get("page", ""),
                        "session_id": d.get("session_id", ""),
                        "timestamp": d.get("timestamp", ""),
                        "ip": d.get("ip", ""),
                    }
                    for d in docs
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
                return extract_total(res)
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
                return extract_total(res)
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
