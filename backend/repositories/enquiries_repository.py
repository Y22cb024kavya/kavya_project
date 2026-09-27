import uuid
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import EnquiryModel
from database.connection import AsyncSessionLocal
from repositories import parse_datetime, format_iso

logger = logging.getLogger("voktaa.repositories.enquiries")


class EnquiryObj:
    def __init__(self, doc_id: str):
        self.id = doc_id


class EnquiryRepository:
    @staticmethod
    async def create(session: Optional[AsyncSession], data: Dict[str, Any], legacy_mongo_id: Optional[str] = None) -> EnquiryObj:
        doc_id = str(uuid.uuid4())
        ts_dt = parse_datetime(data.get("timestamp"))

        enquiry_row = EnquiryModel(
            id=doc_id,
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            program=data.get("program", ""),
            city=data.get("city", ""),
            message=data.get("message", ""),
            timestamp=ts_dt,
            ip=data.get("ip", ""),
            legacy_mongo_id=legacy_mongo_id or None,
        )

        async def _run(s: AsyncSession):
            s.add(enquiry_row)
            await s.flush()
            return EnquiryObj(doc_id)

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            res = await _run(s)
            await s.commit()
            return res

    @staticmethod
    async def list_all(session: Optional[AsyncSession], limit: int = 500) -> List[Dict[str, Any]]:
        async def _run(s: AsyncSession):
            stmt = select(EnquiryModel).order_by(desc(EnquiryModel.timestamp)).limit(limit)
            res = await s.execute(stmt)
            rows = res.scalars().all()
            return [
                {
                    "id": e.id,
                    "first_name": e.first_name,
                    "last_name": e.last_name,
                    "email": e.email,
                    "phone": e.phone,
                    "program": e.program,
                    "city": e.city,
                    "message": e.message,
                    "timestamp": format_iso(e.timestamp) if hasattr(e.timestamp, "isoformat") else str(e.timestamp),
                    "ip": e.ip,
                }
                for e in rows
            ]

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def count_all(session: Optional[AsyncSession]) -> int:
        async def _run(s: AsyncSession):
            stmt = select(func.count(EnquiryModel.id))
            res = await s.execute(stmt)
            return res.scalar_one() or 0

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def program_breakdown(session: Optional[AsyncSession], limit: int = 50) -> List[Dict[str, Any]]:
        async def _run(s: AsyncSession):
            stmt = (
                select(EnquiryModel.program, func.count(EnquiryModel.id).label("cnt"))
                .where(EnquiryModel.program != "")
                .group_by(EnquiryModel.program)
                .order_order_by(desc("cnt"))
                .limit(limit)
            )
            res = await s.execute(stmt)
            return [{"program": prog, "count": cnt} for prog, cnt in res.all()]

        try:
            if session:
                return await _run(session)
            async with AsyncSessionLocal() as s:
                return await _run(s)
        except Exception:
            enquiries = await EnquiryRepository.list_all(session, limit=1000)
            counts: Dict[str, int] = {}
            for e in enquiries:
                prog = (e.get("program") or "").strip()
                if prog:
                    counts[prog] = counts.get(prog, 0) + 1
            sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
            return [{"program": prog, "count": cnt} for prog, cnt in sorted_counts]
