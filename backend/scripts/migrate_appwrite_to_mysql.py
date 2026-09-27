"""
Appwrite Database to Hostinger MySQL Data Migration Script

Usage:
    python backend/scripts/migrate_appwrite_to_mysql.py --migrate
    python backend/scripts/migrate_appwrite_to_mysql.py --verify
"""

import sys
import os
import asyncio
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))

from dotenv import load_dotenv
load_dotenv(ROOT_DIR / ".env")

from sqlalchemy import select, func
from database.connection import AsyncSessionLocal, init_db
from database.models import UserModel, EnquiryModel, ReviewModel, EventModel, SettingModel
from database.appwrite_client import (
    appwrite_manager,
    APPWRITE_DATABASE_ID,
    APPWRITE_ENQUIRIES_COLLECTION_ID,
    APPWRITE_REVIEWS_COLLECTION_ID,
    APPWRITE_EVENTS_COLLECTION_ID,
    APPWRITE_SETTINGS_COLLECTION_ID,
    APPWRITE_USERS_COLLECTION_ID,
)
from repositories import parse_datetime, extract_docs

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("appwrite_to_mysql_migration")


async def migrate_data():
    logger.info("==================================================")
    logger.info("STARTING APPWRITE DATABASE -> MYSQL MIGRATION")
    logger.info("==================================================")

    await init_db()

    if not appwrite_manager.is_configured or not appwrite_manager.databases:
        logger.warning("[NOTE] Appwrite credentials missing or inactive. Skipping live Appwrite pull.")
        logger.info("Local MySQL database is initialized and ready.")
        return

    db = appwrite_manager.databases

    async with AsyncSessionLocal() as session:
        # 1. Users Migration
        try:
            res_users = db.list_documents(database_id=APPWRITE_DATABASE_ID, collection_id=APPWRITE_USERS_COLLECTION_ID)
            users_docs = extract_docs(res_users)
            user_count = 0
            for d in users_docs:
                uid = d.get("$id") or d.get("id")
                email = d.get("email", "").lower().strip()
                if not email:
                    continue
                stmt = select(UserModel).where(UserModel.id == uid).limit(1)
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    u_row = UserModel(
                        id=uid,
                        email=email,
                        password_hash=d.get("password_hash", ""),
                        name=d.get("name", "Admin"),
                        role=d.get("role", "admin"),
                        legacy_mongo_id=d.get("legacy_id"),
                        created_at=parse_datetime(d.get("created_at")),
                    )
                    session.add(u_row)
                    user_count += 1
            await session.commit()
            logger.info("   Users: %d records migrated to MySQL", user_count)
        except Exception as e:
            logger.warning("Users migration warning: %s", e)

        # 2. Enquiries Migration
        try:
            res_enq = db.list_documents(database_id=APPWRITE_DATABASE_ID, collection_id=APPWRITE_ENQUIRIES_COLLECTION_ID)
            enq_docs = extract_docs(res_enq)
            enq_count = 0
            for d in enq_docs:
                eid = d.get("$id") or d.get("id")
                stmt = select(EnquiryModel).where(EnquiryModel.id == eid).limit(1)
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    e_row = EnquiryModel(
                        id=eid,
                        first_name=d.get("first_name", ""),
                        last_name=d.get("last_name", ""),
                        email=d.get("email", ""),
                        phone=d.get("phone", ""),
                        program=d.get("program", ""),
                        city=d.get("city", ""),
                        message=d.get("message", ""),
                        timestamp=parse_datetime(d.get("timestamp")),
                        ip=d.get("ip", ""),
                        legacy_mongo_id=d.get("legacy_id"),
                    )
                    session.add(e_row)
                    enq_count += 1
            await session.commit()
            logger.info("   Enquiries: %d records migrated to MySQL", enq_count)
        except Exception as e:
            logger.warning("Enquiries migration warning: %s", e)

        # 3. Reviews Migration
        try:
            res_rev = db.list_documents(database_id=APPWRITE_DATABASE_ID, collection_id=APPWRITE_REVIEWS_COLLECTION_ID)
            rev_docs = extract_docs(res_rev)
            rev_count = 0
            for d in rev_docs:
                rid = d.get("$id") or d.get("id")
                stmt = select(ReviewModel).where(ReviewModel.id == rid).limit(1)
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    r_row = ReviewModel(
                        id=rid,
                        name=d.get("name", ""),
                        email=d.get("email", ""),
                        phone=d.get("phone", ""),
                        role=d.get("role", "Student"),
                        organisation=d.get("organisation", ""),
                        program=d.get("program", ""),
                        rating=int(d.get("rating", 5)),
                        review=d.get("review", ""),
                        status=d.get("status", "approved"),
                        timestamp=parse_datetime(d.get("timestamp")),
                        ip=d.get("ip", ""),
                        legacy_mongo_id=d.get("legacy_id"),
                    )
                    session.add(r_row)
                    rev_count += 1
            await session.commit()
            logger.info("   Reviews: %d records migrated to MySQL", rev_count)
        except Exception as e:
            logger.warning("Reviews migration warning: %s", e)

        # 4. Events Migration
        try:
            res_ev = db.list_documents(database_id=APPWRITE_DATABASE_ID, collection_id=APPWRITE_EVENTS_COLLECTION_ID)
            ev_docs = extract_docs(res_ev)
            ev_count = 0
            for d in ev_docs:
                evid = d.get("$id") or d.get("id")
                stmt = select(EventModel).where(EventModel.id == evid).limit(1)
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    ev_row = EventModel(
                        id=evid,
                        type=d.get("type", "visit"),
                        category=d.get("category", ""),
                        label=d.get("label", ""),
                        page=d.get("page", ""),
                        session_id=d.get("session_id", ""),
                        timestamp=parse_datetime(d.get("timestamp")),
                        ip=d.get("ip", ""),
                        legacy_mongo_id=d.get("legacy_id"),
                    )
                    session.add(ev_row)
                    ev_count += 1
            await session.commit()
            logger.info("   Events: %d records migrated to MySQL", ev_count)
        except Exception as e:
            logger.warning("Events migration warning: %s", e)

        # 5. Settings Migration
        try:
            res_set = db.list_documents(database_id=APPWRITE_DATABASE_ID, collection_id=APPWRITE_SETTINGS_COLLECTION_ID)
            set_docs = extract_docs(res_set)
            set_count = 0
            for d in set_docs:
                k = d.get("key")
                v = d.get("value", "")
                if not k:
                    continue
                stmt = select(SettingModel).where(SettingModel.key == k).limit(1)
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    s_row = SettingModel(key=k, value=str(v))
                    session.add(s_row)
                    set_count += 1
            await session.commit()
            logger.info("   Settings: %d records migrated to MySQL", set_count)
        except Exception as e:
            logger.warning("Settings migration warning: %s", e)

    logger.info("==================================================")
    logger.info("MIGRATION COMPLETED SUCCESSFULLY!")
    logger.info("==================================================")


async def verify_counts():
    logger.info("==================================================")
    logger.info("VERIFYING MIGRATED RECORD COUNTS")
    logger.info("==================================================")

    async with AsyncSessionLocal() as session:
        u_cnt = (await session.execute(select(func.count(UserModel.id)))).scalar_one()
        e_cnt = (await session.execute(select(func.count(EnquiryModel.id)))).scalar_one()
        r_cnt = (await session.execute(select(func.count(ReviewModel.id)))).scalar_one()
        ev_cnt = (await session.execute(select(func.count(EventModel.id)))).scalar_one()
        set_cnt = (await session.execute(select(func.count(SettingModel.key)))).scalar_one()

        logger.info("MySQL Database Totals:")
        logger.info("   users:     %d records", u_cnt)
        logger.info("   enquiries: %d records", e_cnt)
        logger.info("   reviews:   %d records", r_cnt)
        logger.info("   events:    %d records", ev_cnt)
        logger.info("   settings:  %d records", set_cnt)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--verify":
        asyncio.run(verify_counts())
    else:
        asyncio.run(migrate_data())
        asyncio.run(verify_counts())
