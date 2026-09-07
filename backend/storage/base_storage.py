from abc import ABC, abstractmethod
from typing import Tuple


class BaseStorageProvider(ABC):
    @abstractmethod
    async def save_file(self, file_bytes: bytes, filename: str, content_type: str, folder: str = "uploads") -> Tuple[str, str]:
        """
        Saves a file and returns (relative_path, public_url).
        """
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """
        Deletes a file by relative path or key. Returns True if successfully deleted.
        """
        pass
