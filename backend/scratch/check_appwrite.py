import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from database.appwrite_client import appwrite_manager, APPWRITE_DATABASE_ID, APPWRITE_REVIEWS_COLLECTION_ID

def extract_docs_fixed(res):
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
        
        # Flatten nested data field if present (Appwrite Python SDK model)
        if "data" in d and isinstance(d["data"], dict):
            data_fields = d.pop("data")
            for k, v in data_fields.items():
                if k not in d:
                    d[k] = v
        out.append(d)
    return out

if appwrite_manager.is_configured and appwrite_manager.databases:
    res = appwrite_manager.databases.list_documents(
        database_id=APPWRITE_DATABASE_ID,
        collection_id=APPWRITE_REVIEWS_COLLECTION_ID
    )
    docs = extract_docs_fixed(res)
    print("FIXED EXTRACTED DOCS:")
    for d in docs:
        print(json.dumps(d, indent=2, default=str))
