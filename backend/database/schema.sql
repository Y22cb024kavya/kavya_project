-- ============================================================
-- VOKTAA Solutions Production MySQL Database Schema
-- Compatible with Hostinger MySQL / MariaDB / phpMyAdmin
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Note: Select target database (u832178669_voktaaProdu) in phpMyAdmin before importing.
-- ============================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    legacy_mongo_id VARCHAR(255) DEFAULT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Admin',
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at DATETIME NOT NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_legacy (legacy_mongo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Student & Demo Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(255) PRIMARY KEY,
    legacy_mongo_id VARCHAR(255) DEFAULT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL DEFAULT '',
    last_name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    program VARCHAR(255) NOT NULL DEFAULT '',
    city VARCHAR(255) NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    ip VARCHAR(50) NOT NULL DEFAULT '',
    INDEX idx_enquiries_timestamp (timestamp),
    INDEX idx_enquiries_program (program),
    INDEX idx_enquiries_legacy (legacy_mongo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Student & Partner Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(255) PRIMARY KEY,
    legacy_mongo_id VARCHAR(255) DEFAULT NULL UNIQUE,
    name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    role VARCHAR(100) NOT NULL DEFAULT '',
    organisation VARCHAR(255) NOT NULL DEFAULT '',
    program VARCHAR(255) NOT NULL DEFAULT '',
    rating INT NOT NULL DEFAULT 5,
    review TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'approved',
    timestamp DATETIME NOT NULL,
    ip VARCHAR(50) NOT NULL DEFAULT '',
    INDEX idx_reviews_status (status),
    INDEX idx_reviews_timestamp (timestamp),
    INDEX idx_reviews_status_timestamp (status, timestamp),
    INDEX idx_reviews_legacy (legacy_mongo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Site Analytics & Tracking Events Table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(255) PRIMARY KEY,
    legacy_mongo_id VARCHAR(255) DEFAULT NULL UNIQUE,
    type VARCHAR(50) NOT NULL DEFAULT 'visit',
    category VARCHAR(100) NOT NULL DEFAULT '',
    label VARCHAR(255) NOT NULL DEFAULT '',
    page VARCHAR(255) NOT NULL DEFAULT '',
    session_id VARCHAR(255) NOT NULL DEFAULT '',
    timestamp DATETIME NOT NULL,
    ip VARCHAR(50) NOT NULL DEFAULT '',
    INDEX idx_events_type (type),
    INDEX idx_events_session_id (session_id),
    INDEX idx_events_timestamp (timestamp),
    INDEX idx_events_type_timestamp (type, timestamp),
    INDEX idx_events_category_type (category, type),
    INDEX idx_events_legacy (legacy_mongo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Site Settings Table
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT NOT NULL,
    INDEX idx_settings_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
