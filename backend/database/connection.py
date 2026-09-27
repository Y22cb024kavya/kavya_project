import os
import logging
from typing import AsyncGenerator
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")

logger = logging.getLogger("voktaa.database.connection")

DB_HOST = os.environ.get("DB_HOST", "").strip()
DB_PORT = os.environ.get("DB_PORT", "3306").strip()
DB_USER = os.environ.get("DB_USER", "").strip()
DB_PASSWORD = os.environ.get("DB_PASSWORD", "").strip()
DB_NAME = os.environ.get("DB_NAME", "").strip()

from urllib.parse import quote_plus

if DB_HOST and DB_USER and DB_NAME:
    encoded_password = quote_plus(DB_PASSWORD)
    DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    DB_PROVIDER = "mysql"
    logger.info("🟢 Hostinger MySQL Database configured (Host: %s | DB: %s)", DB_HOST, DB_NAME)
else:
    LOCAL_DB_PATH = ROOT_DIR / "data" / "voktaa_app.db"
    os.makedirs(LOCAL_DB_PATH.parent, exist_ok=True)
    DATABASE_URL = f"sqlite+aiosqlite:///{LOCAL_DB_PATH}"
    DB_PROVIDER = "sqlite"
    logger.info("ℹ️ Local SQLite Database mode fallback active (%s)", LOCAL_DB_PATH)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI async session dependency yielding a real SQLAlchemy session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Idempotently create tables if missing."""
    async with engine.begin() as conn:
        from database.models import Base as ModelsBase
        await conn.run_sync(ModelsBase.metadata.create_all)
