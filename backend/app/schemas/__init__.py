"""
Pydantic schemas for API requests and responses.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class MessageRoleEnum(str, Enum):
    """Message role enum."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageCreate(BaseModel):
    """Create message schema."""
    content: str = Field(..., min_length=1, max_length=10000)
    role: MessageRoleEnum = MessageRoleEnum.USER


class MessageResponse(BaseModel):
    """Message response schema."""
    id: str
    conversation_id: str
    role: MessageRoleEnum
    content: str
    tokens: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    """Create conversation schema."""
    title: str = Field(..., min_length=1, max_length=200)
    model: str = "gpt-4-turbo-preview"


class ConversationUpdate(BaseModel):
    """Update conversation schema."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    model: Optional[str] = None


class ConversationResponse(BaseModel):
    """Conversation response schema."""
    id: str
    title: str
    model: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ConversationDetailResponse(ConversationResponse):
    """Detailed conversation with messages."""
    messages: List[MessageResponse] = []


class ChatCompletionRequest(BaseModel):
    """Chat completion request."""
    conversation_id: str
    message: str = Field(..., min_length=1, max_length=10000)
    model: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=2000, ge=1, le=4000)


class ChatCompletionResponse(BaseModel):
    """Chat completion response."""
    id: str
    message: MessageResponse
    usage: dict = {}


class StreamingResponse(BaseModel):
    """Streaming response chunk."""
    event: str  # "start", "token", "end", "error"
    data: Optional[str] = None
    message_id: Optional[str] = None
    token: Optional[str] = None
    error: Optional[str] = None


class FileUploadResponse(BaseModel):
    """File upload response."""
    filename: str
    size: int
    url: str
    uploaded_at: datetime


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    timestamp: datetime
    database: str
    ai_service: str
