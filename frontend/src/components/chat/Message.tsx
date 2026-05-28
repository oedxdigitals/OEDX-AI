'use client';

/**
 * Message Component with Markdown Rendering
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Message as MessageType } from '@/types';
import { copyToClipboard } from '@/lib/utils';
import { showToast } from '@/components/common/Toast';
interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

export const Message: React.FC<MessageProps> = ({
  message,
  isStreaming = false,
  onCopy,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      showToast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
          isAssistant
            ? 'bg-gradient-to-br from-accent-purple to-accent-pink text-white'
            : 'bg-dark-800 text-accent-cyan'
        }`}
      >
        {isAssistant ? 'AI' : 'You'}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-2xl ${isAssistant ? 'text-left' : 'text-right'}`}>
        <div
          className={`inline-block rounded-lg px-4 py-3 ${
            isAssistant
              ? 'bg-dark-800 text-gray-100'
              : 'bg-accent-purple bg-opacity-20 text-gray-100'
          }`}
        >
          <ReactMarkdown
            components={{
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={atomDark}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">
                  {children}
                </a>
              ),
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-2">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent-purple pl-3 italic my-2 text-gray-400">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {isStreaming && (
            <span className="inline-block w-2 h-5 ml-1 bg-accent-cyan animate-pulse" />
          )}
        </div>

        {/* Actions */}
        {isAssistant && !isStreaming && (
          <div className="flex gap-2 mt-2 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-dark-800 rounded transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className="text-gray-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
