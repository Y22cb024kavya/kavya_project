import uuid
import logging
from typing import List, Optional, Dict, Any
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_REVIEWS_COLLECTION_ID,
)
from repositories import parse_datetime, format_iso, extract_docs, extract_total, _local_store

logger = logging.getLogger("voktaa.repositories.reviews")

try:
    from appwrite.query import Query
    from appwrite.id import ID
except ImportError:
    Query = None
    ID = None


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
                res_raw = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_REVIEWS_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=payload
                )
                res = res_raw.to_dict() if hasattr(res_raw, "to_dict") else dict(res_raw)
                return {"id": res.get("$id") or res.get("id", doc_id), **payload}
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
                docs = extract_docs(res)
                return [
                    {
                        "id": d.get("$id") or d.get("id", ""),
                        "name": d.get("name", ""),
                        "role": d.get("role", ""),
                        "organisation": d.get("organisation", ""),
                        "program": d.get("program", ""),
                        "rating": d.get("rating", 5),
                        "review": d.get("review", ""),
                        "status": d.get("status", "approved"),
                        "timestamp": d.get("timestamp", ""),
                    }
                    for d in docs
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
                docs = extract_docs(res)
                return [
                    {
                        "id": d.get("$id") or d.get("id", ""),
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
                    for d in docs
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
