'use client';

import React, { useState } from 'react';

type Props = {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
};

export default function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Type a message...'
}: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <div className="flex items-center gap-2 p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-3 rounded bg-dark-800 text-white"
      />

      <button
        onClick={handleSend}
        disabled={isLoading}
        className="px-4 py-2 bg-purple-600 rounded text-white"
      >
        Send
      </button>
    </div>
  );
}
