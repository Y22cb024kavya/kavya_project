import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column
from database.connection import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(255), primary_key=True, default=generate_uuid)
    legacy_mongo_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="Admin")
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="admin")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now)


class EnquiryModel(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(255), primary_key=True, default=generate_uuid)
    legacy_mongo_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    program: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    city: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    message: Mapped[str] = mapped_column(Text, nullable=False, default="")
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now, index=True)
    ip: Mapped[str] = mapped_column(String(50), nullable=False, default="")

    __table_args__ = (
        Index("idx_enquiries_program", "program"),
    )


class ReviewModel(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(255), primary_key=True, default=generate_uuid)
    legacy_mongo_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    role: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    organisation: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    program: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    rating: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    review: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="approved")
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now)
    ip: Mapped[str] = mapped_column(String(50), nullable=False, default="")

    __table_args__ = (
        Index("idx_reviews_status_timestamp", "status", "timestamp"),
    )


class EventModel(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(255), primary_key=True, default=generate_uuid)
    legacy_mongo_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    label: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    page: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    session_id: Mapped[str] = mapped_column(String(255), nullable=False, default="", index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now, index=True)
    ip: Mapped[str] = mapped_column(String(50), nullable=False, default="")

    __table_args__ = (
        Index("idx_events_type_timestamp", "type", "timestamp"),
        Index("idx_events_category_type", "category", "type"),
    )


class SettingModel(Base):
    __tablename__ = "settings"

    key: Mapped[str] = mapped_column(String(100), primary_key=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
