import os
import uuid
from pathlib import Path
from typing import Tuple
from storage.base_storage import BaseStorageProvider


class HostingerStorageProvider(BaseStorageProvider):
    def __init__(self, upload_dir: str = "uploads", base_url: str = ""):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.base_url = base_url.rstrip("/")

    async def save_file(self, file_bytes: bytes, filename: str, content_type: str, folder: str = "uploads") -> Tuple[str, str]:
        ext = Path(filename).suffix.lower()
        if not ext:
            ext = ".bin"
        unique_name = f"{uuid.uuid4().hex}{ext}"

        target_folder = self.upload_dir / folder
        target_folder.mkdir(parents=True, exist_ok=True)

        file_path = target_folder / unique_name
        file_path.write_bytes(file_bytes)

        relative_path = f"{folder}/{unique_name}"
        if self.base_url:
            public_url = f"{self.base_url}/{relative_path}"
        else:
            public_url = f"/uploads/{relative_path}"

        return relative_path, public_url

    async def delete_file(self, relative_path: str) -> bool:
        try:
            full_path = self.upload_dir / relative_path
            if full_path.exists():
                full_path.unlink()
                return True
        except Exception:
            pass
        return False
