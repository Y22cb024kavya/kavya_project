import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import EventModel
from database.connection import AsyncSessionLocal
from repositories import parse_datetime, format_iso

logger = logging.getLogger("voktaa.repositories.events")


class EventRepository:
    @staticmethod
    async def create(session: Optional[AsyncSession], data: Dict[str, Any], legacy_mongo_id: Optional[str] = None) -> Dict[str, Any]:
        doc_id = str(uuid.uuid4())
        ts_dt = parse_datetime(data.get("timestamp"))

        event_row = EventModel(
            id=doc_id,
            type=data.get("type", "visit"),
            category=data.get("category", ""),
            label=data.get("label", ""),
            page=data.get("page", ""),
            session_id=data.get("session_id", ""),
            timestamp=ts_dt,
            ip=data.get("ip", ""),
            legacy_mongo_id=legacy_mongo_id or None,
        )

        async def _run(s: AsyncSession):
            s.add(event_row)
            await s.flush()
            return {
                "id": doc_id,
                "type": event_row.type,
                "category": event_row.category,
                "label": event_row.label,
                "page": event_row.page,
                "session_id": event_row.session_id,
                "timestamp": format_iso(ts_dt),
                "ip": event_row.ip,
            }

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            res = await _run(s)
            await s.commit()
            return res

    @staticmethod
    async def list_events(session: Optional[AsyncSession], limit: int = 1000) -> List[Dict[str, Any]]:
        async def _run(s: AsyncSession):
            stmt = select(EventModel).order_by(desc(EventModel.timestamp)).limit(limit)
            res = await s.execute(stmt)
            rows = res.scalars().all()
            return [
                {
                    "id": ev.id,
                    "type": ev.type,
                    "category": ev.category,
                    "label": ev.label,
                    "page": ev.page,
                    "session_id": ev.session_id,
                    "timestamp": format_iso(ev.timestamp) if hasattr(ev.timestamp, "isoformat") else str(ev.timestamp),
                    "ip": ev.ip,
                }
                for ev in rows
            ]

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def count_by_type(session: Optional[AsyncSession], event_type: str) -> int:
        async def _run(s: AsyncSession):
            stmt = select(func.count(EventModel.id)).where(EventModel.type == event_type)
            res = await s.execute(stmt)
            return res.scalar_one() or 0

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def count_by_type_category(session: Optional[AsyncSession], event_type: str, category: str) -> int:
        async def _run(s: AsyncSession):
            stmt = select(func.count(EventModel.id)).where(
                EventModel.type == event_type,
                EventModel.category == category,
            )
            res = await s.execute(stmt)
            return res.scalar_one() or 0

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def distinct_session_visitors(session: Optional[AsyncSession]) -> int:
        events = await EventRepository.list_events(session, limit=1000)
        sessions = {ev["session_id"] for ev in events if ev.get("type") == "visit" and ev.get("session_id")}
        return len(sessions)

    @staticmethod
    async def click_label_breakdown(session: Optional[AsyncSession], limit: int = 50) -> List[Dict[str, Any]]:
        events = await EventRepository.list_events(session, limit=1000)
        counts: Dict[str, int] = {}
        for ev in events:
            if ev.get("type") == "click" and ev.get("category") == "program":
                lbl = (ev.get("label") or "").strip()
                if lbl:
                    counts[lbl] = counts.get(lbl, 0) + 1
        sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
        return [{"program": lbl, "count": cnt} for lbl, cnt in sorted_counts]

    @staticmethod
    async def page_view_breakdown(session: Optional[AsyncSession], limit: int = 50) -> List[Dict[str, Any]]:
        events = await EventRepository.list_events(session, limit=1000)
        counts: Dict[str, int] = {}
        for ev in events:
            if ev.get("type") == "visit":
                page = (ev.get("page") or "/").strip()
                counts[page] = counts.get(page, 0) + 1
        sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:limit]
        return [{"page": page, "count": cnt} for page, cnt in sorted_counts]

    @staticmethod
    async def daily_visits_last_14_days(session: Optional[AsyncSession]) -> List[Dict[str, Any]]:
        events = await EventRepository.list_events(session, limit=2000)
        today = datetime.now(timezone.utc).date()
        days = []
        for i in range(13, -1, -1):
            d = today - timedelta(days=i)
            day_str = d.strftime("%b %d")
            count = 0
            for ev in events:
                if ev.get("type") == "visit":
                    ev_dt = parse_datetime(ev.get("timestamp"))
                    if ev_dt.date() == d:
                        count += 1
            days.append({"date": day_str, "visits": count})
        return days
