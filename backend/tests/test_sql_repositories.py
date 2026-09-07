import sys
import asyncio
import pytest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from database.connection import AsyncSessionLocal, engine, Base
from database.models import UserModel, EnquiryModel, ReviewModel, EventModel, SettingModel
from database.repositories import (
    UserRepository,
    EnquiryRepository,
    ReviewRepository,
    EventRepository,
    SettingsRepository,
)
from server import hash_password


@pytest.mark.asyncio
async def test_database_flow():
    # 1. Drop and recreate tables cleanly for isolated test run
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    # 2. Test User Repo
    async with AsyncSessionLocal() as session:
        user = await UserRepository.create(session, "testadmin_unique@voktaa.com", hash_password("pass123"), "Test Admin")
        assert user.id is not None
        assert user.email == "testadmin_unique@voktaa.com"

        found = await UserRepository.get_by_email(session, "testadmin_unique@voktaa.com")
        assert found is not None
        assert found.id == user.id

    # 3. Test Enquiry Repo
    async with AsyncSessionLocal() as session:
        enq = await EnquiryRepository.create(session, {
            "first_name": "Raja",
            "last_name": "Sekhar",
            "email": "raja@voktaa.com",
            "phone": "9999999999",
            "program": "CRT",
            "city": "Guntur",
            "message": "Test enquiry",
        })
        assert enq.id is not None
        enquiries = await EnquiryRepository.list_all(session)
        assert len(enquiries) >= 1
        assert enquiries[0]["first_name"] == "Raja"

    # 4. Test Review Repo
    async with AsyncSessionLocal() as session:
        rev = await ReviewRepository.create(session, {
            "name": "Student A",
            "email": "student@voktaa.com",
            "role": "Student",
            "review": "Excellent CRT training course!",
            "rating": 5,
            "status": "approved",
        })
        assert rev.id is not None
        public_reviews = await ReviewRepository.list_public(session)
        assert len(public_reviews) >= 1
        assert public_reviews[0]["name"] == "Student A"

    # 5. Test Event Repo & Analytics
    async with AsyncSessionLocal() as session:
        await EventRepository.create(session, {"type": "visit", "page": "/", "session_id": "sess_101"})
        visits = await EventRepository.count_by_type(session, "visit")
        assert visits >= 1

        daily = await EventRepository.daily_visits_last_14_days(session)
        assert len(daily) == 14

    # 6. Test Settings Repo
    async with AsyncSessionLocal() as session:
        settings = await SettingsRepository.get_settings(session)
        assert settings.get("reviews_visible") is True

        updated = await SettingsRepository.update_settings(session, {"reviews_visible": False})
        assert updated.get("reviews_visible") is False

    print("\n[SUCCESS] ALL SQL REPOSITORY & DATABASE TESTS PASSED!")


if __name__ == "__main__":
    asyncio.run(test_database_flow())
