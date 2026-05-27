"""
Database service for conversation and message operations.
"""

import logging
from typing import List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models import Conversation, Message, ConversationStatus, MessageRole
from datetime import datetime

logger = logging.getLogger(__name__)


class ConversationService:
    """Service for conversation database operations."""
    
    @staticmethod
    async def create_conversation(
        db: AsyncSession,
        title: str,
        model: str = "gpt-4-turbo-preview",
    ) -> Conversation:
        """Create a new conversation."""
        conversation = Conversation(title=title, model=model)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        return conversation
    
    @staticmethod
    async def get_conversation(db: AsyncSession, conversation_id: str) -> Optional[Conversation]:
        """Get conversation by ID."""
        result = await db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def list_conversations(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 50,
        status: ConversationStatus = ConversationStatus.ACTIVE,
    ) -> List[Conversation]:
        """List conversations."""
        result = await db.execute(
            select(Conversation)
            .where(Conversation.status == status)
            .order_by(Conversation.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def update_conversation(
        db: AsyncSession,
        conversation_id: str,
        title: Optional[str] = None,
        model: Optional[str] = None,
    ) -> Optional[Conversation]:
        """Update conversation."""
        conversation = await ConversationService.get_conversation(db, conversation_id)
        if not conversation:
            return None
        
        if title:
            conversation.title = title
        if model:
            conversation.model = model
        
        conversation.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(conversation)
        return conversation
    
    @staticmethod
    async def delete_conversation(db: AsyncSession, conversation_id: str) -> bool:
        """Soft delete conversation."""
        conversation = await ConversationService.get_conversation(db, conversation_id)
        if not conversation:
            return False
        
        conversation.status = ConversationStatus.DELETED
        await db.commit()
        return True
    
    @staticmethod
    async def archive_conversation(db: AsyncSession, conversation_id: str) -> bool:
        """Archive conversation."""
        conversation = await ConversationService.get_conversation(db, conversation_id)
        if not conversation:
            return False
        
        conversation.status = ConversationStatus.ARCHIVED
        await db.commit()
        return True


class MessageService:
    """Service for message database operations."""
    
    @staticmethod
    async def create_message(
        db: AsyncSession,
        conversation_id: str,
        role: MessageRole,
        content: str,
        tokens: int = 0,
    ) -> Message:
        """Create a new message."""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tokens=tokens,
        )
        db.add(message)
        await db.commit()
        await db.refresh(message)
        return message
    
    @staticmethod
    async def get_message(db: AsyncSession, message_id: str) -> Optional[Message]:
        """Get message by ID."""
        result = await db.execute(
            select(Message).where(Message.id == message_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_conversation_messages(
        db: AsyncSession,
        conversation_id: str,
        limit: int = 100,
    ) -> List[Message]:
        """Get all messages for a conversation."""
        result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def delete_message(db: AsyncSession, message_id: str) -> bool:
        """Delete a message."""
        message = await MessageService.get_message(db, message_id)
        if not message:
            return False
        
        await db.delete(message)
        await db.commit()
        return True
    
    @staticmethod
    async def get_conversation_with_messages(
        db: AsyncSession,
        conversation_id: str,
    ) -> Optional[Conversation]:
        """Get conversation with all its messages."""
        result = await db.execute(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .options(selectinload(Conversation.__table__))
        )
        return result.scalar_one_or_none()
