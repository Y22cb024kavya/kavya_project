import uuid
import logging
from typing import Optional, Any
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_USERS_COLLECTION_ID,
)
from repositories import parse_datetime, format_iso, now_iso, extract_docs, extract_total, _local_store

logger = logging.getLogger("voktaa.repositories.user")

try:
    from appwrite.query import Query
    from appwrite.id import ID
except ImportError:
    Query = None
    ID = None


class UserObj:
    def __init__(self, doc_id: str, email: str, password_hash: str, name: str = "Admin", role: str = "admin", legacy_id: Optional[str] = None, created_at: Optional[str] = None):
        self.id = doc_id
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.role = role
        self.legacy_id = legacy_id
        self.created_at = created_at or now_iso()


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
                docs = extract_docs(res)
                if docs:
                    d = docs[0]
                    return UserObj(
                        doc_id=d.get("$id") or d.get("id", ""),
                        email=d.get("email", ""),
                        password_hash=d.get("password_hash", ""),
                        name=d.get("name", "Admin"),
                        role=d.get("role", "admin"),
                        legacy_id=d.get("legacy_id"),
                        created_at=d.get("created_at"),
                    )
            except Exception as e:
                logger.warning("Appwrite get_by_email error: %s", e)

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
                d_raw = appwrite_manager.databases.get_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_USERS_COLLECTION_ID,
                    document_id=user_id
                )
                d = d_raw.to_dict() if hasattr(d_raw, "to_dict") else dict(d_raw)
                return UserObj(
                    doc_id=d.get("$id") or d.get("id", user_id),
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
                res_raw = appwrite_manager.databases.create_document(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_USERS_COLLECTION_ID,
                    document_id=ID.unique() if ID else doc_id,
                    data=data
                )
                res = res_raw.to_dict() if hasattr(res_raw, "to_dict") else dict(res_raw)
                return UserObj(
                    doc_id=res.get("$id") or res.get("id", doc_id),
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
                docs = extract_docs(res)
                if docs:
                    appwrite_manager.databases.update_document(
                        database_id=APPWRITE_DATABASE_ID,
                        collection_id=APPWRITE_USERS_COLLECTION_ID,
                        document_id=docs[0].get("$id") or docs[0].get("id"),
                        data={"password_hash": new_password_hash}
                    )
                    return
            except Exception as e:
                logger.warning("Appwrite update_password error: %s", e)

        for u in _local_store["users"]:
            if u["email"].lower().strip() == clean_email:
                u["password_hash"] = new_password_hash
