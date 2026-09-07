"""Initial Schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-06 11:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=255), nullable=False),
        sa.Column('legacy_mongo_id', sa.String(length=255), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('legacy_mongo_id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_legacy_mongo_id', 'users', ['legacy_mongo_id'], unique=True)

    op.create_table(
        'enquiries',
        sa.Column('id', sa.String(length=255), nullable=False),
        sa.Column('legacy_mongo_id', sa.String(length=255), nullable=True),
        sa.Column('first_name', sa.String(length=255), nullable=False),
        sa.Column('last_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('program', sa.String(length=255), nullable=False),
        sa.Column('city', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('ip', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('legacy_mongo_id')
    )
    op.create_index('ix_enquiries_legacy_mongo_id', 'enquiries', ['legacy_mongo_id'], unique=True)
    op.create_index('ix_enquiries_timestamp', 'enquiries', ['timestamp'], unique=False)
    op.create_index('idx_enquiries_program', 'enquiries', ['program'], unique=False)

    op.create_table(
        'reviews',
        sa.Column('id', sa.String(length=255), nullable=False),
        sa.Column('legacy_mongo_id', sa.String(length=255), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('role', sa.String(length=100), nullable=False),
        sa.Column('organisation', sa.String(length=255), nullable=False),
        sa.Column('program', sa.String(length=255), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('review', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('ip', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('legacy_mongo_id')
    )
    op.create_index('ix_reviews_legacy_mongo_id', 'reviews', ['legacy_mongo_id'], unique=True)
    op.create_index('idx_reviews_status_timestamp', 'reviews', ['status', 'timestamp'], unique=False)

    op.create_table(
        'events',
        sa.Column('id', sa.String(length=255), nullable=False),
        sa.Column('legacy_mongo_id', sa.String(length=255), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('label', sa.String(length=255), nullable=False),
        sa.Column('page', sa.String(length=255), nullable=False),
        sa.Column('session_id', sa.String(length=255), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), nullable=False),
        sa.Column('ip', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('legacy_mongo_id')
    )
    op.create_index('ix_events_legacy_mongo_id', 'events', ['legacy_mongo_id'], unique=True)
    op.create_index('ix_events_session_id', 'events', ['session_id'], unique=False)
    op.create_index('ix_events_type', 'events', ['type'], unique=False)
    op.create_index('idx_events_type_timestamp', 'events', ['type', 'timestamp'], unique=False)
    op.create_index('idx_events_category_type', 'events', ['category', 'type'], unique=False)

    op.create_table(
        'settings',
        sa.Column('key', sa.String(length=100), nullable=False),
        sa.Column('value', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('key')
    )


def downgrade() -> None:
    op.drop_table('settings')
    op.drop_table('events')
    op.drop_table('reviews')
    op.drop_table('enquiries')
    op.drop_table('users')
