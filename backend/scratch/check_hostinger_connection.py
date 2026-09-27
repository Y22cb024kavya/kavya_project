import sys
import os
import asyncio
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_USER = os.environ.get("DB_USER", "")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "")

from urllib.parse import quote_plus

async def test_conn():
    encoded_pw = quote_plus(DB_PASSWORD)
    url = f"mysql+aiomysql://{DB_USER}:{encoded_pw}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    print(f"Connecting to MySQL: mysql+aiomysql://{DB_USER}:***@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    try:
        engine = create_async_engine(url, echo=False)
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT 1"))
            val = res.scalar()
            print("Successfully connected to MySQL! SELECT 1 returned:", val)
            
            # Check tables
            tables_res = await conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in tables_res.all()]
            print("Existing tables in database:", tables)
        await engine.dispose()
    except Exception as e:
        print("Connection Exception:", type(e), e)

if __name__ == "__main__":
    asyncio.run(test_conn())
