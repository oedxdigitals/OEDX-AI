/**
 * Frontend Types
 */

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface ChatCompletionRequest {
  conversation_id: string;
  message: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  message: Message;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamingResponse {
  event: 'start' | 'token' | 'end' | 'error';
  token?: string;
  message_id?: string;
  error?: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  database: string;
  ai_service: string;
}
