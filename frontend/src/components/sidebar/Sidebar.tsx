'use client';

/**
 * Sidebar Component
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ArchiveIcon, Menu, X } from 'lucide-react';
import { Conversation } from '@/types';
import { Button } from '@/components/common/Button';

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onArchive: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onArchive,
  isOpen,
  onToggle,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleRename = async (id: string) => {
    if (editTitle.trim()) {
      await onRename(id, editTitle);
      setEditingId(null);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 hover:bg-dark-800 rounded-lg transition-colors text-gray-400"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isOpen ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed lg:static top-0 left-0 h-screen w-64 bg-dark-900 border-r border-dark-800 z-50 lg:z-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-dark-800">
            <Button onClick={onNew} variant="primary" className="w-full" size="md">
              <Plus size={18} /> New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  whileHover={{ x: 4 }}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentId === conv.id
                      ? 'bg-accent-purple bg-opacity-20 text-accent-purple'
                      : 'hover:bg-dark-800 text-gray-300'
                  }`}
                  onClick={() => onSelect(conv.id)}
                >
                  {editingId === conv.id ? (
                    <div onClick={(e) => e.stopPropagation()} className="flex gap-2">
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-dark-700 rounded px-2 py-1 text-sm text-gray-100 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRename(conv.id)}
                        className="text-green-500 hover:text-green-400"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm truncate">{conv.title}</p>
                      <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(conv.id);
                            setEditTitle(conv.title);
                          }}
                          className="p-1 hover:bg-dark-700 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchive(conv.id);
                          }}
                          className="p-1 hover:bg-dark-700 rounded transition-colors"
                        >
                          <ArchiveIcon size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(conv.id);
                          }}
                          className="p-1 hover:bg-red-900 rounded transition-colors hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-dark-800">
            <div className="text-xs text-gray-500 text-center">
              <p>OEDX AI v1.0</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
        />
      )}
    </>
  );
};
