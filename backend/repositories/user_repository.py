import uuid
import logging
from typing import Optional, Any
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import UserModel
from database.connection import AsyncSessionLocal
from repositories import parse_datetime, format_iso, now_iso

logger = logging.getLogger("voktaa.repositories.user")


class UserObj:
    def __init__(self, doc_id: str, email: str, password_hash: str, name: str = "Admin", role: str = "admin", legacy_id: Optional[str] = None, created_at: Optional[str] = None):
        self.id = doc_id
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.role = role
        self.legacy_id = legacy_id
        self.created_at = created_at or now_iso()


class UserRepository:
    @staticmethod
    async def get_by_email(session: Optional[AsyncSession], email: str) -> Optional[UserObj]:
        clean_email = email.lower().strip()
        async def _run(s: AsyncSession):
            stmt = select(UserModel).where(UserModel.email == clean_email).limit(1)
            res = await s.execute(stmt)
            u = res.scalar_one_or_none()
            if u:
                created_str = format_iso(u.created_at) if hasattr(u.created_at, "isoformat") else str(u.created_at or "")
                return UserObj(
                    doc_id=u.id,
                    email=u.email,
                    password_hash=u.password_hash,
                    name=u.name,
                    role=u.role,
                    legacy_id=u.legacy_mongo_id,
                    created_at=created_str,
                )
            return None

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def get_by_id(session: Optional[AsyncSession], user_id: str) -> Optional[UserObj]:
        async def _run(s: AsyncSession):
            stmt = select(UserModel).where(UserModel.id == user_id).limit(1)
            res = await s.execute(stmt)
            u = res.scalar_one_or_none()
            if u:
                created_str = format_iso(u.created_at) if hasattr(u.created_at, "isoformat") else str(u.created_at or "")
                return UserObj(
                    doc_id=u.id,
                    email=u.email,
                    password_hash=u.password_hash,
                    name=u.name,
                    role=u.role,
                    legacy_id=u.legacy_mongo_id,
                    created_at=created_str,
                )
            return None

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def create(session: Optional[AsyncSession], email: str, password_hash: str, name: str = "Admin", role: str = "admin", legacy_mongo_id: Optional[str] = None) -> UserObj:
        clean_email = email.lower().strip()
        doc_id = str(uuid.uuid4())
        created_dt = parse_datetime(now_iso())

        user_row = UserModel(
            id=doc_id,
            email=clean_email,
            password_hash=password_hash,
            name=name,
            role=role,
            legacy_mongo_id=legacy_mongo_id or None,
            created_at=created_dt,
        )

        async def _run(s: AsyncSession):
            s.add(user_row)
            await s.flush()
            return UserObj(
                doc_id=doc_id,
                email=clean_email,
                password_hash=password_hash,
                name=name,
                role=role,
                legacy_id=legacy_mongo_id,
                created_at=format_iso(created_dt),
            )

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            res = await _run(s)
            await s.commit()
            return res

    @staticmethod
    async def update_password(session: Optional[AsyncSession], email: str, new_password_hash: str) -> None:
        clean_email = email.lower().strip()
        async def _run(s: AsyncSession):
            stmt = update(UserModel).where(UserModel.email == clean_email).values(password_hash=new_password_hash)
            await s.execute(stmt)

        if session:
            await _run(session)
        else:
            async with AsyncSessionLocal() as s:
                await _run(s)
                await s.commit()
