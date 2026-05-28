'use client';

import React from "react";
import Message from "./Message";
import { useChatStore } from "@/stores/chatStore";

/**
 * Chat Window - displays all messages
 */
export default function ChatWindow() {
  const { messages, chatId } = useChatStore();

  return (
    <div key={chatId} className="flex flex-col w-full">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          Start a conversation...
        </div>
      ) : (
        messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))
      )}
    </div>
  );
}
