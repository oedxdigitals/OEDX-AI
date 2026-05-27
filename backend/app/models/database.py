"""
Database models for OEDX AI platform.
"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
import uuid
import enum

Base = declarative_base()


class ConversationStatus(str, enum.Enum):
    """Conversation status enum."""
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"


class MessageRole(str, enum.Enum):
    """Message role enum."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Conversation(Base):
    """Conversation model."""
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    model = Column(String, default="gpt-4-turbo-preview")
    status = Column(Enum(ConversationStatus), default=ConversationStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Conversation {self.id}>"


class Message(Base):
    """Message model."""
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, index=True)
    role = Column(Enum(MessageRole), default=MessageRole.USER)
    content = Column(Text)
    tokens = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    def __repr__(self):
        return f"<Message {self.id}>"


class ChatSession(Base):
    """Chat session tracking."""
    __tablename__ = "chat_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_agent = Column(String)
    ip_address = Column(String)
    started_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<ChatSession {self.id}>"
