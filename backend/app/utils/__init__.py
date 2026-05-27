"""
Utility functions.
"""

import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


def create_upload_directory():
    """Create upload directory if it doesn't exist."""
    from app.config import get_settings
    settings = get_settings()
    
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(exist_ok=True)
    logger.info(f"Upload directory ready: {upload_dir}")


def setup_logging(log_level: str = "INFO"):
    """Setup logging configuration."""
    logging.basicConfig(
        level=getattr(logging, log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    )
