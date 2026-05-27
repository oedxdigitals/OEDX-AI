'use client';

/**
 * Main Chat Page
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MessagesContainer } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChatStore } from '@/stores/chatStore';
import { apiClient } from '@/lib/api';
import { showToast } from '@/components/common/Toast';
import { generateTitle } from '@/lib/utils';

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const streamAbortRef = useRef<AbortController | null>(null);

  const {
    conversations,
    currentConversationId,
    messages,
    isStreaming,
    setCurrentConversation,
    loadConversations,
    createNewConversation,
    deleteConversation,
    renameConversation,
    archiveConversation,
    addMessage,
    setLoading,
    setError,
  } = useChatStore();

  // Initialize
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-create first conversation
  useEffect(() => {
    if (conversations.length === 0 && !currentConversationId) {
      handleNewChat();
    } else if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversation(conversations[0].id);
    }
  }, [conversations.length]);

  const handleNewChat = async () => {
    try {
      const title = 'New Conversation';
      const id = await createNewConversation(title);
      setCurrentConversation(id);
      setSidebarOpen(false);
      showToast.success('New conversation created');
    } catch (error) {
      showToast.error('Failed to create conversation');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentConversationId || !message.trim()) return;

    try {
      setIsSending(true);
      setError(null);

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        conversation_id: currentConversationId,
        role: 'user' as const,
        content: message,
        tokens: 0,
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Stream completion
      setStreamingContent('');
      let fullContent = '';

      streamAbortRef.current = await apiClient.streamCompletion(
        currentConversationId,
        message,
        (token) => {
          fullContent += token;
          setStreamingContent(fullContent);
        },
        (messageId) => {
          // Message saved on backend
          showToast.success('Response received');
        },
        (error) => {
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

  const handleRename = async (id: string, title: string) => {
    try {
      await renameConversation(id, title);
      showToast.success('Conversation renamed');
    } catch (error) {
      showToast.error('Failed to rename conversation');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      if (currentConversationId === id) {
        setCurrentConversation(null);
      }
      showToast.success('Conversation deleted');
    } catch (error) {
      showToast.error('Failed to delete conversation');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveConversation(id);
      if (currentConversationId === id) {
        setCurrentConversation(null);
      }
      showToast.success('Conversation archived');
    } catch (error) {
      showToast.error('Failed to archive conversation');
    }
  };

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentId={currentConversationId || ''}
        onSelect={setCurrentConversation}
        onNew={handleNewChat}
        onDelete={handleDelete}
        onRename={handleRename}
        onArchive={handleArchive}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-dark-800 bg-dark-900 bg-opacity-50 backdrop-blur-md"
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                OEDX AI
              </h1>
              <p className="text-xs text-gray-500">Advanced AI Chat Platform</p>
            </div>
          </div>
        </motion.header>

        {/* Messages & Input */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentConversationId ? (
            <>
              <MessagesContainer
                messages={messages}
                isLoading={isSending && !streamingContent}
                streamingContent={streamingContent}
              />
              <div className="border-t border-dark-800 bg-dark-900 bg-opacity-50 backdrop-blur-md p-6">
                <ChatInput
                  onSubmit={handleSendMessage}
                  isLoading={isSending}
                  placeholder="Ask anything..."
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Start a new conversation</h2>
                <button
                  onClick={handleNewChat}
                  className="bg-accent-purple hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Begin Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
