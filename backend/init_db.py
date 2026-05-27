"""
Database initialization script for OEDX AI
Run this to manually initialize database tables
"""

import asyncio
from app.db.session import init_db
from app.config import get_settings

async def main():
    print("Initializing OEDX AI Database...")
    settings = get_settings()
    print(f"Database URL: {settings.DATABASE_URL}")
    print(f"Log Level: {settings.LOG_LEVEL}")
    
    await init_db()
    print("✅ Database initialized successfully!")
    print("\nReady to start the application:")
    print("  python run.py")

if __name__ == "__main__":
    asyncio.run(main())
