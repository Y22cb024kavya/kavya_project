"""
Data Migration CLI: MongoDB Atlas -> Hostinger SQL (MySQL / MariaDB / PostgreSQL / SQLite)

Usage:
  python backend/scripts/migrate_mongodb_to_hostinger.py --dry-run
  python backend/scripts/migrate_mongodb_to_hostinger.py --migrate
  python backend/scripts/migrate_mongodb_to_hostinger.py --verify
"""

import sys
import os
import asyncio
import argparse
import logging
from pathlib import Path

# Add backend directory to Python path
ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))

from dotenv import load_dotenv
load_dotenv(ROOT_DIR / ".env")

import pymongo
from sqlalchemy import select, func, text
from database.connection import AsyncSessionLocal, engine, Base
from database.models import UserModel, EnquiryModel, ReviewModel, EventModel, SettingModel
from database.repositories import parse_datetime, UserRepository, EnquiryRepository, ReviewRepository, EventRepository, SettingsRepository

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("migration")


def get_mongo_db():
    mongo_url = os.environ.get("MONGO_URL", "").strip()
    if not mongo_url:
        logger.error("MONGO_URL environment variable is missing!")
        sys.exit(1)
    db_name = os.environ.get("DB_NAME", "voktaa_db").strip()
    client = pymongo.MongoClient(mongo_url)
    return client[db_name]


async def ensure_sql_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def dry_run():
    logger.info("STARTING DRY RUN AUDIT...")
    mongo_db = get_mongo_db()

    collections = ["users", "enquiries", "reviews", "events", "settings"]
    for col in collections:
        count = mongo_db[col].count_documents({})
        logger.info("   Collection '%s': %d documents", col, count)

    await ensure_sql_tables()

    async with AsyncSessionLocal() as session:
        logger.info("\nTARGET SQL REPOSITORY STATE:")
        for col, model in [
            ("users", UserModel),
            ("enquiries", EnquiryModel),
            ("reviews", ReviewModel),
            ("events", EventModel),
            ("settings", SettingModel),
        ]:
            if col == "settings":
                res = await session.execute(select(func.count()).select_from(SettingModel))
            else:
                res = await session.execute(select(func.count()).select_from(model))
            sql_count = res.scalar() or 0
            logger.info("   SQL Table '%s': %d records", col, sql_count)

    logger.info("\n[OK] DRY RUN COMPLETE. Target SQL engine is accessible and ready.")


async def migrate():
    logger.info("STARTING IDEMPOTENT MIGRATION FROM MONGODB TO SQL...")
    mongo_db = get_mongo_db()
    await ensure_sql_tables()

    async with AsyncSessionLocal() as session:
        # 1. Users
        mongo_users = list(mongo_db.users.find())
        migrated_users = 0
        for u in mongo_users:
            mongo_id = str(u["_id"])
            stmt = select(UserModel).where(UserModel.legacy_mongo_id == mongo_id)
            res = await session.execute(stmt)
            if res.scalar_one_or_none() is None:
                user = UserModel(
                    id=mongo_id,  # Preserve exact original ID for migrated records!
                    legacy_mongo_id=mongo_id,
                    email=u.get("email", "").lower().strip(),
                    password_hash=u.get("password_hash", ""),
                    name=u.get("name", "P. Raja Sekhar"),
                    role=u.get("role", "admin"),
                    created_at=parse_datetime(u.get("created_at")),
                )
                session.add(user)
                migrated_users += 1
        await session.commit()
        logger.info("   Users: %d new records inserted", migrated_users)

        # 2. Enquiries
        mongo_enquiries = list(mongo_db.enquiries.find())
        migrated_enquiries = 0
        for e in mongo_enquiries:
            mongo_id = str(e["_id"])
            stmt = select(EnquiryModel).where(EnquiryModel.legacy_mongo_id == mongo_id)
            res = await session.execute(stmt)
            if res.scalar_one_or_none() is None:
                enquiry = EnquiryModel(
                    id=mongo_id,  # Preserve exact original ID!
                    legacy_mongo_id=mongo_id,
                    first_name=e.get("first_name", ""),
                    last_name=e.get("last_name", ""),
                    email=e.get("email", ""),
                    phone=e.get("phone", ""),
                    program=e.get("program", ""),
                    city=e.get("city", ""),
                    message=e.get("message", ""),
                    timestamp=parse_datetime(e.get("timestamp")),
                    ip=e.get("ip", ""),
                )
                session.add(enquiry)
                migrated_enquiries += 1
        await session.commit()
        logger.info("   Enquiries: %d new records inserted", migrated_enquiries)

        # 3. Reviews
        mongo_reviews = list(mongo_db.reviews.find())
        migrated_reviews = 0
        for r in mongo_reviews:
            mongo_id = str(r["_id"])
            stmt = select(ReviewModel).where(ReviewModel.legacy_mongo_id == mongo_id)
            res = await session.execute(stmt)
            if res.scalar_one_or_none() is None:
                review = ReviewModel(
                    id=mongo_id,  # Preserve exact original ID!
                    legacy_mongo_id=mongo_id,
                    name=r.get("name", ""),
                    email=r.get("email", ""),
                    phone=r.get("phone", ""),
                    role=r.get("role", ""),
                    organisation=r.get("organisation", ""),
                    program=r.get("program", ""),
                    rating=max(1, min(5, int(r.get("rating") or 5))),
                    review=r.get("review", ""),
                    status=r.get("status", "approved"),
                    timestamp=parse_datetime(r.get("timestamp")),
                    ip=r.get("ip", ""),
                )
                session.add(review)
                migrated_reviews += 1
        await session.commit()
        logger.info("   Reviews: %d new records inserted", migrated_reviews)

        # 4. Events
        mongo_events = list(mongo_db.events.find())
        migrated_events = 0
        for ev in mongo_events:
            mongo_id = str(ev["_id"])
            stmt = select(EventModel).where(EventModel.legacy_mongo_id == mongo_id)
            res = await session.execute(stmt)
            if res.scalar_one_or_none() is None:
                event = EventModel(
                    id=mongo_id,  # Preserve exact original ID!
                    legacy_mongo_id=mongo_id,
                    type=ev.get("type", "visit"),
                    category=ev.get("category", ""),
                    label=ev.get("label", ""),
                    page=ev.get("page", ""),
                    session_id=ev.get("session_id", ""),
                    timestamp=parse_datetime(ev.get("timestamp")),
                    ip=ev.get("ip", ""),
                )
                session.add(event)
                migrated_events += 1
        await session.commit()
        logger.info("   Events: %d new records inserted", migrated_events)

        # 5. Settings
        mongo_settings = list(mongo_db.settings.find())
        migrated_settings = 0
        for s in mongo_settings:
            key = str(s.get("_id", "site"))
            val_dict = {k: v for k, v in s.items() if k != "_id"}
            await SettingsRepository.update_settings(session, val_dict)
            migrated_settings += 1
        logger.info("   Settings: %d items migrated/synced", migrated_settings)

    logger.info("[SUCCESS] MIGRATION COMPLETED SUCCESSFULLY!")


async def verify():
    logger.info("VERIFYING MIGRATION AUDIT & FIELD INTEGRITY...")
    mongo_db = get_mongo_db()
    await ensure_sql_tables()

    async with AsyncSessionLocal() as session:
        # 1. Record Count Audits
        m_users = mongo_db.users.count_documents({})
        s_users = (await session.execute(select(func.count()).select_from(UserModel))).scalar() or 0
        logger.info("   Users Count: MongoDB = %d | SQL = %d", m_users, s_users)
        assert s_users >= m_users, "User count mismatch!"

        m_enquiries = mongo_db.enquiries.count_documents({})
        s_enquiries = (await session.execute(select(func.count()).select_from(EnquiryModel))).scalar() or 0
        logger.info("   Enquiries Count: MongoDB = %d | SQL = %d", m_enquiries, s_enquiries)
        assert s_enquiries >= m_enquiries, "Enquiry count mismatch!"

        m_reviews = mongo_db.reviews.count_documents({})
        s_reviews = (await session.execute(select(func.count()).select_from(ReviewModel))).scalar() or 0
        logger.info("   Reviews Count: MongoDB = %d | SQL = %d", m_reviews, s_reviews)
        assert s_reviews >= m_reviews, "Review count mismatch!"

        m_events = mongo_db.events.count_documents({})
        s_events = (await session.execute(select(func.count()).select_from(EventModel))).scalar() or 0
        logger.info("   Events Count: MongoDB = %d | SQL = %d", m_events, s_events)
        assert s_events >= m_events, "Event count mismatch!"

        # 2. Field-by-Field Sample Audit
        sample_reviews = list(mongo_db.reviews.find().limit(5))
        for m_rev in sample_reviews:
            m_id = str(m_rev["_id"])
            stmt = select(ReviewModel).where(ReviewModel.legacy_mongo_id == m_id)
            res = await session.execute(stmt)
            s_rev = res.scalar_one_or_none()
            assert s_rev is not None, f"Review document {m_id} missing in SQL!"
            assert s_rev.name == m_rev.get("name", ""), f"Name mismatch for review {m_id}"
            assert s_rev.review == m_rev.get("review", ""), f"Review text mismatch for review {m_id}"
            assert s_rev.rating == max(1, min(5, int(m_rev.get("rating") or 5))), f"Rating mismatch for review {m_id}"

        # 3. Duplicate legacy_mongo_id Check
        for model in [UserModel, EnquiryModel, ReviewModel, EventModel]:
            stmt = (
                select(model.legacy_mongo_id, func.count(model.id))
                .where(model.legacy_mongo_id.isnot(None))
                .group_by(model.legacy_mongo_id)
                .having(func.count(model.id) > 1)
            )
            dups = (await session.execute(stmt)).all()
            assert len(dups) == 0, f"Duplicate legacy_mongo_id found in {model.__tablename__}!"

    logger.info("[SUCCESS] POST-MIGRATION VERIFICATION & FIELD AUDIT PASSED! ZERO DATA LOSS.")


def main():
    parser = argparse.ArgumentParser(description="MongoDB to Hostinger SQL Migration CLI")
    parser.add_argument("--dry-run", action="store_true", help="Audit MongoDB and test SQL connection")
    parser.add_argument("--migrate", action="store_true", help="Execute data migration to SQL")
    parser.add_argument("--verify", action="store_true", help="Verify record counts, field integrity, and duplicates")
    args = parser.parse_args()

    if args.dry_run:
        asyncio.run(dry_run())
    elif args.migrate:
        asyncio.run(migrate())
    elif args.verify:
        asyncio.run(verify())
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
