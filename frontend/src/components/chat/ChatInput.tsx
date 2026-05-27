'use client';

/**
 * Chat Input Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, Loader } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-end"
    >
      <button
        type="button"
        className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-gray-400 hover:text-accent-cyan"
        title="Add file"
      >
        <Plus size={20} />
      </button>

      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent-purple resize-none max-h-40"
          rows={1}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <Loader size={20} className="animate-spin" />
        ) : (
          <Send size={20} />
        )}
      </Button>
    </motion.form>
  );
};
