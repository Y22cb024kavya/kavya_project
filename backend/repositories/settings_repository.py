import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import SettingModel
from database.connection import AsyncSessionLocal

logger = logging.getLogger("voktaa.repositories.settings")

DEFAULT_SETTINGS = {"reviews_visible": True}


class SettingsRepository:
    @staticmethod
    async def get_settings(session: Optional[AsyncSession] = None) -> Dict[str, Any]:
        async def _run(s: AsyncSession):
            stmt = select(SettingModel)
            res = await s.execute(stmt)
            rows = res.scalars().all()
            out = dict(DEFAULT_SETTINGS)
            for d in rows:
                k = d.key
                v_raw = d.value
                if k:
                    try:
                        out[k] = json.loads(v_raw)
                    except Exception:
                        out[k] = v_raw
            return out

        if session:
            return await _run(session)
        async with AsyncSessionLocal() as s:
            return await _run(s)

    @staticmethod
    async def update_settings(session: Optional[AsyncSession] = None, settings_dict: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if not settings_dict:
            return await SettingsRepository.get_settings(session)

        async def _run(s: AsyncSession):
            for k, v in settings_dict.items():
                if k in DEFAULT_SETTINGS:
                    val_json = json.dumps(v)
                    stmt = select(SettingModel).where(SettingModel.key == k).limit(1)
                    res = await s.execute(stmt)
                    existing = res.scalar_one_or_none()
                    if existing:
                        existing.value = val_json
                    else:
                        new_setting = SettingModel(key=k, value=val_json)
                        s.add(new_setting)

        if session:
            await _run(session)
            return await SettingsRepository.get_settings(session)

        async with AsyncSessionLocal() as s:
            await _run(s)
            await s.commit()
            return await SettingsRepository.get_settings(s)
