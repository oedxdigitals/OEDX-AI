"""
Health check and info endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.db.session import get_db
from app.config import get_settings
from app.schemas import HealthResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["health"])

settings = get_settings()


@router.get("/health", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint."""
    try:
        # Test database connection
        await db.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "unhealthy"
    
    try:
        from app.services.ai_service import get_ai_service
        get_ai_service()
        ai_status = "healthy"
    except Exception as e:
        logger.error(f"AI service health check failed: {e}")
        ai_status = "unhealthy"
    
    return HealthResponse(
        status="healthy" if db_status == "healthy" else "degraded",
        version=settings.VERSION,
        timestamp=datetime.utcnow(),
        database=db_status,
        ai_service=ai_status,
    )


@router.get("/info")
async def get_info():
    """Get API information."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "api_version": "1.0.0",
    }
