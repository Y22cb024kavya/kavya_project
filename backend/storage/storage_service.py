import os
import logging
from typing import Tuple, Optional
from storage.base_storage import BaseStorageProvider
from storage.hostinger_storage import HostingerStorageProvider
from storage.s3_storage import S3StorageProvider

logger = logging.getLogger("storage")

MAX_UPLOAD_SIZE_BYTES = int(os.environ.get("MAX_UPLOAD_SIZE_MB", 10)) * 1024 * 1024

ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "application/pdf", "video/mp4", "video/webm"
}


def get_storage_provider() -> BaseStorageProvider:
    provider_type = os.environ.get("STORAGE_PROVIDER", "hostinger").lower().strip()
    if provider_type in {"s3", "r2", "bunny"}:
        bucket = os.environ.get("S3_BUCKET_NAME", "")
        endpoint = os.environ.get("S3_ENDPOINT_URL", "")
        access_key = os.environ.get("S3_ACCESS_KEY", "")
        secret_key = os.environ.get("S3_SECRET_KEY", "")
        domain = os.environ.get("S3_PUBLIC_DOMAIN", "")
        if bucket:
            logger.info("🟢 Using S3/R2 Object Storage Provider: %s", bucket)
            return S3StorageProvider(bucket, endpoint, access_key, secret_key, domain)

    logger.info("🟢 Using Hostinger Local Hosting Storage Provider")
    upload_dir = os.environ.get("UPLOAD_DIR", "uploads")
    base_url = os.environ.get("STORAGE_BASE_URL", "")
    return HostingerStorageProvider(upload_dir=upload_dir, base_url=base_url)


class StorageService:
    def __init__(self, provider: Optional[BaseStorageProvider] = None):
        self.provider = provider or get_storage_provider()

    async def upload_file(self, file_bytes: bytes, filename: str, content_type: str, folder: str = "images") -> Tuple[str, str]:
        if len(file_bytes) > MAX_UPLOAD_SIZE_BYTES:
            max_mb = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
            raise ValueError(f"File size exceeds maximum allowed limit of {max_mb}MB.")

        content_type_clean = (content_type or "").lower().strip()
        if content_type_clean and content_type_clean not in ALLOWED_MIME_TYPES:
            raise ValueError(f"Unsupported file type '{content_type_clean}'. Allowed types: images, PDFs, MP4/WebM videos.")

        return await self.provider.save_file(file_bytes, filename, content_type_clean, folder=folder)

    async def delete_file(self, file_path: str) -> bool:
        return await self.provider.delete_file(file_path)


storage_service = StorageService()
