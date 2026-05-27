/**
 * Chat Store using Zustand
 */

import { create } from 'zustand';
import { Message, Conversation } from '@/types';
import { apiClient } from '@/lib/api';

interface ChatState {
  // Conversations
  conversations: Conversation[];
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;

  // Messages
  messages: Message[];
  isStreaming: boolean;
  streamingMessageId: string | null;

  // Actions
  setCurrentConversation: (id: string | null) => void;
  loadConversations: () => Promise<void>;
  createNewConversation: (title: string) => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  archiveConversation: (id: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStreaming: (streaming: boolean, messageId?: string) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  loading: false,
  error: null,
  messages: [],
  isStreaming: false,
  streamingMessageId: null,

  setCurrentConversation: (id) => {
    set({ currentConversationId: id });
    if (id) {
      get().loadMessages(id);
    }
  },

  loadConversations: async () => {
    set({ loading: true, error: null });
    try {
      const conversations = await apiClient.listConversations();
      set({ conversations, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load conversations',
        loading: false,
      });
    }
  },

  createNewConversation: async (title: string) => {
    try {
      const conversation = await apiClient.createConversation(title);
      set((state) => ({
        conversations: [conversation, ...state.conversations],
      }));
      return conversation.id;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create conversation',
      });
      throw error;
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await apiClient.deleteConversation(id);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        currentConversationId:
          state.currentConversationId === id ? null : state.currentConversationId,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete conversation',
      });
      throw error;
    }
  },

  renameConversation: async (id: string, title: string) => {
    try {
      await apiClient.updateConversation(id, title);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === id ? { ...c, title } : c
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to rename conversation',
      });
      throw error;
    }
  },

  archiveConversation: async (id: string) => {
    try {
      await apiClient.archiveConversation(id);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to archive conversation',
      });
      throw error;
    }
  },

  loadMessages: async (conversationId: string) => {
    set({ loading: true, error: null });
    try {
      const conversation = await apiClient.getConversation(conversationId);
      set({ messages: conversation.messages, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load messages',
        loading: false,
      });
    }
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setStreaming: (streaming: boolean, messageId?: string) => {
    set({ isStreaming: streaming, streamingMessageId: messageId });
  },

  clear: () => {
    set({
      conversations: [],
      currentConversationId: null,
      messages: [],
      loading: false,
      error: null,
      isStreaming: false,
      streamingMessageId: null,
    });
  },
}));
