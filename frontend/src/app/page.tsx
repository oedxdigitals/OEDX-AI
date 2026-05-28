'use client';

/**
 * Main Chat Page - OEDX AI
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatWindow, ChatInput } from '@/components/chat';
import { apiClient } from '@/lib/api';
import { showToast } from '@/components/common/Toast';

export default function ChatPage() {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // Data state
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Abort controller for streaming
  const streamAbortRef = useRef<AbortController | null>(null);

  // Load conversations
  const loadConversations = async () => {
    try {
      const data = await apiClient.getConversations();
      setConversations(data || []);

      if (data?.length && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    } catch (err) {
      showToast.error('Failed to load conversations');
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (!currentConversationId) return;

    const loadMessages = async () => {
      try {
        const data = await apiClient.getMessages(currentConversationId);
        setMessages(data || []);
      } catch (err) {
        showToast.error('Failed to load messages');
      }
    };

    loadMessages();
  }, [currentConversationId]);

  // Create new chat
  const handleNewChat = async () => {
    try {
      const title = 'New Conversation';
      const id = await apiClient.createConversation(title);

      setConversations((prev) => [id, ...prev]);
      setCurrentConversationId(id);

      setSidebarOpen(false);
      showToast.success('New conversation created');
    } catch (error) {
      showToast.error('Failed to create conversation');
    }
  };

  // Send message
  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !message.trim()) return;

    try {
      setIsSending(true);
      setError(null);

      const userMessage = {
        id: Date.now().toString(),
        conversation_id: currentConversationId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      setStreamingContent('');
      let fullContent = '';

      streamAbortRef.current = await apiClient.streamChat(
        currentConversationId,
        message,
        (token: string) => {
          fullContent += token;
          setStreamingContent(fullContent);
        },
        (messageId: string) => {
          showToast.success('Response received');
        },
        (error: string) => {
          showToast.error(error);
        }
      );
    } catch (error) {
      showToast.error('Failed to send message');
    } finally {
      setIsSending(false);
      setStreamingContent('');
    }
  };

  // Rename chat
  const handleRename = async (id: string, title: string) => {
    try {
      await apiClient.renameConversation(id, title);
      showToast.success('Conversation renamed');
    } catch {
      showToast.error('Failed to rename conversation');
    }
  };

  // Delete chat
  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteConversation(id);

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (currentConversationId === id) {
        setCurrentConversationId(null);
        setMessages([]);
      }

      showToast.success('Conversation deleted');
    } catch {
      showToast.error('Failed to delete conversation');
    }
  };

  // Archive chat
  const handleArchive = async (id: string) => {
    try {
      await apiClient.archiveConversation(id);

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (currentConversationId === id) {
        setCurrentConversationId(null);
        setMessages([]);
      }

      showToast.success('Conversation archived');
    } catch {
      showToast.error('Failed to archive conversation');
    }
  };

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentId={currentConversationId || ''}
        onSelect={setCurrentConversationId}
        onNew={handleNewChat}
        onDelete={handleDelete}
        onRename={handleRename}
        onArchive={handleArchive}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-dark-800 bg-dark-900"
        >
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              OEDX AI
            </h1>
            <p className="text-xs text-gray-400">
              Advanced AI Chat System
            </p>
          </div>
        </motion.header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isSending}
            streamingContent={streamingContent}
          />

          <div className="border-t border-dark-800">
            <ChatInput
              onSubmit={handleSendMessage}
              isLoading={isSending}
              placeholder="Ask anything..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
