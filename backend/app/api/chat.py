"""
Chat/Message endpoints with streaming support.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.db_service import ConversationService, MessageService
from app.services.ai_service import get_ai_service
from app.schemas import ChatCompletionRequest, ChatCompletionResponse, MessageResponse
from app.models import MessageRole
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])


async def stream_generator(messages: list, request: ChatCompletionRequest, db: AsyncSession):
    """Generate streaming response."""
    ai_service = get_ai_service()
    
    try:
        # Send start event
        yield f"data: {json.dumps({'event': 'start'})}\n\n"
        
        # Stream completion
        full_response = ""
        async for token in ai_service.stream_completion(
            messages=messages,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        ):
            full_response += token
            # Send token event
            yield f"data: {json.dumps({'event': 'token', 'token': token})}\n\n"
        
        # Save assistant message to database
        tokens = len(full_response) // 4
        assistant_message = await MessageService.create_message(
            db=db,
            conversation_id=request.conversation_id,
            role=MessageRole.ASSISTANT,
            content=full_response,
            tokens=tokens,
        )
        
        # Send end event with message info
        yield f"data: {json.dumps({
            'event': 'end',
            'message_id': assistant_message.id,
        })}\n\n"
        
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        yield f"data: {json.dumps({'event': 'error', 'error': str(e)})}\n\n"


@router.post("/completions/stream")
async def stream_completion(
    request: ChatCompletionRequest,
    db: AsyncSession = Depends(get_db),
):
    """Stream chat completion."""
    try:
        # Validate conversation
        conversation = await ConversationService.get_conversation(db, request.conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        
        # Save user message
        user_message = await MessageService.create_message(
            db=db,
            conversation_id=request.conversation_id,
            role=MessageRole.USER,
            content=request.message,
        )
        
        # Get conversation history
        messages_db = await MessageService.get_conversation_messages(
            db=db,
            conversation_id=request.conversation_id,
        )
        
        # Format messages for API
        messages = [
            {"role": m.role.value, "content": m.content}
            for m in messages_db
        ]
        
        return StreamingResponse(
            stream_generator(messages, request, db),
            media_type="text/event-stream",
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in stream completion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat completion",
        )


@router.post("/completions", response_model=ChatCompletionResponse)
async def get_completion(
    request: ChatCompletionRequest,
    db: AsyncSession = Depends(get_db),
):
    """Get non-streaming chat completion."""
    try:
        # Validate conversation
        conversation = await ConversationService.get_conversation(db, request.conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        
        # Save user message
        user_message = await MessageService.create_message(
            db=db,
            conversation_id=request.conversation_id,
            role=MessageRole.USER,
            content=request.message,
        )
        
        # Get conversation history
        messages_db = await MessageService.get_conversation_messages(
            db=db,
            conversation_id=request.conversation_id,
        )
        
        # Format messages for API
        messages = [
            {"role": m.role.value, "content": m.content}
            for m in messages_db
        ]
        
        # Get completion from AI service
        ai_service = get_ai_service()
        result = await ai_service.get_completion(
            messages=messages,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        
        # Save assistant message
        tokens = result.get("usage", {}).get("completion_tokens", 0)
        assistant_message = await MessageService.create_message(
            db=db,
            conversation_id=request.conversation_id,
            role=MessageRole.ASSISTANT,
            content=result["content"],
            tokens=tokens,
        )
        
        return ChatCompletionResponse(
            id=assistant_message.id,
            message=MessageResponse.from_orm(assistant_message),
            usage=result.get("usage", {}),
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in completion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat completion",
        )
