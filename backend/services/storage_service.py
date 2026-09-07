import os
import uuid
import logging
from pathlib import Path
from typing import Tuple, Optional
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_BUCKET_ID,
)

logger = logging.getLogger("voktaa.services.storage")

MAX_UPLOAD_SIZE_BYTES = int(os.environ.get("MAX_UPLOAD_SIZE_MB", 10)) * 1024 * 1024

ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "application/pdf", "video/mp4", "video/webm"
}


class StorageService:
    def __init__(self):
        self.upload_dir = Path(os.environ.get("UPLOAD_DIR", "uploads"))
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def upload_file(self, file_bytes: bytes, filename: str, content_type: str, folder: str = "images") -> Tuple[str, str]:
        if len(file_bytes) > MAX_UPLOAD_SIZE_BYTES:
            max_mb = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
            raise ValueError(f"File size exceeds maximum allowed limit of {max_mb}MB.")

        content_type_clean = (content_type or "").lower().strip()
        if content_type_clean and content_type_clean not in ALLOWED_MIME_TYPES:
            raise ValueError(f"Unsupported file type '{content_type_clean}'. Allowed types: images, PDFs, MP4/WebM videos.")

        ext = Path(filename).suffix.lower() or ".bin"
        unique_name = f"{uuid.uuid4().hex}{ext}"

        # If Appwrite Storage is available, store in Appwrite Bucket `media_uploads`
        if appwrite_manager.is_configured and appwrite_manager.storage:
            try:
                from appwrite.input_file import InputFile
                file_obj = InputFile.from_bytes(file_bytes, filename=unique_name, mime_type=content_type_clean or "application/octet-stream")
                res = appwrite_manager.storage.create_file(
                    bucket_id=APPWRITE_BUCKET_ID,
                    file_id=unique_name.replace(".", "_"),
                    file=file_obj
                )
                file_id = res["$id"]
                url = f"{appwrite_manager.client.get_config().get('endpoint', '')}/storage/buckets/{APPWRITE_BUCKET_ID}/files/{file_id}/view?project={appwrite_manager.client.get_config().get('project', '')}"
                logger.info("🟢 File uploaded to Appwrite Storage Bucket '%s': %s", APPWRITE_BUCKET_ID, url)
                return file_id, url
            except Exception as e:
                logger.warning("Appwrite Storage upload failed: %s. Falling back to local storage.", e)

        # Fallback to local server disk
        folder_path = self.upload_dir / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        file_path = folder_path / unique_name
        with open(file_path, "wb") as f:
            f.write(file_bytes)

        rel_path = f"/uploads/{folder}/{unique_name}"
        logger.info("Local File Saved: %s", rel_path)
        return rel_path, rel_path


storage_service = StorageService()
