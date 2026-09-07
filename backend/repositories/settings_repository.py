import json
import uuid
import logging
from typing import Dict, Any
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_SETTINGS_COLLECTION_ID,
)
from repositories import extract_docs, extract_total, _local_store

logger = logging.getLogger("voktaa.repositories.settings")

try:
    from appwrite.query import Query
    from appwrite.id import ID
except ImportError:
    Query = None
    ID = None

DEFAULT_SETTINGS = {"reviews_visible": True}


class SettingsRepository:
    @staticmethod
    async def get_settings(session: Any = None) -> Dict[str, Any]:
        if appwrite_manager.is_configured and appwrite_manager.databases:
            try:
                res = appwrite_manager.databases.list_documents(
                    database_id=APPWRITE_DATABASE_ID,
                    collection_id=APPWRITE_SETTINGS_COLLECTION_ID
                )
                docs = extract_docs(res)
                out = dict(DEFAULT_SETTINGS)
                for d in docs:
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
    async def update_settings(session: Any = None, settings_dict: Dict[str, Any] = None) -> Dict[str, Any]:
        if not settings_dict:
            return await SettingsRepository.get_settings(session)

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
                        docs = extract_docs(res)
                        if docs:
                            appwrite_manager.databases.update_document(
                                database_id=APPWRITE_DATABASE_ID,
                                collection_id=APPWRITE_SETTINGS_COLLECTION_ID,
                                document_id=docs[0].get("$id") or docs[0].get("id"),
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

                found = False
                for s in _local_store["settings"]:
                    if s.get("key") == k:
                        s["value"] = val_json
                        found = True
                        break
                if not found:
                    _local_store["settings"].append({"key": k, "value": val_json})

        return await SettingsRepository.get_settings(session)
