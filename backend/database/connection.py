import logging
from typing import AsyncGenerator

logger = logging.getLogger("voktaa.connection")


class DummySession:
    """Lightweight session placeholder for Appwrite repository pattern compatibility."""
    async def close(self):
        pass


async def get_db() -> AsyncGenerator[DummySession, None]:
    session = DummySession()
    try:
        yield session
    finally:
        await session.close()


AsyncSessionLocal = get_db
