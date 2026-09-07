import os
import uuid
import boto3
from pathlib import Path
from typing import Tuple
from storage.base_storage import BaseStorageProvider


class S3StorageProvider(BaseStorageProvider):
    def __init__(self, bucket_name: str, endpoint_url: str = "", access_key: str = "", secret_key: str = "", public_domain: str = ""):
        self.bucket_name = bucket_name
        self.public_domain = public_domain.rstrip("/")
        
        session = boto3.session.Session()
        kwargs = {}
        if endpoint_url:
            kwargs["endpoint_url"] = endpoint_url
        if access_key and secret_key:
            kwargs["aws_access_key_id"] = access_key
            kwargs["aws_secret_access_key"] = secret_key

        self.s3_client = session.client("s3", **kwargs)

    async def save_file(self, file_bytes: bytes, filename: str, content_type: str, folder: str = "uploads") -> Tuple[str, str]:
        ext = Path(filename).suffix.lower()
        if not ext:
            ext = ".bin"
        unique_name = f"{uuid.uuid4().hex}{ext}"
        key = f"{folder}/{unique_name}"

        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=file_bytes,
            ContentType=content_type or "application/octet-stream",
        )

        if self.public_domain:
            public_url = f"{self.public_domain}/{key}"
        else:
            public_url = f"https://{self.bucket_name}.s3.amazonaws.com/{key}"

        return key, public_url

    async def delete_file(self, key: str) -> bool:
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except Exception:
            return False
