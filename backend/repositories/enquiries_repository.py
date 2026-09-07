import uuid
import logging
from typing import List, Optional, Dict, Any
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_ENQUIRIES_COLLECTION_ID,
)
from repositories import parse_datetime, format_iso, extract_docs, extract_total, _local_store

logger = logging.getLogger("voktaa.repositories.enquiries")

try:
    from appwrite.query import Query
    from appwrite.id import ID
except ImportError:
    Query = None
    ID = None


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
                res_raw = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_ENQUIRIES_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=payload
                )
                res = res_raw.to_dict() if hasattr(res_raw, "to_dict") else dict(res_raw)
                return EnquiryObj(res.get("$id") or res.get("id", doc_id))
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
                docs = extract_docs(res)
                return [
                    {
                        "id": d.get("$id") or d.get("id", ""),
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
                    for d in docs
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
                return extract_total(res)
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
