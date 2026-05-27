"""
AI Service for handling OpenAI API interactions.
"""

import logging
from typing import AsyncGenerator, Optional
from openai import AsyncOpenAI, OpenAI
from app.config import get_settings
import json

logger = logging.getLogger(__name__)
settings = get_settings()


class AIService:
    """Service for AI operations with streaming support."""
    
    def __init__(self):
        """Initialize AI service with OpenAI client."""
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not configured")
        
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        
    async def stream_completion(
        self,
        messages: list,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> AsyncGenerator[str, None]:
        """
        Stream completion from OpenAI API.
        
        Args:
            messages: List of message dicts with role and content
            model: Model to use (defaults to configured model)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Yields:
            Token strings as they arrive from the API
        """
        try:
            model = model or self.model
            
            stream = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"Streaming completion error: {e}")
            raise
    
    async def get_completion(
        self,
        messages: list,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> dict:
        """
        Get non-streaming completion from OpenAI API.
        
        Args:
            messages: List of message dicts
            model: Model to use
            temperature: Sampling temperature
            max_tokens: Maximum tokens
            
        Returns:
            Completion response dict
        """
        try:
            model = model or self.model
            
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            return {
                "content": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                },
            }
        except Exception as e:
            logger.error(f"Completion error: {e}")
            raise
    
    async def count_tokens(self, text: str) -> int:
        """
        Estimate token count for text.
        Rough estimation: ~4 chars per token
        """
        return len(text) // 4


# Global AI service instance
_ai_service: Optional[AIService] = None


def get_ai_service() -> AIService:
    """Get or create AI service instance."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
