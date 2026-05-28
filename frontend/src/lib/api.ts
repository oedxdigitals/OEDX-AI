/**
 * API Utility for Backend Communication
 */

import axios, { AxiosInstance } from 'axios';
import { Message, Conversation, ConversationDetail, StreamingResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || ''
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        throw error;
      }
    );
  }

  // Health & Info
  async getHealth() {
    const response = await this.client.get('/api/health');
    return response.data;
  }

  async getInfo() {
    const response = await this.client.get('/api/info');
    return response.data;
  }

  // Conversations
  async createConversation(title: string, model: string = 'gpt-4-turbo-preview') {
    const response = await this.client.post('/api/conversations', {
      title,
      model,
    });
    return response.data as Conversation;
  }

  async listConversations(skip: number = 0, limit: number = 50) {
    const response = await this.client.get('/api/conversations', {
      params: { skip, limit },
    });
    return response.data as Conversation[];
  }

  async getConversation(conversationId: string) {
    const response = await this.client.get(`/api/conversations/${conversationId}`);
    return response.data as ConversationDetail;
  }

  async updateConversation(conversationId: string, title?: string, model?: string) {
    const response = await this.client.patch(`/api/conversations/${conversationId}`, {
      title,
      model,
    });
    return response.data as Conversation;
  }

  async deleteConversation(conversationId: string) {
    const response = await this.client.delete(`/api/conversations/${conversationId}`);
    return response.data;
  }

  async archiveConversation(conversationId: string) {
    const response = await this.client.post(`/api/conversations/${conversationId}/archive`);
    return response.data;
  }

  // Chat - Streaming
  async streamCompletion(
    conversationId: string,
    message: string,
    onToken: (token: string) => void,
    onEnd: (messageId: string) => void,
    onError: (error: string) => void,
    model?: string,
    temperature: number = 0.7,
    max_tokens: number = 2000
  ): Promise<AbortController> {
    const controller = new AbortController();

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/completions/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message,
          model,
          temperature,
          max_tokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamingResponse = JSON.parse(line.slice(6));

              if (data.event === 'token' && data.token) {
                onToken(data.token);
              } else if (data.event === 'end' && data.message_id) {
                onEnd(data.message_id);
              } else if (data.event === 'error' && data.error) {
                onError(data.error);
              }
            } catch (e) {
              // Skip parsing errors
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          onError(error.message);
        }
      }
    }

    return controller;
  }

  // Chat - Non-streaming
  async getCompletion(
    conversationId: string,
    message: string,
    model?: string,
    temperature: number = 0.7,
    max_tokens: number = 2000
  ) {
    const response = await this.client.post('/api/chat/completions', {
      conversation_id: conversationId,
      message,
      model,
      temperature,
      max_tokens,
    });
    return response.data;
  }
}

export const apiClient = new APIClient();
