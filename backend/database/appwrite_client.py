import os
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")

logger = logging.getLogger("voktaa.appwrite")

# Environment variables
APPWRITE_ENDPOINT = os.environ.get("APPWRITE_ENDPOINT", "https://fra.cloud.appwrite.io/v1").strip()
APPWRITE_PROJECT_ID = os.environ.get("APPWRITE_PROJECT_ID", "").strip()
APPWRITE_API_KEY = os.environ.get("APPWRITE_API_KEY", "").strip()
APPWRITE_DATABASE_ID = os.environ.get("APPWRITE_DATABASE_ID", "voktaa_production").strip()
APPWRITE_BUCKET_ID = os.environ.get("APPWRITE_BUCKET_ID", os.environ.get("APPWRITE_STORAGE_BUCKET_ID", "media_uploads")).strip()

APPWRITE_ENQUIRIES_COLLECTION_ID = os.environ.get("APPWRITE_ENQUIRIES_COLLECTION_ID", "6a9e62ea003a27aa71c1").strip()
APPWRITE_REVIEWS_COLLECTION_ID = os.environ.get("APPWRITE_REVIEWS_COLLECTION_ID", "6a9e62fb00317d9891d4").strip()
APPWRITE_EVENTS_COLLECTION_ID = os.environ.get("APPWRITE_EVENTS_COLLECTION_ID", "6a9e63060029f529bdb4").strip()
APPWRITE_SETTINGS_COLLECTION_ID = os.environ.get("APPWRITE_SETTINGS_COLLECTION_ID", "6a9e6315000d58b0186e").strip()
APPWRITE_USERS_COLLECTION_ID = os.environ.get("APPWRITE_USERS_COLLECTION_ID", "users").strip()

try:
    from appwrite.client import Client
    from appwrite.services.databases import Databases
    from appwrite.services.users import Users
    from appwrite.services.storage import Storage
    from appwrite.query import Query
    from appwrite.id import ID
    from appwrite.exception import AppwriteException
    APPWRITE_SDK_AVAILABLE = True
except ImportError:
    APPWRITE_SDK_AVAILABLE = False
    Client = None
    Databases = None
    Users = None
    Storage = None
    Query = None
    ID = None
    AppwriteException = Exception


class AppwriteServiceManager:
    def __init__(self):
        self.client: Optional[Any] = None
        self.databases: Optional[Any] = None
        self.users: Optional[Any] = None
        self.storage: Optional[Any] = None
        self.is_configured = False
        self._init_client()

    def _init_client(self):
        if not APPWRITE_SDK_AVAILABLE:
            logger.warning("⚠️ Appwrite Python SDK not installed. Falling back to local store mode.")
            self.is_configured = False
            return

        if not APPWRITE_PROJECT_ID or not APPWRITE_API_KEY:
            logger.info("ℹ️ Appwrite environment variables (APPWRITE_PROJECT_ID / APPWRITE_API_KEY) missing. Falling back to local store mode.")
            self.is_configured = False
            return

        try:
            client = Client()
            client.set_endpoint(APPWRITE_ENDPOINT)
            client.set_project(APPWRITE_PROJECT_ID)
            client.set_key(APPWRITE_API_KEY)
            
            self.client = client
            self.databases = Databases(client)
            self.users = Users(client)
            self.storage = Storage(client)
            self.is_configured = True
            logger.info("🟢 Appwrite Client initialized successfully (Endpoint: %s | Project ID: %s)", APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID)
        except Exception as e:
            logger.warning("⚠️ Failed to initialize Appwrite client: %s. Falling back to local store mode.", e)
            self.is_configured = False

    def validate_configuration(self) -> Dict[str, Any]:
        """Validate live Appwrite configuration during startup."""
        status = {
            "endpoint": APPWRITE_ENDPOINT,
            "project_id": APPWRITE_PROJECT_ID,
            "database_id": APPWRITE_DATABASE_ID,
            "bucket_id": APPWRITE_BUCKET_ID,
            "configured": self.is_configured,
        }
        if not self.is_configured:
            logger.warning("⚠️ Appwrite configuration incomplete or offline.")
        return status


appwrite_manager = AppwriteServiceManager()
